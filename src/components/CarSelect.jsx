import React from 'react';
import useStore from '../store/useStore';

const CarSelect = () => {
  const { allCars, baseCar, setCar } = useStore();

  return (
    <div className="absolute inset-0 top-24 bottom-24 flex items-center justify-center pointer-events-none z-10">
      <div className="w-full max-w-6xl h-full p-8 pointer-events-auto overflow-y-auto">
        <h2 className="text-4xl font-black italic uppercase text-white mb-8 drop-shadow-lg text-center">
          My Garage
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCars.map((car) => {
            const isSelected = baseCar.id === car.id;
            return (
              <button
                key={car.id}
                onClick={() => setCar(car.id)}
                className={`
                  relative p-6 rounded-lg text-left border transition-all duration-300 group
                  hover:scale-[1.02] active:scale-[0.98]
                  ${isSelected 
                    ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20' 
                    : 'bg-black/80 text-white border-white/10 hover:border-white/40 hover:bg-black/90'}
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-black/20 px-2 py-0.5 text-xs font-bold uppercase rounded">
                    Selected
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="text-sm font-bold opacity-60 uppercase tracking-widest">{car.brand}</div>
                        <div className="text-2xl font-bold italic">{car.name.replace(car.brand, '').trim()}</div>
                        <div className="text-sm opacity-60 mt-1">{car.year}</div>
                    </div>
                    
                    {/* Class Badge */}
                    <div className={`
                        w-12 h-12 flex flex-col items-center justify-center rounded shadow-lg shrink-0 ml-4
                        ${car.class === 'X' ? 'bg-green-600' : 
                          car.class === 'S2' ? 'bg-blue-600' : 
                          car.class === 'S1' ? 'bg-purple-600' : 
                          car.class === 'A' ? 'bg-red-600' : 
                          car.class === 'B' ? 'bg-orange-500' : 'bg-yellow-600'}
                    `}>
                        <div className="text-xl font-bold italic text-white">{car.class}</div>
                        <div className="text-[10px] font-mono text-white/90">{car.pi}</div>
                    </div>
                </div>

                {/* Base Stats Grid */}
                <div className={`grid grid-cols-3 gap-2 text-xs border-t pt-4 ${isSelected ? 'border-black/10' : 'border-white/10'}`}>
                    <div>
                        <div className="opacity-60 uppercase">Power</div>
                        <div className="font-mono font-bold">{car.baseStats.hp} HP</div>
                    </div>
                    <div>
                        <div className="opacity-60 uppercase">Torque</div>
                        <div className="font-mono font-bold">{car.baseStats.torque}</div>
                    </div>
                    <div>
                        <div className="opacity-60 uppercase">Weight</div>
                        <div className="font-mono font-bold">{car.baseStats.weight}</div>
                    </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CarSelect;
