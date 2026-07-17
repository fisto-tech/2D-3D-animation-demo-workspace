import React, { useEffect, useState } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    let isComplete = false;
    let fadeTimer = null;
    let finishTimer = null;

    const finishLoading = () => {
      if (isComplete) return;
      isComplete = true;

      clearInterval(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);

      setProgress(100);
      setIsFadingOut(true);
      fadeTimer = setTimeout(() => {
        finishTimer = setTimeout(onComplete, 400);
      }, 400);
    };

    const observeMedia = () => {
      const assets = Array.from(document.querySelectorAll('img, video, source'));
      if (!assets.length) {
        finishLoading();
        return;
      }

      let loadedCount = 0;
      const totalCount = assets.length;

      const markAsset = () => {
        loadedCount += 1;
        if (loadedCount >= totalCount) {
          finishLoading();
        }
      };

      assets.forEach((asset) => {
        if (asset.complete) {
          markAsset();
          return;
        }

        asset.addEventListener('load', markAsset, { once: true });
        asset.addEventListener('error', markAsset, { once: true });
      });
    };

    const progressTimer = setInterval(() => {
      const increment = currentProgress > 80 ? Math.random() * 2 : Math.random() * 12;
      currentProgress = Math.min(currentProgress + increment, 94);
      setProgress(Math.floor(currentProgress));
    }, 120);

    observeMedia();

    const handleWindowLoad = () => finishLoading();
    const handleFontsReady = () => finishLoading();

    if (document.fonts?.ready) {
      document.fonts.ready.then(handleFontsReady).catch(handleFontsReady);
    }

    window.addEventListener('load', handleWindowLoad);

    const observer = new MutationObserver(() => {
      observeMedia();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
      window.removeEventListener('load', handleWindowLoad);
      observer.disconnect();
    };
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
