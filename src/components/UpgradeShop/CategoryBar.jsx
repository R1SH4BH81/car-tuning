import React from "react";

const CategoryBar = ({ groups, activeGroup, onGroupChange }) => {
  return (
    <div className="h-18 bg-black/90 backdrop-blur-md border-t border-white/10 pointer-events-auto overflow-x-auto flex items-center px-8 gap-4">
      {groups.map((group) => (
        <button
          key={group}
          onClick={() => onGroupChange(group)}
          className={`
            px-6 py-3 uppercase font-bold tracking-wider transition-all border-b-4 whitespace-nowrap
            ${
              activeGroup === group
                ? "border-yellow-500 text-white bg-white/10"
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
            }
          `}
        >
          {group}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
