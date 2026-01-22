import React, { useState } from "react";
import Experience from "./components/Experience";
import Navigation from "./components/Navigation";
import UpgradeShop from "./components/UpgradeShop";
import TuningMenu from "./components/TuningMenu";
import PerformanceStats from "./components/PerformanceStats";
import Telemetry from "./components/Telemetry";
import CarSelect from "./components/CarSelect";
import { FaArrowLeft, FaChartBar } from "react-icons/fa";

function App() {
  const [currentView, setView] = useState("upgrade");

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none text-white">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Experience />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">
        {currentView !== "showcase" && (
          <Navigation currentView={currentView} setView={setView} />
        )}

        {currentView === "showcase" ? (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            {/* Top Controls */}
            <div className="flex justify-between items-start pointer-events-auto">
              <button
                onClick={() => setView("upgrade")}
                className="bg-black/50 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur-md border border-white/10 transition-all"
              >
                <FaArrowLeft size={20} />
              </button>
            </div>

            {/* Performance Stats Overlay */}
            <div className="pointer-events-auto relative z-50">
              <PerformanceStats />
            </div>
          </div>
        ) : (
          <main className="flex-1 relative pointer-events-auto">
            {currentView === "garage" && <CarSelect />}
            {currentView === "upgrade" && <UpgradeShop />}
            {currentView === "tune" && <TuningMenu />}
            {currentView === "stats" && <Telemetry />}
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
