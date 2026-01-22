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
) => {
  // Physics constants
  const rho = 1.225; // Air density
  const Cd = drag; // Drag coefficient
  const A = 2.2; // Frontal area (m^2) approx
  const tireRadius = 0.33; // m (approx 26 inch tire)
  const mass = weight * 0.453592; // lbs to kg
  const driveTrainLoss = 0.15;
  const peakTorqueNm = torque * 1.35582; // lb-ft to Nm

  let speed = 0; // m/s
  let time = 0; // s
  let currentGear = 0;
  let rpm = 1000; // Launch RPM
  const dt = 0.05; // Time step
  const shiftTime = 0.15; // s (fast shift)
  let shiftTimer = 0;

  // Simulate until 60 mph (26.8224 m/s)
  while (speed < 26.8224 && time < 15) {
    time += dt;

    if (shiftTimer > 0) {
      shiftTimer -= dt;
      // Coasting (drag only)
      const dragForce = 0.5 * rho * Cd * A * speed * speed;
      const decel = dragForce / mass;
      speed -= decel * dt;
      if (speed < 0) speed = 0;
      continue;
    }

    // Calculate RPM
    const gearRatio = gears[currentGear];
    const effectiveRatio = gearRatio * finalDrive;

    // v = w * r -> w = v / r
    // rpm = w * 60 / 2pi
    // rpm = (v / r) * (60 / 2pi) * ratio
    // But engine rpm is what we want.
    // Wheel rpm = speed / (2 * PI * tireRadius) * 60 (This is wrong, speed/circumference gives revs/sec, *60 revs/min)
    // Wheel RPM = (speed / (2 * Math.PI * tireRadius)) * 60;
    // Engine RPM = Wheel RPM * effectiveRatio

    const wheelRpm = (speed / (2 * Math.PI * tireRadius)) * 60;
    rpm = wheelRpm * effectiveRatio;
    rpm = Math.max(1000, rpm); // Clutch slip / stall protection at launch

    // Shift check
    if (rpm > 8000 && currentGear < gears.length - 1) {
      currentGear++;
      shiftTimer = shiftTime;
      continue;
    }

    // Calculate Force
    const engineTorque = getTorqueAtRPM(rpm, peakTorqueNm);
    const wheelTorque = engineTorque * effectiveRatio * (1 - driveTrainLoss);
    const driveForce = wheelTorque / tireRadius;

    // Traction Limit
    // F_max = mu * m * g
    // Downforce adds to m*g for traction but we don't calculate speed-dependent downforce in this simple loop yet,
    // assuming gripMultiplier covers average aero effect or just mechanical grip.
    // Let's add speed dependent downforce for traction
    // Downforce = Cl * 0.5 * rho * v^2 * A_wing (Simplified: gripMultiplier handles base grip + tuning adjustments)
    // We'll stick to simple traction model for now.
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
  // High-performance cars (S1/S2) gain less % than D/C class cars
  // Diminishing returns starts kicking in after 600 HP
  const diminishingReturn = baseHp > 600 ? 0.7 : 1.0;
  return baseHp * partMultiplier * diminishingReturn;
};

export const calculatePerformance = (baseStats, carConfig, tuningSettings) => {
  // 1. Calculate Core Stats (HP, Torque, Weight)
  let hp = baseStats.hp;
  let torque = baseStats.torque;
  let weight = baseStats.weight;
  let gripMultiplier = 1.0;
  let brakingMultiplier = 1.0;
  let handlingMultiplier = 1.0;
  let rpmLimit = 8000; // Default Redline

  // Handle Engine Swap Override
  if (carConfig.engine_swap && carConfig.engine_swap !== "stock") {
    const swapPart = PARTS_DB.engine_swap?.[carConfig.engine_swap];
    if (swapPart && swapPart.baseStats) {
      hp = swapPart.baseStats.hp;
      torque = swapPart.baseStats.torque;
      // Weight: Treat swap baseStats.weight as the Engine Weight.
      // We need to swap the engine.
      // Approx stock engine weight = 150kg (arbitrary baseline for simplicity)
      // newWeight = oldWeight - 150 + newEngineWeight
      weight = weight - 150 + swapPart.baseStats.weight;
    }
  }

  // Base Engine Stats (after swap) to use for multiplier calculations
  const engineBaseHp = hp;
  const engineBaseTorque = torque;

  // Apply Parts
  Object.keys(carConfig).forEach((category) => {
    // Skip engine_swap as it's handled above
    if (category === "engine_swap") return;

    const partId = carConfig[category];
    if (PARTS_DB[category] && PARTS_DB[category][partId]) {
      const part = PARTS_DB[category][partId];
      const stats = part.stats || {};
      const multiplier = part.multiplier || 0;

      // Apply Multiplier-based gains (Dynamic Power Scaling)
      if (multiplier > 0) {
        // If it's a Turbo/Supercharger, it adds a LOT more power
        if (category === "turbo") {
          // Turbos scale off base displacement/power heavily
          hp += calculatePartGain(engineBaseHp, category, multiplier);
          torque += calculatePartGain(
            engineBaseTorque,
            category,
            multiplier * 0.9,
          ); // Torque usually follows HP
        } else {
          // Standard parts (Intake, Exhaust, etc.)
          hp += calculatePartGain(engineBaseHp, category, multiplier);
          // Torque gains are usually about 70% of HP gains for breathing mods
          torque += calculatePartGain(
            engineBaseTorque,
            category,
            multiplier * 0.7,
          );
        }
      }

      // Apply flat stats (Weight, Grip, specific Torque adjustments)
      if (stats.hp) hp += stats.hp; // Legacy or specific flat bonuses
      if (stats.torque) torque += stats.torque;
      if (stats.weight) weight += stats.weight;
      if (stats.grip) gripMultiplier *= stats.grip;
      if (stats.braking) brakingMultiplier *= stats.braking;
      if (stats.handling) handlingMultiplier *= stats.handling;
      if (stats.rpmLimit) rpmLimit += stats.rpmLimit;

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

  const effectiveGrip = gripMultiplier + tractionBonus;
  const baseDrag = 0.3;
  const currentDrag = baseDrag + downforceDragPenalty + toeScrub;

  // Acceleration (0-60)
  const gears = [
    tuningSettings.gear_1,
    tuningSettings.gear_2,
    tuningSettings.gear_3,
    tuningSettings.gear_4,
    tuningSettings.gear_5,
    tuningSettings.gear_6,
  ];

  let accelTime = simulateAcceleration(
    hp,
    torque,
    weight,
    effectiveGrip,
    currentDrag,
    gears,
    tuningSettings.final_drive,
  );

  // Top Speed
  const rho = 1.225;
  const Cd = currentDrag;
  const A = 2.2;
  const watts = hp * 745.7 * 0.85; // 15% drivetrain loss

  const powerLimitSpeedMs = Math.pow(watts / (0.5 * rho * Cd * A), 1 / 3);
  const powerLimitSpeedMph = powerLimitSpeedMs * 2.23694;

  // Gearing limit (Redline in top gear)
  const tireRadius = 0.33;
  const topGearRatio = tuningSettings.gear_6 * tuningSettings.final_drive;
  const gearLimitSpeedMs =
    (8000 * 2 * Math.PI * tireRadius) / (60 * topGearRatio);
  const gearLimitSpeedMph = gearLimitSpeedMs * 2.23694;

  let topSpeed = Math.min(powerLimitSpeedMph, gearLimitSpeedMph);

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

export const generateDynoData = (hp, torque, rpmLimit = 8000) => {
  const data = [];
  const maxRpm = rpmLimit;
  // Peak power RPM shifts higher with race cams (simplified simulation)
  // Assuming 'rpmLimit' > 8000 implies race cams
  const peakPowerRpm = rpmLimit > 8500 ? 7500 : 6000;

  for (let rpm = 0; rpm <= maxRpm; rpm += 500) {
    let tq = 0;

    // Simulate Torque Curve
    if (rpm < 1000) {
      tq = torque * 0.6;
    } else if (rpm < peakPowerRpm - 1000) {
      // Flat torque plateau (modern turbo/big V8)
      tq = torque;
    } else {
      // Torque drops off after peak
      const dropoffFactor = (rpm - (peakPowerRpm - 1000)) / 4000;
      tq = torque * (1 - dropoffFactor);
    }

    // Safety clamp
    tq = Math.max(0, tq);

    let h = (tq * rpm) / 5252;

    data.push({
      name: rpm,
      hp: Math.round(h),
      torque: Math.round(tq),
    });
  }
  return data;
};
