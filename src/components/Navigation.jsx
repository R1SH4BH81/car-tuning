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
    <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-auto">
      <div className="flex flex-col gap-4">
        {/* PERSISTENT CAR DETAILS - Always Visible */}
        <div className="flex flex-col gap-1 border-l-4 border-yellow-500 pl-4">
          <div className="text-2xl font-black italic tracking-tighter text-white uppercase">
            <span className="text-yellow-500 mr-2">{baseCar?.year}</span>
            {baseCar?.name}
          </div>

          <div className="flex gap-8 text-white font-mono text-sm">
            {/* Power Stat */}
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

      <div className="flex gap-1 bg-black/50 p-1 rounded-full backdrop-blur-md border border-white/10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300
              ${
                currentView === item.id
                  ? "bg-white text-black font-bold shadow-lg shadow-white/20"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
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
