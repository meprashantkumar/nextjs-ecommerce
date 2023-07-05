import connectDb from "@/config/database";
import Mail from "@/middlewares/Email";
import { checkAuth } from "@/middlewares/isAuth";
import Seller from "@/models/seller";
import User from "@/models/user";

async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (user.role !== "admin") {
        return res.status(403).json({
          message: "UnAuthorized",
        });
      }

      const { id } = req.body;

      const seller = await Seller.findById(id);

      if (!seller) {
        return res.status(400).json({
          message: "no application with this id",
        });
      }

      seller.verified = true;

      await seller.save();

      const suser = await User.findOne({ email: seller.email });

      suser.role = "seller";

      await suser.save();

      await Mail(
        suser.email,
        "Let's Negotiates",
        `Congratulation Mr. ${suser.name} Your application is selected your shop ${seller.name} is varified. you are seller now team Let's Negotiates ❤️`
      );

      res.status(200).json({
        message: "Application Varified",
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
