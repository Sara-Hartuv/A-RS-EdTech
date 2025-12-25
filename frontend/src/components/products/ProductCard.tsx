import type { Product } from "../../types/product";

interface Props {
  product: Product;
  onAdd?: (id: string) => void;
}

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col hover:shadow-lg transition">
      {product.imageUrl ? (
        <div className="h-40 bg-neutral-100">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-l from-primary-50 to-neutral-50 flex items-center justify-center text-neutral-400 text-sm">
          אין תמונה
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-neutral-800 text-sm">{product.name}</h3>
            {product.category && typeof product.category !== 'string' && product.category.name && (
              <div className="text-xs text-neutral-400">{product.category.name}</div>
            )}
          </div>

          <div className="text-xs rounded-full bg-primary-50 text-primary-700 px-2 py-1">
            {product.costInVouchers} שוברים
          </div>
        </div>

        {product.description && (
          <p className="text-xs text-neutral-500 line-clamp-2">{product.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2 text-xs">
          <span className={
            product.stock === 0 ? 'text-accent-600' : product.stock <= 3 ? 'text-accent-500' : 'text-primary-700'
          }>
            {product.stock === 0 ? 'אזל מהמלאי' : product.stock <= 3 ? `כמעט נגמר · נשארו ${product.stock}` : `במלאי: ${product.stock}`}
          </span>

          <button
            onClick={() => onAdd && onAdd(product._id)}
            disabled={product.stock === 0}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stock === 0 ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
          >
            הוספה לסל
          </button>
        </div>
      </div>
    </article>
  );
}
