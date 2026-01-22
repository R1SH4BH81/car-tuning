import React, { useState, useMemo } from "react";
import useStore from "../store/useStore";
import { PARTS_DB, INITIAL_TUNING } from "../data/parts";
import {
  calculatePerformance,
  generateGearingGraphData,
} from "../utils/physicsEngine";
import tuningData from "../data/tuningData.json";
import TuningModelViewer from "./TuningModelViewer";
import { FaLock } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const TUNING_SECTIONS = [
  { id: "tires", label: "Tires" },
  { id: "gearing", label: "Gearing" },
  { id: "alignment", label: "Alignment" },
  // { id: "arbs", label: "Anti-roll bars" },
  { id: "springs", label: "Springs" },
  { id: "damping", label: "Damping" },
  { id: "aero", label: "Aero" },
  { id: "brake", label: "Brake" },
  { id: "differential", label: "Differential" },
];

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
    {/* Use description to suppress unused var warning or display it */}
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

const TuningMenu = () => {
  const { tuningSettings, setTuning, carConfig, performanceStats, baseCar } =
    useStore();
  const [activeSection, setActiveSection] = useState("tires");

  // Calculate baseline stats for comparison (stock tuning with current parts)
  const baselineStats = useMemo(() => {
    if (!baseCar || !carConfig) return null;
    return calculatePerformance(
      baseCar.baseStats,
      carConfig,
      INITIAL_TUNING,
      baseCar.transmission.gears || 6,
    );
  }, [baseCar, carConfig]);

  // Generate Gearing Data
  const gearingData = useMemo(() => {
    if (activeSection !== "gearing") return [];
    return generateGearingGraphData(
      tuningSettings,
      performanceStats.rpmLimit,
      baseCar.transmission.gears || 6,
    );
  }, [tuningSettings, activeSection, performanceStats.rpmLimit, baseCar]);

  // Helper to check if a category is unlocked for tuning
  const isUnlocked = (category) => {
    // Unlock all options for tuning
    return true;
  };

  // Helper to determine stat color
  const getStatColor = (current, baseline, inverse = false) => {
    if (baseline === undefined || baseline === null) return "text-white";
    const curVal = parseFloat(current);
    const baseVal = parseFloat(baseline);

    if (isNaN(curVal) || isNaN(baseVal)) return "text-white";
    // Float tolerance
    if (Math.abs(curVal - baseVal) < 0.001) return "text-white";

    const improved = inverse ? curVal < baseVal : curVal > baseVal;
    return improved ? "text-green-500" : "text-red-500";
  };

  const renderSection = () => {
    switch (activeSection) {
      case "tires":
        return (
          <>
            <div className="mb-4 text-sm text-gray-400">
              This section manages the contact patch between your car and the
              road.
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
      case "gearing": {
        const unlocked = isUnlocked("transmission");
        const numGears = baseCar?.transmission?.gears || 6;
        const gearsArray = Array.from({ length: numGears }, (_, i) => i + 1);

        const calcGearSpeed = (ratio) => {
          if (!performanceStats?.rpmLimit) return 0;
          const finalDrive = tuningSettings.final_drive;
          const effectiveRatio = ratio * finalDrive;
          const rpm = performanceStats.rpmLimit;
          // Tire radius approx 0.33m (26 inch diameter)
          const tireRadius = 0.33;

          if (effectiveRatio <= 0) return 0;

          const wheelRpm = rpm / effectiveRatio;
          // Speed in m/s = (wheelRpm / 60) * Circumference
          const speedMs = (wheelRpm / 60) * (2 * Math.PI * tireRadius);
          // Convert to MPH
          return (speedMs * 2.23694).toFixed(0);
        };

        return (
          <>
            <div className="mb-4 text-sm text-gray-400">
              Requires a Sport or Race Transmission.
            </div>
            <TuningSlider
              label="Final Drive"
              locked={!unlocked}
              value={tuningSettings.final_drive}
              min={2.0}
              max={6.0}
              step={0.01}
              onChange={(v) => setTuning("final_drive", v)}
              description="Adjusts the entire gear set simultaneously for either Top Speed or Acceleration."
            />
            {gearsArray.map((gear) => {
              // Constraints:
              // Gear N must be < Gear N-1 (numerically smaller ratio for higher gear?)
              // Actually: Gear 1 (High Ratio, e.g. 3.0) -> Gear 6 (Low Ratio, e.g. 0.7)
              // So Gear N < Gear N-1.
              // Max value for Gear N is Gear N-1's value.
              // Min value for Gear N is Gear N+1's value.

              const prevGearVal =
                gear > 1 ? tuningSettings[`gear_${gear - 1}`] : 6.0;
              const nextGearVal =
                gear < numGears ? tuningSettings[`gear_${gear + 1}`] : 0.4; // 0.4 absolute min

              // Add a small buffer so they don't overlap exactly if desired,
              // but standard is allowing them to touch or be close.
              // We'll enforce: Gear N <= Gear N-1 - 0.01
              // And Gear N >= Gear N+1 + 0.01

              const maxLimit = prevGearVal ? prevGearVal - 0.01 : 6.0;
              const minLimit = nextGearVal ? nextGearVal + 0.01 : 0.4;

              // Ensure slider min/max are valid
              const sliderMin = Math.max(0.4, minLimit);
              const sliderMax = Math.min(6.0, maxLimit);

              // If current value is out of bounds due to neighbor change, clamp it?
              // The slider will visually clamp, but state might be out.
              // We won't auto-update state here to avoid loops, but slider limits prevent new invalid inputs.

              const currentVal = tuningSettings[`gear_${gear}`];
              const topSpeed = calcGearSpeed(currentVal);

              return (
                <TuningSlider
                  key={gear}
                  label={`${gear}${gear === 1 ? "st" : gear === 2 ? "nd" : gear === 3 ? "rd" : "th"} Gear`}
                  locked={!unlocked}
                  value={currentVal}
                  min={sliderMin}
                  max={sliderMax}
                  step={0.01}
                  displayValue={`${currentVal.toFixed(2)} (${topSpeed} MPH)`}
                  onChange={(v) => setTuning(`gear_${gear}`, v)}
                />
              );
            })}
          </>
        );
      }
      case "alignment": {
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
      }
      case "arbs": {
        const arbsUnlocked = isUnlocked("arbs");
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
      }
      case "springs": {
        const springsUnlocked = isUnlocked("springs");
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
      }
      case "damping": {
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
      }
      case "aero": {
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
      }
      case "brake": {
        const brakeUnlocked = isUnlocked("brakes");
        return (
          <>
            <div className="mb-4 text-sm text-gray-400">
              Requires Sport or Race Brakes.
            </div>
            <TuningSlider
              label="Balance"
              locked={!brakeUnlocked}
              value={tuningSettings.brake_balance}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => setTuning("brake_balance", v)}
            />
            <TuningSlider
              label="Pressure"
              locked={!brakeUnlocked}
              value={tuningSettings.brake_pressure}
              min={0}
              max={200}
              step={1}
              unit="%"
              onChange={(v) => setTuning("brake_pressure", v)}
            />
          </>
        );
      }
      case "differential": {
        const diffUnlocked = isUnlocked("differential");
        return (
          <>
            <div className="mb-4 text-sm text-gray-400">
              Requires Sport or Race Differential.
            </div>
            <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest">
              Front
            </h3>
            <TuningSlider
              label="Acceleration"
              locked={!diffUnlocked}
              value={tuningSettings.diff_accel_f}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => setTuning("diff_accel_f", v)}
            />
            <TuningSlider
              label="Deceleration"
              locked={!diffUnlocked}
              value={tuningSettings.diff_decel_f}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => setTuning("diff_decel_f", v)}
            />

            <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest mt-6">
              Rear
            </h3>
            <TuningSlider
              label="Acceleration"
              locked={!diffUnlocked}
              value={tuningSettings.diff_accel_r}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => setTuning("diff_accel_r", v)}
            />
            <TuningSlider
              label="Deceleration"
              locked={!diffUnlocked}
              value={tuningSettings.diff_decel_r}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => setTuning("diff_decel_r", v)}
            />

            <h3 className="text-yellow-500 font-bold uppercase mb-2 text-xs tracking-widest mt-6">
              Center
            </h3>
            <TuningSlider
              label="Balance"
              locked={!diffUnlocked}
              value={tuningSettings.diff_center}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(v) => setTuning("diff_center", v)}
            />
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 top-24 bottom-0 flex z-10">
      {/* Top Bar (simulated by Flex layout) */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/90 flex items-center justify-between px-8 border-b border-white/10 z-20">
        <div className="text-xl font-bold italic tracking-tighter">
          TUNE SETUP
        </div>
        <div className="flex gap-1">
          {TUNING_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                        px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors
                        ${activeSection === section.id ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}
                    `}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-full pt-12 flex">
        {/* Left: Stats (Acceleration, Braking, etc) */}
        <div className="w-1/4 bg-black/80 backdrop-blur-md border-r border-white/10 p-8 pt-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                Acceleration
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">0-60 MPH</span>{" "}
                <span
                  className={`font-mono ${getStatColor(performanceStats?.acceleration060, baselineStats?.acceleration060, true)}`}
                >
                  {performanceStats?.acceleration060} s
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">0-100 MPH</span>{" "}
                {/* Simplified estimate for 0-100 based on 0-60 */}
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
                  className={`font-mono ${getStatColor(performanceStats?.topSpeed, baselineStats?.topSpeed, false)}`}
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
                  className={`font-mono ${getStatColor(performanceStats?.brakingDistance600, baselineStats?.brakingDistance600, true)}`}
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
                  className={`font-mono ${getStatColor(performanceStats?.lateralG, baselineStats?.lateralG, false)}`}
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

        {/* Middle: Sliders */}
        <div className="flex-1 bg-black/60 backdrop-blur-md p-8 pt-12 overflow-y-auto">
          {renderSection()}
        </div>

        {/* Right: Helper Info/Image */}
        <div className="w-1/4 bg-black/80 backdrop-blur-md border-l border-white/10 p-8 pt-12 flex flex-col">
          <div className="flex-1 bg-white/5 rounded-lg mb-4 flex items-center justify-center border border-white/10 overflow-hidden relative">
            {activeSection === "gearing" ? (
              <div className="w-full h-full p-2 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={gearingData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="speed"
                      type="number"
                      unit=" MPH"
                      domain={[0, "auto"]}
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                    />
                    <YAxis
                      dataKey="rpm"
                      type="number"
                      domain={[0, performanceStats.rpmLimit]}
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      unit=" RPM"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000",
                        borderColor: "#333",
                      }}
                      itemStyle={{ fontSize: 12 }}
                      labelStyle={{ color: "#fbbf24" }}
                      cursor={{ stroke: "rgba(255,255,255,0.2)" }}
                      formatter={(value, name) => [
                        value,
                        name === "speed" ? "Speed (MPH)" : "RPM",
                      ]}
                    />
                    <Line
                      type="linear"
                      dataKey="rpm"
                      stroke="#fbbf24"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="absolute top-1 right-2 text-[10px] text-gray-500 font-mono">
                  RPM vs SPEED
                </div>
              </div>
            ) : (
              <TuningModelViewer
                modelPath={tuningData[activeSection]?.modelPath}
              />
            )}
          </div>
          <p className="text-gray-300 leading-relaxed text-sm h-24">
            {tuningData[activeSection]?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TuningMenu;
