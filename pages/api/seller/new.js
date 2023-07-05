const { default: connectDb } = require("@/config/database");
const { checkAuth } = require("@/middlewares/isAuth");
const { default: Product } = require("@/models/product");

async function handler(req, res) {
  const method = req.method;

  if (method === "POST") {
    try {
      await connectDb();

      const user = await checkAuth(req);

      if (user.role === "seller") {
        const { name, description, slug, price, stock, image, category } =
          req.body;

        if (
          !name ||
          !description ||
          !slug ||
          !price ||
          !stock ||
          !image ||
          !category
        ) {
          return res.status(400).json({
            message: "Please Enter All Details",
          });
        }

        const product = await Product.findOne({ slug });

        if (product)
          res.status(400).json({
            message: "slug already taken give unique slug",
          });

        await Product.create({
          name,
          description,
          slug,
          stock,
          price,
          image,
          category,
          seller: user._id,
        });

        res.status(201).json({
          message: "Product Created Successfully",
        });
      } else {
        res.status(403).json({
          message: "You are not authorized! for this api",
        });
      }
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
