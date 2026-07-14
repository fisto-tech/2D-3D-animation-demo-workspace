import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WebsiteContext } from '../context/WebsiteContext';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiSettings, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AdminBookingModal from '../components/AdminBookingModal';

const TiltCard = ({ children, className }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    const rotX = ((y - centerY) / centerY) * -10; 
    const rotY = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY, scale: (rotateX || rotateY) ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(30px)" }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { websites, editWebsite } = useContext(WebsiteContext);
  const { isAdmin } = useContext(AuthContext);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showCombo, setShowCombo] = useState(true);
  const [selectedCatalog, setSelectedCatalog] = useState(null);

  const handleCatalogSelect = (type) => {
    setSelectedCatalog(prev => prev === type ? null : type);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const website = websites.find(w => w.websiteId === id);

  if (!website) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-serif text-textPrimary mb-4">Website not found</h2>
        <button onClick={() => navigate('/')} className="text-primary hover:underline flex items-center">
          <FiArrowLeft className="mr-2" /> Back to Marketplace
        </button>
      </div>
    );
  }

  const handleSaveBooking = (updatedData) => {
    editWebsite(updatedData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background relative"
    >
      {/* SECTION 1: Premium Presentation (Hero) */}
      <section className="relative pt-24 pb-12 lg:pt-24 lg:pb-12 lg:min-h-[70vh] flex flex-col justify-center overflow-hidden border-b border-border bg-mesh-pattern">
        <div className="absolute inset-0 gold-glow opacity-30 pointer-events-none"></div>
        
        <div className="w-[95%] md:w-[90%] lg:w-[85%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col">
          
          {/* Top Bar: Back & Admin Controls */}
          <div className="mb-8 lg:mb-12 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button 
              onClick={() => {
                navigate('/');
                window.scrollTo(0, 0);
              }}
              className="flex items-center text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase text-gray-400 hover:text-white transition-colors group"
            >
              <FiArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" size={16} />
              ALL CONCEPTS
            </button>
            
            {isAdmin && (
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="flex items-center px-6 py-2.5 border border-primary/50 text-xs tracking-widest uppercase font-bold rounded-full text-primary hover:bg-primary hover:text-background transition-colors shadow-[0_0_15px_rgba(197,160,89,0.15)]"
              >
                <FiSettings className="mr-2" size={14} />
                Manage Booking
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full">
            
            {/* Left Text */}
          <div className="lg:w-1/2 w-full flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-xl md:text-3xl lg:text-4xl tracking-widest text-gray-300 uppercase font-bold mb-4 lg:mb-6 flex items-center justify-center lg:justify-start">
                <span className="text-3xl md:text-4xl lg:text-5xl mr-3 lg:mr-4 font-sans font-black text-primary drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]">01</span> 
                <span className="mt-1">PREMIUM PRESENTATION</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-medium text-textPrimary leading-[1.1] mb-6 mx-auto lg:mx-0">
                Your business, presented like a <span className="text-primary block lg:inline mt-2 lg:mt-0">premium brand.</span>
              </h1>
              <p className="text-base lg:text-lg text-textSecondary font-light max-w-xl mx-auto lg:mx-0">
                {website.websiteName} - A high-converting {website.category.toLowerCase()} template built for elite digital experiences.
              </p>
            </motion.div>
          </div>

          {/* Right Mobile & Tab Layout */}
          <div className="lg:w-1/2 w-full flex flex-col justify-center mt-4 lg:mt-0 items-center lg:items-end">
            <div className="flex w-[95%] sm:w-[80%] md:w-[70%] lg:w-[100%] gap-4 lg:gap-6 justify-center lg:justify-end items-end pl-0 lg:pl-4">
              {/* Tablet Shape */}
              <div className="flex flex-col gap-3 items-center w-[70%] lg:w-[60%] xl:w-[55%]">
                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 drop-shadow-md">TAB VIEW</span>
                <motion.div 
                  initial={{ opacity: 0, y: 60, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full relative aspect-[3/4] bg-[#111] rounded-[1rem] lg:rounded-[1.5rem] border-[4px] lg:border-[6px] border-[#1a1a1a] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden z-20 group"
                >
                  <img src={website.tabImageUrl || website.imageUrl} alt="Tablet" className="w-full h-full object-cover object-right-top transform group-hover:scale-105 transition-transform duration-700" />
                </motion.div>
              </div>
              
              {/* Mobile Shape */}
              <div className="flex flex-col gap-3 items-center w-[35%] lg:w-[32%] xl:w-[28%]">
                <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 drop-shadow-md">MOBILE VIEW</span>
                <motion.div 
                  initial={{ opacity: 0, y: 80, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full relative aspect-[9/19] bg-[#111] rounded-[1.25rem] lg:rounded-[1.5rem] border-[4px] lg:border-[6px] border-[#1a1a1a] shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden z-30 group"
                >
                  <img src={website.mobileImageUrl || website.imageUrl} alt="Mobile" className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 2: Purchase Banner */}
      <section className="py-12 bg-background relative overflow-hidden border-b border-border">
        <div className="w-[95%] lg:w-[85%] max-w-none mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-3xl p-6 lg:p-8 shadow-2xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full">
              
              <div className="flex flex-col text-center lg:text-left">
                <span className="text-xs tracking-widest uppercase font-bold text-gray-400 mb-1">Website ID</span>
                <span className="text-lg md:text-xl font-mono text-white font-bold">{website.websiteId}</span>
              </div>
              
              <div className="hidden lg:block w-px h-12 bg-[#333]"></div>

              <div className="flex flex-col text-center lg:text-left">
                <span className="text-xs tracking-widest uppercase font-bold text-gray-400 mb-1">Total Price</span>
                <span className="text-2xl md:text-3xl text-primary font-bold">{website.price || '₹25,000'}</span>
              </div>

              <div className="hidden lg:block w-px h-12 bg-[#333]"></div>

              <div className="flex flex-col text-center lg:text-left">
                <span className="text-xs tracking-widest uppercase font-bold text-gray-400 mb-1">Advance Amount</span>
                <span className="text-lg md:text-xl text-white font-medium">{website.advanceAmount || '₹1,500'}</span>
              </div>

              <div className="flex flex-col gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                <button className="w-full lg:w-auto px-10 py-4 bg-primary hover:bg-primary-dark text-background font-bold uppercase tracking-widest text-sm rounded-full transition-colors shadow-lg">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Combo Offer Dropdown */}
            <div className="mt-8 pt-6 border-t border-[#333]">
              <button 
                onClick={() => setShowCombo(!showCombo)} 
                className="flex items-center text-primary font-bold text-sm tracking-widest uppercase hover:text-white transition-colors group"
              >
                Combo Offer 
                <motion.div
                  animate={{ rotate: showCombo ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-2 bg-[#222] p-1 rounded-full group-hover:bg-[#333] transition-colors"
                >
                  <FiChevronDown size={16} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {showCombo && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 bg-[#0a0a0a] p-6 rounded-2xl border border-[#222] lg:w-4/5 xl:w-3/4">
                      <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
                        {/* Image Side */}
                        <div className="w-full md:w-1/3 flex items-center">
                          <img src="https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=400&q=80" alt="Digital Catalogue Example" className="w-full h-auto max-h-[250px] md:max-h-full object-cover rounded-xl border border-[#333] shadow-lg" />
                        </div>
                        
                        {/* Table Side */}
                        <div className="w-full md:w-2/3">
                          <h4 className="text-white font-bold text-xl mb-4 font-serif animate-pulse">Interactive Digital Catalogue</h4>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[#333]">
                                  <th className="py-3 px-2 sm:px-4 text-[10px] sm:text-xs tracking-widest uppercase font-bold text-white">Features</th>
                                  <th className="py-3 px-2 sm:px-4 text-[10px] sm:text-xs tracking-widest uppercase font-bold text-white text-center">8 Pages</th>
                                  <th className="py-3 px-2 sm:px-4 text-[10px] sm:text-xs tracking-widest uppercase font-bold text-white text-center">12 Pages</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-[#222] hover:bg-[#111] transition-colors">
                                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-300 font-medium">Custom Design</td>
                                  <td className="py-3 px-2 sm:px-4 text-center"><FiCheckCircle className="inline text-success" /></td>
                                  <td className="py-3 px-2 sm:px-4 text-center"><FiCheckCircle className="inline text-success" /></td>
                                </tr>
                                <tr className="border-b border-[#222] hover:bg-[#111] transition-colors">
                                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-300 font-medium">Interactive Elements</td>
                                  <td className="py-3 px-2 sm:px-4 text-center"><FiCheckCircle className="inline text-success" /></td>
                                  <td className="py-3 px-2 sm:px-4 text-center"><FiCheckCircle className="inline text-success" /></td>
                                </tr>
                                <tr className="border-b border-[#222] hover:bg-[#111] transition-colors">
                                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-300 font-medium">Revisions Allowed</td>
                                  <td className="py-3 px-2 sm:px-4 text-center text-xs sm:text-sm text-gray-300">2-3</td>
                                  <td className="py-3 px-2 sm:px-4 text-center text-xs sm:text-sm text-gray-300">2-3</td>
                                </tr>
                                <tr className="border-b border-[#222] hover:bg-[#111] transition-colors">
                                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-300 font-medium">Price</td>
                                  <td className="py-3 px-2 sm:px-4 text-center font-bold text-white text-base sm:text-lg">₹15,000</td>
                                  <td className="py-3 px-2 sm:px-4 text-center font-bold text-white text-base sm:text-lg">₹25,000</td>
                                </tr>
                                <tr>
                                  <td className="py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-300 font-medium">Select Package</td>
                                  <td className="py-4 px-2 sm:px-4 text-center">
                                    <button 
                                      onClick={() => handleCatalogSelect('8')} 
                                      className={`w-5 h-5 rounded-full border-2 mx-auto flex items-center justify-center transition-colors ${selectedCatalog === '8' ? 'border-primary' : 'border-gray-500 hover:border-gray-300'}`}
                                    >
                                      {selectedCatalog === '8' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                    </button>
                                  </td>
                                  <td className="py-4 px-2 sm:px-4 text-center">
                                    <button 
                                      onClick={() => handleCatalogSelect('12')} 
                                      className={`w-5 h-5 rounded-full border-2 mx-auto flex items-center justify-center transition-colors ${selectedCatalog === '12' ? 'border-primary' : 'border-gray-500 hover:border-gray-300'}`}
                                    >
                                      {selectedCatalog === '12' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          
                          <p className="mt-5 text-[10px] sm:text-xs text-textSecondary font-light leading-relaxed border-t border-[#222] pt-4">
                            <span className="text-primary font-bold">Disclaimer:</span> Only designs will be provided from our side. A maximum of 2 to 3 corrections are applicable. Multiple correction requests will not be entertained.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Features */}
      <section className="py-16 bg-[#050505] border-b border-border relative">
        <div className="w-[95%] md:w-[90%] lg:w-[85%] max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-center">
            
            {/* Left Side Text Content */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <span className="text-primary text-sm font-bold tracking-widest uppercase mb-4 block">
                  {website.websiteName} Features
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-[1.05] tracking-tight">
                  Every layout is optimized to create a <span className="text-gray-400">premium first impression.</span>
                </h2>
              </motion.div>
            </div>
            
            {/* Right Side Features Grid */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                {website.features && website.features.map((feature, index) => {
                  const isLastOdd = index === website.features.length - 1 && website.features.length % 2 !== 0;
                  return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                    className={`bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 md:p-8 min-h-[140px] flex items-end border border-[#222] rounded-2xl hover:border-primary/40 hover:shadow-[0_0_20px_rgba(197,160,89,0.1)] transition-all duration-300 ${isLastOdd ? 'sm:col-span-2 sm:w-[calc(50%-0.5rem)] lg:w-[calc(50%-0.625rem)] sm:mx-auto' : ''}`}
                  >
                    <h4 className="text-lg md:text-xl font-medium text-gray-200">{feature}</h4>
                  </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="py-16 md:py-24 bg-[#050505] border-b border-border relative overflow-hidden flex justify-center items-center text-center">
        <div className="absolute inset-0 bg-mesh-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 w-[95%] max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold text-primary mb-6 drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">START YOURS</span>
          <h2 className="text-5xl md:text-6xl lg:text-[5.5rem] font-serif text-white leading-[1.05] tracking-tight mb-12">
            Want a website<br className="hidden sm:block"/> like this for your<br className="hidden sm:block"/> business?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto">
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-white text-black text-xs tracking-widest uppercase font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center group"
            >
              START YOUR PROJECT <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-transparent border border-border text-white text-xs tracking-widest uppercase font-bold rounded-full hover:bg-white/5 hover:border-white transition-colors flex items-center justify-center group"
            >
              MORE CONCEPTS <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>


      {/* Fixed View Live Demo Button */}
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.open(website.websiteUrl, '_blank')}
        className="fixed bottom-8 right-8 md:bottom-10 md:right-10 z-[100] group flex items-center justify-center px-6 py-4 border-2 border-primary text-sm tracking-widest uppercase font-bold rounded-full text-primary bg-background/90 backdrop-blur-md hover:bg-primary hover:text-background transition-all shadow-[0_10px_30px_rgba(197,160,89,0.3)] animated-gold-border"
      >
        <span className="relative flex items-center">
          <svg 
            stroke="currentColor" 
            fill="none" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            height="18" 
            width="18" 
            className="mr-3 overflow-visible" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <g className="animate-arrow-loop">
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </g>
          </svg>
          View Live Demo
        </span>
      </motion.button>

      <AdminBookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        website={website}
        onSave={handleSaveBooking}
      />

      {/* Hidden Invoice Template for PDF Generation remains unchanged */}
      <div id="pdf-invoice" className="hidden absolute left-[-9999px] top-[-9999px] w-[800px] bg-white p-12 text-black font-sans">
        <div className="border-b-2 border-[#c5a059] pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif font-extrabold text-[#111] tracking-tight mb-2">Fist-O<span className="text-[#c5a059] italic">Web</span></h1>
            <p className="text-gray-600">Premium Ready-Made Websites</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-300 uppercase tracking-widest">Invoice</h2>
            <p className="text-black font-medium mt-1">Date: {website.bookingDate || new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-bold text-black mb-4 border-b border-gray-200 pb-2">Booking Details</h3>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <span className="text-gray-500 text-sm block">Website Name</span>
              <span className="font-semibold text-lg font-serif">{website.websiteName}</span>
            </div>
            <div>
              <span className="text-gray-500 text-sm block">Website ID</span>
              <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200 inline-block mt-1">{website.websiteId}</span>
            </div>
            <div>
              <span className="text-gray-500 text-sm block">Category</span>
              <span className="font-medium">{website.category}</span>
            </div>
            <div>
              <span className="text-gray-500 text-sm block">Current Status</span>
              <span className="font-bold text-[#c5a059]">{website.status.toUpperCase()}</span>
            </div>
            
            {(website.customerName || website.companyName) && (
              <div className="col-span-2 pt-4 mt-2 border-t border-gray-200">
                <h4 className="font-bold text-black mb-2">Billed To:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Name:</span> <span className="font-medium">{website.customerName || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Company:</span> <span className="font-medium">{website.companyName || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-medium">{website.customerEmail || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{website.customerPhone || 'N/A'}</span></div>
                  <div className="col-span-2"><span className="text-gray-500">Location:</span> <span className="font-medium">{website.location || 'N/A'}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-[#111] text-white">
              <th className="py-3 px-4 text-left rounded-tl-md">Description</th>
              <th className="py-3 px-4 text-right rounded-tr-md">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-4">
                <div className="font-medium font-serif">Premium Website Template Purchase</div>
                <div className="text-sm text-gray-500 mt-1">Includes source code and assets for {website.websiteName}</div>
              </td>
              <td className="py-4 px-4 text-right font-bold font-serif">{website.price}</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-4 px-4 text-right font-medium">Required Advance Payment:</td>
              <td className="py-4 px-4 text-right font-bold text-[#c5a059]">{website.advanceAmount || '\u20B91,500'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Details;
