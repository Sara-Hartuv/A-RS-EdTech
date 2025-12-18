// src/components/cart/CartSummary.tsx
import React, { useState } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
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
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleCheckout = async () => {
    if (!user?._id) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare order data according to backend expectations
      const orderData = {
        student: user._id,
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        status: 'draft', // Start as draft, can be changed to 'pendingApproval' if needed
      };

      // Create order via API
      const response = await api.post('/orders', orderData);

      if (response.status === 201) {
        // Success! Clear cart and show success message
        onCheckoutSuccess();
        
        // Optional: Navigate to orders page or show success modal
        alert('Order created successfully! Your order is now pending approval.');
        navigate('/student/orders'); // Adjust route as needed
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

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      {/* Items Count */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items</span>
          <span className="text-gray-900 font-medium">{totalItems}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">{totalPrice}</p>
              <p className="text-sm text-gray-500">vouchers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isLoading || totalItems === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShoppingBag size={20} />
            Checkout
          </>
        )}
      </button>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Your order will be sent for teacher approval
      </p>
    </div>
  );
};
