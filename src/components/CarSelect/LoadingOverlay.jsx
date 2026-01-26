import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import useStore from "../../store/useStore";

const LoadingOverlay = React.memo(function LoadingOverlay() {
  const { active, progress } = useProgress();
  const { compilingActive, compilingProgress } = useStore();
  const [networkActive, setNetworkActive] = useState(false);

  useEffect(() => {
    const onStart = () => setNetworkActive(true);
    const onLoaded = () => setNetworkActive(false);
    window.addEventListener("model-loading-start", onStart);
    window.addEventListener("model-loaded", onLoaded);
    return () => {
      window.removeEventListener("model-loading-start", onStart);
      window.removeEventListener("model-loaded", onLoaded);
    };
  }, []);

  if (!active && !compilingActive && !networkActive) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center ">
      <div className="flex flex-col items-center">
        <div className="relative w-6 h-6 mb-2">
          <div className="absolute inset-0 rounded-full border-3 border-yellow-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-yellow-500 text-xs">
            {(active
              ? progress
              : compilingActive
                ? compilingProgress
                : 0
            ).toFixed(0)}
          </div>
        </div>
        <div className="text-yellow-500 font-medium ">
          {active || networkActive ? "Loading  " : "Hang On  "}
        </div>
      </div>
    </div>
  );
});

export default LoadingOverlay;
