import React from "react";
import useStore from "../store/useStore";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const PerformanceStats = () => {
  const { performanceStats, dynoData } = useStore();

  return (
    <div className="absolute bottom-0 left-0 right-0 p-0 bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none">
      <div className="flex items-center justify-between px-3 py-2 pointer-events-auto md:hidden">
        <div className="flex items-center gap-2 text-[11px] font-mono text-white overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded border border-white/10 whitespace-nowrap">
            <span className="uppercase text-white/60 tracking-wider">HP</span>
            <span>{performanceStats.hp}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded border border-white/10 whitespace-nowrap">
            <span className="uppercase text-white/60 tracking-wider">
              Torque
            </span>
            <span>{performanceStats.torque}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded border border-white/10 whitespace-nowrap">
            <span className="uppercase text-white/60 tracking-wider">
              Weight
            </span>
            <span>{performanceStats.weight}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded border border-white/10 whitespace-nowrap">
            <span className="uppercase text-white/60 tracking-wider">0-60</span>
            <span>{performanceStats.acceleration060}s</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded border border-white/10 whitespace-nowrap">
            <span className="uppercase text-white/60 tracking-wider">Top</span>
            <span>{performanceStats.topSpeed} MPH</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded border border-white/10 whitespace-nowrap">
            <span className="uppercase text-white/60 tracking-wider">LatG</span>
            <span>{performanceStats.lateralG}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded border border-white/10 whitespace-nowrap">
            <span className="uppercase text-white/60 tracking-wider">60-0</span>
            <span>{performanceStats.brakingDistance600} FT</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`text-lg font-black italic tracking-tighter ${getPIColor(
              performanceStats.piClass,
            )}`}
          >
            {performanceStats.piClass}
          </div>
          <div className="bg-white text-black font-bold text-sm px-2 py-0.5 rounded">
            {performanceStats.pi}
          </div>
        </div>
      </div>

      <div className="hidden md:flex justify-between items-end px-6 pb-4 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto flex-wrap max-w-[60%]">
          <StatBox
            label="Power"
            value={performanceStats.hp}
            unit="HP"
            color="yellow"
          />
          <StatBox
            label="Torque"
            value={performanceStats.torque}
            unit="FT-LB"
            color="yellow"
          />
          <StatBox label="Weight" value={performanceStats.weight} unit="LBS" />
          <StatBox
            label="0-60 MPH"
            value={performanceStats.acceleration060}
            unit="s"
          />
          <StatBox
            label="Top Speed"
            value={performanceStats.topSpeed}
            unit="MPH"
          />
          <StatBox label="Lat G" value={performanceStats.lateralG} unit="G" />
          <StatBox
            label="60-0"
            value={performanceStats.brakingDistance600}
            unit="FT"
          />
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <div
            className={`text-4xl font-black italic tracking-tighter ${getPIColor(
              performanceStats.piClass,
            )}`}
          >
            {performanceStats.piClass}
          </div>
          <div className="bg-white text-black font-bold text-xl px-3 py-1 rounded">
            {performanceStats.pi}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, unit, color = "gray" }) => (
  <div
    className={`bg-black/60 backdrop-blur-md p-3 rounded border-t-2 ${
      color === "yellow" ? "border-yellow-500" : "border-gray-600"
    }`}
  >
    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
      {label}
    </div>
    <div className="text-xl font-bold font-mono text-white whitespace-nowrap">
      {value} <span className="text-xs text-gray-500 ml-1">{unit}</span>
    </div>
  </div>
);

const getPIColor = (piClass) => {
  switch (piClass) {
    case "X":
      return "text-green-500";
    case "S2":
      return "text-blue-500";
    case "S1":
      return "text-purple-500";
    case "A":
      return "text-red-500";
    case "B":
      return "text-orange-500";
    case "C":
      return "text-yellow-500";
    case "D":
      return "text-gray-500";
    default:
      return "text-white";
  }
};

export default PerformanceStats;
