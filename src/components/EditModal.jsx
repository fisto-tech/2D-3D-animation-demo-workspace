import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiLoader } from 'react-icons/fi';
import { WebsiteContext } from '../context/WebsiteContext';

const CATEGORIES = [
  'Bakery', 'Bag', 'Beverage Product (Drinks)', 'Dairy Products', 'Food',
  'Food Container', 'Food Packaging', 'Home Appliance Products', 'Interiors',
  'Machinery', 'Restaurants', 'Tea and Coffee', 'Water Bottle',
];

const EditModal = ({ isOpen, onClose, website }) => {
  const { editWebsite } = useContext(WebsiteContext);

  const [formData, setFormData]   = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [catOpen, setCatOpen]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');
  const [videoSourceType, setVideoSourceType] = useState('gdrive'); // 'gdrive' or 'direct'
  const [videoFile, setVideoFile] = useState(null);
  const [replaceVideo, setReplaceVideo] = useState(false);

  useEffect(() => {
    if (website && isOpen) {
      let type = website.projectType;
      if (type === 'demo') type = '2D';
      if (type === 'active') type = '3D';

      setFormData({ ...website, projectType: type || '2D' });
      setCatSearch(website.category || '');
      setPreview(website.imageUrl || '');
      setImageFile(null);
      setSaveError('');
      
      // Check if they uploaded a direct video or are using a gdrive link
      // A typical gdrive link has drive.google.com in it
      const hasDriveLink = website.websiteUrl && website.websiteUrl.includes('drive.google.com');
      const hasDirectVideo = !!website.preview_video;

      if (hasDirectVideo) {
        // If there's a direct video uploaded, prioritize it just like WebsiteCard does
        setVideoSourceType('direct');
      } else if (hasDriveLink) {
        setVideoSourceType('gdrive');
      } else {
        setVideoSourceType('gdrive');
      }

      setVideoFile(null);
      setReplaceVideo(false);
    }
  }, [website, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
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
    
    let submitData = { ...formData };
    if (videoSourceType === 'direct') {
      submitData.websiteUrl = ' '; // send space to force backend to overwrite
    } else {
      submitData.preview_video = ' '; // send space to force backend to overwrite
    }
    
    const result = await editWebsite(submitData, videoFile, imageFile);
    setSaving(false);
    if (result.success) {
      onClose();
    } else {
      setSaveError(result.message || 'Failed to update. Please try again.');
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
          className="relative bg-white border border-gray-200 rounded-xl shadow-2xl w-[90%] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="absolute inset-0 bg-mesh-pattern opacity-10 pointer-events-none"></div>

          {/* Header */}
          <div className="relative z-10 flex justify-between items-center p-6 border-b border-border bg-white/90 backdrop-blur">
            <h3 className="text-xl font-serif font-bold text-gray-900 tracking-tight">
              Edit: <span className="text-primary font-mono font-normal">{website?.websiteName}</span>
            </h3>
            <button onClick={onClose} className="text-textSecondary hover:text-danger transition-colors"><FiX size={24} /></button>
          </div>

          {/* Body */}
          <div className="relative z-10 p-6 overflow-y-auto flex-1 custom-scrollbar">
            {saveError && (
              <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/30 rounded-md text-danger text-sm">{saveError}</div>
            )}
            <form id="edit-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Project Name */}
                <div>
                  <label className="block text-sm tracking-widest capitalize font-bold text-gray-900 mb-1">Project Name</label>
                  <input name="websiteName" value={formData.websiteName || ''} onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none"
                    required />
                </div>

                {/* Category */}
                <div className="relative">
                  <label className="block text-sm tracking-widest capitalize font-bold text-gray-900 mb-1">Category</label>
                  <input type="text" value={catSearch}
                    onChange={e => { 
                      setCatSearch(e.target.value); 
                      setFormData(prev => ({ ...prev, category: e.target.value }));
                      setCatOpen(true); 
                    }}
                    onFocus={() => setCatOpen(true)}
                    onBlur={() => setTimeout(() => setCatOpen(false), 150)}
                    placeholder="Search or select category..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none" />
                  {catOpen && filteredCats.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-md shadow-xl max-h-48 overflow-y-auto">
                      {filteredCats.map(cat => (
                        <button key={cat} type="button" onMouseDown={() => selectCategory(cat)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-primary/10 hover:text-primary transition-colors">
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Upload Section */}
                <div className="md:col-span-2 border border-border rounded-md p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm tracking-widest capitalize font-bold text-gray-900">Video Source</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-900">
                        <input type="radio" name="videoSource" value="gdrive" 
                          checked={videoSourceType === 'gdrive'} 
                          onChange={() => setVideoSourceType('gdrive')} 
                          className="accent-primary" />
                        <span className={videoSourceType === 'gdrive' ? 'font-bold' : ''}>Google Drive Link</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-900">
                        <input type="radio" name="videoSource" value="direct" 
                          checked={videoSourceType === 'direct'} 
                          onChange={() => setVideoSourceType('direct')} 
                          className="accent-primary" />
                        <span className={videoSourceType === 'direct' ? 'font-bold' : ''}>Upload Video</span>
                      </label>
                    </div>
                  </div>

                  {videoSourceType === 'gdrive' ? (
                    <input name="websiteUrl" value={formData.websiteUrl || ''} onChange={handleChange}
                      placeholder="https://drive.google.com/file/d/.../view"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-textSecondary focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  ) : (
                    <div>
                      {website?.preview_video && !replaceVideo ? (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            disabled 
                            value={website.preview_video.split('?')[0].split('/').pop()} 
                            className="w-full px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md text-gray-500 text-xs cursor-not-allowed font-medium" 
                            title={website.preview_video.split('?')[0].split('/').pop()}
                          />
                          <button 
                            type="button" 
                            onClick={() => setReplaceVideo(true)} 
                            className="shrink-0 px-4 py-1.5 bg-primary/10 text-primary rounded text-xs font-bold hover:bg-primary/20 transition-colors"
                          >
                            Change File
                          </button>
                        </div>
                      ) : (
                        videoFile ? (
                          <div className="flex gap-2 w-full">
                            <div className="flex-1 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-md flex items-center justify-between min-w-0">
                              <span className="text-primary text-xs font-bold truncate pr-2" title={videoFile.name}>
                                {videoFile.name}
                              </span>
                              <button type="button" onClick={() => setVideoFile(null)} className="text-primary hover:text-danger transition-colors shrink-0">
                                <FiX size={16} />
                              </button>
                            </div>
                            {website?.preview_video && (
                              <button 
                                type="button" 
                                onClick={() => { setReplaceVideo(false); setVideoFile(null); }} 
                                className="shrink-0 px-3 py-1.5 text-gray-500 hover:text-gray-700 text-xs font-medium"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2 w-full">
                            <input type="file" accept="video/mp4,video/webm,video/ogg" 
                              onChange={(e) => setVideoFile(e.target.files[0])}
                              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-textSecondary focus:ring-1 focus:ring-primary focus:outline-none file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer text-xs" 
                            />
                            {website?.preview_video && (
                              <button 
                                type="button" 
                                onClick={() => { setReplaceVideo(false); setVideoFile(null); }} 
                                className="shrink-0 px-3 py-1.5 text-gray-500 hover:text-gray-700 text-xs font-medium"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm tracking-widest capitalize font-bold text-gray-900 mb-1">Description</label>
                  <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3}
                    placeholder="Short 1–2 line description shown on the card..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:ring-1 focus:ring-primary focus:outline-none resize-none" />
                </div>
              </div>

              {/* Project Type & Company Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="block text-sm tracking-widest uppercase font-bold text-gray-900 mb-3">Animation Type</label>
                  <div className="flex gap-6 mt-2">
                    {['2D', '3D'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="projectType" value={type}
                          checked={formData.projectType === type} onChange={handleChange}
                          className="accent-primary w-4 h-4" />
                        <span className={`text-sm font-semibold capitalize tracking-wide transition-colors ${formData.projectType === type ? 'text-primary' : 'text-textSecondary group-hover:text-gray-900'}`}>
                          {type} Animation
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                    <div className="w-full">
                      <label className="block text-sm tracking-widest capitalize font-bold text-gray-900 mb-1">Company Name</label>
                      <input name="companyName" value={formData.companyName || ''} onChange={handleChange}
                        placeholder="Enter company name..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-textSecondary focus:ring-1 focus:ring-primary focus:outline-none" />
                    </div>
              </div>

              {/* Image Upload */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-primary text-xs font-bold tracking-widest uppercase mb-3">Image</h4>
                <input type="file" accept="image/*" onChange={handleImageUpload}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md text-textSecondary focus:ring-1 focus:ring-primary focus:outline-none file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer text-xs" />
                {preview && (
                  <img src={preview} alt="preview" className="mt-3 w-full h-32 object-cover rounded border border-border" />
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="relative z-10 p-6 border-t border-border bg-white/90 backdrop-blur flex justify-end space-x-3">
            <button type="button" onClick={onClose}
              className="px-6 py-2 text-sm tracking-widest uppercase font-bold text-textSecondary hover:text-primary transition-colors">
              Cancel
            </button>
            <button type="submit" form="edit-form" disabled={saving}
              className="flex items-center px-6 py-2 text-sm tracking-widest uppercase font-bold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-[0_0_15px_rgba(219,84,0,0.4)] disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? <><FiLoader className="mr-2 animate-spin" /> Saving...</> : <><FiSave className="mr-2" /> Save Details</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditModal;
