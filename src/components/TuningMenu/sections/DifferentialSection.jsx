import React from "react";
import TuningSlider from "../TuningSlider";
import { PARTS_DB } from "../../../data/parts";

const isUnlocked = (carConfig) => {
  const diffId = carConfig?.differential || "stock";
  const part = PARTS_DB.differential?.[diffId];
  return !!(part && part.allows_tuning);
};

const DifferentialSection = ({ tuningSettings, setTuning, carConfig }) => {
  const diffUnlocked = isUnlocked(carConfig);

  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        Requires Sport or Race Differential.
      </div>
      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest">
        Front
      </h3>
      <TuningSlider
        label="Acceleration"
        locked={!diffUnlocked}
        value={tuningSettings.diff_accel_f}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={(v) => setTuning("diff_accel_f", v)}
      />
      <TuningSlider
        label="Deceleration"
        locked={!diffUnlocked}
        value={tuningSettings.diff_decel_f}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={(v) => setTuning("diff_decel_f", v)}
      />

      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest mt-6">
        Rear
      </h3>
      <TuningSlider
        label="Acceleration"
        locked={!diffUnlocked}
        value={tuningSettings.diff_accel_r}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={(v) => setTuning("diff_accel_r", v)}
      />
      <TuningSlider
        label="Deceleration"
        locked={!diffUnlocked}
        value={tuningSettings.diff_decel_r}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={(v) => setTuning("diff_decel_r", v)}
      />

      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest mt-6">
        Center
      </h3>
      <TuningSlider
        label="Balance"
        locked={!diffUnlocked}
        value={tuningSettings.diff_center}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={(v) => setTuning("diff_center", v)}
      />
    </>
  );
};

export default DifferentialSection;
