import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Check, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { wishlistService } from "../services/api";

const ProductCard = ({ product, isWishlisted = false, onWishlistToggle }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);
      if (wishlisted) {
        await wishlistService.removeFromWishlist(product._id);
        setWishlisted(false);
        if (onWishlistToggle) onWishlistToggle(product._id, false);
      } else {
        await wishlistService.addToWishlist(product._id);
        setWishlisted(true);
        if (onWishlistToggle) onWishlistToggle(product._id, true);
      }
    } catch (err) {
      alert(err.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);
      await addToCart(product._id);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    } catch (err) {
      alert(err.message || "Failed to add product to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80";
          }}
        />

        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-200 ${
            wishlisted
              ? "bg-rose-50 text-rose-500 scale-105 shadow-rose-200/50"
              : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
          } ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current text-rose-500" : ""}`} />
        </button>

        <span className="absolute bottom-3.5 left-3.5 px-3 py-1 text-[11px] font-bold rounded-xl bg-white/90 text-slate-700 shadow-sm backdrop-blur-md border border-white/50">
          {product.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow space-y-3">
        <div className="space-y-1">
          <Link
            to={`/products/${product._id}`}
            className="font-extrabold text-slate-800 hover:text-indigo-600 line-clamp-1 text-base transition-colors"
          >
            {product.name}
          </Link>
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 mt-auto">
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
              isOutOfStock
                ? "bg-rose-50 text-rose-600"
                : product.stock < 10
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {isOutOfStock ? "Sold Out" : `${product.stock} in stock`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/products/${product._id}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-2xl transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || cartLoading}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-2xl text-white transition-all shadow-sm ${
              isOutOfStock
                ? "bg-slate-300 cursor-not-allowed"
                : addedNotice
                ? "bg-emerald-600 shadow-emerald-200"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-200"
            }`}
          >
            {addedNotice ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
