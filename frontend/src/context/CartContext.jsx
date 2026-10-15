import React, { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.data?.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId) => {
    const res = await cartService.addToCart(productId);
    if (res.data?.cart) {
      setCart(res.data.cart);
    }
    return res.data;
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await cartService.updateQuantity(productId, quantity);
    if (res.data?.cart) {
      setCart(res.data.cart);
    }
    return res.data;
  };

  const removeFromCart = async (productId) => {
    const res = await cartService.removeFromCart(productId);
    if (res.data?.cart) {
      setCart(res.data.cart);
    }
    return res.data;
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        subtotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
