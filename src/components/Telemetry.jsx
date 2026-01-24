import React, { Suspense } from "react";
import useStore from "../store/useStore";

const RadarBalanceChart = React.lazy(
  () => import("./Telemetry/RadarBalanceChart"),
);
const PowerCurveChart = React.lazy(() => import("./Telemetry/PowerCurveChart"));

const Telemetry = () => {
  const { performanceStats, dynoData } = useStore();

  const hasDynoData = Array.isArray(dynoData) && dynoData.length > 0;
  const peakHpPoint = hasDynoData
    ? dynoData.reduce(
        (max, point) => (point.hp > max.hp ? point : max),
        dynoData[0],
      )
    : null;
  const peakTorquePoint = hasDynoData
    ? dynoData.reduce(
        (max, point) => (point.torque > max.torque ? point : max),
        dynoData[0],
      )
    : null;

  const peakHp = peakHpPoint ? Math.round(peakHpPoint.hp) : 0;
  const peakHpRpm = peakHpPoint
    ? Number(peakHpPoint.name || 0).toLocaleString()
    : "-";
  const peakTorque = peakTorquePoint ? Math.round(peakTorquePoint.torque) : 0;
  const peakTorqueRpm = peakTorquePoint
    ? Number(peakTorquePoint.name || 0).toLocaleString()
    : "-";

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
    <div className="absolute inset-0 top-[18vh] md:top-[16vh] flex items-start justify-center px-4 sm:px-6 py-4 pointer-events-none z-10">
      <div className="w-full max-w-4xl space-y-6 pointer-events-auto max-h-full overflow-y-auto">
        <div className="flex items-end justify-between px-1 sm:px-2">
          <div className="text-xs sm:text-sm font-bold tracking-[0.35em] uppercase text-gray-400">
            Telemetry
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-widest">
                  Power Curve
                </h3>
                <div className="text-xs text-gray-400 mt-1">
                  Wheel horsepower and torque across the rev range
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-right">
                <div>
                  <div className="text-[10px] uppercase text-gray-400">
                    Peak HP
                  </div>
                  <div className="text-sm font-mono text-yellow-400">
                    {peakHp}
                    <span className="text-[10px] text-gray-400 ml-1">hp</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    @ {peakHpRpm} rpm
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-gray-400">
                    Peak Torque
                  </div>
                  <div className="text-sm font-mono text-red-400">
                    {peakTorque}
                    <span className="text-[10px] text-gray-400 ml-1">
                      ft-lb
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    @ {peakTorqueRpm} rpm
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72">
              <Suspense
                fallback={
                  <div className="text-gray-500 text-sm">Loading...</div>
                }
              >
                <PowerCurveChart dynoData={dynoData} />
              </Suspense>
            </div>
          </div>

          <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 uppercase tracking-widest">
              Vehicle Balance
            </h3>
            <div className="w-full h-64">
              <Suspense
                fallback={
                  <div className="text-gray-500 text-sm">Loading...</div>
                }
              >
                <RadarBalanceChart radarData={radarData} />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
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
