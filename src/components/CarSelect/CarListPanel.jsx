import React, { useState, useMemo } from "react";
import CarListItem from "./CarListItem";
import { getClassBorderColor } from "./classColor";

const CarListPanel = React.memo(function CarListPanel({
  allCars,
  selectedCarId,
  selectedRef,
  onSelect,
}) {
  const [selectedClass, setSelectedClass] = useState(null);

  // Get unique classes
  const classes = useMemo(() => {
    const uniqueClasses = [...new Set(allCars.map((car) => car.class))];
    // Custom sort order for classes if needed, or just standard sort
    const order = ["X", "S2", "S1", "A", "B", "C", "D"];
    return uniqueClasses.sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      return a.localeCompare(b);
    });
  }, [allCars]);

  // Filter cars by selected class
  const filteredCars = useMemo(() => {
    if (!selectedClass) return [];
    return allCars.filter((car) => car.class === selectedClass);
  }, [allCars, selectedClass]);

  return (
    <div className="w-full lg:w-96 h-[23vh] lg:h-full pointer-events-auto flex flex-col lg:pr-8 px-0 lg:px-0 py-0">
      <div className="bg-black/80 backdrop-blur-md rounded-none  border-t border-white/10 h-full overflow-hidden flex flex-col shadow-2xl">
        <div className="px-4 py-0 sm:px-2 sm:py-1 lg:p-6 border-b border-white/10 bg-black/40 flex justify-between items-center min-h-[70px]">
          <div>
            <h2 className="text-sm sm:text-base lg:text-2xl font-black italic uppercase text-white tracking-wider">
              {selectedClass ? `${selectedClass} CLASS` : "SELECT CLASS"}
            </h2>
            <div className="text-[11px] sm:text-xs text-white/40 mt-0.5 font-medium">
              {selectedClass
                ? `${filteredCars.length} CARS`
                : `${allCars.length} CARS TOTAL`}
            </div>
          </div>
          {selectedClass && (
            <button
              onClick={() => setSelectedClass(null)}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Back
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {!selectedClass ? (
            <div className="grid grid-cols-2 gap-3">
              {classes.map((carClass) => (
                <button
                  key={carClass}
                  onClick={() => setSelectedClass(carClass)}
                  className={`px-4 md:px-6 py-2 md:py-3 flex items-center justify-center uppercase font-bold tracking-wider whitespace-nowrap text-xs sm:text-sm transition-all duration-300 border-b-4 ${getClassBorderColor(carClass)} text-white bg-white/5 hover:bg-white/10`}
                >
                  {carClass}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCars.map((car) => {
                const isSelected = selectedCarId === car.id;
                return (
                  <CarListItem
                    key={car.id}
                    ref={isSelected ? selectedRef : null}
                    car={car}
                    isSelected={isSelected}
                    onSelect={onSelect}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default CarListPanel;
