// src/pages/ProductsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { getAllProducts } from "../api/products.api";
import type { Product } from "../types/product";
import ProductCard from "../components/products/ProductCard";
import { useCartStore } from "../store/CartStore";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { addItem, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await getAllProducts();
        if (mounted) setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("לא הצלחנו לטעון את רשימת המוצרים");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const visible = products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    try {
      addItem(product, 1);
      setSuccessMessage(`${product.name} נוסף לסל בהצלחה!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "שגיאה בהוספת המוצר לסל");
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">חנות המוצרים</h1>
          <p className="text-sm text-slate-500">מבחר מוצרים לתלמידות — בחרי ותתחילי לשמור לרכישה.</p>
        </div>

        <button
          onClick={() => navigate("/cart")}
          className="relative bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
          aria-label="סל קניות"
        >
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <span className="text-lg">✓</span>
          {successMessage}
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חפשי לפי שם מוצר..."
          className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">מספר מוצרים: {products.length}</div>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center">
          <div className="text-slate-600">טוען מוצרים…</div>
        </div>
      ) : error ? (
        <div className="mt-6 flex justify-center">
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">{error}</div>
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-6 flex justify-center">
          <div className="bg-white rounded-xl shadow p-6 text-center text-slate-600">לא נמצאו מוצרים התואמים לחיפוש.</div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
