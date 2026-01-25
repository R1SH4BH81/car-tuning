import React, { useCallback, useEffect, useRef, useTransition } from "react";
import useStore from "../store/useStore";
import LoadingOverlay from "./CarSelect/LoadingOverlay";
import CarStats from "./CarSelect/CarStats";
import CarListPanel from "./CarSelect/CarListPanel";

const CarSelect = () => {
  const { allCars, baseCar, setCar } = useStore();
  const selectedRef = useRef(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [baseCar.id]);

  const handleSelect = useCallback(
    (carId) => {
      startTransition(() => {
        setCar(carId);
      });
    },
    [setCar],
  );

  return (
    <div className="absolute left-0 right-0 top-16 md:top-24 bottom-0 flex flex-col lg:flex-row justify-end lg:justify-start pb-0 md:pb-6 pointer-events-none z-10">
      <LoadingOverlay />
      <CarStats baseCar={baseCar} />
      <CarListPanel
        allCars={allCars}
        selectedCarId={baseCar.id}
        selectedRef={selectedRef}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default CarSelect;
