import connectDb from "@/config/database";
import { checkAuth } from "@/middlewares/isAuth";
import Product from "@/models/product";

async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (!user) {
        return res.status(403).json({
          message: "Please Login",
        });
      }

      if (user.role !== "seller") {
        return res.status(403).json({
          message: "UnAuthorized",
        });
      }

      const products = await Product.find({
        seller: user._id,
      }).sort("-createdAt");

      res.json({
        products,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(404).json({
      message: `${method} method is not allowed`,
    });
  }
}

export default handler;
