import React from "react";
import TuningSlider from "../TuningSlider";

const isUnlocked = () => {
  return true;
};

const GearingSection = ({ tuningSettings, setTuning, baseCar, performanceStats }) => {
  const unlocked = isUnlocked("transmission");
  const numGears = baseCar?.transmission?.gears || 6;
  const gearsArray = Array.from({ length: numGears }, (_, i) => i + 1);

  const calcGearSpeed = (ratio) => {
    if (!performanceStats?.rpmLimit) return 0;
    const finalDrive = tuningSettings.final_drive;
    const effectiveRatio = ratio * finalDrive;
    const rpm = performanceStats.rpmLimit;
    const tireRadius = 0.33;

    if (effectiveRatio <= 0) return 0;

    const wheelRpm = rpm / effectiveRatio;
    const speedMs = (wheelRpm / 60) * (2 * Math.PI * tireRadius);
    return (speedMs * 2.23694).toFixed(0);
  };

  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        Requires a Sport or Race Transmission.
      </div>
      <TuningSlider
        label="Final Drive"
        locked={!unlocked}
        value={tuningSettings.final_drive}
        min={2.0}
        max={6.0}
        step={0.01}
        onChange={(v) => setTuning("final_drive", v)}
        description="Adjusts the entire gear set simultaneously for either Top Speed or Acceleration."
      />
      {gearsArray.map((gear) => {
        const prevGearVal = gear > 1 ? tuningSettings[`gear_${gear - 1}`] : 6.0;
        const nextGearVal = gear < numGears ? tuningSettings[`gear_${gear + 1}`] : 0.4;

        const maxLimit = prevGearVal ? prevGearVal - 0.01 : 6.0;
        const minLimit = nextGearVal ? nextGearVal + 0.01 : 0.4;

        const sliderMin = Math.max(0.4, minLimit);
        const sliderMax = Math.min(6.0, maxLimit);

        const currentVal = tuningSettings[`gear_${gear}`];
        const topSpeed = calcGearSpeed(currentVal);

        return (
          <TuningSlider
            key={gear}
            label={`${gear}${gear === 1 ? "st" : gear === 2 ? "nd" : gear === 3 ? "rd" : "th"} Gear`}
            locked={!unlocked}
            value={currentVal}
            min={sliderMin}
            max={sliderMax}
            step={0.01}
            displayValue={`${currentVal.toFixed(2)} (${topSpeed} MPH)`}
            onChange={(v) => setTuning(`gear_${gear}`, v)}
          />
        );
      })}
    </>
  );
};

export default GearingSection;
