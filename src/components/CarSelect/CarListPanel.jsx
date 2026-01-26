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
  const [mobileExpanded, setMobileExpanded] = useState(false);

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
    <div
      className={`w-full lg:w-96 ${mobileExpanded ? "h-[55vh]" : "h-[23vh]"} lg:h-full pointer-events-auto flex flex-col lg:pr-8 px-0 lg:px-0 py-0 transition-all`}
    >
      <div className="bg-black/80 backdrop-blur-md rounded-none  border-t border-white/10 h-full overflow-hidden flex flex-col shadow-2xl">
        <div className="px-4 py-0 sm:px-2 sm:py-0.5 lg:px-6 lg:py-3 border-b border-white/10 bg-black/40 flex justify-between items-center min-h-[50px]">
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
          <div className="flex items-center gap-2">
            {selectedClass && (
              <button
                onClick={() => setSelectedClass(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => setMobileExpanded((prev) => !prev)}
              className=" rounded text-white transition-colors lg:hidden"
            >
              <span className="text-yellow-500 flex items-center">
                {mobileExpanded ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="yellow"
                  >
                    <path d="M440-440v240h-80v-160H200v-80h240Zm160-320v160h160v80H520v-240h80Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="yellow"
                  >
                    <path d="M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z" />
                  </svg>
                )}
              </span>
            </button>
          </div>
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
