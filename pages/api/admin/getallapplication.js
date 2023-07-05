import connectDb from "@/config/database";
import { checkAuth } from "@/middlewares/isAuth";
import Seller from "@/models/seller";

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (user.role !== "admin") {
        return res.status(403).json({
          message: "UnAuthorized",
        });
      }

      const sellers = await Seller.find().sort("-createdAt");

      res.status(200).json({
        sellers,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(400).json(`${req.method} Method is not Allowed`);
  }
}

export default handler;
