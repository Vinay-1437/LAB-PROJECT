import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "name, description, price, category, image, and stock are required"
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0"
      });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative"
      });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      image,
      stock: Number(stock)
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error creating product",
      error: error.message
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search && search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    if (category && category.trim() !== "" && category.toLowerCase() !== "all") {
      filter.category = { $regex: `^${category.trim()}$`, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
      error: error.message
    });
  }
};
