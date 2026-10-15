import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  Package,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles
} from "lucide-react";

const Navbar = () => {
  const { customer, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
      isActive
        ? "text-indigo-600 bg-indigo-50/80 shadow-sm shadow-indigo-100"
        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 bg-clip-text text-transparent">
                ShopKart
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-500 -mt-1 flex items-center gap-1">
                Store <Sparkles className="w-2.5 h-2.5" />
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-2xl border border-slate-200/50">
            {isAuthenticated && (
              <NavLink to="/home" className={navItemClass}>
                Dashboard
              </NavLink>
            )}
            <NavLink to="/products" className={navItemClass}>
              Catalog
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/wishlist" className={navItemClass}>
                  <Heart className="w-3.5 h-3.5" />
                  Wishlist
                </NavLink>
                <NavLink to="/orders" className={navItemClass}>
                  <Package className="w-3.5 h-3.5" />
                  Orders
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 rounded-2xl transition-all duration-200 group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-indigo-300 animate-in zoom-in-50 duration-200">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200/80">
                <div className="flex items-center gap-2.5 bg-slate-50/90 py-1.5 px-3 rounded-2xl border border-slate-200/60">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center text-xs shadow-sm shadow-indigo-200">
                    {customer?.fullName ? customer.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-bold text-slate-700 hidden sm:inline-block max-w-[110px] truncate">
                    {customer?.fullName?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  Join ShopKart
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
