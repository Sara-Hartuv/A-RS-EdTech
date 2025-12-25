// src/components/cart/CartSummary.tsx
import React, { useState } from 'react';
import { ShoppingBag, Loader2, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';
import { useAuthStore } from '../../store/authStore';

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  items: Array<{
    product: { _id: string; costInVouchers: number };
    quantity: number;
  }>;
  onCheckoutSuccess: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalItems,
  totalPrice,
  items,
  onCheckoutSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleCheckout = () => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {

    if (!user?._id) {
    navigate('/login');
    return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        student: user._id,
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        status: 'newOrder',
      };

      const response = await api.post('/orders/', orderData);

      if (response.status === 201) {
        setShowConfirmModal(false);
        onCheckoutSuccess();
        alert('ההזמנה נוצרה בהצלחה! ההזמנה נשלחה למורה!.');
        navigate('/student/orders');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Failed to create order. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = () => {
    setShowConfirmModal(false);
    setError(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          סיכום הזמנה
        </h2>

        {/* Items Count */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Items</span>
            <span className="text-neutral-900 font-medium">{totalItems}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-end">
              <span className="text-base font-semibold text-neutral-900">סה"כ</span>
              <div className="text-right">
                <p className="text-xl font-bold text-neutral-900">{totalPrice}</p>
                <p className="text-sm text-neutral-500">שוברים</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-accent-50 border border-accent-200 rounded-lg">
            <p className="text-sm text-accent-600">{error}</p>
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading || totalItems === 0}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={20} />
          תשלום
        </button>

        {/* Info Text */}
        <p className="text-xs text-neutral-500 text-center mt-4">
          לאחר לחיצה על "תשלום", ההזמנה תשלח למורה,
          ניתן לקבל את ההזמנה בחדר ריכוז חברתי.
        </p>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={handleCancelOrder}
              className="absolute top-4 left-4 text-neutral-400 hover:text-neutral-600 transition-colors"
              disabled={isLoading}
            >
              <X size={24} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <AlertCircle size={32} className="text-yellow-600" />
              </div>
            </div>

            {/* Message */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              אישור קניה
            </h3>
            <p className="text-gray-600 text-center mb-6">
              אין החזרות והחלפות לאחר אישור הקניה.
              <br />
              האם את בטוחה שאת רוצה לאשר את הקניה?
            </p>

            {/* Error Message in Modal */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelOrder}
                disabled={isLoading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    מאשר...
                  </>
                ) : (
                  'אישור'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
