import React from "react";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";

const OrderSummary = ({
  cart,
  subtotal,
  onPlaceOrder,
  loading,
  buttonText = "Proceed to Payment"
}) => {
  const deliveryCharge = 0;
  const finalTotal = subtotal + deliveryCharge;

  return (
    <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Order Summary</h2>
        <p className="text-xs text-slate-500 mt-0.5">{cart.length} distinct item(s) in bag</p>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={item.product?._id} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-slate-800 truncate max-w-[160px] sm:max-w-[200px]">
                  {item.product?.name}
                </p>
                <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="font-bold text-slate-900 flex-shrink-0">
              ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2.5 pt-4 border-t border-slate-100 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-bold text-slate-800">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Delivery</span>
          <span className="text-emerald-600 font-bold">FREE</span>
        </div>
        <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
          <span>Total</span>
          <span>₹{finalTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={loading || cart.length === 0}
        className={`w-full py-3.5 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2 ${
          loading || cart.length === 0
            ? "bg-slate-300 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-200"
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Securing Order...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>{buttonText}</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-[11px] font-medium text-slate-400 pt-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Merchant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Encrypted Gateway</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
