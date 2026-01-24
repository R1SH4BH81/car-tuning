import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const PowerCurveChart = ({ dynoData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={dynoData}
        margin={{ top: 10, right: 1, left: 0, bottom: 18 }}
      >
        <defs>
          <linearGradient id="hpStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="tqStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke="#1f2937"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          stroke="#4b5563"
          tick={{ fill: "#9ca3af", fontSize: 10 }}
          tickFormatter={(value) => Number(value || 0).toLocaleString("en-US")}
          tickLine={false}
          axisLine={{ stroke: "#374151" }}
          label={{
            value: "Power/Torque x RPM",
            position: "insideBottomRight",
            offset: -10,
            fill: "#9ca3af",
            fontSize: 10,
          }}
        />
        <YAxis
          stroke="#4b5563"
          tick={{ fill: "#9ca3af", fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: "#374151" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.9)",
            border: "1px solid #4b5563",
            borderRadius: 8,
            padding: 8,
          }}
          itemStyle={{ color: "#e5e7eb", fontSize: 11 }}
          labelStyle={{ color: "#9ca3af", fontSize: 11 }}
          formatter={(value, name) => {
            const rounded = Math.round(value || 0);
            const unit = name === "HP" ? "hp" : "ft-lb";
            return [`${rounded} ${unit}`, name];
          }}
          labelFormatter={(value) =>
            `${Number(value || 0).toLocaleString("en-US")} rpm`
          }
        />
        <Legend
          wrapperStyle={{ paddingTop: 8, color: "#f9fafb", fontSize: 11 }}
          iconType="plainline"
        />
        <Line
          type="monotone"
          dataKey="hp"
          stroke="url(#hpStroke)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          name="HP"
        />
        <Line
          type="monotone"
          dataKey="torque"
          stroke="url(#tqStroke)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          name="Torque"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PowerCurveChart;
