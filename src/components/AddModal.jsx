import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiLoader } from 'react-icons/fi';
import { WebsiteContext } from '../context/WebsiteContext';

const CATEGORIES = [
  'Bakery', 'Bag', 'Beverage Product (Drinks)', 'Dairy Products', 'Food',
  'Food Container', 'Food Packaging', 'Home Appliance Products', 'Interiors',
  'Machinery', 'Restaurants', 'Tea and Coffee', 'Water Bottle',
];

const EMPTY = {
  websiteName: '', category: '', description: '',
  websiteUrl: '', projectType: 'demo', companyName: '',
};

const AddModal = ({ isOpen, onClose }) => {
  const { addWebsite } = useContext(WebsiteContext);

  const [formData, setFormData]   = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [catOpen, setCatOpen]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFormData(EMPTY);
      setImageFile(null);
      setPreview('');
      setCatSearch('');
      setSaveError('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const filteredCats = CATEGORIES.filter(c =>
    c.toLowerCase().includes(catSearch.toLowerCase())
  );

  const selectCategory = (cat) => {
    setFormData(prev => ({ ...prev, category: cat }));
    setCatSearch(cat);
    setCatOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    const result = await addWebsite(formData, imageFile);
    setSaving(false);
    if (result.success) {
      onClose();
    } else {
      setSaveError(result.message || 'Failed to save. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-card border border-border rounded-xl shadow-2xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="absolute inset-0 bg-mesh-pattern opacity-10 pointer-events-none"></div>

          {/* Header */}
          <div className="relative z-10 flex justify-between items-center p-6 border-b border-border bg-background/80 backdrop-blur">
            <h3 className="text-xl font-serif font-bold text-textPrimary tracking-tight">Add New Website</h3>
            <button onClick={onClose} className="text-textSecondary hover:text-danger transition-colors"><FiX size={24} /></button>
          </div>

          {/* Body */}
          <div className="relative z-10 p-6 overflow-y-auto flex-1 custom-scrollbar">
            {saveError && (
              <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/30 rounded-md text-danger text-sm">{saveError}</div>
            )}
            <form id="add-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Website Name */}
                <div>
                  <label className="block text-sm tracking-widest capitalize font-bold text-white mb-1">Website Name *</label>
                  <input name="websiteName" value={formData.websiteName} onChange={handleChange}
                    placeholder="e.g. Coffee Brew Co."
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-textPrimary placeholder-textSecondary focus:ring-1 focus:ring-primary focus:outline-none"
                    required />
                </div>

                {/* Category */}
                <div className="relative">
                  <label className="block text-sm tracking-widest capitalize font-bold text-white mb-1">Category *</label>
                  <input type="text" value={catSearch}
                    onChange={e => { 
                      setCatSearch(e.target.value); 
                      setFormData(prev => ({ ...prev, category: e.target.value }));
                      setCatOpen(true); 
                    }}
                    onFocus={() => setCatOpen(true)}
                    onBlur={() => setTimeout(() => setCatOpen(false), 150)}
                    placeholder="Search or select category..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-textPrimary placeholder-textSecondary focus:ring-1 focus:ring-primary focus:outline-none"
                    required />
                  {catOpen && filteredCats.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-border rounded-md shadow-xl max-h-48 overflow-y-auto">
                      {filteredCats.map(cat => (
                        <button key={cat} type="button" onMouseDown={() => selectCategory(cat)}
                          className="w-full text-left px-3 py-2 text-sm text-textPrimary hover:bg-primary/10 hover:text-primary transition-colors">
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm tracking-widest capitalize font-bold text-white mb-1">Live Demo URL *</label>
                  <input name="websiteUrl" value={formData.websiteUrl} onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-textPrimary placeholder-textSecondary focus:ring-1 focus:ring-primary focus:outline-none"
                    required />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm tracking-widest capitalize font-bold text-white mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                    placeholder="Short 1–2 line description shown on the card..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-textPrimary placeholder-textSecondary focus:ring-1 focus:ring-primary focus:outline-none resize-none" />
                </div>
              </div>

              {/* Project Type & Company Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="block text-sm tracking-widest uppercase font-bold text-white mb-3">Project Type *</label>
                  <div className="flex gap-6 mt-2">
                    {['demo', 'active'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="projectType" value={type}
                          checked={formData.projectType === type} onChange={handleChange}
                          className="accent-primary w-4 h-4" />
                        <span className={`text-sm font-semibold capitalize tracking-wide transition-colors ${formData.projectType === type ? 'text-primary' : 'text-textSecondary group-hover:text-textPrimary'}`}>
                          {type === 'demo' ? 'Demo Project' : 'Active Project'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {formData.projectType === 'active' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    >
                      <label className="block text-sm tracking-widest capitalize font-bold text-white mb-1">Company Name</label>
                      <input name="companyName" value={formData.companyName} onChange={handleChange}
                        placeholder="Enter company name..."
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-textPrimary placeholder-textSecondary focus:ring-1 focus:ring-primary focus:outline-none" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Image Upload */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Image</h4>
                <input type="file" accept="image/*" onChange={handleImageUpload}
                  className="w-full px-3 py-1.5 bg-background border border-border rounded-md text-textSecondary focus:ring-1 focus:ring-primary focus:outline-none file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer text-xs" />
                {preview && (
                  <img src={preview} alt="preview" className="mt-3 w-full h-32 object-cover rounded border border-border" />
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="relative z-10 p-6 border-t border-border bg-background/80 backdrop-blur flex justify-end space-x-3">
            <button type="button" onClick={onClose}
              className="px-6 py-2 text-sm tracking-widest uppercase font-bold text-textSecondary hover:text-primary transition-colors">
              Cancel
            </button>
            <button type="submit" form="add-form" disabled={saving}
              className="flex items-center px-6 py-2 text-sm tracking-widest uppercase font-bold text-background bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-[0_0_15px_rgba(197,160,89,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? <><FiLoader className="mr-2 animate-spin" /> Saving...</> : <><FiPlus className="mr-2" /> Add Website</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddModal;
