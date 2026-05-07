import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, productAPI, orderAPI, subscriptionAPI, paymentAPI } from '../../services/api';
import { CheckCircle, XCircle, Loader, Play } from 'lucide-react';

const IntegrationTest = () => {
  const { user, login } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [running, setRunning] = useState(false);

  const tests = [
    { id: 'auth', name: 'Authentication API', action: testAuth },
    { id: 'shops', name: 'Shops API', action: testShops },
    { id: 'products', name: 'Products API', action: testProducts },
    { id: 'orders', name: 'Orders API', action: testOrders },
    { id: 'subscriptions', name: 'Subscriptions API', action: testSubscriptions },
    { id: 'payments', name: 'Payments API', action: testPayments },
  ];

  async function testAuth() {
    try {
      const response = await shopAPI.getNearbyShops({ lat: 18.5204, lng: 73.8567 });
      return { success: true, message: 'Auth working, shops fetched' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function testShops() {
    try {
      const response = await shopAPI.getNearbyShops({ lat: 18.5204, lng: 73.8567 });
      return { success: true, message: `Found ${response.data.count} shops` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function testProducts() {
    try {
      const response = await productAPI.searchProducts('dosa');
      return { success: true, message: `Found ${response.data.count} products` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function testOrders() {
    try {
      if (!user) return { success: false, message: 'Please login first' };
      const response = await orderAPI.getMyOrders();
      return { success: true, message: `Found ${response.data.count} orders` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function testSubscriptions() {
    try {
      if (!user) return { success: false, message: 'Please login first' };
      const response = await subscriptionAPI.getMySubscriptions();
      return { success: true, message: `Found ${response.data.count} subscriptions` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function testPayments() {
    try {
      if (!user) return { success: false, message: 'Please login first' };
      const response = await paymentAPI.getPaymentHistory();
      return { success: true, message: `Found ${response.data.count} payments` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const runAllTests = async () => {
    setRunning(true);
    const results = {};
    for (const test of tests) {
      const result = await test.action();
      results[test.id] = result;
      setTestResults({ ...results });
    }
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-2">Integration Test Panel</h1>
          <p className="text-gray-600 mb-6">Test all API integrations</p>

          <button
            onClick={runAllTests}
            disabled={running}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mb-8"
          >
            {running ? <Loader className="animate-spin" size={20} /> : <Play size={20} />}
            {running ? 'Running Tests...' : 'Run All Tests'}
          </button>

          <div className="space-y-3">
            {tests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span className="font-medium">{test.name}</span>
                {testResults[test.id] ? (
                  <div className="flex items-center gap-2">
                    {testResults[test.id].success ? (
                      <>
                        <CheckCircle className="text-green-500" size={18} />
                        <span className="text-green-600 text-sm">{testResults[test.id].message}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500" size={18} />
                        <span className="text-red-600 text-sm">{testResults[test.id].message}</span>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Not tested</span>
                )}
              </div>
            ))}
          </div>

          {user && (
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <p className="text-green-800 text-sm">✅ Logged in as: {user.name} ({user.role})</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationTest;