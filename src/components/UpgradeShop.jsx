import React, { useState, useMemo } from "react";
import useStore from "../store/useStore";
import { PARTS_DB } from "../data/parts";
import { AnimatePresence } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";
import { generateDynoData } from "../utils/physicsEngine";

// Group definitions
const CATEGORY_GROUPS = {
  Engine: [
    "engine_swap",
    "intake_manifold",
    "fuel_system",
    "ignition",
    "exhaust",
    "camshaft",
    "valves",
    "pistons",
    "turbo",
    "intercooler",
    "flywheel",
  ],
  Platform: ["brakes", "suspension", "arbs", "weight_reduction"],
  Drivetrain: ["transmission", "differential"],
  Tires: ["tires"],
  Aero: ["aero"],
};

// Helper to show stat diff
const StatDiff = ({ label, current, preview, unit = "", inverse = false }) => {
  const diff = preview - current;
  // Float tolerance
  const hasDiff = Math.abs(diff) > 0.001;

  // Determine color:
  // Normal: Increase (Diff > 0) is Green, Decrease is Red
  // Inverse (e.g. Time, Weight): Increase (Diff > 0) is Red, Decrease is Green
  const isGood = inverse ? diff < 0 : diff > 0;
  const colorClass = isGood ? "text-green-500" : "text-red-500";

  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <div className="flex gap-2">
        <span>
          {typeof preview === "number"
            ? parseFloat(preview.toFixed(2))
            : preview}
          {unit}
        </span>
        {hasDiff && (
          <span className={colorClass}>
            ({diff > 0 ? "+" : ""}
            {parseFloat(diff.toFixed(2))})
          </span>
        )}
      </div>
    </div>
  );
};

