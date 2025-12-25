// src/components/cart/CartItem.tsx
import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem as CartItemType } from '../../store/CartStore';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }
    onUpdateQuantity(product._id, newQuantity);
  };

  const subtotal = product.costInVouchers * quantity;

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <span className="text-2xl">📦</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-neutral-900 truncate">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-medium text-primary-600">
            {product.costInVouchers} שוברים
          </span>
          <span className="text-xs text-neutral-400">•</span>
          <span className="text-xs text-neutral-500">
            {product.stock} במלאי
          </span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-neutral-50 rounded-lg p-1">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="p-1.5 rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} className="text-neutral-600" />
          </button>
          <span className="w-8 text-center text-sm font-medium text-neutral-900">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            className="p-1.5 rounded-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} className="text-neutral-600" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[80px]">
          <p className="text-sm font-semibold text-neutral-900">
            {subtotal}
          </p>
          <p className="text-xs text-neutral-500">שוברים</p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(product._id)}
          className="p-2 text-neutral-400 hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
