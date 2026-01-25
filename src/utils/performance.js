import { PARTS_DB } from "../data/parts";

const getTorqueAtRPM = (rpm, peakTorque) => {
  if (rpm < 1000) return peakTorque * 0.6;
  if (rpm < 5000) return peakTorque;
  return Math.max(0, peakTorque * (1 - (rpm - 5000) / 4000));
};

const simulateAcceleration = (
  hp,
  torque,
  weight,
  gripMultiplier,
  drag,
  gears,
  finalDrive,
  shiftTimeValue = 0.3,
) => {
  const rho = 1.225;
  const Cd = drag;
  const A = 2.2;
  const tireRadius = 0.33;
  const mass = weight * 0.453592;
  const driveTrainLoss = 0.15;
  const peakTorqueNm = torque * 1.35582;

  let speed = 0;
  let time = 0;
  let currentGear = 0;
  let rpm = 1000;
  let shiftTimer = 0;

  const dt = 0.1;
  while (speed < 26.8224 && time < 10) {
    time += dt;
    if (shiftTimer > 0) {
      shiftTimer -= dt;
      const dragForce = 0.5 * rho * Cd * A * speed * speed;
      const decel = dragForce / mass;
      speed -= decel * dt;
      if (speed < 0) speed = 0;
      continue;
    }
    const gearRatio = gears[currentGear];
    const effectiveRatio = gearRatio * finalDrive;
    const wheelRpm = (speed / (2 * Math.PI * tireRadius)) * 60;
    rpm = wheelRpm * effectiveRatio;
    rpm = Math.max(1000, rpm);
    if (rpm > 8000 && currentGear < gears.length - 1) {
      currentGear++;
      shiftTimer = shiftTimeValue;
      continue;
    }
    const engineTorque = getTorqueAtRPM(rpm, peakTorqueNm);
    const wheelTorque = engineTorque * effectiveRatio * (1 - driveTrainLoss);
    const driveForce = wheelTorque / tireRadius;
    const maxTraction = gripMultiplier * mass * 9.81;
    const limitedForce = Math.min(driveForce, maxTraction);
    const dragForce = 0.5 * rho * Cd * A * speed * speed;
    const netForce = limitedForce - dragForce;
    const accel = netForce / mass;
    speed += accel * dt;
  }
  return time;
};

const calculatePartGain = (baseHp, category, partMultiplier) => {
  let diminishingReturn = 1.0;
  if (baseHp > 900) diminishingReturn = 0.4;
  else if (baseHp > 700) diminishingReturn = 0.55;
  else if (baseHp > 500) diminishingReturn = 0.7;
  const categoryScale = category === "ignition" ? 0.4 : 1.0;
  const globalScale = 0.4;
  return (
    baseHp * partMultiplier * diminishingReturn * categoryScale * globalScale
  );
};

