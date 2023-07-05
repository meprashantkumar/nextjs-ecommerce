import Mail from "@/middlewares/Email";
import { checkAuth } from "@/middlewares/isAuth";
import Cart from "@/models/cart";
import Order from "@/models/order";
import Payment from "@/models/payment";
import Product from "@/models/product";
import * as crypto from "crypto";

const { default: connectDb } = require("@/config/database");

async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    await connectDb();
    try {
      const user = await checkAuth(req);
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        orderOptions,
      } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY)
        .update(body)
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        const payment = await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        });

        const order = await Order.create({
          ...orderOptions,
          paidAt: new Date(Date.now()),
          paymentInfo: payment._id,
        });

        for (let i of order.items) {
          let product = await Product.findOne({ _id: i.product });

          product.$inc("stock", -1 * i.quantity);
          product.$inc("sold", +i.quantity);

          await product.save();
        }

        await Cart.find({ user: user._id }).deleteMany();

        await Mail(
          user.email,
          `Let's Negotiates`,
          `Thank for shopping on Platform Your order will be deliverd soon ❤️❤️❤️`
        );

        res.status(201).json({
          success: true,
          message: `Order Placed Successfully. Payment ID: ${payment._id}`,
        });
      } else {
        return res.status(400).json({ message: "Payment Failed" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(404).json({
      message: `${method} method is not allowed`,
    });
  }
}

export default handler;
