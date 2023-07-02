import connectDb from "@/config/database";
import Mail from "@/middlewares/Email";
import User from "@/models/user";
import bcrypt from "bcrypt";

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        return res.status(400).json({
          message: "Please Enter All Details",
        });

      await connectDb();

      let user = await User.findOne({ email });

      if (user)
        return res.status(400).json({
          message: "User Already There",
        });

      const hashedPassword = await bcrypt.hash(password, 10);

      const otp = Math.floor(Math.random() * 1000000);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otp_expiry: new Date(Date.now() + 2 * 60 * 1000),
      });

      await Mail(
        email,
        "Let's Negotiates",
        `Please Verify Your Account using otp your Otp is ${otp}`
      );

      res.status(201).json({
        message:
          "Registerd!, Please check your email spam section to get otp and verify your account.",
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
