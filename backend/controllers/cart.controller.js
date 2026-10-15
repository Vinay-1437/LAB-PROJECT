import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const customer = await Customer.findById(req.user._id);

    const existingCartItemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    let targetQuantity = 1;
    if (existingCartItemIndex > -1) {
      targetQuantity = customer.cart[existingCartItemIndex].quantity + 1;
    }

    if (targetQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} units available.`
      });
    }

    if (existingCartItemIndex > -1) {
      customer.cart[existingCartItemIndex].quantity = targetQuantity;
    } else {
      customer.cart.push({
        product: productId,
        quantity: 1
      });
    }

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price category image stock"
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: customer.cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add to cart",
      error: error.message
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price category image stock"
    });

    const validCart = customer.cart.filter((item) => item.product !== null);

    const subtotal = validCart.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );

    return res.status(200).json({
      success: true,
      cart: validCart,
      subtotal,
      itemCount: validCart.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const numQuantity = Number(quantity);
    if (!numQuantity || numQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (numQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Maximum available is ${product.stock}`
      });
    }

    const customer = await Customer.findById(req.user._id);
    const itemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart"
      });
    }

    customer.cart[itemIndex].quantity = numQuantity;
    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price category image stock"
    });

    return res.status(200).json({
      success: true,
      message: "Cart item updated",
      cart: customer.cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const customer = await Customer.findById(req.user._id);

    const initialLength = customer.cart.length;
    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );

    if (customer.cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price category image stock"
    });

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: customer.cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove from cart",
      error: error.message
    });
  }
};
