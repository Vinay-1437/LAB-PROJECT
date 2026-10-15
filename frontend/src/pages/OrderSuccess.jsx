import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "../services/api";
import { CheckCircle2, ShoppingBag, Package } from "lucide-react";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Failed to load order confirmation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-200">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-100">
          Payment Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Thank you for shopping with ShopKart. We've verified your payment and received your order.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 text-left space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Order ID</span>
            <p className="font-mono text-xs sm:text-sm font-bold text-slate-800">{id}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
            {order?.status || "PLACED"}
          </span>
        </div>

        {loading ? (
          <div className="py-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : order ? (
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({order.items?.length} items)</span>
              <span className="font-bold text-slate-900">
                ₹{order.totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Status</span>
              <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
            </div>
            {order.shippingAddress && (
              <div className="pt-3 border-t border-slate-100 text-slate-500 space-y-0.5">
                <span className="font-bold text-slate-700 block mb-1">Delivering to:</span>
                <p>{order.shippingAddress.fullName}</p>
                <p>
                  {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
        >
          <Package className="w-4 h-4" /> View My Orders
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
