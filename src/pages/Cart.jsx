import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderAPI, paymentAPI } from '../services/api';
import { loadRazorpayScript } from '../utils/razorpay';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!deliveryAddress && user?.address) {
      const addressString =
        typeof user.address === 'string'
          ? user.address
          : user.address.address || user.address.street || `${user.address.area || ''} ${user.address.city || ''}`.trim();
      setDeliveryAddress(addressString || deliveryAddress);
    }
  }, [user, deliveryAddress]);

  const shopIds = Array.from(new Set(cartItems.map(item => item.shopId).filter(Boolean)));
  const orderShopId = shopIds.length === 1 ? shopIds[0] : null;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to continue to checkout.');
      navigate('/login/customer');
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Please enter a delivery address before checkout.');
      return;
    }

    if (!orderShopId) {
      toast.error('Cart items must belong to a single shop before checkout.');
      return;
    }

    if (shopIds.length > 1) {
      toast.error('Please checkout one shop at a time.');
      return;
    }

    setCheckoutLoading(true);

    try {
      await loadRazorpayScript();

      const orderResponse = await orderAPI.createOrder({
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          customization: item.customization || [],
        })),
        shopId: orderShopId,
        deliveryAddress: deliveryAddress.trim(),
        specialInstructions: specialInstructions.trim(),
      });

      const orderId = orderResponse.data.order?._id || orderResponse.data.order?.id;
      if (!orderId) {
        throw new Error('Unable to create order. Please try again.');
      }

      const paymentResponse = await paymentAPI.createOrderPayment(orderId);

      const options = {
        key: paymentResponse.data.razorpayKey,
        order_id: paymentResponse.data.razorpayOrderId,
        handler: async (payment) => {
          try {
            await paymentAPI.verifyPayment({
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_signature: payment.razorpay_signature,
              orderId,
            });
            clearCart();
            toast.success('Order placed successfully!');
            navigate('/my-orders');
          } catch (verifyError) {
            console.error(verifyError);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#f97316' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom mx-auto px-4">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Cart</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review your selections before placing the order.
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200"
            >
              <FiTrash2 /> Clear cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 p-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-500/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-300">
              <FiShoppingCart size={28} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your cart is empty</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Add items from the Explore page or your favorite shop to start building your order.
            </p>
            <Link
              to="/explore"
              className="mt-6 inline-flex rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Browse restaurants
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.productId} className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || 'https://via.placeholder.com/120'}
                        alt={item.name}
                        className="h-24 w-24 rounded-3xl object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 md:items-end md:text-right">
                      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-700 dark:bg-gray-900">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <FiMinus />
                        </button>
                        <span className="min-w-[36px] text-center text-sm font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        Remove
                      </button>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order summary</h2>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2 mb-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Items</span>
                  <span className="font-semibold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                  <span>Estimated total</span>
                  <span className="text-primary-600">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {shopIds.length > 1 && (
                <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-xs font-medium text-red-700 dark:text-red-300">
                    ⚠️ Multiple shops detected. Checkout one shop at a time.
                  </p>
                </div>
              )}

              {!orderShopId && cartItems.length > 0 && (
                <div className="mb-4 p-3 rounded-2xl bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                  <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    ⚠️ Some items are missing shop details. Please remove them.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Delivery address *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    rows={2}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="Street, area, city, pincode"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Special instructions (optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={2}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="Allergies, preferences, delivery notes..."
                  />
                </div>

                {!deliveryAddress.trim() && (
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      ℹ️ Enter delivery address to enable checkout
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cartItems.length === 0 || shopIds.length !== 1 || !deliveryAddress.trim()}
                  className={`w-full rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition ${
                    checkoutLoading || cartItems.length === 0 || shopIds.length !== 1 || !deliveryAddress.trim()
                      ? 'bg-primary-600 opacity-60 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
                  }`}
                >
                  {checkoutLoading ? 'Processing...' : 'Checkout securely'}
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
