import Mail from "@/middlewares/Email";
import Cart from "@/models/cart";
import Order from "@/models/order";

const { default: connectDb } = require("@/config/database");
const { checkAuth } = require("@/middlewares/isAuth");
const { default: Product } = require("@/models/product");

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

      const { items, method, phone, address } = req.body;

      if (!items || !method || !phone || !address) {
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

      const order = await Order.create({
        items,
        method,
        user: user._id,
        phone,
        address,
        subTotal,
      });

      await Cart.find({ user: user._id }).deleteMany();

      await Mail(
        user.email,
        `Let's Negotiates - Thank You for Odering products of ₹ ${subTotal} Your Order Will be Delivered Soon ❤️❤️`
      );

      res.status(201).json({
        message: "Order Created Successfully",
        order,
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
