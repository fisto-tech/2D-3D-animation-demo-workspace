import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 15, y: 50 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div 
      className="relative overflow-hidden border-b border-border"
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full interactive-glow pointer-events-none opacity-50"></div>

      <div className="w-[95%] md:w-[80%] lg:w-[60%] min-h-[30vh] lg:min-h-[30vh] max-w-none mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:py-6 relative z-10 flex items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight mb-6 tracking-wide">
              Bringing Ideas to Life with <span className="text-[#d6fd95] drop-shadow-md block mt-3 text-5xl md:text-6xl lg:text-8xl">2D & 3D Animation</span> 
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-10 max-w-2xl font-light leading-relaxed">
              Immersive, high-quality animations that elevate your brand's digital presence
            </p>

          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
