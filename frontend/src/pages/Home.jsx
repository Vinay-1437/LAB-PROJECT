import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { authService } from "../services/api";
import {
  User,
  Mail,
  Phone,
  Shield,
  ShoppingBag,
  ShoppingCart,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

const Home = () => {
  const { customer } = useAuth();
  const { cartCount } = useCart();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({ success: "", error: "", loading: false });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus({ success: "", error: "", loading: true });

    try {
      await authService.changePassword({ oldPassword, newPassword });
      setPasswordStatus({
        success: "Password updated successfully!",
        error: "",
        loading: false
      });
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordStatus({ success: "", error: "", loading: false });
      }, 1500);
    } catch (err) {
      setPasswordStatus({
        success: "",
        error: err.message || "Failed to change password",
        loading: false
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-8 sm:p-12 text-white shadow-xl shadow-indigo-900/10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/10">
            <Sparkles className="w-3 h-3 text-indigo-300" />
            Customer Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Welcome back, {customer?.fullName}!
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed max-w-xl">
            Your ShopKart account is verified and ready. Explore the product catalog, check your saved items, or review past orders.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs uppercase tracking-wider shadow hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
            >
              Browse Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-sm border border-white/10 transition-colors flex items-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5" /> Change Password
            </button>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute right-40 -top-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-indigo-100">
              {customer?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">{customer?.fullName}</h2>
              <span className="text-xs text-slate-400 font-medium">Customer Profile</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="truncate text-xs font-semibold">{customer?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold">{customer?.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600">
                JWT HttpOnly Cookie Active
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/products"
          className="group bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Product Catalog
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Browse, filter by category, and search our latest inventory.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 mt-4 inline-flex items-center gap-1">
            Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/cart"
          className="group bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
              Shopping Cart ({cartCount})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              View your active bag, adjust quantities, and complete checkout.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-4 inline-flex items-center gap-1">
            View Bag ({cartCount} items) <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 sm:p-9 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {passwordStatus.error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordStatus.error}</span>
              </div>
            )}

            {passwordStatus.success && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{passwordStatus.success}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordStatus.loading}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200"
                >
                  {passwordStatus.loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
