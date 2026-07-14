import React, { useEffect, useState } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    
    // Simulate a realistic loading progression
    const timer = setInterval(() => {
      // Slow down as it gets closer to 100% to simulate real loading
      const increment = currentProgress > 80 ? Math.random() * 2 : Math.random() * 15;
      currentProgress = Math.min(currentProgress + increment, 100);
      
      setProgress(Math.floor(currentProgress));

      if (currentProgress >= 100) {
        clearInterval(timer);
        // Start fade out animation
        setTimeout(() => {
          setIsFadingOut(true);
          // Tell parent component we're done after fade out completes
          setTimeout(onComplete, 800); 
        }, 400);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-background transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none translate-y-[-20px]' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center justify-center gap-6">
        
        {/* Animated Wave Bars */}
        <div className="flex items-center gap-2 h-16">
          <div className="w-3 h-full bg-primary rounded-full animate-[wave_1.2s_ease-in-out_infinite]"></div>
          <div className="w-3 h-full bg-primary rounded-full animate-[wave_1.2s_ease-in-out_0.2s_infinite]"></div>
          <div className="w-3 h-full bg-primary rounded-full animate-[wave_1.2s_ease-in-out_0.4s_infinite]"></div>
          <div className="w-3 h-full bg-primary rounded-full animate-[wave_1.2s_ease-in-out_0.6s_infinite]"></div>
          <div className="w-3 h-full bg-primary rounded-full animate-[wave_1.2s_ease-in-out_0.8s_infinite]"></div>
        </div>
        
        {/* Brand Text */}
        <div className="mt-4 text-center">
          <h2 className="text-xl md:text-2xl font-sans tracking-widest text-textPrimary font-bold">
            INITIALIZING
          </h2>
          <p className="text-sm text-primary font-mono mt-2 tracking-widest">
            {progress}%
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Preloader;
