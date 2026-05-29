import React from 'react';
import { Edit } from 'lucide-react';

const PendingEditStatus = ({ shop }) => {
  if (!shop || shop.isActive) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3">
        <Edit size={24} className="text-blue-500" />
        <div>
          <h3 className="font-semibold text-blue-700">Shop Under Review</h3>
          <p className="text-sm text-blue-600">
            Your shop details are being reviewed. You can still edit, but changes will be visible after approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingEditStatus;
