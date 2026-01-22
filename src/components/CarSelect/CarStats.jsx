import React from "react";
import getClassColor from "./classColor";

const CarStats = React.memo(function CarStats({ baseCar }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-end pb-12 pointer-events-none">
      <div className=" p-1 rounded-2xl   max-w-3xl w-full mx-2 pointer-events-auto ">
        <div className="grid grid-cols-4 gap-8 pt-6">
          <div>
            <div className="text-sm font-bold opacity-50 uppercase tracking-wider text-white mb-1">
              Power
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              {baseCar.baseStats.hp}{" "}
              <span className="text-sm opacity-50 font-sans">HP</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold opacity-50 uppercase tracking-wider text-white mb-1">
              Torque
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              {baseCar.baseStats.torque}{" "}
              <span className="text-sm opacity-50 font-sans">FT-LB</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold opacity-50 uppercase tracking-wider text-white mb-1">
              Weight
            </div>
            <div className="text-3xl font-mono font-bold text-white">
              {baseCar.baseStats.weight}{" "}
              <span className="text-sm opacity-50 font-sans">LBS</span>
            </div>
          </div>
          <div
            className={`
                w-24 h-20 flex flex-col items-center justify-center rounded-xl shadow-lg shrink-0 ml-8
                ${getClassColor(baseCar.class)}
            `}
          >
            <div className="text-4xl font-black italic text-white shadow-sm">
              {baseCar.class}
            </div>
            <div className="text-sm font-mono text-white/90 font-bold">
              {baseCar.pi}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CarStats;
