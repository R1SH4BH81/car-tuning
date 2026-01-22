import React from "react";
import useStore from "../store/useStore";
import { ResponsiveContainer, LineChart, Line } from "recharts";

const PerformanceStats = () => {
  const { performanceStats, dynoData } = useStore();

  return (
    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent z-10 flex justify-between items-end pointer-events-none">
      {/* Left: Core Stats */}
      <div className="flex gap-8 pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border-l-4 border-yellow-500">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Power
          </div>
          <div className="text-3xl font-bold font-mono">
            {performanceStats.hp}{" "}
            <span className="text-sm text-gray-500">HP</span>
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border-l-4 border-yellow-500">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Torque
          </div>
          <div className="text-3xl font-bold font-mono">
            {performanceStats.torque}{" "}
            <span className="text-sm text-gray-500">FT-LB</span>
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border-l-4 border-gray-500">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Weight
          </div>
          <div className="text-3xl font-bold font-mono">
            {performanceStats.weight}{" "}
            <span className="text-sm text-gray-500">LBS</span>
          </div>
        </div>
      </div>

      {/* Middle: Dyno Graph */}
      <div className="h-32 w-64 bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/5 pointer-events-auto hidden md:block">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dynoData}>
            <Line
              type="monotone"
              dataKey="hp"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="torque"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Right: Class & PI */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase">0-60 MPH</div>
          <div className="text-xl font-mono text-white">
            {performanceStats.acceleration060}s
          </div>
          <div className="text-xs text-gray-400 uppercase mt-2">Top Speed</div>
          <div className="text-xl font-mono text-white">
            {performanceStats.topSpeed} MPH
          </div>
        </div>

        <div
          className={`
            w-24 h-20 flex flex-col items-center justify-center rounded-lg shadow-lg
            ${
              performanceStats.piClass === "X"
                ? "bg-green-600"
                : performanceStats.piClass === "S2"
                  ? "bg-blue-600"
                  : performanceStats.piClass === "S1"
                    ? "bg-purple-600"
                    : performanceStats.piClass === "A"
                      ? "bg-red-600"
                      : "bg-orange-500"
            }
         `}
        >
          <div className="text-3xl font-bold italic">
            {performanceStats.piClass}
          </div>
          <div className="text-xl font-mono">{performanceStats.pi}</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;
