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

