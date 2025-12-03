
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ 
  chart, 
  className, 
  onClick, 
  animate = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // 1. Initialize Mermaid with High Visibility Settings
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      logLevel: 5,
      securityLevel: "loose",
      themeVariables: {
        primaryColor: "#ffffff",
        primaryTextColor: "#000000", // Pitch black text
        primaryBorderColor: "#000000", // Pitch black border
        lineColor: "#000000", // Pitch black lines
        secondaryColor: "#ffffff",
        tertiaryColor: "#f8f9fa",
        fontFamily: '"Google Sans", "Roboto", sans-serif',
        fontSize: "16px", // Larger font for visibility
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: false,
        padding: 20,
        rankSpacing: 50,
        nodeSpacing: 50,
      },
    });

    const renderChart = async () => {
      if (!chart) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // 2. Clean and Validate syntax
        let cleanChart = chart
          .replace(/```mermaid/g, "")
          .replace(/```/g, "")
          .trim();
        
        if (!cleanChart.startsWith("graph") && !cleanChart.startsWith("flowchart")) {
             cleanChart = `graph LR\n${cleanChart}`;
        }

        // 3. Render
        const { svg } = await mermaid.render(id, cleanChart);
        
        // 4. Post-process the SVG string
        let processedSvg = svg;

        // Force 100% dimensions to fill parent container
        processedSvg = processedSvg
             .replace(/width="[^"]*"/, 'width="100%"')
             .replace(/height="[^"]*"/, 'height="100%"')
             .replace(/style="[^"]*"/, 'style="width: 100%; height: 100%;"');

        // Inject Styles for High Visibility and Animation
        if (animate) {
            const styles = `
                <style>
                    #${id} .node rect, #${id} .node circle, #${id} .node polygon, #${id} .node path {
                        stroke-width: 2.5px !important; /* Thicker strokes */
                        filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.1)); /* Harder shadow for pop */
                    }
                    #${id} .edgePath path {
                        stroke-width: 2px !important; /* Thicker connection lines */
                    }
                    #${id} .edgeLabel {
                         background-color: white !important;
                         padding: 2px 4px;
                         font-weight: bold;
                    }
                    
                    @keyframes mFadeIn { from { opacity: 0; } to { opacity: 1; } }
                    
                    #${id} .node { opacity: 0; animation: mFadeIn 0.5s ease-out forwards; }
                    #${id} .edgePath, #${id} .edgeLabel { opacity: 0; animation: mFadeIn 0.5s ease-out forwards; animation-delay: 0.3s; }
                    
                    /* Stagger first few nodes */
                    #${id} .node:nth-of-type(1) { animation-delay: 0.1s; }
                    #${id} .node:nth-of-type(2) { animation-delay: 0.2s; }
                    #${id} .node:nth-of-type(3) { animation-delay: 0.3s; }
                    #${id} .node:nth-of-type(4) { animation-delay: 0.4s; }
                    #${id} .node:nth-of-type(5) { animation-delay: 0.5s; }
                </style>
            `;
            // Insert style before closing svg tag
            processedSvg = processedSvg.replace('</svg>', `${styles}</svg>`);
        }

        setSvgContent(processedSvg);
        setError(false);
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
        setError(true);
      }
    };

    renderChart();
  }, [chart, animate]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 text-red-500 p-4 rounded-lg text-sm border border-red-100 ${className}`}>
        <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-2xl">broken_image</span>
            <span>Unable to visualize flowchart</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container flex items-center justify-center overflow-hidden ${className}`}
      onClick={onClick}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: svgContent }} 
        className="w-full h-full flex items-center justify-center"
      />
    </div>
  );
};

export default MermaidDiagram;
