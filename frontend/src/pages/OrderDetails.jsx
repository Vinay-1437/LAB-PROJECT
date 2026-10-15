import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService } from "../services/api";
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  MapPin,
  CreditCard
} from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await orderService.getOrderById(id);
        setOrder(res.data.order);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-black text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500">{error || "Could not retrieve order details."}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-9 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Order Reference</span>
            <p className="font-mono text-base font-bold text-slate-800">{order._id}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Placed on {formattedDate}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
              {order.status}
            </span>
            <p className="text-xs text-slate-400 mt-1 font-medium">Payment: {order.paymentStatus}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
            Items in this Order
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-2xl object-cover bg-white"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      ₹{item.price?.toLocaleString("en-IN")} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-black text-slate-900 text-sm">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Delivery Address</span>
            </div>
            {order.shippingAddress && (
              <div className="text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                <p className="font-extrabold text-slate-900 text-sm">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </p>
                <p className="text-slate-400 pt-1">Phone: {order.shippingAddress.phone}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>Payment Breakdown</span>
            </div>
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
              {order.razorpayPaymentId && (
                <p className="text-[11px] font-mono text-slate-400 pt-1">
                  Razorpay Txn: {order.razorpayPaymentId}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
