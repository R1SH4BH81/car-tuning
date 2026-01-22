import React from "react";
import TuningSlider from "../TuningSlider";

const TiresSection = ({ tuningSettings, setTuning }) => {
  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        This section manages the contact patch between your car and the road.
      </div>
      <TuningSlider
        label="Front Pressure"
        value={tuningSettings.tire_pressure_f}
        min={15}
        max={55}
        step={0.5}
        unit=" PSI"
        onChange={(v) => setTuning("tire_pressure_f", v)}
        description="Adjusted in PSI (or Bar). Higher pressure increases responsiveness; lower pressure increases mechanical grip and heat."
      />
      <TuningSlider
        label="Rear Pressure"
        value={tuningSettings.tire_pressure_r}
        min={15}
        max={55}
        step={0.5}
        unit=" PSI"
        onChange={(v) => setTuning("tire_pressure_r", v)}
        description="Crucial for managing oversteer or understeer during acceleration."
      />
    </>
  );
};

export default TiresSection;
