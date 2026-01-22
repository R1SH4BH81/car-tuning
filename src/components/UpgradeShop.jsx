import React, { useState, useMemo } from "react";
import useStore from "../store/useStore";
import { PARTS_DB } from "../data/parts";
import { AnimatePresence } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";
import { generateDynoData } from "../utils/physicsEngine";

// Helper to show stat diff
const StatDiff = ({ label, current, preview, unit = "" }) => {
  const diff = preview - current;
  // Float tolerance
  const hasDiff = Math.abs(diff) > 0.001;

  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <div className="flex gap-2">
        <span>
          {preview}
          {unit}
        </span>
        {hasDiff && (
          <span className={diff > 0 ? "text-green-500" : "text-red-500"}>
            ({diff > 0 ? "+" : ""}
            {diff.toFixed(2).replace(/\.00$/, "")})
          </span>
        )}
      </div>
    </div>
  );
};

const UpgradeShop = () => {
  const { carConfig, setPart, getPreviewStats, performanceStats, dynoData } =
    useStore();
  const [selectedCategory, setSelectedCategory] = useState("engine");
  const [hoveredPart, setHoveredPart] = useState(null);
  const [installingPart, setInstallingPart] = useState(null);

  const categories = Object.keys(PARTS_DB);

  // Handle part installation with delay
  const handleInstall = (category, partId) => {
    if (carConfig[category] === partId) return; // Already installed

    setInstallingPart(partId);
    // Simulate install time (avg 1 sec)
    setTimeout(() => {
      setPart(category, partId);
      setInstallingPart(null);
    }, 1000);
  };

  // Calculate preview stats if hovering, else show current
  const previewStats = useMemo(() => {
    // If installing, show the stats of the part being installed as "preview"
    // or just keep showing current until done.
    // Standard behavior: show preview on hover.
    return hoveredPart
      ? getPreviewStats(selectedCategory, hoveredPart)
      : performanceStats;
  }, [hoveredPart, selectedCategory, getPreviewStats, performanceStats]);

  // Calculate preview dyno data
  const previewDynoData = useMemo(() => {
    if (!hoveredPart) return dynoData;
    return generateDynoData(previewStats.hp, previewStats.torque);
  }, [hoveredPart, dynoData, previewStats]);

  return (
    <div className="absolute inset-0 top-24 bottom-0 flex flex-col pointer-events-none z-10">
      <div className="flex flex-1 overflow-hidden">
        {/* Parts List */}
        <div className="flex-1 p-8 pointer-events-auto overflow-y-auto">
          <h2 className="text-4xl font-black italic uppercase text-white mb-8 drop-shadow-lg">
            {selectedCategory.replace("_", " ")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
            {Object.entries(PARTS_DB[selectedCategory]).map(([id, part]) => {
              const isInstalled = carConfig[selectedCategory] === id;
              const isInstalling = installingPart === id;

              return (
                <button
                  key={id}
                  onClick={() => handleInstall(selectedCategory, id)}
                  onMouseEnter={() => setHoveredPart(id)}
                  onMouseLeave={() => setHoveredPart(null)}
                  disabled={isInstalling}
                  className={`
                  relative p-6 rounded-sm text-left border transition-all group hover:scale-[1.02] active:scale-[0.98]
                  ${
                    isInstalled
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : "bg-black/80 text-white border-white/10 hover:border-white/40"
                  }
                  ${isInstalling ? "opacity-100 cursor-wait" : ""}
                `}
                >
                  {isInstalling && (
                    <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center backdrop-blur-sm rounded-sm">
                      <div className="traffic-loader scale-50"></div>
                    </div>
                  )}

                  {isInstalled && !isInstalling && (
                    <div className="absolute top-2 right-2 bg-black/20 px-2 py-0.5 text-xs font-bold uppercase rounded">
                      Installed
                    </div>
                  )}
                  <div className="text-lg font-bold mb-1">{part.name}</div>
                  {part.description && (
                    <div className="text-xs opacity-70 mb-2 uppercase tracking-wide">
                      {part.description}
                    </div>
                  )}

                  {/* Mini Stats Preview */}
                  <div className="mt-4 text-xs space-y-1 opacity-60 group-hover:opacity-100">
                    {Object.entries(part.stats).map(([stat, val]) => (
                      <div
                        key={stat}
                        className="flex justify-between uppercase"
                      >
                        <span>{stat}</span>
                        <span>
                          {val > 0 ? "+" : ""}
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Panel (Right) - Always Visible */}
        <div className="w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 p-6 pointer-events-auto">
          <h3 className="text-xl font-bold uppercase mb-6 text-yellow-500 border-b border-white/10 pb-2">
            Projected Stats
          </h3>

          <div className="space-y-4 font-mono">
            {/* HP, Torque, Weight removed as requested (moved to top bar) */}

            <StatDiff
              label="Top Speed"
              current={performanceStats.topSpeed}
              preview={previewStats.topSpeed}
              unit=" MPH"
            />
            <StatDiff
              label="0-60 MPH"
              current={performanceStats.acceleration060}
              preview={previewStats.acceleration060}
              unit="s"
            />
            <StatDiff
              label="Handling"
              current={performanceStats.lateralG}
              preview={previewStats.lateralG}
              unit=" G"
            />
            <StatDiff
              label="Braking"
              current={performanceStats.brakingDistance600}
              preview={previewStats.brakingDistance600}
              unit=" FT"
            />

            <div className="mt-4 border-t border-white/10 pt-4 text-xs text-gray-500 font-mono">
              <div className="flex justify-between mb-1">
                <span>Stock HP:</span>
                <span className="text-gray-400">565 HP</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Stock Torque:</span>
                <span className="text-gray-400">467 FT-LB</span>
              </div>
              <div className="flex justify-between">
                <span>Stock Weight:</span>
                <span className="text-gray-400">1752 LBS</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="uppercase text-sm">PI Change</span>
                <div className="text-2xl font-bold flex gap-2">
                  <span>{performanceStats.pi}</span>
                  <span className="text-gray-500">→</span>
                  <span
                    className={
                      previewStats.pi > performanceStats.pi
                        ? "text-green-500"
                        : "text-white"
                    }
                  >
                    {previewStats.pi}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-32 w-64 bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/5 pointer-events-auto hidden md:block relative">
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
                  {/* If hovering, show ghost lines of current stats for comparison */}
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
          </div>
        </div>
      </div>

      {/* Categories Bottom Bar */}
      <div className="h-24 bg-black/90 backdrop-blur-md border-t border-white/10 pointer-events-auto overflow-x-auto flex items-center px-8 gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
                px-6 py-3 uppercase font-bold tracking-wider transition-all border-b-4 whitespace-nowrap
                ${
                  selectedCategory === cat
                    ? "border-yellow-500 text-white bg-white/10"
                    : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
          >
            {cat.replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpgradeShop;
