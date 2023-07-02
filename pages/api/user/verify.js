import User from "@/models/user";

const { default: connectDb } = require("@/config/database");

async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    try {
      await connectDb();

      const otp = Number(req.body.otp);
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message: "No User with this email found!",
        });
      }

      if (user.otp !== otp || user.otp_expiry < Date.now()) {
        return res.status(400).json({
          success: false,
          message: "Invailid OTP or has been Expiredd",
        });
      }

      user.verified = true;
      user.otp = null;
      user.otp_expiry = null;

      await user.save();

      res.status(200).json({ message: "Account Verified now you can login" });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(400).json({
      message: `${method} is not allowed`,
    });
  }
}

export default handler;
