import connectDb from "@/config/database";
import Product from "@/models/product";

async function handler(req, res) {
  const method = req.method;

  if (method === "GET") {
    try {
      await connectDb();

      const { slug } = req.query;

      const product = await Product.findOne({ slug });

      res.json({ product });
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
