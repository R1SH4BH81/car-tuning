import React, { useState, useEffect } from "react";
import Experience from "./components/Experience";
import Navigation from "./components/Navigation";
import UpgradeShop from "./components/UpgradeShop";
import TuningMenu from "./components/TuningMenu";
import PerformanceStats from "./components/PerformanceStats";
import Telemetry from "./components/Telemetry";
import CarSelect from "./components/CarSelect";
import { FaArrowLeft, FaChartBar, FaDatabase, FaGlobe } from "react-icons/fa";

function App() {
  const [currentView, setView] = useState("upgrade");
  const [cacheNotification, setCacheNotification] = useState(null);

  useEffect(() => {
    const handleModelLoaded = (event) => {
      const { source, url } = event.detail;
      const fileName = url.split("/").pop();
      setCacheNotification({
        message: `Model loaded from ${source === "cache" ? "Local Cache" : "Network"}`,
        source: source,
        details: fileName,
      });

      // Clear notification after 3 seconds
      setTimeout(() => setCacheNotification(null), 3000);
    };

    window.addEventListener("model-loaded", handleModelLoaded);
    return () => window.removeEventListener("model-loaded", handleModelLoaded);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none text-white">
      {/* Cache Notification Toast */}
      {/* {cacheNotification && (
        <div className="absolute bottom-4 right-4 z-50 flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-lg shadow-xl animate-bounce-in">
          <div
            className={`p-2 rounded-full ${cacheNotification.source === "cache" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"}`}
          >
            {cacheNotification.source === "cache" ? (
              <FaDatabase />
            ) : (
              <FaGlobe />
            )}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {cacheNotification.source === "cache"
                ? "IndexedDB Cache"
                : "Network Request"}
            </div>
          </div>
        </div>
      )} */}

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
