export const generateDynoData = (hp, torque, rpmLimit = 8000) => {
  const data = [];
  const maxRpm = rpmLimit;
  const peakPowerRpm = rpmLimit > 8500 ? 7500 : 6000;
  for (let rpm = 0; rpm <= maxRpm; rpm += 500) {
    let tq = 0;
    if (rpm < 1000) {
      tq = torque * 0.6;
    } else if (rpm < peakPowerRpm - 1000) {
      tq = torque;
    } else {
      const dropoffFactor = (rpm - (peakPowerRpm - 1000)) / 4000;
      tq = torque * (1 - dropoffFactor);
    }
    tq = Math.max(0, tq);
    const h = (tq * rpm) / 5252;
    data.push({
      name: rpm,
      hp: Math.round(h),
      torque: Math.round(tq),
    });
  }
  return data;
};
