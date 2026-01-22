import React, { Suspense } from "react";
import useStore from "../store/useStore";

const RadarBalanceChart = React.lazy(() => import("./Telemetry/RadarBalanceChart"));
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
    <div className="absolute inset-0 top-34 bottom-24 flex items-center justify-center pointer-events-none z-10">
      <div className="w-full max-w-5xl grid grid-cols-2 gap-8 p-8 pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest self-start">
            Vehicle Balance
          </h3>
          <div className="w-full h-80">
            <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
              <RadarBalanceChart radarData={radarData} />
            </Suspense>
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">
            Power Curve
          </h3>
          <div className="w-full h-80">
            <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
              <PowerCurveChart dynoData={dynoData} />
            </Suspense>
          </div>
        </div>

        <div className="col-span-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-xs uppercase">Lateral G</div>
            <div className="text-2xl font-mono text-white">
              {performanceStats.lateralG} G
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs uppercase">
              Braking (60-0)
            </div>
            <div className="text-2xl font-mono text-white">
              {performanceStats.brakingDistance600} ft
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs uppercase">Power/Weight</div>
            <div className="text-2xl font-mono text-white">
              {(performanceStats.hp / (performanceStats.weight / 2200)).toFixed(
                2,
              )}{" "}
              hp/t
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs uppercase">Top Speed</div>
            <div className="text-2xl font-mono text-white">
              {performanceStats.topSpeed} mph
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telemetry;
