import { create } from "zustand";
import { calculatePerformance, generateDynoData } from "../utils/physicsEngine";
import { PARTS_DB, INITIAL_TUNING } from "../data/parts";
import carsData from "../assets/Cars.json";

const defaultCar =
  carsData.cars.find((c) => c.id === "koenigsegg-agera-r-2011") ||
  carsData.cars[0];

const INITIAL_CONFIG = {
  engine_swap: "stock",
  pistons: "stock",
  valves: "stock",
  camshaft: "stock",
  ignition: "stock",
  exhaust: "stock",
  intake_manifold: "stock",
  fuel_system: "stock",
  turbo: "stock",
  intercooler: "stock",
  flywheel: "stock",
  tires: "stock",
  weight_reduction: "stock",
  brakes: "stock",
  suspension: "stock",
  transmission: "stock",
  arbs: "stock",
  differential: "stock",
  aero: "stock",
};

const useStore = create((set, get) => ({
  // Base Car Data
  baseCar: defaultCar,
  allCars: carsData.cars,

  // State
  carConfig: { ...INITIAL_CONFIG },
  tuningSettings: { ...INITIAL_TUNING },
  compilingActive: false,
  compilingProgress: 0,

  // Computed Performance Stats
  performanceStats: calculatePerformance(
    { ...defaultCar.baseStats, pi: defaultCar.pi },
    INITIAL_CONFIG,
    INITIAL_TUNING,
    defaultCar.transmission.gears || 6,
  ),

  dynoData: generateDynoData(
    defaultCar.baseStats.hp,
    defaultCar.baseStats.torque,
  ),

  // Actions
  setCar: (carId) => {
    const newCar = carsData.cars.find((c) => c.id === carId);
    if (!newCar) return;

    // Reset config and tuning when changing car
    const newConfig = { ...INITIAL_CONFIG };
    const newTuning = { ...INITIAL_TUNING };

    const newStats = calculatePerformance(
      { ...newCar.baseStats, pi: newCar.pi },
      newConfig,
      newTuning,
      newCar.transmission.gears || 6,
    );
    const newDyno = generateDynoData(newStats.hp, newStats.torque);

    set({
      baseCar: newCar,
      carConfig: newConfig,
      tuningSettings: newTuning,
      performanceStats: newStats,
      dynoData: newDyno,
    });
  },

  setPart: (category, partId) => {
    const { baseCar, carConfig, tuningSettings } = get();
    const newConfig = { ...carConfig, [category]: partId };

    const newStats = calculatePerformance(
      { ...baseCar.baseStats, pi: baseCar.pi },
      newConfig,
      tuningSettings,
      baseCar.transmission.gears || 6,
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
      { ...baseCar.baseStats, pi: baseCar.pi },
      carConfig,
      newTuning,
      baseCar.transmission.gears || 6,
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
    return calculatePerformance(
      { ...baseCar.baseStats, pi: baseCar.pi },
      tempConfig,
      tuningSettings,
      baseCar.transmission.gears || 6,
    );
  },
  setCompilingActive: (active) => set({ compilingActive: active }),
  setCompilingProgress: (progress) => set({ compilingProgress: progress }),
}));

export default useStore;
