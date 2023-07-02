import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    requied: true,
  },

  description: {
    type: String,
    requied: true,
  },

  slug: {
    type: String,
    requied: true,
    unique: true,
  },

  stock: {
    type: Number,
    requied: true,
  },

  price: {
    type: Number,
    requied: true,
  },

  image: {
    type: String,
    requied: true,
  },

  seller: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};

const Product = mongoose.model("Product", schema);

export default Product;
