import React, { useState, useMemo } from "react";
import useStore from "../store/useStore";
import { generateDynoData } from "../utils/physicsEngine";
import CategoryBar from "./UpgradeShop/CategoryBar";
import PartsPanel from "./UpgradeShop/PartsPanel";
import ComparisonPanel from "./UpgradeShop/ComparisonPanel";

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

  return (
    <div className="absolute inset-0 top-36  bottom-0 flex flex-col pointer-events-none z-10 ">
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <PartsPanel
          categoryGroups={CATEGORY_GROUPS}
          activeGroup={activeGroup}
          activeSubCategory={activeSubCategory}
          setActiveSubCategory={setActiveSubCategory}
          carConfig={carConfig}
          baseCar={baseCar}
          setHoveredPart={setHoveredPart}
          installingPart={installingPart}
          handleInstall={handleInstall}
        />

        {/* Comparison Panel (Right) - Always Visible */}
        <ComparisonPanel
          performanceStats={performanceStats}
          previewStats={previewStats}
          hoveredPart={hoveredPart}
          dynoData={dynoData}
          previewDynoData={previewDynoData}
        />
      </div>

      {/* Categories Bottom Bar */}
      <CategoryBar
        groups={Object.keys(CATEGORY_GROUPS)}
        activeGroup={activeGroup}
        onGroupChange={handleGroupChange}
      />
    </div>
  );
};

export default UpgradeShop;
