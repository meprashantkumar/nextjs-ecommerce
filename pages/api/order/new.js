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

      const { items, method, phone, address, subTotal } = req.body;

      if (!items || !method || !phone || !address || !subTotal) {
        return res.status(400).json({
          message: "Please Enter All Details",
        });
      }

      const order = await Order.create({
        items,
        method,
        user: user._id,
        phone,
        address,
        subTotal,
      });

      await Cart.find({ user: user._id }).deleteMany();

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
