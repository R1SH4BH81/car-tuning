import React from "react";
import getClassColor from "./classColor";

const CarListItem = React.memo(
  React.forwardRef(function CarListItem(
    { car, isSelected, onSelect, onPreload },
    ref,
  ) {
    return (
      <button
        ref={ref}
        onClick={() => onSelect(car.id)}
        onPointerEnter={() => onPreload(car.modelPath)}
        style={{ contentVisibility: "auto", containIntrinsicSize: "80px" }}
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
              className={`text-[12px] font-bold uppercase tracking-wider mb-0.5 ${isSelected ? "text-black/90" : "text-white/90"}`}
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
                ${getClassColor(car.class)}
                ${isSelected ? "shadow-sm" : "opacity-90"}
            `}
          >
            <div className="text-sm italic text-white leading-none">
              {car.class}
            </div>
          </div>
        </div>
      </button>
    );
  }),
);

export default CarListItem;

