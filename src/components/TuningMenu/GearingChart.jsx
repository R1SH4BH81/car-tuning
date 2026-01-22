import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const GearingChart = ({ data, rpmLimit }) => {
  return (
    <div className="w-full h-full p-2 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="speed"
            type="number"
            unit=" MPH"
            domain={[0, "auto"]}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
          />
          <YAxis
            dataKey="rpm"
            type="number"
            domain={[0, rpmLimit]}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            unit=" RPM"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#000",
              borderColor: "#333",
            }}
            itemStyle={{ fontSize: 12 }}
            labelStyle={{ color: "#fbbf24" }}
            cursor={{ stroke: "rgba(255,255,255,0.2)" }}
            formatter={(value, name) => [value, name === "speed" ? "Speed (MPH)" : "RPM"]}
          />
          <Line
            type="linear"
            dataKey="rpm"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="absolute top-1 right-2 text-[10px] text-gray-500 font-mono">
        RPM vs SPEED
      </div>
    </div>
  );
};

export default GearingChart;
