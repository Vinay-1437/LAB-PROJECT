import React, { useState, useEffect } from "react";
import { productService, wishlistService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal, RefreshCw, AlertCircle, ShoppingBag, Sparkles } from "lucide-react";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Books"];

const Products = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlistIds = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await wishlistService.getWishlist();
      if (res.data?.wishlist) {
        setWishlistIds(new Set(res.data.wishlist.map((item) => item._id)));
      }
    } catch (err) {}
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (searchTerm.trim() !== "") params.search = searchTerm.trim();
      if (selectedCategory !== "All") params.category = selectedCategory;

      const res = await productService.getProducts(params);
      setProducts(res.data.products || []);
    } catch (err) {
      setError(err.message || "Failed to load products. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistIds();
  }, [isAuthenticated]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory]);

  const handleWishlistToggle = (productId, isAdded) => {
    setWishlistIds((prev) => {
      const updated = new Set(prev);
      if (isAdded) updated.add(productId);
      else updated.delete(productId);
      return updated;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Curated Discovery
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Explore All Products
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Browse our full selection of premium gear, accessories, and home goods.
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 bg-white text-xs font-semibold shadow-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/70"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 animate-pulse"
            >
              <div className="aspect-square bg-slate-200/70 rounded-2xl"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-full"></div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50/70 border border-red-200/80 rounded-3xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="font-extrabold text-red-800 text-base">Unable to Load Products</h3>
          <p className="text-xs text-red-600 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-2xl hover:bg-red-700 transition-colors shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h3 className="text-xl font-black text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any items matching your filters or search query.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isWishlisted={wishlistIds.has(product._id)}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
