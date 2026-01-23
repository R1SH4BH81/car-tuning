export const engine_swap = {
  stock: {
    name: "Stock Engine",
    description: "Original factory engine",
    price: 0,
    stats: { hp: 0, torque: 0, weight: 0 },
  },
  v8_modern: {
    name: "6.2L V8",
    description: "Naturally Aspirated Modern V8",
    price: 12000,
    baseStats: { hp: 450, torque: 450 },
    stats: { weight: 50 },
    specs: {
      displacement: "6.2L",
      cylinders: "V8",
      aspiration: "NA",
      weight: "200 LBS",
    },
  },
  rotary_20b: {
    name: "2.0L 3-Rotor",
    description: "Screaming Triple-Rotor Wankel",
    price: 18000,
    baseStats: { hp: 450, torque: 300 },
    stats: { weight: -40, rpmLimit: 3000 },
    specs: {
      displacement: "2.0L",
      cylinders: "3-Rotor",
      aspiration: "TT",
      weight: "110 LBS",
    },
  },
  racing_v8: {
    name: "5.0L Racing V8",
    description: "High-revving Racing V8",
    price: 25000,
    baseStats: { hp: 600, torque: 500 },
    stats: { weight: 30, rpmLimit: 1000 },
    specs: {
      displacement: "5.0L",
      cylinders: "V8",
      aspiration: "NA",
      weight: "180 LBS",
    },
  },
  v10_f1_spec: {
    name: "3.0L V10 F1",
    description: "High-revving 2000s F1 Engine",
    price: 55000,
    baseStats: { hp: 880, torque: 380 },
    stats: { weight: -50, rpmLimit: 8500 },
    specs: {
      displacement: "3.0L",
      cylinders: "V10",
      aspiration: "NA",
      weight: "125 LBS",
    },
  },
  racing_v12: {
    name: "6.0L Racing V12",
    description: "Le Mans Prototype Engine",
    price: 45000,
    baseStats: { hp: 800, torque: 700 },
    stats: { weight: 70, rpmLimit: 500 },
    specs: {
      displacement: "6.0L",
      cylinders: "V12",
      aspiration: "NA",
      weight: "220 LBS",
    },
  },
  ev_dual_motor: {
    name: "Dual Motor EV",
    description: "Instant Torque Electric Swap",
    price: 40000,
    baseStats: { hp: 750, torque: 950 },
    stats: { weight: 160, rpmLimit: 10000 },
    specs: {
      displacement: "N/A",
      cylinders: "Electric",
      aspiration: "None",
      weight: "380 LBS",
    },
  },
  racing_v6_tt: {
    name: "3.8L V6 Twin Turbo",
    description: "VR38DETT Spec",
    price: 30000,
    baseStats: { hp: 600, torque: 480 },
    stats: { weight: 80 },
    specs: {
      displacement: "3.8L",
      cylinders: "V6",
      aspiration: "Twin Turbo",
      weight: "230 LBS",
    },
  },
  turbo_rally_i4: {
    name: "1.6L Turbo Rally",
    description: "WRC Spec Inline-4",
    price: 15000,
    baseStats: { hp: 380, torque: 450 },
    stats: { weight: -30 },
    specs: {
      displacement: "1.6L",
      cylinders: "I4",
      aspiration: "Turbo",
      weight: "120 LBS",
    },
  },
};

export const intake_manifold = {
  stock: { name: "Stock Intake", price: 0, multiplier: 0, grade: "stock" },
  street: {
    name: "Street Intake",
    price: 500,
    multiplier: 0.04,
    grade: "street",
    stats: { torque: 5 },
  },
  sport: {
    name: "Sport Intake",
    price: 1500,
    multiplier: 0.08,
    grade: "sport",
    stats: { weight: -2 },
  },
  race: {
    name: "Race Intake",
    price: 3000,
    multiplier: 0.14,
    grade: "race",
    stats: { weight: -5 },
  },
};

