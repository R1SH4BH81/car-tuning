export const PARTS_DB = {
  engine_swap: {
    stock: {
      name: "Stock Engine",
      description: "Original factory engine",
      price: 0,
      stats: { hp: 0, torque: 0, weight: 0 }, // Relative to base, handled specially
    },
    // Generic Swaps (Legacy support if needed, or specific mapped ones)
    v8_modern: {
      name: "6.2L V8",
      description: "Naturally Aspirated Modern V8",
      price: 12000,
      baseStats: { hp: 450, torque: 450, weight: 200 }, // Absolute stats
    },
    racing_v8: {
      name: "5.0L Racing V8",
      description: "High-revving Racing V8",
      price: 25000,
      baseStats: { hp: 600, torque: 500, weight: 180 },
    },
    racing_v12: {
      name: "6.0L Racing V12",
      description: "Le Mans Prototype Engine",
      price: 45000,
      baseStats: { hp: 800, torque: 700, weight: 220 },
    },
    racing_v10: {
      name: "5.2L V10",
      description: "High performance V10",
      price: 35000,
      baseStats: { hp: 600, torque: 400, weight: 190 },
    },
    flat6_tt: {
      name: "3.8L Flat-6 Twin Turbo",
      description: "Modern Turbocharged Flat-6",
      price: 28000,
      baseStats: { hp: 640, torque: 590, weight: 210 },
    },
    flat6_modern: {
      name: "4.0L Flat-6 NA",
      description: "Modern Naturally Aspirated Flat-6",
      price: 22000,
      baseStats: { hp: 500, torque: 340, weight: 190 },
    },
    racing_v6_tt: {
      name: "3.8L V6 Twin Turbo",
      description: "VR38DETT Spec",
      price: 30000,
      baseStats: { hp: 600, torque: 480, weight: 230 },
    },
    v10_n_a: {
      name: "5.2L V10 NA",
      description: "Naturally Aspirated V10",
      price: 28000,
      baseStats: { hp: 602, torque: 413, weight: 240 },
    },
    turbo_rally_i4: {
      name: "1.6L Turbo Rally",
      description: "WRC Spec Inline-4",
      price: 15000,
      baseStats: { hp: 380, torque: 450, weight: 120 },
    },
  },

  // Engine Internals
  intake_manifold: {
    stock: { name: "Stock Intake", price: 0, multiplier: 0, grade: "stock" },
    street: {
      name: "Street Intake",
      price: 500,
      multiplier: 0.05,
      grade: "street",
      stats: { torque: 5 },
    },
    sport: {
      name: "Sport Intake",
      price: 1500,
      multiplier: 0.1,
      grade: "sport",
      stats: { weight: -2 },
    },
    race: {
      name: "Race Intake",
      price: 3000,
      multiplier: 0.15,
      grade: "race",
      stats: { weight: -5 },
    },
  },
  fuel_system: {
    stock: {
      name: "Stock Fuel System",
      price: 0,
      multiplier: 0,
      grade: "stock",
    },
    street: {
      name: "Street Fuel System",
      price: 800,
      multiplier: 0.05,
      grade: "street",
    },
    sport: {
      name: "Sport Fuel System",
      price: 2000,
      multiplier: 0.12,
      grade: "sport",
    },
    race: {
      name: "Race Fuel System",
      price: 4500,
      multiplier: 0.2,
      grade: "race",
    },
  },
  ignition: {
    // ECU
    stock: { name: "Stock Ignition", price: 0, multiplier: 0, grade: "stock" },
    street: {
      name: "Street Ignition",
      price: 1000,
      multiplier: 0.08,
      grade: "street",
    },
    sport: {
      name: "Sport Ignition",
      price: 2500,
      multiplier: 0.15,
      grade: "sport",
    },
    race: {
      name: "Race Ignition",
      price: 6000,
      multiplier: 0.25,
      grade: "race",
    },
  },
  exhaust: {
    stock: {
      name: "Stock Exhaust",
      price: 0,
      multiplier: 0,
      grade: "stock",
      stats: { weight: 0 },
    },
    street: {
      name: "Street Exhaust",
      price: 900,
      multiplier: 0.05,
      grade: "street",
      stats: { weight: -5 },
    },
    sport: {
      name: "Sport Exhaust",
      price: 2200,
      multiplier: 0.1,
      grade: "sport",
      stats: { weight: -12 },
    },
    race: {
      name: "Race Exhaust",
      price: 5000,
      multiplier: 0.18,
      grade: "race",
      stats: { weight: -25 },
    },
  },
  camshaft: {
    stock: {
      name: "Stock Camshaft",
      price: 0,
      multiplier: 0,
      grade: "stock",
      stats: { rpmLimit: 0 },
    },
    street: {
      name: "Street Camshaft",
      price: 1200,
      multiplier: 0.08,
      grade: "street",
      stats: { rpmLimit: 500 },
    },
    sport: {
      name: "Sport Camshaft",
      price: 3000,
      multiplier: 0.15,
      grade: "sport",
      stats: { rpmLimit: 1000 },
    },
    race: {
      name: "Race Camshaft",
      price: 7000,
      multiplier: 0.25,
      grade: "race",
      stats: { rpmLimit: 2000 },
    },
  },
  valves: {
    stock: { name: "Stock Valves", price: 0, multiplier: 0, grade: "stock" },
    street: {
      name: "Street Valves",
      price: 800,
      multiplier: 0.04,
      grade: "street",
    },
    sport: {
      name: "Sport Valves",
      price: 2000,
      multiplier: 0.09,
      grade: "sport",
    },
    race: { name: "Race Valves", price: 4000, multiplier: 0.15, grade: "race" },
  },
  pistons: {
    // Displacement/Compression
    stock: {
      name: "Stock Block",
      price: 0,
      multiplier: 0,
      grade: "stock",
      stats: { weight: 0 },
    },
    street: {
      name: "Street Block",
      price: 1500,
      multiplier: 0.06,
      grade: "street",
      stats: { weight: -2 },
    },
    sport: {
      name: "Sport Block",
      price: 4000,
      multiplier: 0.12,
      grade: "sport",
      stats: { weight: -5 },
    },
    race: {
      name: "Race Block",
      price: 9000,
      multiplier: 0.2,
      grade: "race",
      stats: { weight: -10 },
    },
  },
  turbo: {
    // Turbo/Supercharger
    stock: {
      name: "Stock Aspiration",
      price: 0,
      multiplier: 0,
      grade: "stock",
      stats: { weight: 0 },
    },
    sport_turbo: {
      name: "Sport Turbo",
      price: 4000,
      multiplier: 0.25,
      grade: "sport",
      stats: { weight: 10 },
    },
    race_turbo: {
      name: "Race Turbo",
      price: 9000,
      multiplier: 0.45,
      grade: "race",
      stats: { weight: 15 },
    },
  },
  intercooler: {
    stock: {
      name: "Stock Intercooler",
      price: 0,
      multiplier: 0,
      grade: "stock",
      stats: { weight: 0 },
    },
    sport: {
      name: "Sport Intercooler",
      price: 1200,
      multiplier: 0.08,
      grade: "sport",
      stats: { weight: 5 },
    },
    race: {
      name: "Race Intercooler",
      price: 3000,
      multiplier: 0.15,
      grade: "race",
      stats: { weight: 10 },
    },
  },
  flywheel: {
    // Crankshaft/Flywheel
    stock: {
      name: "Stock Flywheel",
      price: 0,
      multiplier: 0,
      grade: "stock",
      stats: { weight: 0 },
    },
    street: {
      name: "Street Flywheel",
      price: 600,
      multiplier: 0.02,
      grade: "street",
      stats: { weight: -2 },
    },
    sport: {
      name: "Sport Flywheel",
      price: 1500,
      multiplier: 0.05,
      grade: "sport",
      stats: { weight: -4 },
    },
    race: {
      name: "Race Flywheel",
      price: 3500,
      multiplier: 0.08,
      grade: "race",
      stats: { weight: -7 },
    },
  },

  // Chassis
  tires: {
    stock: { name: "Stock Compound", price: 0, stats: { grip: 1.0 } },
    street: { name: "Street Compound", price: 800, stats: { grip: 1.12 } },
    sport: { name: "Sport Compound", price: 1500, stats: { grip: 1.28 } },
    slick_comp: {
      name: "Race Slick Compound",
      price: 4000,
      stats: { grip: 1.55 },
    },
  },
  weight_reduction: {
    stock: { name: "Stock Chassis", price: 0, stats: { weight: 0 } },
    sport: {
      name: "Sport Weight Reduction",
      price: 1200,
      stats: { weight: -120 },
    },
    race: {
      name: "Race Weight Reduction",
      price: 3500,
      stats: { weight: -285 },
    },
  },
  brakes: {
    stock: {
      name: "Stock Brakes",
      price: 0,
      stats: { braking: 1.0, weight: 0 },
    },
    sport: {
      name: "Sport Brakes",
      price: 900,
      stats: { braking: 1.18, weight: -6 },
    },
    race: {
      name: "Race Brakes",
      price: 2200,
      stats: { braking: 1.35, weight: -14 },
      allows_tuning: true,
    },
  },
  suspension: {
    stock: { name: "Stock Suspension", price: 0, stats: { handling: 1.0 } },
    sport: {
      name: "Sport Suspension",
      price: 1400,
      stats: { handling: 1.18 },
      allows_tuning: true,
    },
    race: {
      name: "Race Suspension",
      price: 3800,
      stats: { handling: 1.32 },
      allows_tuning: true,
    },
  },
  transmission: {
    stock: { name: "Stock Transmission", price: 0, stats: { shiftTime: 0.3 } },
    sport: {
      name: "Sport Transmission",
      price: 1800,
      stats: { shiftTime: 0.15 },
      allows_tuning: true,
    },
    race: {
      name: "Race Transmission",
      price: 4500,
      stats: { shiftTime: 0.05 },
      allows_tuning: true,
    },
  },
  arbs: {
    stock: { name: "Stock ARBs", price: 0, stats: { handling: 1.0 } },
    sport: {
      name: "Sport ARBs",
      price: 800,
      stats: { handling: 1.08 },
      allows_tuning: true,
    },
    race: {
      name: "Race ARBs",
      price: 2000,
      stats: { handling: 1.15 },
      allows_tuning: true,
    },
  },
  differential: {
    stock: { name: "Stock Differential", price: 0, stats: { handling: 1.0 } },
    sport: {
      name: "Sport Differential",
      price: 1200,
      stats: { handling: 1.08 },
      allows_tuning: true,
    },
    race: {
      name: "Race Differential",
      price: 2500,
      stats: { handling: 1.14 },
      allows_tuning: true,
    },
  },
  aero: {
    stock: { name: "Stock Aero", price: 0, stats: { downforce: 0 } },
    sport: {
      name: "Sport Aero",
      price: 1000,
      stats: { downforce: 85 },
      allows_tuning: true,
    },
    race: {
      name: "Race Aero",
      price: 3000,
      stats: { downforce: 220 },
      allows_tuning: true,
    },
  },
};

export const INITIAL_TUNING = {
  // Tires
  tire_pressure_f: 30, // psi
  tire_pressure_r: 30,

  // Gearing
  final_drive: 3.5,
  gear_1: 3.2,
  gear_2: 2.2,
  gear_3: 1.6,
  gear_4: 1.2,
  gear_5: 0.9,
  gear_6: 0.75,

  // Alignment
  camber_f: -0.5,
  camber_r: -0.5,
  toe_f: 0,
  toe_r: 0,
  caster_f: 5.0,

  // ARBs
  arb_f: 20,
  arb_r: 20,

  // Springs
  springs_f: 500,
  springs_r: 500,
  ride_height_f: 15,
  ride_height_r: 15,

  // Damping
  rebound_f: 8.0,
  rebound_r: 8.0,
  bump_f: 5.0,
  bump_r: 5.0,

  // Aero
  downforce_f: 100, // kg
  downforce_r: 150,

  // Brake
  brake_balance: 50, // % to front
  brake_pressure: 100, // %

  // Differential
  diff_accel_f: 50, // %
  diff_decel_f: 0,
  diff_accel_r: 75,
  diff_decel_r: 30,
  diff_center: 60, // % rear
};
