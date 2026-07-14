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
      const res  = await fetch(`${API_BASE}/get_websites.php`);
      const json = await res.json();
      if (json.success) {
        // If DB is totally empty, seed it from initial data
        if (json.data.length === 0) {
          await seedDatabase();
        } else {
          let finalData = json.data;
          
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

  const seedDatabase = async () => {
    try {
      const { initialWebsites } = await import('../data/websites.js');
      // Insert from last to first so they show up in correct order since we order by created_at DESC
      const reverseData = [...initialWebsites].reverse();
      
      for (const item of reverseData) {
        const fd = new FormData();
        fd.append('website_name', item.websiteName  || '');
        fd.append('category',     item.category     || '');
        fd.append('website_link', item.websiteUrl   || '');
        fd.append('description',  item.description  || '');
        fd.append('project_type', item.projectType  || 'demo');
        fd.append('company_name', item.companyName  || '');
        fd.append('image_path',   item.imageUrl     || ''); // Vite asset URL
        
        await fetch(`${API_BASE}/save_website.php`, { method: 'POST', body: fd });
      }
      
      // Fetch again to get the populated data
      const res2 = await fetch(`${API_BASE}/get_websites.php`);
      const json2 = await res2.json();
      if (json2.success) setWebsites(json2.data);
    } catch (err) {
      console.error('Error seeding DB:', err);
    }
  };

  useEffect(() => { fetchWebsites(); }, [fetchWebsites]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const addWebsite = async (data, imageFile) => {
    const fd = new FormData();
    fd.append('website_name', data.websiteName  || '');
    fd.append('category',     data.category     || '');
    fd.append('website_link', data.websiteUrl   || '');
    fd.append('description',  data.description  || '');
    fd.append('project_type', data.projectType  || 'demo');
    fd.append('company_name', data.companyName  || '');
    if (imageFile) fd.append('image', imageFile);

    try {
      const res  = await fetch(`${API_BASE}/save_website.php`, { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) await fetchWebsites();
      return json;
    } catch (e) {
      return { success: false, message: 'Network error.' };
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const editWebsite = async (data, imageFile) => {
    const fd = new FormData();
    fd.append('id',             data.websiteId   || '');
    fd.append('website_name',   data.websiteName || '');
    fd.append('category',       data.category    || '');
    fd.append('website_link',   data.websiteUrl  || '');
    fd.append('description',    data.description || '');
    fd.append('project_type',   data.projectType || 'demo');
    fd.append('company_name',   data.companyName || '');
    // Send the existing relative image path so the server keeps it if no new upload
    fd.append('existing_image', data.imagePath   || '');
    if (imageFile) fd.append('image', imageFile);

    try {
      const res  = await fetch(`${API_BASE}/update_website.php`, { method: 'POST', body: fd });
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
      const res  = await fetch(`${API_BASE}/delete_website.php`, { method: 'POST', body: fd });
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
