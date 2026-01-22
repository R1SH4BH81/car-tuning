import React, { useState } from 'react';
import Experience from './components/Experience';
import Navigation from './components/Navigation';
import UpgradeShop from './components/UpgradeShop';
import TuningMenu from './components/TuningMenu';
import PerformanceStats from './components/PerformanceStats';
import Telemetry from './components/Telemetry';

function App() {
  const [currentView, setView] = useState('upgrade');

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none text-white">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Experience />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        <Navigation currentView={currentView} setView={setView} />
        
        <main className="flex-1 relative">
          {currentView === 'upgrade' && <UpgradeShop />}
          {currentView === 'tune' && <TuningMenu />}
          {currentView === 'stats' && <Telemetry />}
        </main>

        <PerformanceStats />
      </div>
    </div>
  );
}

export default App;
