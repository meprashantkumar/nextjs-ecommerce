import Cart from "@/models/cart";

const { default: connectDb } = require("@/config/database");
const { checkAuth } = require("@/middlewares/isAuth");

async function handler(req, res) {
  const method = req.method;

  if (method === "PUT") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (!user)
        return res.status(403).json({
          message: "Please Login First",
        });

      const { id } = req.body;

      const cart = await Cart.findById(id);

      if (cart.quantity > 1) {
        await cart.quantity--;
        await cart.save();
      } else {
        return res.status(400).json({
          message: "You Have only One quantity",
        });
      }

      res.status(200).json({
        message: "Cart Updated",
        quantity: cart.quantity,
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
