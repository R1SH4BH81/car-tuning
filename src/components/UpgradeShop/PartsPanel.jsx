import React, { useCallback } from "react";
import { PARTS_DB } from "../../data/parts";
import PartLoader from "../common/PartLoader";

const PartsPanel = ({
  categoryGroups,
  activeGroup,
  activeSubCategory,
  setActiveSubCategory,
  carConfig,
  baseCar,
  setHoveredPart,
  installingPart,
  handleInstall,
}) => {
  const handleSubCategorySelect = useCallback(
    (subCat) => {
      setActiveSubCategory(subCat);
      setHoveredPart(null);
    },
    [setActiveSubCategory, setHoveredPart],
  );

  const getOptionCount = useCallback(
    (subCat) => {
      const allParts = PARTS_DB[subCat] || {};
      const partIds = Object.keys(allParts);

      if (subCat === "engine_swap") {
        return partIds.filter((id) => {
          if (id === "stock") return true;
          return baseCar.compatibleSwaps?.includes(id);
        }).length;
      }

      return partIds.length;
    },
    [baseCar.compatibleSwaps],
  );

  const getRelativeStat = useCallback(
    (stat, val, partId) => {
      if (!activeSubCategory) return null;
      if (carConfig[activeSubCategory] === partId) return null;

      const currentPartId = carConfig[activeSubCategory];
      const currentPart = PARTS_DB[activeSubCategory]?.[currentPartId];
      if (!currentPart) return null;

      let currentVal = 0;

      if (activeSubCategory === "engine_swap" && currentPartId === "stock") {
        if (baseCar.baseStats[stat] !== undefined) {
          currentVal = baseCar.baseStats[stat];
        }
      } else if (currentPart.stats && currentPart.stats[stat] !== undefined) {
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

      const diff = val - currentVal;
      if (Math.abs(diff) < 0.001) return null;

      const isInverse = [
        "weight",
        "shiftTime",
        "acceleration060",
        "brakingDistance600",
      ].includes(stat);
      const isGood = isInverse ? diff < 0 : diff > 0;

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
    },
    [activeSubCategory, baseCar.baseStats, carConfig],
  );

  return (
    <div className="flex-1 px-8 py-2 pointer-events-auto overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        {activeSubCategory && (
          <button
            onClick={() => {
              setActiveSubCategory(null);
              setHoveredPart(null);
            }}
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
        <h3 className="text-2xl font-black italic uppercase text-white drop-shadow-lg">
          {activeSubCategory
            ? activeSubCategory.replace("_", " ")
            : activeGroup}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
        {!activeSubCategory
          ? categoryGroups[activeGroup].map((subCat) => {
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
          : PARTS_DB[activeSubCategory] &&
            Object.entries(PARTS_DB[activeSubCategory])
              .filter(([id]) => {
                if (activeSubCategory === "engine_swap") {
                  if (id === "stock") return true;
                  return baseCar.compatibleSwaps?.includes(id);
                }
                return true;
              })
              .map(([id, part]) => {
                const isInstalled = carConfig[activeSubCategory] === id;
                const isInstalling = installingPart === id;

                let displayBaseStats = part.baseStats;
                if (activeSubCategory === "engine_swap" && id === "stock") {
                  displayBaseStats = {
                    hp: baseCar.baseStats.hp,
                    torque: baseCar.baseStats.torque,
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
                    {isInstalling && <PartLoader />}

                    {isInstalled && !isInstalling && (
                      <div className="absolute top-2 right-2 bg-black/20 px-2 py-0.5 text-xs font-bold uppercase rounded">
                        Installed
                      </div>
                    )}
                    <div className="text-lg font-bold mb-1">{part.name}</div>
                    {part.description && (
                      <div className="text-xs opacity-70 mb-2 uppercase tracking-wide">
                        {part.description}
                        {/* {part.specs && (
                          <div className="flex gap-2 mt-1">
                            {part.specs.aspiration && (
                              <span className="bg-white/10 px-1.5 py-0.5 rounded">
                                {part.specs.aspiration}
                              </span>
                            )}
                            {part.specs.weight && (
                              <span className="bg-white/10 px-1.5 py-0.5 rounded">
                                {part.specs.weight}
                              </span>
                            )}
                          </div>
                        )} */}
                      </div>
                    )}

                    <div className="mt-4 text-xs space-y-1 opacity-60 group-hover:opacity-100">
                      {displayBaseStats &&
                        Object.entries(displayBaseStats).map(([stat, val]) => (
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
                        ))}

                      {part.multiplier !== undefined && part.multiplier > 0 && (
                        <div className="flex justify-between uppercase text-yellow-500 font-bold">
                          <span>Power Gain</span>
                          <span>
                            +{(part.multiplier * 100).toFixed(0)}%
                            {getRelativeStat("multiplier", part.multiplier, id)}
                          </span>
                        </div>
                      )}
                      {part.stats &&
                        Object.entries(part.stats).map(([stat, val]) => {
                          // Don't show stat if it's already displayed in baseStats (e.g. stock engine)
                          if (
                            displayBaseStats &&
                            displayBaseStats[stat] !== undefined
                          )
                            return null;

                          // Don't show weight stat for engine swaps (handled by specs)
                          if (
                            activeSubCategory === "engine_swap" &&
                            stat === "weight"
                          )
                            return null;

                          return (
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
                          );
                        })}
                    </div>
                  </button>
                );
              })}
      </div>
    </div>
  );
};

export default PartsPanel;
