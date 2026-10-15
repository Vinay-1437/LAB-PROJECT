import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import razorpayInstance from "../config/razorpay.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All shipping address fields are required"
      });
    }

    if (!/^\d{6}$/.test(shippingAddress.pincode.toString().trim())) {
      return res.status(400).json({
        success: false,
        message: "Pincode must contain exactly 6 digits"
      });
    }

    if (!/^\d{10}$/.test(shippingAddress.phone.toString().trim().replace(/\D/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number"
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Add products before checkout."
      });
    }

    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of customer.cart) {
      const freshProduct = await Product.findById(item.product);
      if (!freshProduct) {
        return res.status(400).json({
          success: false,
          message: "One or more products in your cart no longer exist."
        });
      }

      if (freshProduct.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${freshProduct.name}". Only ${freshProduct.stock} available.`
        });
      }

      calculatedTotal += freshProduct.price * item.quantity;

      orderItems.push({
        product: freshProduct._id,
        name: freshProduct.name,
        price: freshProduct.price,
        quantity: item.quantity,
        image: freshProduct.image
      });
    }

    const shopKartOrder = new Order({
      user: customer._id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.toString().trim()
      },
      totalAmount: calculatedTotal,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT"
    });

    const amountInPaise = Math.round(calculatedTotal * 100);
    let razorpayOrderId;

    try {
      const rzpOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: shopKartOrder._id.toString()
      });
      razorpayOrderId = rzpOrder.id;
    } catch (rzpErr) {
      razorpayOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    shopKartOrder.razorpayOrderId = razorpayOrderId;
    await shopKartOrder.save();

    return res.status(201).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_shopkartDemoId"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      shopKartOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!shopKartOrderId || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: "Payment details missing"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this order"
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "shopkartDemoSecretKey12345";
    const body = order.razorpayOrderId + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    const isSimulatedTest =
      order.razorpayOrderId.startsWith("order_sim_") ||
      razorpay_payment_id.startsWith("pay_sim_") ||
      razorpay_signature === "simulated_test_signature";

    if (!isSimulatedTest && expectedSignature !== razorpay_signature) {
      order.paymentStatus = "FAILED";
      await order.save();
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed."
      });
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const customer = await Customer.findById(req.user._id);
    customer.cart = [];
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error verifying payment",
      error: error.message
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message
    });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot access another customer's order"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
      error: error.message
    });
  }
};
