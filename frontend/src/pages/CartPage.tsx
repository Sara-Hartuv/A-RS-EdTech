// src/pages/Cart.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } =
    useCartStore();

  const handleCheckoutSuccess = () => {
    clearCart();
  };

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              העגלה שלך ריקה
            </h2>
            <p className="text-gray-500 mb-8">
              התחלי להוסיף מוצרים לעגלה שלך כדי  לקנות !
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              התחלי לקנות
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cart with Items
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">עגלה קניות</h1>
          <p className="text-gray-500">
            סקור את הפריטים שלך והמשך לתשלום
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to clear your cart?'
                    )
                  ) {
                    clearCart();
                  }
                }}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                נקה עגלה
              </button>
            </div>
          </div>

          {/* Summary - Takes 1/3 on desktop */}
          <div className="lg:col-span-1">
            <CartSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              items={items}
              onCheckoutSuccess={handleCheckoutSuccess}
            />
          </div>
        </div>

        {/* Continue Shopping Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowRight size={18} className="rotate-180" />
            המשך בקניה
          </button>
        </div>
      </div>
    </div>
  );
};
