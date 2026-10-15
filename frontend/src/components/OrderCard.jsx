import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const OrderCard = ({ order }) => {
  const getStatusBadge = (status, paymentStatus) => {
    if (paymentStatus === "PAID" || status === "PLACED" || status === "DELIVERED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {status} ({paymentStatus})
        </span>
      );
    }
    if (paymentStatus === "FAILED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-sm">
          <AlertCircle className="w-3.5 h-3.5" />
          FAILED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
        <Clock className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-6 sm:p-7 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Order ID</span>
          <p className="font-mono text-sm font-bold text-slate-800">{order._id}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>
        <div>{getStatusBadge(order.status, order.paymentStatus)}</div>
      </div>

      <div className="space-y-2.5">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm py-1">
            <div className="flex items-center gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-11 h-11 rounded-xl object-cover bg-slate-100"
                />
              )}
              <span className="text-slate-800 font-bold text-sm">
                {item.name} <span className="text-slate-400 font-normal">× {item.quantity}</span>
              </span>
            </div>
            <span className="font-bold text-slate-900">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Paid</span>
          <p className="text-xl font-black text-slate-900">
            ₹{order.totalAmount?.toLocaleString("en-IN")}
          </p>
        </div>
        <Link
          to={`/orders/${order._id}`}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 rounded-xl transition-colors shadow-sm shadow-indigo-100"
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
