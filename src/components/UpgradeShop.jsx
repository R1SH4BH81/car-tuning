import React, { useState } from "react";
import useStore from "../store/useStore";
import { PARTS_DB } from "../data/parts";
import { AnimatePresence } from "framer-motion";

// Helper to show stat diff
const StatDiff = ({ label, current, preview, unit = "" }) => {
  const diff = preview - current;
  if (diff === 0) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={diff > 0 ? "text-green-500" : "text-red-500"}>
        {diff > 0 ? "+" : ""}
        {diff}
        {unit}
      </span>
    </div>
  );
};

const UpgradeShop = () => {
  const { carConfig, setPart, getPreviewStats, performanceStats } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("engine");
  const [hoveredPart, setHoveredPart] = useState(null);

  const categories = Object.keys(PARTS_DB);

  // Calculate preview stats if hovering, else show current
  const previewStats = hoveredPart
    ? getPreviewStats(selectedCategory, hoveredPart)
    : performanceStats;

  return (
    <div className="absolute inset-0 top-24 bottom-24 flex pointer-events-none z-10">
      {/* Categories Sidebar */}
      <div className="w-64 h-full bg-black/60 backdrop-blur-md border-r border-white/10 pointer-events-auto overflow-y-auto">
        <div className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
          Categories
        </div>
        <div className="flex flex-col">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                text-left px-6 py-4 uppercase font-bold tracking-wider transition-all border-l-4
                ${
                  selectedCategory === cat
                    ? "bg-white/10 border-yellow-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Parts List */}
      <div className="flex-1 p-8 pointer-events-auto overflow-y-auto">
        <h2 className="text-4xl font-black italic uppercase text-white mb-8 drop-shadow-lg">
          {selectedCategory.replace("_", " ")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(PARTS_DB[selectedCategory]).map(([id, part]) => {
            const isInstalled = carConfig[selectedCategory] === id;
            return (
              <button
                key={id}
                onClick={() => setPart(selectedCategory, id)}
                onMouseEnter={() => setHoveredPart(id)}
                onMouseLeave={() => setHoveredPart(null)}
                className={`
                  relative p-6 rounded-sm text-left border transition-all group hover:scale-[1.02] active:scale-[0.98]
                  ${
                    isInstalled
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : "bg-black/80 text-white border-white/10 hover:border-white/40"
                  }
                `}
              >
                {isInstalled && (
                  <div className="absolute top-2 right-2 bg-black/20 px-2 py-0.5 text-xs font-bold uppercase rounded">
                    Installed
                  </div>
                )}
                <div className="text-lg font-bold mb-1">{part.name}</div>
                <div
                  className={`font-mono ${isInstalled ? "text-black/70" : "text-yellow-500"}`}
                >
                  {part.price === 0
                    ? "FREE"
                    : `${part.price.toLocaleString()} CR`}
                </div>

                {/* Mini Stats Preview */}
                <div className="mt-4 text-xs space-y-1 opacity-60 group-hover:opacity-100">
                  {Object.entries(part.stats).map(([stat, val]) => (
                    <div key={stat} className="flex justify-between uppercase">
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

      {/* Comparison Panel (Right) */}
      <AnimatePresence>
        {hoveredPart && hoveredPart !== carConfig[selectedCategory] && (
          <div className="w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 p-6 pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold uppercase mb-6 text-yellow-500 border-b border-white/10 pb-2">
              Projected Stats
            </h3>

            <div className="space-y-4 font-mono">
              <StatDiff
                label="Horsepower"
                current={performanceStats.hp}
                preview={previewStats.hp}
                unit=" HP"
              />
              <StatDiff
                label="Torque"
                current={performanceStats.torque}
                preview={previewStats.torque}
                unit=" FT-LB"
              />
              <StatDiff
                label="Weight"
                current={performanceStats.weight}
                preview={previewStats.weight}
                unit=" LBS"
              />
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
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpgradeShop;
