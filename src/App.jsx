import React, { useState, useEffect } from "react";
import Experience from "./components/Experience";
import Navigation from "./components/Navigation";
import UpgradeShop from "./components/UpgradeShop";
import TuningMenu from "./components/TuningMenu";

import ShowCar from "./components/ShowCar";
import Telemetry from "./components/Telemetry";
import CarSelect from "./components/CarSelect";
import { FaDatabase, FaGlobe } from "react-icons/fa";

function App() {
  const [currentView, setView] = useState("garage");
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
    <div className="relative w-screen h-screen  overflow-hidden font-sans select-none text-white">
      {/* Cache Notification Toast */}
      {cacheNotification && (
        <div className="absolute bottom-4 right-4 z-50 flex items-center gap-3   px-4 py-3 rounded-lg shadow-xl animate-bounce-in">
          <div
            className={`p-2 rounded-full ${cacheNotification.source === "cache" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"}`}
          >
            {cacheNotification.source === "cache" ? (
              <FaDatabase />
            ) : (
              <FaGlobe />
            )}
          </div>
          {/* <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {cacheNotification.source === "cache"
                ? "IndexedDB Cache"
                : "Network Request"}
            </div>
          </div> */}
        </div>
      )}

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
          <ShowCar setView={setView} />
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
