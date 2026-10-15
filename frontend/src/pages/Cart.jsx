import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck
} from "lucide-react";

const Cart = () => {
  const { cart, loading, subtotal, cartCount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, currentQty, delta, maxStock) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (newQty > maxStock) {
      alert(`Cannot add more. Only ${maxStock} units available.`);
      return;
    }
    try {
      await updateQuantity(productId, newQty);
    } catch (err) {
      alert(err.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      alert(err.message || "Failed to remove item");
    }
  };

  if (loading && cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex justify-center items-center">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore our top products and start shopping!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <ShoppingBag className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200/80 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Shopping Bag
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
          Your Shopping Cart
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {cartCount} {cartCount === 1 ? "item" : "items"} currently in your bag
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const product = item.product;
            if (!product) return null;

            const itemTotal = (product.price || 0) * item.quantity;
            const isMaxStock = item.quantity >= product.stock;

            return (
              <div
                key={product._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 flex flex-col sm:flex-row items-center gap-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-slate-100 rounded-2xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow space-y-1 text-center sm:text-left w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {product.category}
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-base hover:text-indigo-600 transition-colors">
                    <Link to={`/products/${product._id}`}>{product.name}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Unit Price: ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Available Stock: {product.stock} units
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => handleQuantityChange(product._id, item.quantity, -1, product.stock)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product._id, item.quantity, 1, product.stock)}
                      disabled={isMaxStock}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="text-base font-black text-slate-900 block">
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemove(product._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-9 space-y-6 shadow-sm sticky top-24">
          <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">
            Cart Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({cartCount})</span>
              <span className="font-bold text-slate-900">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax</span>
              <span className="text-slate-400 font-medium">Included</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
              <span>Order Total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Standard delivery in 2-4 business days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secure checkout with Razorpay Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
