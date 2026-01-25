import React from "react";
import getClassColor from "./classColor";

const CarStats = React.memo(function CarStats({ baseCar }) {
  return (
    <div className="w-full lg:flex-1 flex flex-col items-center justify-end pb-0 pointer-events-none">
      <div className="max-w-3xl w-full mx-2 pointer-events-auto">
        {/* Mobile/Tablet View (sm, md) */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-black/70 border border-white/10 backdrop-blur-md">
            {/* HP */}
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-white/50">
                HP
              </span>
              <span className="text-sm font-mono font-bold text-white">
                {baseCar.baseStats.hp}
              </span>
            </div>

            {/* TORQUE */}
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-white/50">
                TRQ
              </span>
              <span className="text-sm font-mono font-bold text-white">
                {baseCar.baseStats.torque}
              </span>
            </div>

            {/* WEIGHT */}
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-white/50">
                LB
              </span>
              <span className="text-sm font-mono font-bold text-white">
                {baseCar.baseStats.weight}
              </span>
            </div>

            {/* CLASS/PI Badge */}
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${getClassColor(baseCar.class)}`}
            >
              <span className="text-xs font-black italic text-white leading-none">
                {baseCar.class}
              </span>
              <span className="text-xs font-mono font-bold text-white leading-none border-l border-white/20 pl-1.5">
                {baseCar.pi}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop View (lg) */}
        {/* <div className="hidden lg:block p-1 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-6">
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
              className={`w-24 h-20 flex flex-col items-center justify-center rounded-xl shadow-lg shrink-0 ml-8 ${getClassColor(baseCar.class)}`}
            >
              <div className="text-4xl font-black italic text-white">
                {baseCar.class}
              </div>
              <div className="text-sm font-mono text-white/90 font-bold">
                {baseCar.pi}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
});

export default CarStats;
