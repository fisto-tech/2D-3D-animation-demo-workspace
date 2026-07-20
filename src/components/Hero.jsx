import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 15, y: 50 });
  const { isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const heroSectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    let isAnimating = false;

    const handleWheel = (e) => {
      // If we are near the top and scrolling down
      if (window.scrollY < 50 && e.deltaY > 0 && !isAnimating) {
        e.preventDefault();
        isAnimating = true;
        
        const section = document.getElementById('marketplace-grid');
        if (section) {
          // Calculate target with a small offset for the sticky header if needed, or exact top
          const targetY = section.getBoundingClientRect().top + window.scrollY;
          
          gsap.to(window, {
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTo: { y: targetY, autoKill: false },
            onComplete: () => {
              setTimeout(() => { isAnimating = false; }, 100);
            }
          });
        } else {
          isAnimating = false;
        }
      } else if (isAnimating) {
        e.preventDefault(); // Block scrolling while animating
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

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

  const handleExploreDemos = () => {
    const section = document.getElementById('marketplace-grid');
    if (!section) return;

    const targetY = section.getBoundingClientRect().top + window.scrollY - 80;

    gsap.to(window, {
      duration: 1.25,
      ease: 'power3.inOut',
      scrollTo: { y: targetY, autoKill: false }
    });
  };

  return (
    <div ref={heroSectionRef} className="relative">
      <div 
        className="relative overflow-hidden border-b border-border py-2 lg:py-4"
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

      <div className="w-[95%] md:w-[80%] lg:w-[60%] min-h-[30vh] lg:min-h-[30vh] max-w-none mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 lg:py-6 relative z-10 flex items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-white leading-tight mb-2 tracking-tight flex flex-col items-center text-center">
              <span className="block">Transforming Imagination into</span>
              <span className="block">Stunning Visual Experiences</span>
              <span className="block text-[#a6da9f]">2D & 3D Animation</span>
            </h1>

            <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-8 max-w-2xl font-light leading-relaxed mt-4">
              Impactful animations for memorable digital experiences.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExploreDemos}
              className="px-8 py-3 md:px-10 md:py-3.5 text-xs md:text-sm tracking-widest uppercase font-bold text-gray-900 bg-[#a6da9f] hover:bg-[#7db376] rounded-full transition-all shadow-lg"
            >
              Explore Demos
            </motion.button>

          </motion.div>

        </div>
      </div>
      </div>
    </div>
  );
};

export default Hero;
