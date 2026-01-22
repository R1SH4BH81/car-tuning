import React from "react";

const getStatColor = (current, baseline, inverse = false) => {
  if (baseline === undefined || baseline === null) return "text-white";
  const curVal = parseFloat(current);
  const baseVal = parseFloat(baseline);

  if (isNaN(curVal) || isNaN(baseVal)) return "text-white";
  if (Math.abs(curVal - baseVal) < 0.001) return "text-white";

  const improved = inverse ? curVal < baseVal : curVal > baseVal;
  return improved ? "text-green-500" : "text-red-500";
};

const TuningStatsPanel = ({ performanceStats, baselineStats }) => {
  return (
    <div className="w-1/4 bg-black/80 backdrop-blur-md border-r border-white/10 p-8 pt-12">
      <div className="space-y-6">
        <div>
          <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">
            Acceleration
          </h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">0-60 MPH</span>{" "}
            <span
              className={`font-mono ${getStatColor(
                performanceStats?.acceleration060,
                baselineStats?.acceleration060,
                true,
              )}`}
            >
              {performanceStats?.acceleration060} s
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">0-100 MPH</span>{" "}
            <span
              className={`font-mono ${getStatColor(
                (performanceStats?.acceleration060 * 2.1).toFixed(2),
                (baselineStats?.acceleration060 * 2.1).toFixed(2),
                true,
              )}`}
            >
              {(performanceStats?.acceleration060 * 2.1).toFixed(2)} s
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Top Speed</span>{" "}
            <span
              className={`font-mono ${getStatColor(
                performanceStats?.topSpeed,
                baselineStats?.topSpeed,
                false,
              )}`}
            >
              {performanceStats?.topSpeed} MPH
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">
            Braking Distance
          </h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">60-0 MPH</span>{" "}
            <span
              className={`font-mono ${getStatColor(
                performanceStats?.brakingDistance600,
                baselineStats?.brakingDistance600,
                true,
              )}`}
            >
              {performanceStats?.brakingDistance600} FT
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">100-0 MPH</span>{" "}
            <span
              className={`font-mono ${getStatColor(
                (performanceStats?.brakingDistance600 * 2.8).toFixed(1),
                (baselineStats?.brakingDistance600 * 2.8).toFixed(1),
                true,
              )}`}
            >
              {(performanceStats?.brakingDistance600 * 2.8).toFixed(1)} FT
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">
            Lateral G's
          </h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">60 MPH</span>{" "}
            <span
              className={`font-mono ${getStatColor(
                performanceStats?.lateralG,
                baselineStats?.lateralG,
                false,
              )}`}
            >
              {performanceStats?.lateralG}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">120 MPH</span>{" "}
            <span
              className={`font-mono ${getStatColor(
                (performanceStats?.lateralG * 1.1).toFixed(2),
                (baselineStats?.lateralG * 1.1).toFixed(2),
                false,
              )}`}
            >
              {(performanceStats?.lateralG * 1.1).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuningStatsPanel;
