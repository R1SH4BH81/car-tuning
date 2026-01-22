import { PARTS_DB } from "../data/parts";

export const calculatePerformance = (baseStats, carConfig, tuningSettings) => {
  // 1. Calculate Core Stats (HP, Torque, Weight)
  let hp = baseStats.hp;
  let torque = baseStats.torque;
  let weight = baseStats.weight;
  let gripMultiplier = 1.0;
  let brakingMultiplier = 1.0;
  let handlingMultiplier = 1.0;

  // Apply Parts
  Object.keys(carConfig).forEach((category) => {
    const partId = carConfig[category];
    if (PARTS_DB[category] && PARTS_DB[category][partId]) {
      const stats = PARTS_DB[category][partId].stats;
      if (stats.hp) hp += stats.hp;
      if (stats.torque) torque += stats.torque;
      if (stats.weight) weight += stats.weight;
      if (stats.grip) gripMultiplier *= stats.grip;
      if (stats.braking) brakingMultiplier *= stats.braking;
      if (stats.handling) handlingMultiplier *= stats.handling;
      if (stats.downforce) {
        // Base aero added by parts, though usually this is adjustable
        // For simplicity, we treat the 'tuningSettings' as the definitive source for aero if adjustable parts are installed
      }
    }
  });

  // Apply Tuning Impacts

  // 1. Tires
  const idealPressure = 30;
  const pressureFactorF =
    1 - Math.abs(tuningSettings.tire_pressure_f - idealPressure) * 0.005;
  const pressureFactorR =
    1 - Math.abs(tuningSettings.tire_pressure_r - idealPressure) * 0.005;
  const avgPressureFactor = (pressureFactorF + pressureFactorR) / 2;
  gripMultiplier *= avgPressureFactor;

  // 2. Aero (Downforce)
  // Check if aero is adjustable
  const hasAdjustableAero = PARTS_DB["aero"][carConfig["aero"]]?.allows_tuning;

  // Increases grip (handling) but adds drag (reduces top speed)
  // Only apply downforce penalty/bonus if aero is adjustable
  const totalDownforce = hasAdjustableAero
    ? (tuningSettings.downforce_f || 0) + (tuningSettings.downforce_r || 0)
    : 0;

  const downforceHandlingBonus = totalDownforce * 0.0005; // Arbitrary scaler
  const downforceDragPenalty = totalDownforce * 0.0002;
  handlingMultiplier += downforceHandlingBonus;

  // 3. Alignment (Camber, Toe, Caster)
  // Check if suspension allows tuning
  const hasTunableSuspension =
    PARTS_DB["suspension"][carConfig["suspension"]]?.allows_tuning;

  // Optimal camber for cornering is usually negative.
  // We'll simulate a "sweet spot" around -1.5 to -2.0.
  // If suspension is stock (not tunable), assume factory alignment is neutral (no penalty)
  const idealCamber = -1.5;
  const camberPenaltyF = hasTunableSuspension
    ? Math.abs(tuningSettings.camber_f - idealCamber) * 0.01
    : 0;
  const camberPenaltyR = hasTunableSuspension
    ? Math.abs(tuningSettings.camber_r - idealCamber) * 0.01
    : 0;
  handlingMultiplier -= camberPenaltyF + camberPenaltyR;

  // Toe helps stability (toe-in) or turn-in (toe-out).
  // Extreme values reduce straight line speed (scrubbing).
  const toeScrub = hasTunableSuspension
    ? (Math.abs(tuningSettings.toe_f) + Math.abs(tuningSettings.toe_r)) * 0.002
    : 0;

  // 4. Springs & Damping
  // Too soft = boaty, too stiff = skittish.
  // Simplified: Stiffer is generally better for handling response up to a point.
  // We'll just add a small factor based on "race stiffness" vs stock.
  // If stock, assume balanced
  const avgStiffness =
    (tuningSettings.springs_f + tuningSettings.springs_r) / 2;
  const stiffnessBonus = hasTunableSuspension
    ? (avgStiffness - 500) * 0.0001
    : 0; // Small handling bonus for stiffer springs
  handlingMultiplier += stiffnessBonus;

  // Ride height: lower is better for CG (handling)
  const avgHeight =
    (tuningSettings.ride_height_f + tuningSettings.ride_height_r) / 2;
  const heightPenalty = hasTunableSuspension ? (avgHeight - 10) * 0.002 : 0; // Penalty for being high
  handlingMultiplier -= heightPenalty;

  // 5. Differential
  const hasTunableDiff =
    PARTS_DB["differential"][carConfig["differential"]]?.allows_tuning;
  // Affects acceleration out of corners.
  // Higher accel lock = better traction on exit but can cause understeer.
  const diffAccelAvg =
    (tuningSettings.diff_accel_f + tuningSettings.diff_accel_r) / 2;
  const tractionBonus = hasTunableDiff ? diffAccelAvg * 0.001 : 0;

  // --- Calculate Derived Performance Metrics ---

  // Acceleration (0-60)
  const basePowerToWeight = 565 / 1752;
  const currentPowerToWeight = hp / weight;

  let accelTime =
    baseStats.acceleration060 * (basePowerToWeight / currentPowerToWeight);

  // Grip & Traction Limits
  // Traction is improved by Grip Multiplier and Differential Accel Lock
  const effectiveGrip = gripMultiplier + tractionBonus;

  // Penalty for low grip vs high power (Wheelspin)
  if (hp > 600 && effectiveGrip < 1.2) {
    accelTime += 0.4 * (1.2 - effectiveGrip);
  }

  // Final Drive tuning effect
  const hasTunableTrans =
    PARTS_DB["transmission"][carConfig["transmission"]]?.allows_tuning;

  const baseFinalDrive = 3.5;
  const fdRatio = hasTunableTrans
    ? tuningSettings.final_drive / baseFinalDrive
    : 1.0;
  // Also consider 1st gear ratio for launch
  const gear1Ratio = hasTunableTrans ? tuningSettings.gear_1 / 3.2 : 1.0;

  // Combined gearing impact on launch
  const launchGearing = Math.sqrt(fdRatio * gear1Ratio);
  accelTime /= launchGearing;

  // Top Speed
  const baseDrag = 0.3; // Cd
  const currentDrag = baseDrag + downforceDragPenalty + toeScrub;

  // Power vs Drag limit
  let topSpeed =
    baseStats.topSpeed * Math.pow(hp / 565, 1 / 3) * (baseDrag / currentDrag);

  // Gearing limit
  const gearingTopSpeedLimit = 300 / (tuningSettings.final_drive / 2.5);
  // Also limited by top gear ratio (gear 6)
  const topGearLimit = gearingTopSpeedLimit / (tuningSettings.gear_6 / 0.75);

  topSpeed = Math.min(topSpeed, topGearLimit);

  // Braking 60-0
  // Brake Pressure tuning: >100% can lock up (bad), <100% might not be enough force.
  // Optimal is near 100% with ABS, or threshold braking.
  // We'll assume pressure > 100 doesn't help distance (locks up), < 100 hurts it.
  const brakePressureFactor = Math.min(
    1.0,
    tuningSettings.brake_pressure / 100,
  );

  const brakingPerformance =
    gripMultiplier * brakingMultiplier * brakePressureFactor;
  const weightFactor = weight / 1752;
  const brakingDist =
    (baseStats.brakingDistance600 * weightFactor) / brakingPerformance;

  // Lateral Gs
  const latG = 1.05 * effectiveGrip * handlingMultiplier * (1752 / weight);

  // PI (Performance Index)
  // Calculate relative change from base stats
  const hpChange = hp / baseStats.hp;
  const weightChange = baseStats.weight / weight; // Lower weight is better
  const gripChange = gripMultiplier; // Approximation

  // Base PI from JSON
  const basePI = baseStats.pi || 500; // Fallback if missing

  // Calculate PI delta based on performance improvements
  // Weights: Power (40%), Weight (30%), Grip (30%)
  const piMultiplier = hpChange * 0.4 + weightChange * 0.3 + gripChange * 0.3;

  const pi = Math.min(999, Math.max(100, Math.floor(basePI * piMultiplier)));
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
  };
};

export const generateDynoData = (hp, torque) => {
  const data = [];
  const maxRpm = 8000;
  for (let rpm = 0; rpm <= maxRpm; rpm += 500) {
    let tq = 0;
    if (rpm < 1000) tq = torque * 0.6;
    else if (rpm < 5000) tq = torque;
    else tq = torque * (1 - (rpm - 5000) / 4000);

    let h = (tq * rpm) / 5252;

    data.push({
      name: rpm,
      hp: Math.round(h),
      torque: Math.round(tq),
    });
  }
  return data;
};
