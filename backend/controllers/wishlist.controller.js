import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
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

    const isAlreadyWishlisted = customer.wishlist.some(
      (item) => item.toString() === productId
    );

    if (isAlreadyWishlisted) {
      return res.status(409).json({
        success: false,
        message: "Product is already in your wishlist"
      });
    }

    customer.wishlist.push(productId);
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
      error: error.message
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "wishlist",
      select: "name price category image stock description"
    });

    return res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      wishlist: customer.wishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const customer = await Customer.findById(req.user._id);

    const existsInWishlist = customer.wishlist.some(
      (item) => item.toString() === productId
    );

    if (!existsInWishlist) {
      return res.status(404).json({
        success: false,
        message: "Product not in wishlist"
      });
    }

    customer.wishlist = customer.wishlist.filter(
      (item) => item.toString() !== productId
    );

    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
      error: error.message
    });
  }
};
