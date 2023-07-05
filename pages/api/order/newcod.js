import Mail from "@/middlewares/Email";
import Cart from "@/models/cart";
import Order from "@/models/order";
import Product from "@/models/product";

const { default: connectDb } = require("@/config/database");
const { checkAuth } = require("@/middlewares/isAuth");

async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (!user)
        return res.status(403).json({
          message: "Please Login First",
        });

      const { method, phone, address } = req.body;

      if (!method || !phone || !address) {
        return res.status(400).json({
          message: "Please Enter All Details",
        });
      }

      const cart = await Cart.find({ user: user._id }).populate("product");

      let subTotal = 0;

      cart.forEach((i) => {
        const itemSubtotal = i.product.price * i.quantity;

        subTotal += itemSubtotal;
      });

      const items = await Cart.find({ user: user._id })
        .select("-_id")
        .select("-user")
        .select("-__v");

      const order = await Order.create({
        items,
        method,
        user: user._id,
        phone,
        address,
        subTotal,
      });

      for (let i of order.items) {
        let product = await Product.findOne({ _id: i.product });

        product.$inc("stock", -1 * i.quantity);
        product.$inc("sold", +i.quantity);

        await product.save();
      }

      await Cart.find({ user: user._id }).deleteMany();

      await Mail(
        user.email,
        `Let's Negotiates`,
        `Thank for shopping of ₹ ${subTotal} from our Platform Your order will be deliverd soon ❤️❤️❤️`
      );

      res.status(201).json({
        message: "Order Created Successfully",
        order,
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
