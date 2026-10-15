import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";

const WishlistCard = ({ product, onRemove }) => {
  const { addToCart } = useCart();
  const [moving, setMoving] = useState(false);

  const handleMoveToCart = async () => {
    try {
      setMoving(true);
      await addToCart(product._id);
      await onRemove(product._id);
    } catch (err) {
      alert(err.message || "Failed to move product to cart");
    } finally {
      setMoving(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all p-5 flex flex-col sm:flex-row items-center gap-5">
      <div className="w-full sm:w-36 h-36 flex-shrink-0 bg-slate-100 rounded-2xl overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow space-y-1.5 text-center sm:text-left w-full">
        <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-600">
          {product.category}
        </span>
        <h3 className="font-extrabold text-slate-900 text-lg hover:text-indigo-600 transition-colors">
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
          <span className="text-2xl font-black text-slate-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isOutOfStock ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </span>
        </div>
      </div>

      <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
        <button
          onClick={handleMoveToCart}
          disabled={isOutOfStock || moving}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
            isOutOfStock
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-100"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {moving ? "Moving..." : "Move to Cart"}
        </button>

        <Link
          to={`/products/${product._id}`}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Link>

        <button
          onClick={() => onRemove(product._id)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-xl transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
