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
    <div className="absolute bottom-0 left-0 right-0 p-0 bg-gradient-to-t from-black via-black/90 to-transparent z-10 flex justify-between items-end pointer-events-none">
      {/* Left: Core Stats */}
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

      {/* Middle: Dyno Graph */}
      <div className="w-64 h-32 pointer-events-auto opacity-80 hidden md:block">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dynoData}>
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[0, "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                border: "1px solid #333",
              }}
              itemStyle={{ fontSize: "12px" }}
              labelStyle={{ display: "none" }}
            />
            <Line
              type="monotone"
              dataKey="hp"
              stroke="#eab308"
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
