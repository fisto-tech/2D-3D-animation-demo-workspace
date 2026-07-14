import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMessageCircle, FiDownload, FiMail, FiCheckCircle } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdminBookingModal = ({ isOpen, onClose, website, onSave }) => {
  const [formData, setFormData] = useState({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (website) {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        ...website,
        bookingDate: website.bookingDate || today
      });
    }
  }, [website, isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'customerPhone') {
      const digitsOnly = value.replace(/\D/g, '');
      const truncated = digitsOnly.slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: truncated }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleWhatsApp = () => {
    const text = `*Invoice: ${formData.websiteName}*\n\n*ID:* ${formData.websiteId}\n*Category:* ${formData.category}\n*Total Price:* ${formData.price}\n*Advance Required:* ${formData.advanceAmount || '₹1,500'}\n*Status:* ${formData.status}\n\n*Customer Details:*\nName: ${formData.customerName || 'N/A'}\nCompany: ${formData.companyName || 'N/A'}\nEmail: ${formData.customerEmail || 'N/A'}\nPhone: ${formData.customerPhone || 'N/A'}\nDate: ${formData.bookingDate || 'N/A'}\nLocation: ${formData.location || 'N/A'}\n\nThank you for choosing Fist-O Web!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const actionWord = formData.status === 'Booked' ? 'booking' : 
                       formData.status === 'Reserved' ? 'reserving' : 
                       formData.status === 'Sold Out' ? 'purchasing' : 'choosing';
    const subject = `Thank you for ${actionWord} ${formData.websiteName}`;
    const body = `Dear ${formData.customerName || 'Customer'},\n\nThank you for ${actionWord} ${formData.websiteName}!\n\nBooking Details:\nWebsite: ${formData.websiteName}\nID: ${formData.websiteId}\nStatus: ${formData.status}\n\nPlease let us know if you have any questions.\n\nBest regards,\nFist-O Web`;
    window.location.href = `mailto:${formData.customerEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      try {
        const pdf = new jsPDF();
        pdf.setFontSize(22);
        pdf.text('Dummy Document', 20, 20);
        pdf.setFontSize(16);
        pdf.text(`Website ID: ${formData.websiteId}`, 20, 40);
        pdf.text(`Website Name: ${formData.websiteName}`, 20, 50);
        pdf.text(`Customer Name: ${formData.customerName || 'N/A'}`, 20, 60);
        pdf.text(`Company Name: ${formData.companyName || 'N/A'}`, 20, 70);
        pdf.text('This is a dummy PDF download, not a full invoice.', 20, 90);
        pdf.save(`Dummy_${formData.websiteId}.pdf`);
      } catch (error) {
        console.error('Error generating PDF', error);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        setIsGeneratingPDF(false);
      }
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed top-6 right-6 z-[200] bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold tracking-wider text-sm flex items-center border border-white/20"
        >
          <FiCheckCircle className="mr-2" size={18} />
          Details Saved Successfully!
        </motion.div>
      )}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="absolute inset-0 bg-mesh-pattern opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-center p-6 border-b border-border bg-background/50 backdrop-blur">
            <h3 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight">
              Manage Booking: <span className="font-mono text-primary font-normal text-xl">{website?.websiteId}</span>
            </h3>
            <button onClick={onClose} className="text-textSecondary hover:text-white transition-colors">
              <FiX size={28} />
            </button>
          </div>
          
          <div className="relative z-10 p-6 overflow-y-auto flex-1 custom-scrollbar">
            <form id="booking-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 p-4 bg-background border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(197,160,89,0.05)]">
                <label className="block text-sm tracking-widest capitalize font-bold text-white mb-2">Update Status</label>
                <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full px-4 py-3 bg-card border border-border rounded-lg text-white text-lg font-sans focus:ring-1 focus:ring-primary focus:outline-none transition-colors">
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved (No Advance)</option>
                  <option value="Booked">Booked (Advance Paid)</option>
                  <option value="Sold Out">Sold Out (Full Paid)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm tracking-widest capitalize font-bold text-white mb-2">Customer Name</label>
                <input required name="customerName" value={formData.customerName || ''} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white text-lg font-sans focus:ring-1 focus:ring-primary" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm tracking-widest capitalize font-bold text-white mb-2">Company Name</label>
                <input required name="companyName" value={formData.companyName || ''} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white text-lg font-sans focus:ring-1 focus:ring-primary" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm tracking-widest capitalize font-bold text-white mb-2">Email Address</label>
                <input required type="email" name="customerEmail" value={formData.customerEmail || ''} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white text-lg font-sans focus:ring-1 focus:ring-primary" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm tracking-widest capitalize font-bold text-white mb-2">Phone Number</label>
                <input required name="customerPhone" value={formData.customerPhone || ''} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white text-lg font-sans focus:ring-1 focus:ring-primary" placeholder="1234567890" />
              </div>
              <div>
                <label className="block text-sm tracking-widest capitalize font-bold text-white mb-2">Booking Date</label>
                <input type="date" name="bookingDate" value={formData.bookingDate || ''} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white text-lg font-sans focus:ring-1 focus:ring-primary" style={{colorScheme: 'dark'}} />
              </div>
              <div>
                <label className="block text-sm tracking-widest capitalize font-bold text-white mb-2">Location</label>
                <input name="location" value={formData.location || ''} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white text-lg font-sans focus:ring-1 focus:ring-primary" placeholder="City, Country" />
              </div>
              <div>
                <label className="block text-sm tracking-widest capitalize font-bold text-white mb-2">Received Amount</label>
                <input name="receivedAmount" value={formData.receivedAmount || ''} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white text-lg font-sans focus:ring-1 focus:ring-primary" placeholder="₹0" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm tracking-widest capitalize font-bold text-white mb-2">Remarks</label>
                <textarea name="remarks" value={formData.remarks || ''} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white text-lg font-sans focus:ring-1 focus:ring-primary" placeholder="Any special requests or notes..."></textarea>
              </div>
            </form>
          </div>
          
          <div className="relative z-10 p-6 border-t border-border bg-background/50 backdrop-blur flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Action Buttons */}
            <div className="flex space-x-2 w-full md:w-auto">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-[#25D366] text-black text-xs tracking-widest uppercase font-bold rounded hover:bg-[#1ebd5a] transition-colors"
                title="Send WhatsApp Template"
              >
                <FiMessageCircle className="mr-2" size={16} /> WhatsApp
              </button>
              <button
                type="button"
                onClick={handleEmail}
                className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-card border border-border text-textPrimary text-xs tracking-widest uppercase font-bold rounded hover:border-primary/50 transition-colors"
                title="Email Invoice"
              >
                <FiMail className="mr-2" size={16} /> Email
              </button>
              <button
                type="button"
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-card border border-border text-textPrimary text-xs tracking-widest uppercase font-bold rounded hover:border-primary/50 transition-colors disabled:opacity-50"
                title="Download PDF"
              >
                <FiDownload className="mr-2" size={16} /> {isGeneratingPDF ? 'Gen...' : 'PDF'}
              </button>
            </div>

            {/* Save Button */}
            <div className="flex space-x-3 w-full md:w-auto justify-end">
              <button type="button" onClick={onClose} className="px-6 py-2 text-xs tracking-widest uppercase font-bold text-textSecondary bg-transparent border border-border rounded-md hover:text-primary transition-colors">
                Cancel
              </button>
              <button type="submit" form="booking-form" className="px-8 py-2 text-xs tracking-widest uppercase font-bold text-background bg-primary rounded-md hover:bg-primary-dark transition-colors shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                Save Details
              </button>
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminBookingModal;
