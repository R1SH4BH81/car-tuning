import React from "react";
import TuningSlider from "../TuningSlider";
import { PARTS_DB } from "../../../data/parts";

const isUnlocked = (carConfig) => {
  const brakeId = carConfig?.brakes || "stock";
  const part = PARTS_DB.brakes?.[brakeId];
  return !!(part && part.allows_tuning);
};

const BrakeSection = ({ tuningSettings, setTuning, carConfig }) => {
  const brakeUnlocked = isUnlocked(carConfig);

  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        Requires Sport or Race Brakes.
      </div>
      <TuningSlider
        label="Balance"
        locked={!brakeUnlocked}
        value={tuningSettings.brake_balance}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={(v) => setTuning("brake_balance", v)}
      />
      <TuningSlider
        label="Pressure"
        locked={!brakeUnlocked}
        value={tuningSettings.brake_pressure}
        min={0}
        max={200}
        step={1}
        unit="%"
        onChange={(v) => setTuning("brake_pressure", v)}
      />
    </>
  );
};

export default BrakeSection;
