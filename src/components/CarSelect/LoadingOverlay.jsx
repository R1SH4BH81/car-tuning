import React from "react";
import { useProgress } from "@react-three/drei";

const LoadingOverlay = React.memo(function LoadingOverlay() {
  const { active, progress } = useProgress();
  
  if (!active) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-none">
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>

        <div className="font-mono text-yellow-500 mt-2">
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
});

export default LoadingOverlay;

