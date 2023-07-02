import Cart from "@/models/cart";
import Product from "@/models/product";

const { default: connectDb } = require("@/config/database");
const { checkAuth } = require("@/middlewares/isAuth");

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

      const { product } = req.body;

      const cart = await Cart.findOne({ product });

      if (cart)
        return res.status(400).json({
          message: "Item already in cart",
        });

      const cartProd = await Product.findById(product);

      await Cart.create({
        quantity: 1,
        product: cartProd._id,
        user: user._id,
      });

      res.status(200).json({
        message: "Added To Cart",
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
