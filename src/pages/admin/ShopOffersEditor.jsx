import React, { useEffect, useState } from 'react';
import { shopAPI } from '../../services/api';
import { resolveImageUrl } from '../../utils/media';
import toast from 'react-hot-toast';

export default function ShopOffersEditor({ shopId }) {
  const [shop, setShop] = useState(null);
  const [offers, setOffers] = useState([]);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDesc, setNewOfferDesc] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!shopId) return;
    fetchShop();
    // eslint-disable-next-line
  }, [shopId]);

  const fetchShop = async () => {
    try {
      const res = await shopAPI.getShopById(shopId);
      setShop(res.data.shop);
      setOffers(res.data.shop.offers || []);
    } catch (err) {
      toast.error('Failed to load shop');
    }
  };

  const addOffer = () => {
    if (!newOfferTitle) return toast.error('Enter title');
    const o = { title: newOfferTitle, description: newOfferDesc };
    setOffers(prev => [...prev, o]);
    setNewOfferTitle('');
    setNewOfferDesc('');
  };

  const removeOffer = (index) => {
    setOffers(prev => prev.filter((_, i) => i !== index));
  };

  const saveOffers = async () => {
    try {
      await shopAPI.updateShop(shopId, { offers });
      toast.success('Offers saved');
    } catch (err) {
      toast.error('Failed to save offers');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return toast.error('Select a file');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await shopAPI.uploadLocal(shopId, fd);
      toast.success('Uploaded: ' + res.data.url);
      // refresh shop
      fetchShop();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    }
  };

  const removeImage = async (url) => {
    if (!confirm('Remove this image from gallery?')) return;
    try {
      await shopAPI.deleteGalleryImage(shopId, url);
      toast.success('Image removed');
      fetchShop();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove image');
    }
  };

  if (!shopId) return <div className="p-4">Provide a `shopId` prop to edit offers and gallery.</div>;

  return (
    <div className="p-4 max-w-3xl">
      <h2 className="text-xl font-bold mb-3">Edit Offers & Gallery - {shop?.name || shopId}</h2>

      <section className="mb-6">
        <h3 className="font-semibold mb-2">Offers</h3>
        <div className="space-y-2">
          {offers.map((o, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
              <div>
                <div className="font-medium">{o.title}</div>
                <div className="text-sm text-gray-500">{o.description}</div>
              </div>
              <button className="text-red-500" onClick={() => removeOffer(idx)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input value={newOfferTitle} onChange={e => setNewOfferTitle(e.target.value)} placeholder="Title" className="p-2 border rounded" />
          <input value={newOfferDesc} onChange={e => setNewOfferDesc(e.target.value)} placeholder="Description" className="p-2 border rounded" />
          <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={addOffer}>Add</button>
        </div>

        <div className="mt-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={saveOffers}>Save Offers</button>
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Gallery</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {(shop?.gallery || []).map((g, i) => (
            <div key={i} className="relative">
              <img src={resolveImageUrl(g)} alt={`gallery-${i}`} className="w-full h-24 object-cover rounded" />
              <button onClick={() => removeImage(g)} className="absolute top-1 right-1 bg-white/80 rounded p-1 text-red-600">Remove</button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input type="file" onChange={handleFileChange} />
          <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={uploadFile}>Upload</button>
        </div>
      </section>
    </div>
  );
}
