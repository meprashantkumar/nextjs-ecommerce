import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

mongoose.models = {};

const Cart = mongoose.model("Cart", schema);

export default Cart;
