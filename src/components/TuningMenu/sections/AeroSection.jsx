import React from "react";
import TuningSlider from "../TuningSlider";

const isUnlocked = () => {
  return true;
};

const AeroSection = ({ tuningSettings, setTuning }) => {
  const aeroUnlocked = isUnlocked("aero");

  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        Requires adjustable Front Splitter or Rear Wing.
      </div>
      <TuningSlider
        label="Front Downforce"
        locked={!aeroUnlocked}
        value={tuningSettings.downforce_f}
        min={50}
        max={300}
        step={1}
        unit=" KG"
        onChange={(v) => setTuning("downforce_f", v)}
      />
      <TuningSlider
        label="Rear Downforce"
        locked={!aeroUnlocked}
        value={tuningSettings.downforce_r}
        min={50}
        max={400}
        step={1}
        unit=" KG"
        onChange={(v) => setTuning("downforce_r", v)}
      />
    </>
  );
};

export default AeroSection;
