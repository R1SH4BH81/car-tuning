import React, { Suspense, lazy } from "react";
import StatDiff from "./StatDiff";

const DynoChart = lazy(() => import("./DynoChart"));

const ComparisonPanel = ({
  performanceStats,
  previewStats,
  hoveredPart,
  dynoData,
  previewDynoData,
}) => {
  return (
    <div className="w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 p-6 pointer-events-auto">
      <h3 className="text-xl font-bold uppercase mb-6 text-yellow-500 border-b border-white/10 pb-2">
        Projected Stats
      </h3>

      <div className="space-y-4 font-mono">
        <StatDiff
          label="Top Speed"
          current={performanceStats.topSpeed}
          preview={previewStats.topSpeed}
          unit=" MPH"
        />
        <StatDiff
          label="0-60 MPH"
          current={performanceStats.acceleration060}
          preview={previewStats.acceleration060}
          unit="s"
          inverse={true}
        />
        <StatDiff
          label="Handling"
          current={performanceStats.lateralG}
          preview={previewStats.lateralG}
          unit=" G"
        />
        <StatDiff
          label="Braking"
          current={performanceStats.brakingDistance600}
          preview={previewStats.brakingDistance600}
          unit=" FT"
          inverse={true}
        />

        <div className="mt-4 border-t border-white/10 pt-4 text-xs text-gray-500 font-mono">
          <div className="flex justify-between mb-1">
            <span>Stock HP:</span>
            <span className="text-gray-400">565 HP</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Stock Torque:</span>
            <span className="text-gray-400">467 FT-LB</span>
          </div>
          <div className="flex justify-between">
            <span>Stock Weight:</span>
            <span className="text-gray-400">1752 LBS</span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="uppercase text-sm">PI Change</span>
            <div className="text-2xl font-bold flex gap-2">
              <span>{performanceStats.pi}</span>
              <span className="text-gray-500">→</span>
              <span
                className={
                  previewStats.pi > performanceStats.pi
                    ? "text-green-500"
                    : "text-white"
                }
              >
                {previewStats.pi}
              </span>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="h-32 w-64 bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/5 pointer-events-auto hidden md:block" />
          }
        >
          <DynoChart
            hoveredPart={hoveredPart}
            dynoData={dynoData}
            previewDynoData={previewDynoData}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ComparisonPanel;
