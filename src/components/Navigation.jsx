import React from "react";
import useStore from "../store/useStore";
import { FaWrench, FaCogs, FaChartLine, FaCar, FaEye } from "react-icons/fa";

const Navigation = ({ currentView, setView }) => {
  const { performanceStats, baseCar } = useStore();
  const navItems = [
    { id: "garage", label: "My Garage", icon: <FaCar /> },
    { id: "upgrade", label: "Upgrade Shop", icon: <FaWrench /> },
    { id: "tune", label: "Tuning", icon: <FaCogs /> },
    { id: "stats", label: "Telemetry", icon: <FaChartLine /> },
    { id: "showcase", label: "Show Car", icon: <FaEye /> },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 border-l-4 border-yellow-500 pl-4 mt-4">
          <div className="text-2xl font-black italic tracking-tighter text-white uppercase">
            <span className="text-yellow-500 mr-2">{baseCar?.year}</span>
            {baseCar?.name}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 uppercase tracking-widest text-[10px]">
                Power
              </span>
              <span className="font-bold">
                {performanceStats?.hp}{" "}
                <span className="text-xs text-yellow-500">HP</span>
              </span>
            </div>

            {/* Torque Stat */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 uppercase tracking-widest text-[10px]">
                Torque
              </span>
              <span className="font-bold">
                {performanceStats?.torque}{" "}
                <span className="text-xs text-yellow-500">FT-LB</span>
              </span>
            </div>

            {/* Weight Stat */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 uppercase tracking-widest text-[10px]">
                Weight
              </span>
              <span className="font-bold">
                {performanceStats?.weight}{" "}
                <span className="text-xs text-yellow-500">LBS</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-black/60 backdrop-blur-md border border-white/10  px-1 py-1 overflow-x-auto max-w-full md:max-w-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`
    px-4 md:px-6 py-2 md:py-3 flex items-center gap-2 
    uppercase font-bold tracking-wider whitespace-nowrap text-xs sm:text-sm
    transition-all duration-300 border-b-4
    ${
      currentView === item.id
        ? "border-yellow-500 text-white bg-white/10 shadow-lg shadow-yellow-500/10"
        : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
    }
  `}
          >
            {item.icon}
            <span className="uppercase text-sm tracking-wider">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
