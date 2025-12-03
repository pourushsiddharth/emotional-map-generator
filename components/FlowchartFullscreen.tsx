import React, { useState } from "react";
import MermaidDiagram from "./MermaidDiagram";

interface FlowchartFullscreenProps {
  mermaidCode: string;
  onBack: () => void;
  situation: string;
}

const FlowchartFullscreen: React.FC<FlowchartFullscreenProps> = ({
  mermaidCode,
  onBack,
  situation,
}) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.25));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light animate-fadeIn">
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:px-6 sm:py-4 bg-white/90 backdrop-blur-md border-b border-outline/30 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-transparent text-on-surface-variant transition-colors hover:bg-gray-100 hover:text-on-surface"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col">
              <h2 className="text-base font-medium text-on-surface max-w-[200px] sm:max-w-md truncate leading-tight">
                {situation || "Emotional Flow"}
              </h2>
              <span className="text-xs text-on-surface-variant">Detailed Flowchart View</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={onBack}
                className="hidden sm:flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-hover"
            >
                Done
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative bg-[#f8f9fa] overflow-hidden">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#dadce0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60"></div>

        {/* Floating Controls */}
        <div className="absolute bottom-24 right-6 z-10 flex flex-col gap-3 shadow-card rounded-lg bg-surface p-1.5 ring-1 ring-black/5 animate-slideUp">
            <button
              onClick={handleZoomIn}
              className="p-2.5 text-on-surface-variant transition-colors hover:bg-gray-100 hover:text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[24px]">add</span>
            </button>
            <div className="h-px w-full bg-outline/50"></div>
            <button
              onClick={handleZoomOut}
              className="p-2.5 text-on-surface-variant transition-colors hover:bg-gray-100 hover:text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[24px]">remove</span>
            </button>
            <div className="h-px w-full bg-outline/50"></div>
            <button
              onClick={handleResetZoom}
              className="p-2.5 text-on-surface-variant transition-colors hover:bg-gray-100 hover:text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              title="Reset View"
            >
              <span className="material-symbols-outlined text-[24px]">center_focus_strong</span>
            </button>
        </div>

        {/* SVG Container */}
        <div className="flex-1 w-full h-full p-8 md:p-12 overflow-auto flex items-center justify-center cursor-move active:cursor-grabbing">
          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MermaidDiagram 
                chart={mermaidCode} 
                animate={true}
                className="w-full h-full max-w-5xl max-h-[80vh]"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlowchartFullscreen;