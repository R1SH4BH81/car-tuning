import React from "react";

const StatDiff = ({ label, current, preview, unit = "", inverse = false }) => {
  const diff = preview - current;
  const hasDiff = Math.abs(diff) > 0.001;

  const isGood = inverse ? diff < 0 : diff > 0;
  const colorClass = isGood ? "text-green-500" : "text-red-500";

  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <div className="flex gap-2">
        <span>
          {typeof preview === "number"
            ? parseFloat(preview.toFixed(2))
            : preview}
          {unit}
        </span>
        {hasDiff && (
          <span className={colorClass}>
            ({diff > 0 ? "+" : ""}
            {parseFloat(diff.toFixed(2))})
          </span>
        )}
      </div>
    </div>
  );
};

export default StatDiff;