const UpgradeShop = () => {
  const {
    carConfig,
    setPart,
    getPreviewStats,
    performanceStats,
    dynoData,
    baseCar,
  } = useStore();

  const [activeGroup, setActiveGroup] = useState("Engine");
  const [activeSubCategory, setActiveSubCategory] = useState(null); // If null, show sub-category list
  const [hoveredPart, setHoveredPart] = useState(null);
  const [installingPart, setInstallingPart] = useState(null);

  // Helper to handle group change
  const handleGroupChange = (group) => {
    setActiveGroup(group);
    setActiveSubCategory(null);
    setHoveredPart(null);
  };

  // Helper to handle sub-category selection
  const handleSubCategorySelect = (subCat) => {
    setActiveSubCategory(subCat);
    setHoveredPart(null);
  };

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
    if (!activeSubCategory || !hoveredPart) return performanceStats;
    return getPreviewStats(activeSubCategory, hoveredPart);
  }, [activeSubCategory, hoveredPart, getPreviewStats, performanceStats]);

  // Calculate preview dyno data
  const previewDynoData = useMemo(() => {
    if (!hoveredPart) return dynoData;
    return generateDynoData(previewStats.hp, previewStats.torque);
  }, [hoveredPart, dynoData, previewStats]);

  // Helper to get relative stat value for cards
  const getRelativeStat = (stat, val, partId) => {
    // If we are looking at the installed part, diff is 0
    if (!activeSubCategory) return null;
    if (carConfig[activeSubCategory] === partId) return null;

    // We need the value of this stat on the CURRENTLY INSTALLED part.
    // 1. Get current part ID
    const currentPartId = carConfig[activeSubCategory];

    // 2. Get current part object
    const currentPart = PARTS_DB[activeSubCategory]?.[currentPartId];

    if (!currentPart) return null;

    // 3. Get value.
    // stat could be in 'stats', 'baseStats' or calculated from 'multiplier'
    // But 'val' passed in is the absolute value/multiplier of the part we are rendering.

    // Check if the current part has this stat
    let currentVal = 0;

    // Special handling for STOCK ENGINE SWAP which uses baseCar stats
    if (activeSubCategory === "engine_swap" && currentPartId === "stock") {
      if (baseCar.baseStats[stat] !== undefined) {
        currentVal = baseCar.baseStats[stat];
      }
    } else {
      if (currentPart.stats && currentPart.stats[stat] !== undefined) {
        currentVal = currentPart.stats[stat];
      } else if (
        currentPart.baseStats &&
        currentPart.baseStats[stat] !== undefined
      ) {
        currentVal = currentPart.baseStats[stat];
      } else if (
        stat === "multiplier" &&
        currentPart.multiplier !== undefined
      ) {
        currentVal = currentPart.multiplier;
      } else {
        currentVal = 0;
      }
    }

    const diff = val - currentVal;
    if (Math.abs(diff) < 0.001) return null;

    // Determine color
    const isInverse = [
      "weight",
      "shiftTime",
      "acceleration060",
      "brakingDistance600",
    ].includes(stat);
    const isGood = isInverse ? diff < 0 : diff > 0;

    // Format for multiplier
    if (stat === "multiplier") {
      return (
        <span
          className={`ml-1 text-[10px] ${isGood ? "text-green-500" : "text-red-500"}`}
        >
          ({diff > 0 ? "+" : ""}
          {(diff * 100).toFixed(0)}%)
        </span>
      );
    }

    return (
      <span
        className={`ml-1 text-[10px] ${isGood ? "text-green-500" : "text-red-500"}`}
      >
        ({diff > 0 ? "+" : ""}
        {parseFloat(diff.toFixed(2))})
      </span>
    );
  };

  // Helper to get option count based on filtering
  const getOptionCount = (subCat) => {
    const allParts = PARTS_DB[subCat] || {};
    const partIds = Object.keys(allParts);

    if (subCat === "engine_swap") {
      return partIds.filter((id) => {
        if (id === "stock") return true;
        return baseCar.compatibleSwaps?.includes(id);
      }).length;
    }

    return partIds.length;
  };

  return (
    <div className="absolute inset-0 top-24 bottom-0 flex flex-col pointer-events-none z-10">
      <div className="flex flex-1 overflow-hidden">
        {/* Parts List */}
        <div className="flex-1 p-8 pointer-events-auto overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            {activeSubCategory && (
              <button
                onClick={() => setActiveSubCategory(null)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <h2 className="text-4xl font-black italic uppercase text-white drop-shadow-lg">
              {activeSubCategory
                ? activeSubCategory.replace("_", " ")
                : activeGroup}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
            {!activeSubCategory
              ? // Sub-Category Selection View
                CATEGORY_GROUPS[activeGroup].map((subCat) => {
                  // Get currently installed part name
                  const installedPartId = carConfig[subCat];
                  const installedPart = PARTS_DB[subCat]?.[installedPartId];

                  return (
                    <button
                      key={subCat}
                      onClick={() => handleSubCategorySelect(subCat)}
                      className="relative p-6 rounded-sm text-left border bg-black/80 text-white border-white/10 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                      <div className="text-lg font-bold mb-1 uppercase">
                        {subCat.replace("_", " ")}
                      </div>
                      {installedPart && (
                        <div className="text-xs text-yellow-500 uppercase tracking-wide">
                          Installed: {installedPart.name}
                        </div>
                      )}
                      <div className="mt-4 text-xs opacity-60 uppercase">
                        {getOptionCount(subCat)} Options
                      </div>
                    </button>
                  );
                })
              : // Parts Selection View
                PARTS_DB[activeSubCategory] &&
                Object.entries(PARTS_DB[activeSubCategory])
                  .filter(([id]) => {
                    // Filter engine swaps based on car compatibility
                    if (activeSubCategory === "engine_swap") {
                      if (id === "stock") return true;
                      return baseCar.compatibleSwaps?.includes(id);
                    }
                    return true;
                  })
                  .map(([id, part]) => {
                    const isInstalled = carConfig[activeSubCategory] === id;
                    const isInstalling = installingPart === id;

                    // Override for Stock Engine Swap display
                    let displayBaseStats = part.baseStats;
                    if (activeSubCategory === "engine_swap" && id === "stock") {
                      displayBaseStats = {
                        hp: baseCar.baseStats.hp,
                        torque: baseCar.baseStats.torque,
                        weight: baseCar.baseStats.weight,
                      };
                    }

                    return (
                      <button
                        key={id}
                        onClick={() => handleInstall(activeSubCategory, id)}
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
                        <div className="text-lg font-bold mb-1">
                          {part.name}
                        </div>
                        {part.description && (
                          <div className="text-xs opacity-70 mb-2 uppercase tracking-wide">
                            {part.description}
                          </div>
                        )}

                        {/* Mini Stats Preview */}
                        <div className="mt-4 text-xs space-y-1 opacity-60 group-hover:opacity-100">
                          {displayBaseStats ? (
                            Object.entries(displayBaseStats).map(
                              ([stat, val]) => (
                                <div
                                  key={stat}
                                  className="flex justify-between uppercase"
                                >
                                  <span>{stat}</span>
                                  <span>
                                    {typeof val === "number"
                                      ? parseFloat(val.toFixed(2))
                                      : val}
                                    {getRelativeStat(stat, val, id)}
                                  </span>
                                </div>
                              ),
                            )
                          ) : (
                            <>
                              {part.multiplier !== undefined &&
                                part.multiplier > 0 && (
                                  <div className="flex justify-between uppercase text-yellow-500 font-bold">
                                    <span>Power Gain</span>
                                    <span>
                                      +{(part.multiplier * 100).toFixed(0)}%
                                      {getRelativeStat(
                                        "multiplier",
                                        part.multiplier,
                                        id,
                                      )}
                                    </span>
                                  </div>
                                )}
                              {part.stats &&
                                Object.entries(part.stats).map(
                                  ([stat, val]) => (
                                    <div
                                      key={stat}
                                      className="flex justify-between uppercase"
                                    >
                                      <span>{stat}</span>
                                      <span>
                                        {val > 0 ? "+" : ""}
                                        {typeof val === "number"
                                          ? parseFloat(val.toFixed(2))
                                          : val}
                                        {getRelativeStat(stat, val, id)}
                                      </span>
                                    </div>
                                  ),
                                )}
                            </>
                          )}
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
              inverse={true}
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
              inverse={true}
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
        {Object.keys(CATEGORY_GROUPS).map((group) => (
          <button
            key={group}
            onClick={() => handleGroupChange(group)}
            className={`
                px-6 py-3 uppercase font-bold tracking-wider transition-all border-b-4 whitespace-nowrap
                ${
                  activeGroup === group
                    ? "border-yellow-500 text-white bg-white/10"
                    : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
          >
            {group}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpgradeShop;
