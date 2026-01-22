import { create } from "zustand";
import { calculatePerformance, generateDynoData } from "../utils/physicsEngine";
import { PARTS_DB, INITIAL_TUNING } from "../data/parts";
import carsData from "../assets/Cars.json";

// Use the first car as default for now
const defaultCar = carsData.cars[0];

const useStore = create((set, get) => ({
  // Base Car Data
  baseCar: defaultCar,

  // State
  carConfig: {
    engine: "stock",
    tires: "stock",
    weight_reduction: "stock",
    brakes: "stock",
    suspension: "stock",
    transmission: "stock",
  },
  tuningSettings: { ...INITIAL_TUNING },

  // Computed Performance Stats
  performanceStats: calculatePerformance(
    defaultCar.baseStats,
    {
      engine: "stock",
      tires: "stock",
      weight_reduction: "stock",
      brakes: "stock",
      suspension: "stock",
      transmission: "stock",
    },
    INITIAL_TUNING,
  ),

  dynoData: generateDynoData(
    defaultCar.baseStats.hp,
    defaultCar.baseStats.torque,
  ),

  // Actions
  setPart: (category, partId) => {
    const { baseCar, carConfig, tuningSettings } = get();
    const newConfig = { ...carConfig, [category]: partId };

    const newStats = calculatePerformance(
      baseCar.baseStats,
      newConfig,
      tuningSettings,
    );
    const newDyno = generateDynoData(newStats.hp, newStats.torque);

    set({
      carConfig: newConfig,
      performanceStats: newStats,
      dynoData: newDyno,
    });
  },

  setTuning: (setting, value) => {
    const { baseCar, carConfig, tuningSettings } = get();
    const newTuning = { ...tuningSettings, [setting]: value };

    const newStats = calculatePerformance(
      baseCar.baseStats,
      carConfig,
      newTuning,
    );

    set({
      tuningSettings: newTuning,
      performanceStats: newStats,
    });
  },

  // Helper to get preview stats for a part (Ghost Bars)
  getPreviewStats: (category, partId) => {
    const { baseCar, carConfig, tuningSettings } = get();
    const tempConfig = { ...carConfig, [category]: partId };
    return calculatePerformance(baseCar.baseStats, tempConfig, tuningSettings);
  },
}));

export default useStore;
