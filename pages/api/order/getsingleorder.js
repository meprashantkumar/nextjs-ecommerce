import connectDb from "@/config/database";
import { checkAuth } from "@/middlewares/isAuth";
import Order from "@/models/order";

async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (!user)
        return res.status(403).json({
          message: "Please Login",
        });

      const { id } = req.query;

      const order = await Order.findById(id).populate("items.product");

      if (order.user.toString() !== user._id.toString()) {
        return res.status(403).json({
          message: "Unauthorized",
        });
      }

      res.json({ order });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: `${method} is not allowed!`,
    });
  }
}

export default handler;
