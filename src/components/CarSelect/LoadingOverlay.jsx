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
        <div className="w-6 h-6 border-4 border-yellow-500  rounded-full animate-spin mb-4"></div>

        <div className="font-mono text-yellow-500 mt-2">
          {active ? "Loading " : "Compiling "}
          {(active ? progress : compilingProgress).toFixed(0)}%
        </div>
      </div>
    </div>
  );
});

export default LoadingOverlay;
