import React from "react";
import useStore from "../store/useStore";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

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
        {/* Radar Chart */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest self-start">
            Vehicle Balance
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "white", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Car"
                  dataKey="A"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  fill="#fbbf24"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dyno Graph Large */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">
            Power Curve
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dynoData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#666"
                  label={{
                    value: "RPM",
                    position: "insideBottomRight",
                    offset: -5,
                    fill: "#9ca3af",
                  }}
                />
                <YAxis
                  stroke="#666"
                  label={{
                    value: "Power / Torque",
                    angle: -90,
                    position: "insideLeft",
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
                <Legend wrapperStyle={{ paddingTop: "10px", color: "#fff" }} />
                <Line
                  type="monotone"
                  dataKey="hp"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  dot={false}
                  name="HP"
                />
                <Line
                  type="monotone"
                  dataKey="torque"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                  name="Torque"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Detailed Stats */}
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
