import React, { useState, useMemo } from "react";
import useStore from "../store/useStore";
import { INITIAL_TUNING } from "../data/parts";
import {
  calculatePerformance,
  generateGearingGraphData,
} from "../utils/physicsEngine";
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
    <div className="absolute left-0 right-0 top-[14vh] md:top-24 bottom-0 flex flex-col lg:flex-row z-10">
      <div className="absolute top-0 left-0 right-0 h-auto md:h-12 bg-black/90 flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8 py-2 md:py-0 border-b border-white/10 z-20">
        <div className="text-xl font-bold italic tracking-tighter">
          TUNE SETUP
        </div>
        <div className="flex flex-wrap gap-2 md:gap-1 mt-2 md:mt-0">
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

      <div className="w-full h-full pt-16 md:pt-12 flex flex-col lg:flex-row gap-4 lg:gap-0">
        <TuningStatsPanel
          performanceStats={performanceStats}
          baselineStats={baselineStats}
        />

        <div className="flex-1 bg-black/60 backdrop-blur-md p-4 md:p-8 pt-16 md:pt-12 overflow-y-auto">
          <TuningSectionContent
            activeSection={activeSection}
            tuningSettings={tuningSettings}
            setTuning={setTuning}
            baseCar={baseCar}
            performanceStats={performanceStats}
          />
        </div>

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
