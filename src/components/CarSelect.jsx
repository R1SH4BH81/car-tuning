import React, { useEffect, useRef } from "react";
import useStore from "../store/useStore";

const CarSelect = () => {
  const { allCars, baseCar, setCar } = useStore();
  const selectedRef = useRef(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [baseCar.id]);

  return (
    <div className="absolute inset-0 top-24 bottom-0 flex pointer-events-none z-10">
      {/* Center: Selected Car Details */}
      <div className="flex-1 flex flex-col items-center justify-end pb-12 pointer-events-none">
        <div className=" p-1 rounded-2xl   max-w-3xl w-full mx-2 pointer-events-auto ">
          {/* Stats Grid */}
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
                ${
                  baseCar.class === "X"
                    ? "bg-green-600"
                    : baseCar.class === "S2"
                      ? "bg-blue-600"
                      : baseCar.class === "S1"
                        ? "bg-purple-600"
                        : baseCar.class === "A"
                          ? "bg-red-600"
                          : baseCar.class === "B"
                            ? "bg-orange-500"
                            : "bg-yellow-600"
                }
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

      {/* Right: Scrollable Car List */}
      <div className="w-96 h-full pointer-events-auto flex flex-col pr-8 py-4">
        <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 h-full overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 border-b border-white/10 bg-black/40">
            <h2 className="text-2xl font-black italic uppercase text-white tracking-wider">
              {allCars.length} CARS AVAILABLE
            </h2>
            <div className="text-sm text-white/40 mt-1 font-medium"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {allCars.map((car) => {
              const isSelected = baseCar.id === car.id;
              return (
                <button
                  key={car.id}
                  ref={isSelected ? selectedRef : null}
                  onClick={() => setCar(car.id)}
                  className={`
                    w-full p-4 rounded-xl text-left border transition-all duration-200 group relative overflow-hidden
                    ${
                      isSelected
                        ? "bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20 scale-[1.02] z-10"
                        : "bg-white/5 text-white border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]"
                    }
                    `}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="min-w-0 flex-1 pr-4">
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isSelected ? "text-black/60" : "text-white/40"}`}
                      >
                        {car.brand}
                      </div>
                      <div className="font-bold italic truncate text-lg leading-none">
                        {car.name.replace(car.brand, "").trim()}
                      </div>
                    </div>

                    <div
                      className={`
                            w-10 h-10 flex flex-col items-center justify-center rounded font-bold shrink-0
                            ${
                              car.class === "X"
                                ? "bg-green-600"
                                : car.class === "S2"
                                  ? "bg-blue-600"
                                  : car.class === "S1"
                                    ? "bg-purple-600"
                                    : car.class === "A"
                                      ? "bg-red-600"
                                      : car.class === "B"
                                        ? "bg-orange-500"
                                        : "bg-yellow-600"
                            }
                            ${isSelected ? "shadow-sm" : "opacity-90"}
                        `}
                    >
                      <div className="text-sm italic text-white leading-none">
                        {car.class}
                      </div>
                      <div className="text-[8px] font-mono text-white/90 leading-none mt-0.5">
                        {car.pi}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scroll Indicator / Footer */}
        </div>
      </div>
    </div>
  );
};

export default CarSelect;
