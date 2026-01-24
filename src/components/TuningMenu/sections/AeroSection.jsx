import React from "react";
import TuningSlider from "../TuningSlider";
import { PARTS_DB } from "../../../data/parts";

const isUnlocked = (carConfig) => {
  const aeroId = carConfig?.aero || "stock";
  const part = PARTS_DB.aero?.[aeroId];
  return !!(part && part.allows_tuning);
};

const AeroSection = ({ tuningSettings, setTuning, carConfig }) => {
  const aeroUnlocked = isUnlocked(carConfig);

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