export const calculatePerformance = (
  baseStats,
  carConfig,
  tuningSettings,
  numberOfGears = 6,
) => {
  let hp = baseStats.hp;
  let torque = baseStats.torque;
  let weight = baseStats.weight;
  let gripMultiplier = 1.0;
  let brakingMultiplier = 1.0;
  let handlingMultiplier = 1.0;
  let rpmLimit = 8000;
  let shiftTime = 0.3;

  if (carConfig.engine_swap && carConfig.engine_swap !== "stock") {
    const swapPart = PARTS_DB.engine_swap?.[carConfig.engine_swap];
    if (swapPart && swapPart.baseStats) {
      hp = swapPart.baseStats.hp;
      torque = swapPart.baseStats.torque;
    }
  }

  const engineBaseHp = hp;
  const engineBaseTorque = torque;

  Object.keys(carConfig).forEach((category) => {
    const partId = carConfig[category];
    if (PARTS_DB[category] && PARTS_DB[category][partId]) {
      const part = PARTS_DB[category][partId];
      const stats = part.stats || {};
      const multiplier = part.multiplier || 0;
      if (multiplier > 0) {
        if (category === "turbo") {
          hp += calculatePartGain(engineBaseHp, category, multiplier);
          torque += calculatePartGain(
            engineBaseTorque,
            category,
            multiplier * 0.9,
          );
        } else {
          hp += calculatePartGain(engineBaseHp, category, multiplier);
          torque += calculatePartGain(
            engineBaseTorque,
            category,
            multiplier * 0.7,
          );
        }
      }
      if (stats.hp) hp += stats.hp;
      if (stats.torque) torque += stats.torque;
      if (stats.weight) weight += stats.weight;
      if (stats.grip) gripMultiplier *= stats.grip;
      if (stats.braking) brakingMultiplier *= stats.braking;
      if (stats.handling) handlingMultiplier *= stats.handling;
      if (stats.rpmLimit) rpmLimit += stats.rpmLimit;
      if (stats.shiftTime !== undefined) shiftTime = stats.shiftTime;
    }
  });

  const idealPressure = 30;
  const pressureFactorF =
    1 - Math.abs(tuningSettings.tire_pressure_f - idealPressure) * 0.005;
  const pressureFactorR =
    1 - Math.abs(tuningSettings.tire_pressure_r - idealPressure) * 0.005;
  const avgPressureFactor = (pressureFactorF + pressureFactorR) / 2;
  gripMultiplier *= avgPressureFactor;

  const hasAdjustableAero = PARTS_DB["aero"][carConfig["aero"]]?.allows_tuning;
  const totalDownforce = hasAdjustableAero
    ? (tuningSettings.downforce_f || 0) + (tuningSettings.downforce_r || 0)
    : 0;
  const downforceHandlingBonus = totalDownforce * 0.0005;
  const downforceDragPenalty = totalDownforce * 0.0002;
  handlingMultiplier += downforceHandlingBonus;

  const hasTunableSuspension =
    PARTS_DB["suspension"][carConfig["suspension"]]?.allows_tuning;
  const idealCamber = -1.5;
  const camberPenaltyF = hasTunableSuspension
    ? Math.abs(tuningSettings.camber_f - idealCamber) * 0.01
    : 0;
  const camberPenaltyR = hasTunableSuspension
    ? Math.abs(tuningSettings.camber_r - idealCamber) * 0.01
    : 0;
  handlingMultiplier -= camberPenaltyF + camberPenaltyR;

  const toeScrub = hasTunableSuspension
    ? (Math.abs(tuningSettings.toe_f) + Math.abs(tuningSettings.toe_r)) * 0.002
    : 0;

  const avgStiffness =
    (tuningSettings.springs_f + tuningSettings.springs_r) / 2;
  const stiffnessBonus = hasTunableSuspension
    ? (avgStiffness - 500) * 0.0001
    : 0;
  handlingMultiplier += stiffnessBonus;

  const avgHeight =
    (tuningSettings.ride_height_f + tuningSettings.ride_height_r) / 2;
  const heightPenalty = hasTunableSuspension ? (avgHeight - 10) * 0.002 : 0;
  handlingMultiplier -= heightPenalty;

  const hasTunableDiff =
    PARTS_DB["differential"][carConfig["differential"]]?.allows_tuning;
  const diffAccelAvg =
    (tuningSettings.diff_accel_f + tuningSettings.diff_accel_r) / 2;
  const tractionBonus = hasTunableDiff ? diffAccelAvg * 0.001 : 0;

  const effectiveGrip = gripMultiplier + tractionBonus;
  const baseDrag = 0.3;
  const currentDrag = baseDrag + downforceDragPenalty + toeScrub;

  const gearRatios = [];
  for (let i = 1; i <= numberOfGears; i++) {
    const gearRatio = tuningSettings[`gear_${i}`];
    if (gearRatio) {
      gearRatios.push(gearRatio);
    }
  }

  const accelTime = simulateAcceleration(
    hp,
    torque,
    weight,
    effectiveGrip,
    currentDrag,
    gearRatios,
    tuningSettings.final_drive,
    shiftTime,
  );

  const rho = 1.225;
  const Cd = currentDrag;
  const A = 2.2;
  const watts = hp * 745.7 * 0.85;

  const powerLimitSpeedMs = Math.pow(watts / (0.5 * rho * Cd * A), 1 / 3);
  const powerLimitSpeedMph = powerLimitSpeedMs * 2.23694;

  const tireRadius = 0.33;
  const topGearRatioValue =
    gearRatios.length > 0 ? gearRatios[gearRatios.length - 1] : 0.75;
  const topGearRatio = topGearRatioValue * tuningSettings.final_drive;

  const gearLimitSpeedMs =
    (rpmLimit * 2 * Math.PI * tireRadius) / (60 * topGearRatio);
  const gearLimitSpeedMph = gearLimitSpeedMs * 2.23694;

  const topSpeed = Math.min(powerLimitSpeedMph, gearLimitSpeedMph);

  const brakePressureFactor = Math.min(
    1.0,
    tuningSettings.brake_pressure / 100,
  );

  const brakingPerformance =
    gripMultiplier * brakingMultiplier * brakePressureFactor;
  const weightFactor = weight / 1752;
  const brakingDist =
    (baseStats.brakingDistance600 * weightFactor) / brakingPerformance;

  const latG = 1.05 * effectiveGrip * handlingMultiplier * (1752 / weight);

  const hpChange = hp / baseStats.hp;
  const weightChange = baseStats.weight / weight;
  const gripChange = gripMultiplier;
  const basePI = baseStats.pi || 500;
  const rawPiMultiplier =
    hpChange * 0.35 + weightChange * 0.3 + gripChange * 0.35;
  const adjustedPiMultiplier = 1 + (rawPiMultiplier - 1) * 0.7;
  const pi = Math.min(
    999,
    Math.max(100, Math.floor(basePI * adjustedPiMultiplier)),
  );
  const piClass =
    pi > 998
      ? "X"
      : pi > 900
        ? "S2"
        : pi > 800
          ? "S1"
          : pi > 700
            ? "A"
            : pi > 600
              ? "B"
              : "C";

  return {
    hp: Math.round(hp),
    torque: Math.round(torque),
    weight: Math.round(weight),
    topSpeed: Math.round(topSpeed),
    acceleration060: parseFloat(accelTime.toFixed(3)),
    brakingDistance600: parseFloat(brakingDist.toFixed(1)),
    lateralG: parseFloat(latG.toFixed(2)),
    pi,
    piClass,
    rpmLimit,
  };
};
