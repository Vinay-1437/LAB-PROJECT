import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../services/api";
import OrderCard from "../components/OrderCard";
import { Package, ShoppingBag, RefreshCw, AlertCircle } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await orderService.getOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Purchase History
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2.5">
          <Package className="w-8 h-8 text-indigo-600" />
          My Orders
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Track and review your past purchases and shipments
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 h-40 animate-pulse"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50/70 border border-red-200/80 rounded-3xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="font-extrabold text-red-800 text-base">Unable to Load Orders</h3>
          <p className="text-xs text-red-600">{error}</p>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-2xl hover:bg-red-700 transition-colors shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h2 className="text-xl font-black text-slate-800">No orders yet</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You haven't placed any orders yet. Browse through our products and grab something you love!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
          >
            <ShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
