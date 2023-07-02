import Cart from "@/models/cart";

const { default: connectDb } = require("@/config/database");
const { checkAuth } = require("@/middlewares/isAuth");

async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (!user)
        return res.status(403).json({
          message: "Please Login First",
        });

      const cart = await Cart.find({ user: user._id }).populate("product");

      let subtotal = 0;

      cart.forEach((i) => {
        const itemSubtotal = i.product.price * i.quantity;

        subtotal += itemSubtotal;
      });

      res.status(200).json({
        subtotal,
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
