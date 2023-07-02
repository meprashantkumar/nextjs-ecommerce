import Cart from "@/models/cart";
import Razorpay from "razorpay";

const { default: connectDb } = require("@/config/database");
const { checkAuth } = require("@/middlewares/isAuth");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_KEY,
});

async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (!user)
        return res.status(403).json({
          message: "Please Login First",
        });

      const { method, phone, address } = req.body;

      if (!method || !phone || !address) {
        return res.status(400).json({
          message: "Please Enter All Details",
        });
      }

      const cart = await Cart.find({ user: user._id }).populate("product");

      let subTotal = 0;

      cart.forEach((i) => {
        const itemSubtotal = i.product.price * i.quantity;

        subTotal += itemSubtotal;
      });

      const items = await Cart.find({ user: user._id })
        .select("-_id")
        .select("-user")
        .select("-__v");

      const orderOptions = {
        items,
        method,
        user: user._id,
        phone,
        address,
        subTotal,
      };

      const options = {
        amount: Number(subTotal) * 100,
        currency: "INR",
      };

      const order = await instance.orders.create(options);

      res.status(201).json({
        success: true,
        order,
        orderOptions,
      });
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
