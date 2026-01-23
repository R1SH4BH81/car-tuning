export const generateGearingGraphData = (
  tuningSettings,
  rpmLimit = 8000,
  numberOfGears = 6,
) => {
  const data = [];
  const tireRadius = 0.33;
  const finalDrive = tuningSettings.final_drive;

  const gears = [];
  for (let i = 1; i <= numberOfGears; i++) {
    const gearRatio = tuningSettings[`gear_${i}`];
    if (gearRatio) {
      gears.push(gearRatio);
    }
  }

  gears.forEach((gearRatio, index) => {
    const gearNum = index + 1;
    const effectiveRatio = gearRatio * finalDrive;
    let startRpm = 0;
    if (index > 0) {
      const prevGearRatio = gears[index - 1];
      startRpm = rpmLimit * (gearRatio / prevGearRatio);
    }
    const endRpm = rpmLimit;
    const calcSpeed = (rpm) => {
      const wheelRpm = rpm / effectiveRatio;
      const speedMs = (wheelRpm / 60) * (2 * Math.PI * tireRadius);
      return speedMs * 2.23694;
    };
    const endSpeed = calcSpeed(endRpm);
    if (index === 0) {
      data.push({ speed: 0, rpm: 0, gear: gearNum });
    } else {
      const prevEndSpeed = data[data.length - 1].speed;
      data.push({ speed: prevEndSpeed, rpm: startRpm, gear: gearNum });
    }
    data.push({ speed: endSpeed, rpm: endRpm, gear: gearNum });
  });

  return data;
};
