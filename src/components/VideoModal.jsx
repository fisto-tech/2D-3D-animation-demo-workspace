import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const VideoModal = ({ isOpen, onClose, videoUrl, title }) => {
  const isGoogleDrive = videoUrl?.includes('drive.google.com');
  let embedUrl = videoUrl;
  
  if (isGoogleDrive) {
    if (videoUrl.includes('/view')) {
      embedUrl = videoUrl.split('/view')[0] + '/preview?autoplay=1';
    } else if (!videoUrl.includes('/preview')) {
      // Improved regex to capture the ID without needing a trailing slash
      const match = videoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        embedUrl = `https://drive.google.com/file/d/${match[1]}/preview?autoplay=1`;
      } else {
        embedUrl = videoUrl.includes('?') ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`; 
      }
    } else {
      embedUrl = videoUrl.includes('?') ? `${videoUrl}&autoplay=1` : `${videoUrl}?autoplay=1`;
    }
  }
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-[90%] max-w-7xl h-[90vh] bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="relative flex justify-center items-center p-4 bg-white border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{title || 'Fist-O'}</h2>
              <button
                onClick={onClose}
                className="absolute right-4 p-2 bg-white/5 hover:bg-white/10 text-gray-900 rounded-full transition-colors group"
                title="Close"
              >
                <FiX size={20} className="group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative flex-1 w-full bg-black">
              {videoUrl ? (
                isGoogleDrive ? (
                  <div className="relative w-full h-full">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      title="Google Drive Video"
                    />
                    {/* Hack to hide Google Drive's native pop-out icon in the top right */}
                    <div className="absolute top-0 right-0 w-[60px] h-[60px] bg-black z-10 pointer-events-none"></div>
                  </div>
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <div className="flex items-center justify-center w-full h-full text-textSecondary">
                  No video URL provided
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
