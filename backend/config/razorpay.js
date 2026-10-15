import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_shopkartDemoId",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "shopkartDemoSecretKey12345"
});

export default razorpayInstance;
