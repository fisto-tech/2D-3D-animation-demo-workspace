import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebsiteProvider } from './context/WebsiteContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import { FiMaximize, FiArrowUp } from 'react-icons/fi';
import Preloader from './components/Preloader';

const FullScreenToggle = () => {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <button 
      onClick={toggleFullScreen}
      className="fixed bottom-2 right-2 p-2 z-[9999] opacity-0 hover:opacity-20 transition-opacity duration-300 cursor-pointer text-gray-500"
      title="Developer Fullscreen Mode"
    >
      <FiMaximize size={16} />
    </button>
  );
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 z-[100] bg-primary text-background rounded-full shadow-lg transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
      title="Back to Top"
    >
      <FiArrowUp size={20} />
    </button>
  );
};

function App() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <AuthProvider>
      <WebsiteProvider>
        <HashRouter>
          {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}
          <div className="flex flex-col min-h-screen bg-background relative">
            {/* <Navbar /> */}
            <div className="flex-grow">
              <AppRoutes />
            </div>
            <Footer />
            <FullScreenToggle />
            <BackToTop />
          </div>
        </HashRouter>
      </WebsiteProvider>
    </AuthProvider>
  );
}

export default App;
