import React from "react";
import TuningSlider from "../TuningSlider";
import { PARTS_DB } from "../../../data/parts";

const isUnlocked = (carConfig) => {
  const arbsId = carConfig?.arbs || "stock";
  const part = PARTS_DB.arbs?.[arbsId];
  return !!(part && part.allows_tuning);
};

const ArbsSection = ({ tuningSettings, setTuning, carConfig }) => {
  const arbsUnlocked = isUnlocked(carConfig);

  return (
    <>
      <div className="mb-4 text-sm text-gray-400">
        Requires Sport or Race ARBs.
      </div>
      <TuningSlider
        label="Front Stiffness"
        locked={!arbsUnlocked}
        value={tuningSettings.arb_f}
        min={1}
        max={65}
        step={0.1}
        onChange={(v) => setTuning("arb_f", v)}
      />
      <TuningSlider
        label="Rear Stiffness"
        locked={!arbsUnlocked}
        value={tuningSettings.arb_r}
        min={1}
        max={65}
        step={0.1}
        onChange={(v) => setTuning("arb_r", v)}
      />
    </>
  );
};

export default ArbsSection;
