import React from "react";
import useStore from "../store/useStore";
import { ResponsiveContainer, LineChart, Line } from "recharts";

const PerformanceStats = () => {
  const { performanceStats, dynoData } = useStore();

  return (
    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent z-10 flex justify-between items-end pointer-events-none">
      {/* Left: Core Stats */}
      {/* <div className="flex gap-8 pointer-events-auto">
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
      </div> */}

      {/* Middle: Dyno Graph */}

      {/* Right: Class & PI */}
    </div>
  );
};

export default PerformanceStats;
