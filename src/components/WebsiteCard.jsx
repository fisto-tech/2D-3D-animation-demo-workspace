import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';

import { AuthContext } from '../context/AuthContext';
import { WebsiteContext } from '../context/WebsiteContext';
import { FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';
import EditModal from './EditModal';

const getCategoryColor = (category) => {
  const normalized = category?.toLowerCase() || '';
  if (normalized.includes('coffee')) return 'bg-orange-600';
  if (normalized.includes('dairy')) return 'bg-blue-400 text-gray-900';
  if (normalized.includes('restrarunt') || normalized.includes('restaurant')) return 'bg-red-500';
  if (normalized.includes('container')) return 'bg-teal-500';
  if (normalized.includes('water')) return 'bg-cyan-500 text-gray-900';
  if (normalized.includes('baker')) return 'bg-yellow-600';
  if (normalized.includes('drink')) return 'bg-pink-500';
  if (normalized.includes('fruit') || normalized.includes('veg')) return 'bg-green-500';
  if (normalized.includes('bag') || normalized.includes('pack')) return 'bg-indigo-500';
  if (normalized.includes('ingredient')) return 'bg-purple-500';
  return 'bg-blue-600'; // Default
};

const WebsiteCard = ({ website, onEditClick, onPlayVideo }) => {
  const { isAdmin } = useContext(AuthContext);
  const { deleteWebsite } = useContext(WebsiteContext);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${website.websiteName}?`)) {
      setIsDeleting(true);
      await deleteWebsite(website.websiteId);
      // We don't reset isDeleting because the component will unmount once deleted.
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`bg-white/5 backdrop-blur-md p-3 rounded-[1rem] shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col group border border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(219,84,0,0.2)] h-full relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >

      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl mb-4 bg-black">
        {website.imageUrl ? (
          <img 
            src={website.imageUrl} 
            alt={website.websiteName}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
        ) : website.preview_video ? (
          <video 
            src={website.preview_video} 
            preload="metadata"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900 text-xs uppercase tracking-widest">
            No Image
          </div>
        )}
        
        {/* Animated Hover Layer */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex items-center justify-center cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            const videoToPlay = website.preview_video || website.websiteUrl;
            if (videoToPlay && onPlayVideo) {
              onPlayVideo(videoToPlay);
            }
          }}
        >
          <span className="text-white text-xs font-bold tracking-wider px-6 py-2.5 border border-white/30 rounded-full backdrop-blur-md bg-black/40 hover:bg-white hover:text-black transition-all duration-300 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            VIEW
          </span>
        </div>
      </div>

      {/* Info Row (Category Badge only) */}
      <div className="flex justify-end items-center mb-3 px-1 mt-2">
        <div className={`px-2.5 py-1 rounded text-xs font-semibold text-white shadow-sm ${getCategoryColor(website.category)}`}>
          {website.category}
        </div>
      </div>

      {/* Title + Description */}
      <div className="px-1 mb-5 flex-1">
        {website.companyName ? (
          <div className="mb-2">
            <h3 className="text-lg md:text-xl font-bold leading-snug" style={{ color: '#ff9b9b' }}>
              {website.companyName}
            </h3>
            <h4 className="text-sm md:text-base font-medium tracking-wide mt-0.5" style={{ color: '#b1df92' }}>
              {website.websiteName}
            </h4>
          </div>
        ) : (
          <h3 className="text-base md:text-lg font-medium leading-snug mb-2" style={{ color: '#b1df92' }}>
            {website.websiteName}
          </h3>
        )}
        {website.description && (
          <p 
            className="text-[11px] text-gray-100 leading-relaxed line-clamp-2"
            title={website.description}
          >
            {website.description}
          </p>
        )}
      </div>

      {/* Footer row (Admin controls only) */}
      {isAdmin && (
        <div className="flex gap-2 px-1 mt-auto relative z-20">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if(onEditClick) onEditClick(website); 
              else setIsEditModalOpen(true); 
            }}
            className="px-3 py-1.5 shrink-0 bg-gray-500 hover:bg-gray-400 rounded-full flex items-center justify-center gap-1.5 text-white text-[11px] font-semibold transition-colors duration-300 shadow-sm"
            title="Edit Website"
          >
            <FiEdit size={12} />
            <span>Edit</span>
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1.5 shrink-0 bg-red-900/50 hover:bg-red-600 rounded-full flex items-center justify-center gap-1.5 text-white text-[11px] font-semibold transition-colors duration-300 shadow-sm"
            title="Delete Website"
          >
            {isDeleting ? <FiLoader className="animate-spin" size={12} /> : <FiTrash2 size={12} />}
            <span>{isDeleting ? 'Deleting' : 'Delete'}</span>
          </button>
        </div>
      )}
    </motion.div>
    
    {/* Local Edit Modal for Home Page & Details */}
    <EditModal 
      isOpen={isEditModalOpen} 
      onClose={() => setIsEditModalOpen(false)}
      website={website}
    />
    </>
  );
};

export default WebsiteCard;
