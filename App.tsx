
import React, { useState } from "react";
import InputForm from "./components/InputForm";
import AnalysisResults from "./components/AnalysisResults";
import FlowchartFullscreen from "./components/FlowchartFullscreen";
import ProfileCard from "./components/ProfileCard";
import { analyzeEmotionalMap } from "./services/geminiService";
import { AppState, EmotionalMapAnalysis, UserInput } from "./types";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [analysisData, setAnalysisData] = useState<EmotionalMapAnalysis | null>(null);
  const [currentSituation, setCurrentSituation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisSubmit = async (input: UserInput) => {
    setAppState(AppState.LOADING);
    setError(null);
    setCurrentSituation(input.situation);
    
    // Safety check for API Key before calling service
    if (!input.apiKey) {
      setError("API Key is missing. Please set your Google Gemini API Key in Settings.");
      setAppState(AppState.INPUT);
      return;
    }

    try {
      const result = await analyzeEmotionalMap(input);
      setAnalysisData(result);
      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      let errorMessage = "An error occurred while communicating with the AI.";
      
      if (err.message && (err.message.includes("API Key") || err.message.includes("403") || err.message.includes("key"))) {
          errorMessage = "Authentication Error: Invalid or missing API Key. Please check your settings.";
      } else if (err.message) {
          errorMessage = err.message;
      }

      setError(errorMessage);
      setAppState(AppState.INPUT);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setCurrentSituation("");
    setAppState(AppState.INPUT);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.INPUT:
      case AppState.LOADING:
        return (
          <>
            <InputForm onSubmit={handleAnalysisSubmit} isLoading={appState === AppState.LOADING} />
            {error && (
               <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2 animate-slideUp">
                 <span className="material-symbols-outlined">error</span>
                 <span>{error}</span>
                 <button onClick={() => setError(null)} className="ml-2 font-bold hover:text-red-900">&times;</button>
               </div>
            )}
          </>
        );
      case AppState.RESULTS:
        return (
          analysisData && (
            <AnalysisResults
              data={analysisData}
              onFullscreen={() => setAppState(AppState.FULLSCREEN)}
              onReset={handleReset}
            />
          )
        );
      case AppState.FULLSCREEN:
        return (
          analysisData && (
            <FlowchartFullscreen
              mermaidCode={analysisData.mermaid_code}
              onBack={() => setAppState(AppState.RESULTS)}
              situation={currentSituation}
            />
          )
        );
      default:
        return <div>Unknown State</div>;
    }
  };

  return (
    <>
      {renderContent()}
      <ProfileCard />
    </>
  );
};

export default App;
