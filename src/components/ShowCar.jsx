import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import useStore from "../store/useStore";
import PerformanceStats from "./PerformanceStats";
import DynoChart from "./UpgradeShop/DynoChart";

const ShowCar = ({ setView }) => {
  const { dynoData } = useStore();

  return (
    <div className="absolute mt-[5vh] inset-0 pointer-events-none flex flex-col justify-between pt-12 px-0.5">
      <div className="flex justify-between items-start pointer-events-auto px-3">
        <button
          onClick={() => setView("upgrade")}
          className="bg-black/50 hover:bg-white text-white hover:text-black ml-5 p-3 rounded-full backdrop-blur-md border border-white/10 transition-all"
        >
          <FaArrowLeft size={20} />
        </button>
        <div className="w-40 h-24 sm:w-56 sm:h-32">
          <DynoChart
            hoveredPart={null}
            dynoData={dynoData}
            previewDynoData={dynoData}
          />
        </div>
      </div>

      <div className="pointer-events-auto relative z-50">
        <PerformanceStats />
      </div>
    </div>
  );
};

export default ShowCar;
