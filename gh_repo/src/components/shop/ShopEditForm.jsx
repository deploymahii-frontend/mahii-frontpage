import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Store } from 'lucide-react';
import { shopAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ShopEditForm = ({ shop, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    description: shop?.description || '',
    contactNumber: shop?.contactNumber || '',
    timings: {
      open: shop?.timings?.open || '09:00',
      close: shop?.timings?.close || '22:00',
    },
    costForTwo: shop?.costForTwo || 300,
    pureVeg: shop?.pureVeg || false,
    homeDelivery: shop?.homeDelivery || true,
    takeaway: shop?.takeaway || true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('timings.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        timings: { ...formData.timings, [field]: value }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await shopAPI.updateShop(shop._id, formData);
      toast.success('Shop updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Shop Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Shop Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Opening Time</label>
              <input
                type="time"
                name="timings.open"
                value={formData.timings.open}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Closing Time</label>
              <input
                type="time"
                name="timings.close"
                value={formData.timings.close}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Cost for Two (₹)</label>
            <input
              type="number"
              name="costForTwo"
              value={formData.costForTwo}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="pureVeg"
                checked={formData.pureVeg}
                onChange={handleChange}
                className="rounded"
              />
              Pure Vegetarian
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="homeDelivery"
                checked={formData.homeDelivery}
                onChange={handleChange}
                className="rounded"
              />
              Home Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="takeaway"
                checked={formData.takeaway}
                onChange={handleChange}
                className="rounded"
              />
              Takeaway
            </label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#C2185B] text-white py-2 rounded-lg">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopEditForm;
