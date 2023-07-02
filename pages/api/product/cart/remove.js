import Cart from "@/models/cart";

const { default: connectDb } = require("@/config/database");
const { checkAuth } = require("@/middlewares/isAuth");

async function handler(req, res) {
  const method = req.method;

  if (method === "DELETE") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (!user)
        return res.status(403).json({
          message: "Please Login First",
        });

      const { id } = req.query;

      const cart = await Cart.findById(id);

      await cart.deleteOne();

      res.status(200).json({
        message: "Removed from Cart",
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
