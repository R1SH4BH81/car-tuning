import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import PerformanceStats from "./PerformanceStats";

const ShowCar = ({ setView }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between  pt-8 px-0.5">
      {/* Top Controls */}
      <div className="flex justify-between items-start pointer-events-auto">
        <button
          onClick={() => setView("upgrade")}
          className="bg-black/50 hover:bg-white text-white hover:text-black ml-5 p-3 rounded-full backdrop-blur-md border border-white/10 transition-all"
        >
          <FaArrowLeft size={20} />
        </button>
      </div>

      {/* Performance Stats Overlay */}
      <div className="pointer-events-auto relative z-50">
        <PerformanceStats />
      </div>
    </div>
  );
};

export default ShowCar;
