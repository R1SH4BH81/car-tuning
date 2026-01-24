import React from "react";
import TuningSlider from "../TuningSlider";
import { PARTS_DB } from "../../../data/parts";

const isUnlocked = (carConfig) => {
  const suspId = carConfig?.suspension || "stock";
  const part = PARTS_DB.suspension?.[suspId];
  return !!(part && part.allows_tuning);
};

const SpringsSection = ({ tuningSettings, setTuning, carConfig }) => {
  const springsUnlocked = isUnlocked(carConfig);

  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        Requires Sport or Race Suspension.
      </div>
      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest">
        Springs
      </h3>
      <TuningSlider
        label="Front"
        locked={!springsUnlocked}
        value={tuningSettings.springs_f}
        min={200}
        max={1500}
        step={1}
        unit=" LB/IN"
        onChange={(v) => setTuning("springs_f", v)}
      />
      <TuningSlider
        label="Rear"
        locked={!springsUnlocked}
        value={tuningSettings.springs_r}
        min={200}
        max={1500}
        step={1}
        unit=" LB/IN"
        onChange={(v) => setTuning("springs_r", v)}
      />

      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest mt-6">
        Ride Height
      </h3>
      <TuningSlider
        label="Front"
        locked={!springsUnlocked}
        value={tuningSettings.ride_height_f}
        min={5}
        max={20}
        step={0.1}
        unit=" IN"
        onChange={(v) => setTuning("ride_height_f", v)}
      />
      <TuningSlider
        label="Rear"
        locked={!springsUnlocked}
        value={tuningSettings.ride_height_r}
        min={5}
        max={20}
        step={0.1}
        unit=" IN"
        onChange={(v) => setTuning("ride_height_r", v)}
      />
    </>
  );
};

export default SpringsSection;
