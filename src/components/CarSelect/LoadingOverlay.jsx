import React from "react";
import { useProgress } from "@react-three/drei";
import useStore from "../../store/useStore";

const LoadingOverlay = React.memo(function LoadingOverlay() {
  const { active, progress } = useProgress();
  const { compilingActive, compilingProgress } = useStore();

  if (!active && !compilingActive) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center ">
      <div className="flex flex-col items-center">
        <div className="relative w-11 h-11 mb-2">
          <div className="absolute inset-0 rounded-full border-5 border-yellow-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-yellow-500 text-s">
            {(active ? progress : compilingProgress).toFixed(0)}%
          </div>
        </div>
        <div className="text-yellow-500">
          {active ? "Loading  " : "Hang On  "}
        </div>
      </div>
    </div>
  );
});

export default LoadingOverlay;
