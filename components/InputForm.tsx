
import React, { useState, useEffect } from "react";
import { UserInput } from "../types";

interface InputFormProps {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [situation, setSituation] = useState("");
  const [language, setLanguage] = useState("English");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  
  // API Key State
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState("");

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setTempKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem("gemini_api_key", tempKey.trim());
      setApiKey(tempKey.trim());
      setShowSettings(false);
    } else {
      alert("Please enter a valid API Key");
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setTempKey("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    if (situation.trim().length < 10) {
      alert("Please describe the situation in more detail.");
      return;
    }
    
    onSubmit({ situation, language, age, country, apiKey });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-background-light">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-2xl border border-outline ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">key</span>
                API Key Configuration
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
              To use this application, you need your own Google Gemini API key. 
              Your key is stored locally in your browser and is never shared with us.
            </p>

            <div className="flex flex-col gap-2 mb-6">
              <label htmlFor="apiKey" className="text-sm font-medium text-on-surface">
                Gemini API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-lg border border-outline bg-background-light p-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
              />
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
              >
                Get a free API key here
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </a>
            </div>

            <div className="flex gap-3 justify-end">
              {apiKey && (
                <button
                  onClick={handleClearKey}
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mr-auto"
                >
                  Clear Key
                </button>
              )}
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-sm"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex h-20 w-full max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-3 text-on-surface">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: "28px" }}
          >
            psychology
          </span>
          <h2 className="text-lg font-medium hidden sm:block">Emotional Map Generator</h2>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${apiKey ? 'bg-surface border-outline text-on-surface-variant hover:bg-gray-50' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {apiKey ? 'settings' : 'warning'}
          </span>
          {apiKey ? 'API Settings' : 'Set API Key'}
        </button>
      </header>

      <main className="flex w-full max-w-5xl flex-1 flex-col items-center px-6 py-8 md:py-16">
        <div className="flex w-full max-w-xl flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface md:text-5xl font-display">
            Create Your Emotional Map
          </h1>
          <p className="max-w-lg text-base text-on-surface-variant md:text-lg">
            Describe a situation, and our AI will generate a personalized
            emotional map for you.
          </p>
        </div>
        <div className="mt-12 w-full max-w-xl rounded-xl border border-outline bg-surface p-6 shadow-sm md:p-8">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium text-on-surface-variant"
                htmlFor="situation"
              >
                Situation Description
              </label>
              <textarea
                className="form-textarea min-h-36 w-full resize-none rounded-lg border border-outline bg-background-light p-4 text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                id="situation"
                required
                placeholder="e.g., Describe a recent argument with a friend, a successful project at work, or a memorable family vacation..."
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
              ></textarea>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-on-surface-variant"
                  htmlFor="language"
                >
                  Preferred Language
                </label>
                <select
                  className="form-select h-12 w-full rounded-lg border border-outline bg-background-light px-4 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                  <option>Chinese</option>
                  <option>Portuguese</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-medium text-on-surface-variant"
                  htmlFor="age"
                >
                  Age
                </label>
                <select
                  className="form-select h-12 w-full rounded-lg border border-outline bg-background-light px-4 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  id="age"
                  value={age}
                  required
                  onChange={(e) => setAge(e.target.value)}
                >
                  <option value="" disabled>
                    Select Age Range
                  </option>
                  <option value="Under 18">Under 18</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-50">36-50</option>
                  <option value="51+">51+</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium text-on-surface-variant"
                htmlFor="country"
              >
                Country
              </label>
              <input
                className="form-input h-12 w-full rounded-lg border border-outline bg-background-light p-4 text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                id="country"
                placeholder="Select Country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <button
              className="mt-4 flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Analysis...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Generate My Map
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default InputForm;
