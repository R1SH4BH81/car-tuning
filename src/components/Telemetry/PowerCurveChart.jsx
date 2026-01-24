import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const PowerCurveChart = ({ dynoData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={dynoData}
        margin={{ top: 1, right: 3, left: 2, bottom: 1 }}
      >
        <XAxis
          dataKey="name"
          stroke="#666"
          tick={{ fill: "#9ca3af", fontSize: 9 }}
          label={{
            value: "RPM",
            position: "insideBottomRight",
            offset: -5,
            fill: "#9ca3af",
          }}
        />
        <YAxis
          stroke="#666"
          tick={{ fill: "#9ca3af", fontSize: 9 }}
          label={{
            value: "Power/Torque",
            angle: -90,
            position: "center",
            offset: -5,
            fill: "#9ca3af",
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#000",
            border: "1px solid #333",
          }}
          itemStyle={{ color: "#fff" }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "6px", color: "#fff", fontSize: 9 }}
        />
        <Line
          type="monotone"
          dataKey="hp"
          stroke="#fbbf24"
          strokeWidth={2}
          dot={false}
          name="HP"
        />
        <Line
          type="monotone"
          dataKey="torque"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          name="Torque"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PowerCurveChart;
