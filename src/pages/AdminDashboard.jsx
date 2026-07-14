import React, { useContext, useState } from 'react';
import { WebsiteContext } from '../context/WebsiteContext';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import WebsiteCard from '../components/WebsiteCard';
import EditModal from '../components/EditModal';

const AdminDashboard = () => {
  const { websites, editWebsite } = useContext(WebsiteContext);
  const { isAdmin } = useContext(AuthContext);
  const [editingWebsite, setEditingWebsite] = useState(null);

  if (!isAdmin) {
    return <div className="p-8 text-center text-danger font-bold text-xl">Access Denied. Admins only.</div>;
  }

  const handleEditClick = (website) => {
    setEditingWebsite(website);
  };

  const handleSaveEdit = (updatedWebsite) => {
    editWebsite(updatedWebsite);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background relative"
    >
      <div className="absolute top-0 left-0 w-full h-96 bg-mesh-pattern opacity-10 pointer-events-none z-0"></div>
      
      {/* Header */}
      <div className="bg-card border-b border-border shadow-lg py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-[95%] md:w-[85%] max-w-none mx-auto">
          <h1 className="text-4xl font-serif font-bold text-textPrimary">Admin Dashboard</h1>
          <p className="mt-2 text-textSecondary font-light">Manage your premium marketplace inventory.</p>
        </div>
      </div>

      <div className="w-[95%] md:w-[85%] max-w-none mx-auto px-2 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Inventory heading */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-textPrimary">Current Inventory</h2>
          <span className="text-sm text-textSecondary">{websites.length} websites</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {websites.map(website => (
            <WebsiteCard 
              key={website.websiteId} 
              website={website} 
              onEditClick={handleEditClick}
            />
          ))}
        </div>
      </div>

      <EditModal 
        isOpen={!!editingWebsite} 
        onClose={() => setEditingWebsite(null)}
        website={editingWebsite}
        onSave={handleSaveEdit}
      />
    </motion.div>
  );
};

export default AdminDashboard;
