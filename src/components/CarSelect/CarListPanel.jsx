import React from "react";
import CarListItem from "./CarListItem";

const CarListPanel = React.memo(function CarListPanel({
  allCars,
  selectedCarId,
  selectedRef,
  onSelect,
  onPreload,
}) {
  return (
    <div className="w-full lg:w-96 h-[25vh] lg:h-full pointer-events-auto flex flex-col lg:pr-8 px-0 lg:px-0 py-0">
      <div className="bg-black/80 backdrop-blur-md rounded-none lg:rounded-2xl border-t border-white/10 h-full overflow-hidden flex flex-col shadow-2xl">
        <div className="px-3 py-0 sm:px-4 sm:py-3 lg:p-6 border-b border-white/10 bg-black/40">
          <h2 className="text-sm sm:text-base lg:text-2xl font-black italic uppercase text-white tracking-wider">
            {allCars.length} CARS AVAILABLE
          </h2>
          <div className="text-[11px] sm:text-xs text-white/40 mt-0.5 font-medium"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {allCars.map((car) => {
            const isSelected = selectedCarId === car.id;
            return (
              <CarListItem
                key={car.id}
                ref={isSelected ? selectedRef : null}
                car={car}
                isSelected={isSelected}
                onSelect={onSelect}
                onPreload={onPreload}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default CarListPanel;
