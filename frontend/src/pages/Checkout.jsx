import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/api";
import CheckoutForm from "../components/CheckoutForm";
import OrderSummary from "../components/OrderSummary";
import { AlertCircle } from "lucide-react";

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    const cleanPhone = formData.phone.toString().trim().replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = "Phone number must contain exactly 10 digits";
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    const cleanPincode = formData.pincode.toString().trim();
    if (!cleanPincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(cleanPincode)) {
      newErrors.pincode = "Pincode must contain exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const res = await orderService.createPaymentOrder(formData);
      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to initialize checkout");
      }

      const { shopKartOrderId, razorpayOrderId, amount, currency, key } = data;

      if (typeof window !== "undefined" && window.Razorpay && !razorpayOrderId.startsWith("order_sim_")) {
        const options = {
          key: key,
          amount: amount,
          currency: currency || "INR",
          name: "ShopKart Store",
          description: `Order #${shopKartOrderId.slice(-6)}`,
          order_id: razorpayOrderId,
          prefill: {
            name: formData.fullName,
            contact: formData.phone
          },
          theme: {
            color: "#4f46e5"
          },
          handler: async function (response) {
            try {
              const verifyRes = await orderService.verifyPayment({
                shopKartOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                clearCart();
                navigate(`/order-success/${shopKartOrderId}`);
              } else {
                setServerError(verifyRes.data.message || "Payment verification failed.");
              }
            } catch (vErr) {
              setServerError(vErr.message || "Verification failed on server.");
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on("payment.failed", function (response) {
          setServerError(
            response.error?.description || "Payment failed. Your cart has been kept safe."
          );
          setLoading(false);
        });
        razorpayInstance.open();
      } else {
        const simPaymentId = `pay_sim_${Date.now()}`;
        const verifyRes = await orderService.verifyPayment({
          shopKartOrderId,
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: simPaymentId,
          razorpay_signature: "simulated_test_signature"
        });

        if (verifyRes.data.success) {
          clearCart();
          navigate(`/order-success/${shopKartOrderId}`);
        } else {
          setServerError(verifyRes.data.message || "Simulated payment verification failed.");
        }
      }
    } catch (err) {
      setServerError(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200/80 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Secure Checkout
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
          Finalize Your Order
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Review your delivery information and complete payment to confirm your order.
        </p>
      </div>

      {serverError && (
        <div className="p-4 bg-red-50 text-red-700 text-xs font-semibold rounded-2xl border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Checkout Error</p>
            <p>{serverError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <CheckoutForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        </div>

        <div className="lg:col-span-1 sticky top-24">
          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
            buttonText="Pay & Confirm Order"
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
