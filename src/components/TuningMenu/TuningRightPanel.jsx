import React, { Suspense } from "react";
import tuningData from "../../data/tuningData.json";

const TuningModelViewer = React.lazy(() => import("../TuningModelViewer"));
const GearingChart = React.lazy(() => import("./GearingChart"));

const TuningRightPanel = ({ activeSection, gearingData, rpmLimit }) => {
  const sectionData = tuningData[activeSection];

  return (
    <div className="w-1/4 bg-black/80 backdrop-blur-md border-l border-white/10 p-8 pt-12 flex flex-col">
      <div className="flex-1 bg-white/5 rounded-lg mb-4 flex items-center justify-center border border-white/10 overflow-hidden relative">
        <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
          {activeSection === "gearing" ? (
            <GearingChart data={gearingData} rpmLimit={rpmLimit} />
          ) : (
            <TuningModelViewer modelPath={sectionData?.modelPath} />
          )}
        </Suspense>
      </div>
      <p className="text-gray-300 leading-relaxed text-sm h-24">
        {sectionData?.description}
      </p>
    </div>
  );
};

export default TuningRightPanel;
