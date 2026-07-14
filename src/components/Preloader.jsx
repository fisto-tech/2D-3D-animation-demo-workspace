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
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated geometric rings */}
        <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_4s_linear_infinite]"></div>
          {/* Middle ring with solid border piece */}
          <div className="absolute inset-2 rounded-full border border-transparent border-t-primary border-r-primary animate-[spin_3s_ease-in-out_infinite_alternate]"></div>
          {/* Inner ring */}
          <div className="absolute inset-6 rounded-full border border-transparent border-b-primary/60 border-l-primary/60 animate-[spin_2s_linear_infinite_reverse]"></div>
          
          {/* Center glow */}
          <div className="absolute inset-0 rounded-full gold-glow animate-pulse opacity-50"></div>
          
          {/* Percentage */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-xl font-serif text-textPrimary tracking-wider">
              {progress}<span className="text-sm text-primary ml-1">%</span>
            </span>
          </div>
        </div>
        
        {/* Brand Text */}
        <div className="overflow-hidden">
          <h2 className="text-sm md:text-base font-sans tracking-[0.3em] text-textSecondary uppercase font-medium">
            Loading<span className="animate-pulse">...</span>
          </h2>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-64 h-[2px] bg-border mt-8 relative overflow-hidden rounded-full">
          {/* Progress fill */}
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Glow effect on the tip of the progress bar */}
          <div 
            className="absolute top-0 h-full w-4 bg-white/50 blur-[2px] transition-all duration-300 ease-out"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
