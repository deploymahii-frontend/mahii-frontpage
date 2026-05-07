import React from 'react';

const MenuManager = ({ shopId }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Menu Manager</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Add, edit, and manage your menu items</p>
          <p className="text-sm">Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
