import React from "react";
import TuningSlider from "../TuningSlider";

const isUnlocked = () => {
  return true;
};

const BrakeSection = ({ tuningSettings, setTuning }) => {
  const brakeUnlocked = isUnlocked("brakes");

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
