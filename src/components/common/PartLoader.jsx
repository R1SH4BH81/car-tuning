import React from "react";

const PartLoader = () => {
  return (
    <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center backdrop-blur-sm rounded-sm">
      <div className="traffic-loader scale-50"></div>
    </div>
  );
};

export default PartLoader;
