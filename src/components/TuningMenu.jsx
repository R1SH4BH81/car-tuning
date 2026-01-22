import React, { useState, useMemo } from "react";
import useStore from "../store/useStore";
import { INITIAL_TUNING } from "../data/parts";
import { calculatePerformance, generateGearingGraphData } from "../utils/physicsEngine";
import TuningRightPanel from "./TuningMenu/TuningRightPanel";
import TuningSectionContent from "./TuningMenu/TuningSectionContent";
import TuningStatsPanel from "./TuningMenu/TuningStatsPanel";

const TUNING_SECTIONS = [
  { id: "tires", label: "Tires" },
  { id: "gearing", label: "Gearing" },
  { id: "alignment", label: "Alignment" },
  // { id: "arbs", label: "Anti-roll bars" },
  { id: "springs", label: "Springs" },
  { id: "damping", label: "Damping" },
  { id: "aero", label: "Aero" },
  { id: "brake", label: "Brake" },
  { id: "differential", label: "Differential" },
];

const TuningMenu = () => {
  const { tuningSettings, setTuning, carConfig, performanceStats, baseCar } =
    useStore();
  const [activeSection, setActiveSection] = useState("tires");

  // Calculate baseline stats for comparison (stock tuning with current parts)
  const baselineStats = useMemo(() => {
    if (!baseCar || !carConfig) return null;
    return calculatePerformance(
      baseCar.baseStats,
      carConfig,
      INITIAL_TUNING,
      baseCar.transmission.gears || 6,
    );
  }, [baseCar, carConfig]);

  // Generate Gearing Data
  const gearingData = useMemo(() => {
    if (activeSection !== "gearing") return [];
    return generateGearingGraphData(
      tuningSettings,
      performanceStats?.rpmLimit,
      baseCar?.transmission?.gears || 6,
    );
  }, [tuningSettings, activeSection, performanceStats?.rpmLimit, baseCar]);

  return (
    <div className="absolute inset-0 top-24 bottom-0 flex z-10">
      {/* Top Bar (simulated by Flex layout) */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/90 flex items-center justify-between px-8 border-b border-white/10 z-20">
        <div className="text-xl font-bold italic tracking-tighter">
          TUNE SETUP
        </div>
        <div className="flex gap-1">
          {TUNING_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                        px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors
                        ${activeSection === section.id ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}
                    `}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full pt-12 flex">
        {/* Left: Stats (Acceleration, Braking, etc) */}
        <TuningStatsPanel
          performanceStats={performanceStats}
          baselineStats={baselineStats}
        />

        {/* Middle: Sliders */}
        <div className="flex-1 bg-black/60 backdrop-blur-md p-8 pt-12 overflow-y-auto">
          <TuningSectionContent
            activeSection={activeSection}
            tuningSettings={tuningSettings}
            setTuning={setTuning}
            baseCar={baseCar}
            performanceStats={performanceStats}
          />
        </div>

        {/* Right: Helper Info/Image */}
        <TuningRightPanel
          activeSection={activeSection}
          gearingData={gearingData}
          rpmLimit={performanceStats?.rpmLimit}
        />
      </div>
    </div>
  );
};

export default TuningMenu;
