import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

const DynoChart = ({ hoveredPart, dynoData, previewDynoData }) => {
  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/5 pointer-events-auto relative">
      <div className="absolute top-2 right-2 text-[10px] text-gray-500 font-mono">
        {hoveredPart ? "PREVIEW" : "CURRENT"}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={previewDynoData}>
          <XAxis hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Line
            type="monotone"
            dataKey="hp"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            strokeOpacity={hoveredPart ? 0.8 : 1}
          />
          <Line
            type="monotone"
            dataKey="torque"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            strokeOpacity={hoveredPart ? 0.8 : 1}
          />
          {hoveredPart && (
            <>
              <Line
                type="monotone"
                dataKey="hp"
                data={dynoData}
                stroke="#fbbf24"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                isAnimationActive={false}
                strokeOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="torque"
                data={dynoData}
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                isAnimationActive={false}
                strokeOpacity={0.3}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynoChart;
