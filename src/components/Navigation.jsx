import React from 'react';
import { FaWrench, FaCogs, FaChartLine, FaHome } from 'react-icons/fa';

const Navigation = ({ currentView, setView }) => {
  const navItems = [
    { id: 'upgrade', label: 'Upgrade Shop', icon: <FaWrench /> },
    { id: 'tune', label: 'Tuning', icon: <FaCogs /> },
    { id: 'stats', label: 'Telemetry', icon: <FaChartLine /> },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-auto">
      <div className="text-2xl font-bold tracking-tighter italic text-white flex items-center gap-2">
        <span className="bg-white text-black px-2 py-1 transform -skew-x-12">FORZA</span>
        <span className="text-yellow-500">BUILDER</span>
      </div>
      
      <div className="flex gap-1 bg-black/50 p-1 rounded-full backdrop-blur-md border border-white/10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300
              ${currentView === item.id 
                ? 'bg-white text-black font-bold shadow-lg shadow-white/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'}
            `}
          >
            {item.icon}
            <span className="uppercase text-sm tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="text-right">
        <div className="text-xs text-gray-400 uppercase tracking-widest">Credits</div>
        <div className="text-xl font-mono text-yellow-500">9,999,999 CR</div>
      </div>
    </div>
  );
};

export default Navigation;
