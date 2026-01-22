import React from "react";
import TuningSlider from "../TuningSlider";

const isUnlocked = () => {
  return true;
};

const DampingSection = ({ tuningSettings, setTuning }) => {
  const dampUnlocked = isUnlocked("damping");

  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        Controls how the suspension reacts to bumps and weight transfer.
      </div>
      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest">
        Rebound Stiffness
      </h3>
      <TuningSlider
        label="Front"
        locked={!dampUnlocked}
        value={tuningSettings.rebound_f}
        min={1}
        max={20}
        step={0.1}
        onChange={(v) => setTuning("rebound_f", v)}
      />
      <TuningSlider
        label="Rear"
        locked={!dampUnlocked}
        value={tuningSettings.rebound_r}
        min={1}
        max={20}
        step={0.1}
        onChange={(v) => setTuning("rebound_r", v)}
      />

      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest mt-6">
        Bump Stiffness
      </h3>
      <TuningSlider
        label="Front"
        locked={!dampUnlocked}
        value={tuningSettings.bump_f}
        min={1}
        max={20}
        step={0.1}
        onChange={(v) => setTuning("bump_f", v)}
      />
      <TuningSlider
        label="Rear"
        locked={!dampUnlocked}
        value={tuningSettings.bump_r}
        min={1}
        max={20}
        step={0.1}
        onChange={(v) => setTuning("bump_r", v)}
      />
    </>
  );
};

export default DampingSection;
