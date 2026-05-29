import React from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ShopOffersEditor from './ShopOffersEditor';

export default function ShopOffersEditorPage() {
  const { id } = useParams();
  return (
    <AdminLayout>
      <ShopOffersEditor shopId={id} />
    </AdminLayout>
  );
}