export const fuel_system = {
  stock: { name: "Stock Fuel", price: 0, multiplier: 0, grade: "stock" },
  street: {
    name: "Street Fuel",
    price: 800,
    multiplier: 0.05,
    grade: "street",
  },
  sport: { name: "Sport Fuel", price: 2000, multiplier: 0.1, grade: "sport" },
  race: { name: "Race Fuel", price: 4500, multiplier: 0.18, grade: "race" },
  // Adding empty object for consistent export structure if needed, but not required
};

export const ignition = {
  stock: { name: "Stock ECU", price: 0, multiplier: 0, grade: "stock" },
  street: {
    name: "Street ECU",
    price: 1000,
    multiplier: 0.06,
    grade: "street",
  },
  sport: { name: "Sport ECU", price: 2500, multiplier: 0.14, grade: "sport" },
  race: { name: "Race ECU", price: 6000, multiplier: 0.24, grade: "race" },
};

export const exhaust = {
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
    multiplier: 0.11,
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
};

export const camshaft = {
  stock: {
    name: "Stock Cam",
    price: 0,
    multiplier: 0,
    grade: "stock",
    stats: { rpmLimit: 0 },
  },
  street: {
    name: "Street Cam",
    price: 1200,
    multiplier: 0.07,
    grade: "street",
    stats: { rpmLimit: 500 },
  },
  sport: {
    name: "Sport Cam",
    price: 3000,
    multiplier: 0.15,
    grade: "sport",
    stats: { rpmLimit: 1200 },
  },
  race: {
    name: "Race Cam",
    price: 7000,
    multiplier: 0.26,
    grade: "race",
    stats: { rpmLimit: 2200 },
  },
};

export const valves = {
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
    multiplier: 0.1,
    grade: "sport",
  },
  race: { name: "Race Valves", price: 4000, multiplier: 0.16, grade: "race" },
};

export const pistons = {
  stock: {
    name: "Stock Block",
    price: 0,
    multiplier: 0,
    grade: "stock",
    stats: { weight: 0 },
  },
  street: {
    name: "Street Pistons",
    price: 1500,
    multiplier: 0.06,
    grade: "street",
    stats: { weight: -2 },
  },
  sport: {
    name: "Sport Pistons",
    price: 4000,
    multiplier: 0.13,
    grade: "sport",
    stats: { weight: -5 },
  },
  race: {
    name: "Race Pistons",
    price: 9000,
    multiplier: 0.22,
    grade: "race",
    stats: { weight: -10 },
  },
};

export const turbo = {
  stock: {
    name: "N/A",
    price: 0,
    multiplier: 0,
    grade: "stock",
    stats: { weight: 0 },
  },
  sport_turbo: {
    name: "Sport Turbo",
    price: 4500,
    multiplier: 0.3,
    grade: "sport",
    stats: { weight: 12, torque: 50 },
  },
  race_turbo: {
    name: "Race Big Turbo",
    price: 10000,
    multiplier: 0.6,
    grade: "race",
    stats: { weight: 18, torque: 160 },
  },
};

export const intercooler = {
  stock: { name: "Stock Cooling", price: 0, multiplier: 0, grade: "stock" },
  sport: {
    name: "Sport Intercooler",
    price: 1200,
    multiplier: 0.06,
    grade: "sport",
    stats: { weight: 5 },
  },
  race: {
    name: "Race Intercooler",
    price: 3000,
    multiplier: 0.12,
    grade: "race",
    stats: { weight: 10 },
  },
};

export const flywheel = {
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
    stats: { weight: -3 },
  },
  sport: {
    name: "Sport Flywheel",
    price: 1500,
    multiplier: 0.05,
    grade: "sport",
    stats: { weight: -6 },
  },
  race: {
    name: "Race Flywheel",
    price: 3500,
    multiplier: 0.09,
    grade: "race",
    stats: { weight: -10 },
  },
};
