import React, { Suspense, lazy, useState } from "react";
import StatDiff from "./StatDiff";

const DynoChart = lazy(() => import("./DynoChart"));

const ComparisonPanel = ({
  performanceStats,
  previewStats,
  hoveredPart,
  dynoData,
  previewDynoData,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full lg:w-80 bg-black/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 p-4 sm:p-1 pointer-events-auto max-h-[50vh] md:max-h-none overflow-y-auto">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 text-left text-yellow-500 border-b border-white/10 pb-2 mb-2"
      >
        <span className="text-sm md:text-base lg:text-xl font-bold uppercase">
          Projected Stats
        </span>
        <span
          className={`transition-transform duration-200 text-xs md:text-sm lg:hidden ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#fff500"
          >
            <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
          </svg>
        </span>
      </button>
      <div
        className={`${
          isOpen ? "space-y-2 font-mono" : "hidden lg:block"
        } lg:space-y-4 lg:font-mono`}
      >
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

        <div className="mt-4 pt-3 border-t border-white/10">
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

        <div className="mt-4 h-40 sm:h-48">
          <Suspense
            fallback={
              <div className="h-24 w-full bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/5 pointer-events-auto" />
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
    </div>
  );
};

export default ComparisonPanel;
