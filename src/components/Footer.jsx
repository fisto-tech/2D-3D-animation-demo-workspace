import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 text-textPrimary py-6 mt-0 overflow-hidden text-center relative">
      <div className="absolute inset-0 bg-mesh-pattern opacity-10 pointer-events-none"></div>
      <div className="w-[95%] md:w-[90%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 text-sm font-medium text-textSecondary relative z-10">
        <p>&copy; {new Date().getFullYear()} Fist-O | 2D 3D Animation | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
