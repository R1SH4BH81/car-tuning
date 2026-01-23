export const transmission = {
  stock: { name: "Stock Trans", price: 0, stats: { shiftTime: 0.35 } },
  sport: {
    name: "Sport Trans",
    price: 2000,
    stats: { shiftTime: 0.12 },
    allows_tuning: true,
  },
  race: {
    name: "Race Trans",
    price: 5000,
    stats: { shiftTime: 0.04 },
    allows_tuning: true,
  },
};

export const differential = {
  stock: { name: "Stock Diff", price: 0, stats: { handling: 1.0 } },
  sport: {
    name: "Sport Diff",
    price: 1200,
    stats: { handling: 1.09 },
    allows_tuning: true,
  },
  race: {
    name: "Race Diff",
    price: 2800,
    stats: { handling: 1.16 },
    allows_tuning: true,
  },
};
