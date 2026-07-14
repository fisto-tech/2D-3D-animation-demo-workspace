import React from 'react';
import { motion } from 'framer-motion';
import WebsiteCard from './WebsiteCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const WebsiteGrid = ({ websites, onEditClick, sortBy, onPlayVideo }) => {
  if (websites.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-border shadow-sm">
        <h3 className="text-xl font-medium text-textSecondary">No websites found matching your criteria.</h3>
      </div>
    );
  }

  if (sortBy === 'Category Wise') {
    const grouped = websites.reduce((acc, website) => {
      const cat = website.category || 'Uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(website);
      return acc;
    }, {});

    // Sort categories alphabetically
    const sortedCategories = Object.keys(grouped).sort();

    return (
      <div className="flex flex-col gap-10">
        {sortedCategories.map(category => (
          <div key={category} className="border-b border-border/30 pb-10 last:border-0">
            <h3 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              {category}
            </h3>
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {grouped[category].map(website => (
                <motion.div key={website.websiteId} variants={item}>
                  <WebsiteCard website={website} onEditClick={onEditClick} onPlayVideo={onPlayVideo} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {websites.map(website => (
        <motion.div key={website.websiteId} variants={item}>
          <WebsiteCard website={website} onEditClick={onEditClick} onPlayVideo={onPlayVideo} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default WebsiteGrid;
