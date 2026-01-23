export const weight_reduction = {
  stock: { name: "Stock Chassis", price: 0, stats: { weight: 0 } },
  sport: {
    name: "Sport Weight Reduc.",
    price: 1500,
    stats: { weight: -150 },
  },
  race: { name: "Race Weight Reduc.", price: 5000, stats: { weight: -350 } },
};

export const brakes = {
  stock: {
    name: "Stock Brakes",
    price: 0,
    stats: { braking: 1.0, weight: 0 },
  },
  sport: {
    name: "Sport Brakes",
    price: 1000,
    stats: { braking: 1.22, weight: -8 },
  },
  race: {
    name: "Race Brakes",
    price: 2500,
    stats: { braking: 1.4, weight: -18 },
    allows_tuning: true,
  },
};

export const suspension = {
  stock: { name: "Stock Susp.", price: 0, stats: { handling: 1.0 } },
  sport: {
    name: "Sport Susp.",
    price: 1600,
    stats: { handling: 1.2 },
    allows_tuning: true,
  },
  race: {
    name: "Race Susp.",
    price: 4200,
    stats: { handling: 1.35 },
    allows_tuning: true,
  },
};

export const arbs = {
  stock: { name: "Stock ARBs", price: 0, stats: { handling: 1.0 } },
  sport: {
    name: "Sport ARBs",
    price: 800,
    stats: { handling: 1.1 },
    allows_tuning: true,
  },
  race: {
    name: "Race ARBs",
    price: 2200,
    stats: { handling: 1.18 },
    allows_tuning: true,
  },
};
