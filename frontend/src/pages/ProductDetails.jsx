import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService, wishlistService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  AlertCircle
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const fetchProductAndWishlist = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await productService.getProductById(id);
        setProduct(res.data.product);

        if (isAuthenticated) {
          try {
            const wishRes = await wishlistService.getWishlist();
            const exists = wishRes.data?.wishlist?.some((item) => item._id === id);
            setIsWishlisted(!!exists);
          } catch (e) {}
        }
      } catch (err) {
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndWishlist();
  }, [id, isAuthenticated]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setWishlistLoading(true);
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product._id);
        setIsWishlisted(false);
      } else {
        await wishlistService.addToWishlist(product._id);
        setIsWishlisted(true);
      }
    } catch (err) {
      alert(err.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setCartLoading(true);
      for (let i = 0; i < quantity; i++) {
        await addToCart(product._id);
      }
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    } catch (err) {
      alert(err.message || "Failed to add product to cart");
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">{error || "The requested product does not exist."}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`absolute top-4 right-4 p-3 rounded-2xl shadow-lg transition-all ${
              isWishlisted
                ? "bg-rose-50 text-rose-500 scale-105"
                : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current text-rose-500" : ""}`} />
          </button>
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 pt-1">
              <span className="text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-xl ${
                  isOutOfStock
                    ? "bg-rose-50 text-rose-600"
                    : product.stock < 10
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : `${product.stock} units in stock`}
              </span>
            </div>
          </div>

          <div className="border-t border-b border-slate-100 py-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Product Overview
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-800 bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || cartLoading}
                className={`flex-1 py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? "bg-slate-300 cursor-not-allowed"
                    : addedNotice
                    ? "bg-emerald-600 shadow-emerald-200"
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-200"
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 text-center border-t border-slate-100">
            <div className="p-2 space-y-1">
              <Truck className="w-5 h-5 text-indigo-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-700">Free Delivery</p>
              <p className="text-[10px] text-slate-400">On all orders</p>
            </div>
            <div className="p-2 space-y-1">
              <ShieldCheck className="w-5 h-5 text-indigo-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-700">100% Genuine</p>
              <p className="text-[10px] text-slate-400">Direct from brands</p>
            </div>
            <div className="p-2 space-y-1">
              <RotateCcw className="w-5 h-5 text-indigo-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-700">Easy Returns</p>
              <p className="text-[10px] text-slate-400">7-day policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
