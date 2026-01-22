import React from "react";
import TuningSlider from "../TuningSlider";

const isUnlocked = () => {
  return true;
};

const AlignmentSection = ({ tuningSettings, setTuning }) => {
  const alignUnlocked = isUnlocked("alignment");

  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        Adjusts the angle at which the tires sit on the pavement.
      </div>
      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest">
        Camber
      </h3>
      <TuningSlider
        label="Front"
        locked={!alignUnlocked}
        value={tuningSettings.camber_f}
        min={-5}
        max={0}
        step={0.1}
        unit="°"
        onChange={(v) => setTuning("camber_f", v)}
      />
      <TuningSlider
        label="Rear"
        locked={!alignUnlocked}
        value={tuningSettings.camber_r}
        min={-5}
        max={0}
        step={0.1}
        unit="°"
        onChange={(v) => setTuning("camber_r", v)}
      />

      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest mt-6">
        Toe
      </h3>
      <TuningSlider
        label="Front"
        locked={!alignUnlocked}
        value={tuningSettings.toe_f}
        min={-5}
        max={5}
        step={0.1}
        unit="°"
        onChange={(v) => setTuning("toe_f", v)}
      />
      <TuningSlider
        label="Rear"
        locked={!alignUnlocked}
        value={tuningSettings.toe_r}
        min={-5}
        max={5}
        step={0.1}
        unit="°"
        onChange={(v) => setTuning("toe_r", v)}
      />

      <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest mt-6">
        Front Caster
      </h3>
      <TuningSlider
        label="Angle"
        locked={!alignUnlocked}
        value={tuningSettings.caster_f}
        min={1}
        max={7}
        step={0.1}
        unit="°"
        onChange={(v) => setTuning("caster_f", v)}
      />
    </>
  );
};

export default AlignmentSection;
