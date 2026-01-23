import React, { useCallback, useEffect, useRef, useTransition } from "react";
import useStore from "../store/useStore";
import { preloadModel } from "../utils/modelLoader";
import LoadingOverlay from "./CarSelect/LoadingOverlay";
import CarStats from "./CarSelect/CarStats";
import CarListPanel from "./CarSelect/CarListPanel";

const CarSelect = () => {
  const { allCars, baseCar, setCar } = useStore();
  const selectedRef = useRef(null);
  const [, startTransition] = useTransition();
  const preloadTimeoutRef = useRef(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [baseCar.id]);

  useEffect(() => {
    let cancelled = false;
    const warm = () => {
      const candidates = allCars
        .slice(0, 8)
        .map((c) => c.modelPath)
        .filter(Boolean);

      candidates.forEach((path) => {
        if (cancelled) return;
        preloadModel(path);
      });
    };

    const handle =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback(warm, { timeout: 2000 })
        : setTimeout(warm, 500);

    return () => {
      cancelled = true;
      if (typeof handle === "number") clearTimeout(handle);
      else if (
        typeof window !== "undefined" &&
        "cancelIdleCallback" in window
      ) {
        window.cancelIdleCallback(handle);
      }
    };
  }, [allCars]);

  const handleSelect = useCallback(
    (carId) => {
      startTransition(() => {
        setCar(carId);
      });
    },
    [setCar],
  );

  const handlePreload = useCallback((modelPath) => {
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }
    preloadTimeoutRef.current = setTimeout(() => {
      preloadModel(modelPath);
    }, 150);
  }, []);

  return (
    <div className="absolute left-0 right-0 top-8 md:top-24 bottom-0 flex flex-col lg:flex-row justify-end lg:justify-start pb-0 md:pb-6 pointer-events-none z-10">
      <LoadingOverlay />
      <CarStats baseCar={baseCar} />
      <CarListPanel
        allCars={allCars}
        selectedCarId={baseCar.id}
        selectedRef={selectedRef}
        onSelect={handleSelect}
        onPreload={handlePreload}
      />
    </div>
  );
};

export default CarSelect;
