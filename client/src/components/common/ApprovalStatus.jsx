import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ApprovalStatus = ({ shop }) => {
  if (!shop) return null;

  if (shop.isActive && shop.isApproved) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle size={24} className="text-green-500" />
          <div>
            <h3 className="font-semibold text-green-700">✅ Shop is LIVE!</h3>
            <p className="text-sm text-green-600">
              Your shop is visible to customers on the explore page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (shop.isRejected) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <XCircle size={24} className="text-red-500" />
          <div>
            <h3 className="font-semibold text-red-700">Shop Rejected</h3>
            <p className="text-sm text-red-600">
              Reason: {shop.rejectionReason || 'Please contact support'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3">
        <Clock size={24} className="text-yellow-500" />
        <div>
          <h3 className="font-semibold text-yellow-700">⏳ Pending Admin Approval</h3>
          <p className="text-sm text-yellow-600">
            Your shop is registered but NOT visible to customers yet.
            Admin will review and approve within 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalStatus;