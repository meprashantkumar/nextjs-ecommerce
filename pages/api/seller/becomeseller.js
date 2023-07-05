import connectDb from "@/config/database";
import Mail from "@/middlewares/Email";
import { checkAuth } from "@/middlewares/isAuth";
import Seller from "@/models/seller";

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, phone, aadhar, pan, gst, accountNo } = req.body;

      if (!name || !phone || !aadhar || !pan || !gst || !accountNo)
        return res.status(400).json({
          message: "Please Enter All Details",
        });

      await connectDb();

      const user = await checkAuth(req);

      if (user.role === "seller" || user.role === "admin") {
        return res.status.json({
          message: "You are already seller or admin",
        });
      }

      const isexists = await Seller.findOne({ email: user.email });

      if (isexists) {
        return res.status(400).json({
          message: "You Already Submitted your Application",
        });
      }

      const isnoexists = await Seller.findOne({ phone: phone });

      if (isnoexists) {
        return res.status(400).json({
          message: "Number already taken",
        });
      }

      const application = await Seller.create({
        email: user.email,
        phone,
        name,
        aadhar,
        pan,
        gst,
        accountNo,
      });

      await Mail(
        user.email,
        "Let's Negotiates",
        `Your seller application id ${application._id} is submitted, our team will verify your details and if everything will be fine then we will give you seller dashboard. Thank for your trust ❤️❤️❤️❤️❤️`
      );

      res.status(201).json({
        message: "Application Submitted Please check Your email",
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
