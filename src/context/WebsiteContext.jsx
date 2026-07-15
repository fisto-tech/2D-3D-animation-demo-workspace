import React, { createContext, useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../config/api';

export const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // ── Fetch all websites from DB ────────────────────────────────────────────
  const fetchWebsites = useCallback(async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_BASE}/get_animations.php`);
      const json = await res.json();
      if (json.success) {
        // If DB is totally empty, seed it from initial data
        if (json.data.length === 0) {
          await seedDatabase();
        } else {
          // Map DB columns to frontend expected properties
          let finalData = json.data.map(row => {
            const formatUrl = (path) => {
              if (!path) return path;
              if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/assets') || path.startsWith('/images')) {
                return path;
              }
              return `${API_BASE}/${path}`;
            };
            
            return {
              websiteId: row.id,
              websiteName: row.project_name,
              category: row.category,
              websiteUrl: row.project_link,
              projectType: row.animation_type,
              imageUrl: formatUrl(row.thumbnail_image),
              companyName: row.company_name,
              description: row.description,
              preview_video: formatUrl(row.preview_video)
            };
          });
          
          // In development mode, replace hashed Vite URLs from the DB 
          // with the original local module imports so images work on localhost
          if (import.meta.env.DEV) {
            try {
              const { initialWebsites } = await import('../data/websites.js');
              finalData = finalData.map(site => {
                if (site.imageUrl && site.imageUrl.includes('/assets/')) {
                  const original = initialWebsites.find(w => w.websiteName === site.websiteName);
                  if (original && original.imageUrl) {
                    return { ...site, imageUrl: original.imageUrl };
                  }
                }
                return site;
              });
            } catch (err) {
              console.error("Could not map dev images", err);
            }
          }
          
          setWebsites(finalData);
          setError(null);
        }
      } else {
        setError(json.message || 'Failed to load websites.');
      }
    } catch (e) {
      setError('Cannot connect to server. Check that your backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);



  useEffect(() => { fetchWebsites(); }, [fetchWebsites]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const addWebsite = async (data, videoFile, imageFile) => {
    const fd = new FormData();
    fd.append('project_name',   data.websiteName  || data.projectName || '');
    fd.append('category',       data.category     || '');
    fd.append('project_link',   data.websiteUrl   || data.projectLink || '');
    fd.append('description',    data.description  || '');
    fd.append('animation_type', data.projectType  || data.animationType || '2D');
    fd.append('company_name',   data.companyName  || '');
    
    if (videoFile) fd.append('preview_video', videoFile);
    if (imageFile) fd.append('thumbnail_image', imageFile);

    try {
      const res  = await fetch(`${API_BASE}/save_animation.php`, { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) await fetchWebsites();
      return json;
    } catch (e) {
      return { success: false, message: 'Network error.' };
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const editWebsite = async (data, videoFile, imageFile) => {
    const fd = new FormData();
    fd.append('id',             data.id || data.websiteId || '');
    fd.append('project_name',   data.websiteName  || data.projectName || '');
    fd.append('category',       data.category     || '');
    fd.append('project_link',   data.websiteUrl   || data.projectLink || '');
    fd.append('description',    data.description  || '');
    fd.append('animation_type', data.projectType  || data.animationType || '2D');
    fd.append('company_name',   data.companyName  || '');
    
    fd.append('existing_preview', data.preview_video || '');
    fd.append('existing_thumbnail', data.thumbnail_image || data.imagePath || data.imageUrl || '');
    
    if (videoFile) fd.append('preview_video', videoFile);
    if (imageFile) fd.append('thumbnail_image', imageFile);

    try {
      const res  = await fetch(`${API_BASE}/update_animation.php`, { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) await fetchWebsites();
      return json;
    } catch (e) {
      return { success: false, message: 'Network error.' };
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteWebsite = async (id) => {
    const fd = new FormData();
    fd.append('id', id);

    try {
      const res  = await fetch(`${API_BASE}/delete_animation.php`, { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) await fetchWebsites();
      return json;
    } catch (e) {
      return { success: false, message: 'Network error.' };
    }
  };

  return (
    <WebsiteContext.Provider value={{
      websites,
      loading,
      error,
      addWebsite,
      editWebsite,
      deleteWebsite,
      refreshWebsites: fetchWebsites,
    }}>
      {children}
    </WebsiteContext.Provider>
  );
};
