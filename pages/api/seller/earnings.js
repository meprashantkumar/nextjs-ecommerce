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
      });

      let totalearnings = 0;

      let totalProductsold = 0;

      for (let i = 0; i < products.length; i++) {
        totalearnings += products[i].sold * products[i].price;
        totalProductsold += products[i].sold;
      }

      const earnings = 0.9 * totalearnings;

      res.json({
        earnings,
        totalearnings,
        totalProductsold,
        user: user.email,
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
