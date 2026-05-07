import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, productAPI } from '../../services/api';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Search, Filter,
  Utensils, Coffee, IceCream, Store, Map, Tag, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';

const ShopMenu = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [shop, setShop] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'snacks',
    description: '',
    veg: true,
    isAvailable: true,
    isPopular: false,
    image: '',
  });

  const categories = [
    { value: 'breakfast', label: 'Breakfast', icon: Coffee },
    { value: 'lunch', label: 'Lunch', icon: Utensils },
    { value: 'dinner', label: 'Dinner', icon: Utensils },
    { value: 'snacks', label: 'Snacks', icon: Tag },
    { value: 'beverages', label: 'Beverages', icon: Coffee },
    { value: 'desserts', label: 'Desserts', icon: IceCream },
  ];

  useEffect(() => {
    fetchShopAndProducts();
  }, [user]);

  const fetchShopAndProducts = async () => {
    setLoading(true);
    try {
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      setShop(userShop);
      
      if (userShop) {
        const productsRes = await productAPI.getProductsByShop(userShop._id);
        setProducts(productsRes.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, formData);
        toast.success('Product updated');
      } else {
        await productAPI.createProduct({ ...formData, shopId: shop._id });
        toast.success('Product added');
      }
      fetchShopAndProducts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (product) => {
    if (confirm(`Delete "${product.name}" from menu?`)) {
      try {
        await productAPI.deleteProduct(product._id);
        toast.success('Product deleted');
        fetchShopAndProducts();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      await productAPI.updateProduct(product._id, { isAvailable: !product.isAvailable });
      toast.success(`Product ${product.isAvailable ? 'hidden' : 'visible'}`);
      fetchShopAndProducts();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'snacks',
      description: '',
      veg: true,
      isAvailable: true,
      isPopular: false,
      image: '',
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <ShopLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Manager</h1>
            <p className="text-gray-500">Add, edit, and manage your food items</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-medium hover:bg-[#e55a2b] transition"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === 'all' ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1 ${
              selectedCategory === cat.value ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
            }`}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm w-64 focus:outline-none focus:border-[#FF6B35]"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
          <Utensils size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No menu items</h3>
          <p className="text-gray-500">Click "Add Item" to create your first menu item</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.image || `https://placehold.co/400x200/f3f4f6/9ca3af?text=${product.name}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isPopular && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
                <button
                  onClick={() => handleToggleAvailability(product)}
                  className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white transition"
                >
                  {product.isAvailable ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                  </div>
                  <p className="text-lg font-bold text-[#FF6B35]">₹{product.price}</p>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  {product.veg ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Veg</span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Non-Veg</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {product.isAvailable ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingProduct(product); setFormData(product); setShowModal(true); }}
                    className="flex-1 py-1.5 border border-gray-200 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-gray-50 transition"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="flex-1 py-1.5 border border-red-200 text-red-500 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-red-50 transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingProduct ? 'Edit Item' : 'Add Menu Item'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g., Masala Dosa"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                      placeholder="99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] resize-none"
                    placeholder="Describe your dish..."
                  />
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.veg}
                      onChange={(e) => setFormData({ ...formData, veg: e.target.checked })}
                      className="rounded"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="rounded"
                    />
                    <span>Mark as Popular</span>
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-[#FF6B35] text-white py-2 rounded-lg">
                    {editingProduct ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ShopLayout>
  );
};

const X = ({ size, onClick, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} onClick={onClick}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default ShopMenu;