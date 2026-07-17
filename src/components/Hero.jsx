import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 15, y: 50 });
  const { isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
      {/* Admin Login / Logout Button - Top Right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
        {isAdmin ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center px-5 py-2.5 text-xs tracking-widest uppercase font-bold text-primary bg-white hover:bg-gray-100 rounded-full transition-colors shadow-sm"
          >
            <FiLogOut className="mr-2" />
            Logout
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0.8 }}
            whileHover={{ scale: 1.05, opacity: 1, boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(255, 255, 255, 0)", "0px 0px 20px rgba(255, 255, 255, 0.3)", "0px 0px 0px rgba(255, 255, 255, 0)"] 
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 text-xs tracking-widest uppercase font-bold text-primary bg-white hover:bg-gray-100 rounded-full transition-colors"
          >
            Admin Login
          </motion.button>
        )}
      </div>

      <div className="absolute top-0 left-0 w-full h-full interactive-glow pointer-events-none opacity-50"></div>

      <div className="w-[95%] md:w-[80%] lg:w-[60%] min-h-[30vh] lg:min-h-[30vh] max-w-none mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:py-16 relative z-10 flex items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-sans font-bold text-white leading-[1.1] mb-8 tracking-tight flex flex-col items-center text-center">
              <span className="block">Bringing Ideas</span>
              <span className="block">to Life with <span className="text-[#d6fd95]">2D & 3D</span></span>
              <span className="block">Animation</span>
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
