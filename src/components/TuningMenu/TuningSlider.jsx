import React from "react";
import { FaLock } from "react-icons/fa";

const TuningSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  locked = false,
  description,
  displayValue,
}) => (
  <div
    className={` group relative ${locked ? "opacity-50 pointer-events-none" : ""}`}
  >
    <div className="flex justify-between mb-2 items-center">
      <label className="text-sm uppercase font-bold text-gray-300">
        {label}
      </label>
      {locked ? (
        <FaLock className="text-gray-500" />
      ) : (
        <span className="font-mono text-yellow-500">
          {displayValue || `${value}${unit}`}
        </span>
      )}
    </div>
    {description && !locked && (
      <div className="hidden group-hover:block absolute right-0 top-0 -mt-8 bg-black/90 p-2 text-xs text-white rounded border border-white/10 z-20 w-64">
        {description}
      </div>
    )}
    <div className="relative h-2 bg-gray-700 rounded-lg">
      {!locked && (
        <div
          className="absolute top-0 bottom-0 left-0 bg-yellow-500 rounded-lg"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={locked}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
    </div>
    <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono">
      <span>
        {min}
        {unit}
      </span>
      <span>
        {max}
        {unit}
      </span>
    </div>
  </div>
);

export default TuningSlider;
