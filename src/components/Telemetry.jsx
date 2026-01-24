import React, { Suspense } from "react";
import useStore from "../store/useStore";

const RadarBalanceChart = React.lazy(
  () => import("./Telemetry/RadarBalanceChart"),
);
const PowerCurveChart = React.lazy(() => import("./Telemetry/PowerCurveChart"));

const Telemetry = () => {
  const { performanceStats, dynoData } = useStore();

  const radarData = [
    {
      subject: "Speed",
      A: Math.min(100, performanceStats.topSpeed / 3),
      fullMark: 100,
    },
    {
      subject: "Accel",
      A: Math.min(100, (3 / performanceStats.acceleration060) * 80),
      fullMark: 100,
    },
    {
      subject: "Handling",
      A: Math.min(100, performanceStats.lateralG * 60),
      fullMark: 100,
    },
    {
      subject: "Braking",
      A: Math.min(100, (100 / performanceStats.brakingDistance600) * 80),
      fullMark: 100,
    },
    {
      subject: "Launch",
      A: Math.min(100, (3 / performanceStats.acceleration060) * 70),
      fullMark: 100,
    },
  ];

  return (
    <div className="absolute inset-0 top-[20vh] bottom-0 flex items-start justify-center px-4 sm:px-6 py-4 pointer-events-none z-10">
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 sm:p-6 md:p-8 pointer-events-auto max-h-full overflow-y-auto">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest self-start">
            Vehicle Balance
          </h3>
          <div className="w-full h-80">
            <Suspense
              fallback={<div className="text-gray-500 text-sm">Loading...</div>}
            >
              <RadarBalanceChart radarData={radarData} />
            </Suspense>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">
            Power Curve
          </h3>
          <div className="w-full h-64">
            <Suspense
              fallback={<div className="text-gray-500 text-sm">Loading...</div>}
            >
              <PowerCurveChart dynoData={dynoData} />
            </Suspense>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-xs uppercase">Lateral G</div>
            <div className="text-xl font-mono text-white">
              {performanceStats.lateralG} G
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs uppercase">
              Braking (60-0)
            </div>
            <div className="text-xl font-mono text-white">
              {performanceStats.brakingDistance600} ft
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs uppercase">Power/Weight</div>
            <div className="text-xl font-mono text-white">
              {(performanceStats.hp / (performanceStats.weight / 2200)).toFixed(
                2,
              )}{" "}
              hp/t
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs uppercase">Top Speed</div>
            <div className="text-xl font-mono text-white">
              {performanceStats.topSpeed} mph
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telemetry;
