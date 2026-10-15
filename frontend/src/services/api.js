import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export const authService = {
  register: (data) => api.post("/customers/register", data),
  login: (data) => api.post("/customers/login", data),
  getMe: () => api.get("/customers/me"),
  logout: () => api.post("/customers/logout"),
  changePassword: (data) => api.patch("/customers/change-password", data)
};

export const productService = {
  getProducts: (params) => api.get("/products", { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post("/products", data)
};

export const wishlistService = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`)
};

export const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: (productId) => api.post(`/cart/${productId}`),
  updateQuantity: (productId, quantity) =>
    api.patch(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`)
};

export const orderService = {
  createPaymentOrder: (shippingAddress) =>
    api.post("/orders/create-payment-order", { shippingAddress }),
  verifyPayment: (paymentData) => api.post("/orders/verify-payment", paymentData),
  getOrders: () => api.get("/orders"),
  getOrderById: (id) => api.get(`/orders/${id}`)
};

export default api;
