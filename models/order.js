import mongoose from "mongoose";

const schema = new mongoose.Schema({
  items: [
    {
      quantity: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],

  method: {
    type: String,
    required: true,
  },

  paymentInfo: {
    type: mongoose.Schema.ObjectId,
    ref: "Payment",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  phone: {
    type: Number,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
  },

  subTotal: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};

const Order = mongoose.model("Order", schema);

export default Order;
