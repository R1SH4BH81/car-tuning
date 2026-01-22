export const PARTS_DB = {
  engine: {
    stock: {
      name: "Stock Engine",
      price: 0,
      stats: { hp: 0, torque: 0, weight: 0 },
    },
    sport_intake: {
      name: "Sport Intake",
      price: 500,
      stats: { hp: 15, torque: 10, weight: -2 },
    },
    race_turbo: {
      name: "Race Turbo",
      price: 5000,
      stats: { hp: 150, torque: 120, weight: 15 },
    },
    titanium_exhaust: {
      name: "Titanium Race Exhaust",
      price: 2500,
      stats: { hp: 25, torque: 15, weight: -10 },
    },
  },
  tires: {
    stock: { name: "Stock Compound", price: 0, stats: { grip: 1.0 } },
    street: { name: "Street Compound", price: 800, stats: { grip: 1.1 } },
    sport: { name: "Sport Compound", price: 1500, stats: { grip: 1.25 } },
    slick_comp: {
      name: "Race Slick Compound",
      price: 4000,
      stats: { grip: 1.5 },
    },
  },
  weight_reduction: {
    stock: { name: "Stock Chassis", price: 0, stats: { weight: 0 } },
    sport: {
      name: "Sport Weight Reduction",
      price: 1200,
      stats: { weight: -100 },
    },
    race: {
      name: "Race Weight Reduction",
      price: 3500,
      stats: { weight: -250 },
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
      stats: { braking: 1.15, weight: -5 },
    },
    race: {
      name: "Race Brakes",
      price: 2200,
      stats: { braking: 1.3, weight: -12 },
      allows_tuning: true,
    },
  },
  suspension: {
    stock: { name: "Stock Suspension", price: 0, stats: { handling: 1.0 } },
    sport: {
      name: "Sport Suspension",
      price: 1400,
      stats: { handling: 1.15 },
      allows_tuning: true,
    },
    race: {
      name: "Race Suspension",
      price: 3800,
      stats: { handling: 1.3 },
      allows_tuning: true,
    },
  },
  transmission: {
    stock: { name: "Stock Transmission", price: 0, stats: { shiftTime: 0.3 } },
    sport: {
      name: "Sport Transmission",
      price: 1800,
      stats: { shiftTime: 0.2 },
      allows_tuning: true,
    },
    race: {
      name: "Race Transmission",
      price: 4500,
      stats: { shiftTime: 0.1 },
      allows_tuning: true,
    },
  },
  arbs: {
    stock: { name: "Stock ARBs", price: 0, stats: { handling: 1.0 } },
    sport: {
      name: "Sport ARBs",
      price: 800,
      stats: { handling: 1.05 },
      allows_tuning: true,
    },
    race: {
      name: "Race ARBs",
      price: 2000,
      stats: { handling: 1.1 },
      allows_tuning: true,
    },
  },
  differential: {
    stock: { name: "Stock Differential", price: 0, stats: { handling: 1.0 } },
    sport: {
      name: "Sport Differential",
      price: 1200,
      stats: { handling: 1.05 },
      allows_tuning: true,
    },
    race: {
      name: "Race Differential",
      price: 2500,
      stats: { handling: 1.1 },
      allows_tuning: true,
    },
  },
  aero: {
    stock: { name: "Stock Aero", price: 0, stats: { downforce: 0 } },
    sport: {
      name: "Sport Aero",
      price: 1000,
      stats: { downforce: 50 },
      allows_tuning: true,
    },
    race: {
      name: "Race Aero",
      price: 3000,
      stats: { downforce: 150 },
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
