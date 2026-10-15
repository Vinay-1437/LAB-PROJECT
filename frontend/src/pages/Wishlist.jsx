import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { wishlistService } from "../services/api";
import WishlistCard from "../components/WishlistCard";
import { Heart, ShoppingBag, RefreshCw, AlertCircle } from "lucide-react";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await wishlistService.getWishlist();
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      setError(err.message || "We couldn't load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      alert(err.message || "Failed to remove item from wishlist");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          Saved Items
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2.5">
          <Heart className="w-8 h-8 text-rose-500 fill-current" />
          My Wishlist
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved for later
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 h-36 animate-pulse"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50/70 border border-red-200/80 rounded-3xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="font-extrabold text-red-800 text-base">Unable to Load Wishlist</h3>
          <p className="text-xs text-red-600">{error}</p>
          <button
            onClick={fetchWishlist}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-2xl hover:bg-red-700 transition-colors shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-800">Your wishlist is empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Explore our collection and click the heart icon on any product to save it here for later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map((product) => (
            <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
