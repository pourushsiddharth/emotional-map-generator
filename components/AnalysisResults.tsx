import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { EmotionalMapAnalysis } from "../types";
import MermaidDiagram from "./MermaidDiagram";

interface AnalysisResultsProps {
  data: EmotionalMapAnalysis;
  onFullscreen: () => void;
  onReset: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  data,
  onFullscreen,
  onReset,
}) => {
  const handleShare = async () => {
    const topEmotions = [...data.core_emotions]
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 3)
      .map((e) => e.emotion)
      .join(", ");

    const shareTitle = "My Emotional Map Analysis";
    const shareText = `I just analyzed my emotional journey with the Emotional Map Generator.\n\nTop Emotions: ${topEmotions}\n\nInsight: ${data.empathetic_message}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${shareTitle}\n\n${shareText}\n\n${shareUrl}`
        );
        alert("Analysis summary copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  const handleExportJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "emotional-map-analysis.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export JSON:", err);
      alert("Failed to export JSON.");
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light animate-fadeIn">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-5xl">
            <header className="flex items-center justify-between text-on-surface px-4 py-3 border-b border-outline/50 sm:border-none no-print">
              <div className="flex items-center gap-4">
                <div className="size-7 text-primary">
                  <svg
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <h1 className="font-display text-xl font-medium tracking-wide">
                  Emotional Map
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-on-surface-variant bg-surface border border-outline hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  title="Export as JSON"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    data_object
                  </span>
                  <span className="hidden md:inline">JSON</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-on-surface-variant bg-surface border border-outline hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  title="Export as PDF"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    picture_as_pdf
                  </span>
                  <span className="hidden md:inline">PDF</span>
                </button>
                <div className="w-px h-6 bg-outline/50 mx-1 hidden sm:block"></div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  title="Share Analysis"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    share
                  </span>
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </header>
            <div className="flex flex-col gap-2 p-4 pt-8 md:pt-12">
              <h2 className="font-display text-3xl md:text-4xl font-normal text-on-surface tracking-tight">
                Analysis Results
              </h2>
              <p className="text-on-surface-variant text-base font-normal leading-relaxed">
                Here's the emotional map generated by AI based on your
                situation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
                {/* Flowchart Preview */}
                <div className="bg-surface rounded-xl border border-outline shadow-card overflow-hidden transition-all hover:shadow-lg animate-slideUp" style={{ animationDelay: "0.1s" }}>
                  <div className="px-6 py-4 border-b border-outline flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        account_tree
                      </span>
                      <h3 className="font-display text-lg font-medium text-on-surface">
                        Emotional Journey
                      </h3>
                    </div>
                    <button
                      onClick={onFullscreen}
                      className="text-primary hover:text-primary-hover hover:bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-colors no-print"
                    >
                      <span className="material-symbols-outlined text-lg">
                        fullscreen
                      </span>
                      Fullscreen
                    </button>
                  </div>
                  <div
                    className="relative w-full h-80 bg-white flex items-center justify-center overflow-hidden cursor-pointer group"
                    onClick={onFullscreen}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                    
                    {/* Mermaid Diagram */}
                    <MermaidDiagram 
                      chart={data.mermaid_code} 
                      animate={true}
                      className="w-full h-full p-6 transition-transform duration-300 group-hover:scale-[1.01]"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors no-print">
                      <span className="opacity-0 group-hover:opacity-100 bg-surface text-on-surface shadow-md px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Click to Expand
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accordion List */}
                <div className="bg-surface rounded-xl border border-outline shadow-subtle overflow-hidden animate-slideUp" style={{ animationDelay: "0.2s" }}>
                  <div className="p-6 border-b border-outline/50">
                    <h3 className="font-display text-xl font-medium text-on-surface">
                      Detailed Analysis
                    </h3>
                  </div>
                  <div className="flex flex-col">
                    <DetailsAccordion
                      icon="conversion_path"
                      title="Emotional Transitions"
                      content={
                        <ul className="relative pl-4 space-y-4 border-l-2 border-primary/20 ml-2">
                          {data.emotional_transitions.map((t, i) => (
                            <li key={i} className="relative pl-4">
                              <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-surface"></div>
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-on-surface text-base">
                                  {t.from}{" "}
                                  <span className="text-on-surface-variant mx-1">
                                    →
                                  </span>{" "}
                                  {t.to}
                                </span>
                                <p className="text-on-surface-variant text-sm">
                                  {t.description}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      }
                      defaultOpen
                    />
                    <DetailsAccordion
                      icon="flag"
                      title="Trigger Analysis"
                      content={
                        <div className="flex flex-wrap gap-2">
                          {data.triggers.map((trigger, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-100 font-medium"
                            >
                              {trigger}
                            </span>
                          ))}
                        </div>
                      }
                    />
                    <DetailsAccordion
                      icon="psychology"
                      title="Psychological Interpretations"
                      content={
                        <ul className="space-y-3">
                          {data.psychological_interpretations.map((item, i) => (
                            <li key={i} className="flex gap-3 items-start">
                              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                                lightbulb
                              </span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      }
                    />
                    <DetailsAccordion
                      icon="spa"
                      title="Healing Suggestions"
                      content={
                        <ul className="space-y-3">
                          {data.healing_suggestions.map((item, i) => (
                            <li key={i} className="flex gap-3 items-start">
                              <span className="material-symbols-outlined text-green-600 text-[20px] mt-0.5">
                                check_circle
                              </span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      }
                    />
                    <DetailsAccordion
                      icon="favorite"
                      title="An Empathetic Message"
                      content={
                        <div className="flex gap-4 items-start bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <span className="material-symbols-outlined text-primary text-3xl">
                            sentiment_satisfied
                          </span>
                          <p className="italic text-on-surface text-base leading-relaxed">
                            {data.empathetic_message}
                          </p>
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Chart */}
              <div className="lg:col-span-1 flex flex-col gap-6 animate-slideUp min-w-0" style={{ animationDelay: "0.3s" }}>
                <div className="bg-surface rounded-xl border border-outline p-6 flex flex-col gap-4 shadow-subtle sticky top-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <span className="material-symbols-outlined !font-light">
                        pie_chart
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-medium text-on-surface">
                      Core Emotions
                    </h3>
                  </div>
                  <p className="text-on-surface-variant text-sm font-normal leading-normal">
                    Intensity of each primary emotion detected in your narrative.
                  </p>

                  {/* Recharts Bar Chart */}
                  <div className="w-full mt-2 min-w-0 relative" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.core_emotions}
                        layout="vertical"
                        margin={{
                          top: 10,
                          right: 10,
                          left: 10,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={true}
                          vertical={false}
                          stroke="#e5e7eb"
                        />
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis
                          dataKey="emotion"
                          type="category"
                          width={80}
                          tick={{
                            fontSize: 12,
                            fill: "#5f6368",
                            fontWeight: 500,
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#f8f9fa" }}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #dadce0",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar
                          dataKey="intensity"
                          radius={[0, 4, 4, 0]}
                          animationDuration={1500}
                          barSize={24}
                        >
                          {data.core_emotions.map((_entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill="#1a73e8"
                              fillOpacity={0.6 + index * 0.1}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 px-4 py-12 no-print animate-slideUp" style={{ animationDelay: "0.4s" }}>
              <button
                onClick={onReset}
                className="bg-primary text-white font-medium py-3 px-8 rounded-full text-base hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined">restart_alt</span>
                Analyze Another Situation
              </button>
              <p className="text-center text-xs text-on-surface-variant max-w-md mt-4">
                Disclaimer: This analysis is AI-generated and for informational
                purposes only. It is not a substitute for professional
                psychological advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailsAccordionProps {
  icon: string;
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

const DetailsAccordion: React.FC<DetailsAccordionProps> = ({
  icon,
  title,
  content,
  defaultOpen = false,
}) => {
  return (
    <details
      className="group border-t border-outline/50 first:border-t-0"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 hover:bg-zinc-50 transition-colors">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant">
            {icon}
          </span>
          <p className="text-base font-medium text-on-surface">{title}</p>
        </div>
        <div className="text-on-surface-variant transition-transform group-open:rotate-180">
          <span className="material-symbols-outlined !font-light">
            expand_more
          </span>
        </div>
      </summary>
      <div className="px-6 pb-6 pl-16 animate-fadeIn">
        <div className="text-on-surface-variant text-sm leading-6">
          {content}
        </div>
      </div>
    </details>
  );
};

export default AnalysisResults;