import mongoose from "mongoose";

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    requied: true,
    unique: true,
  },

  phone: {
    type: Number,
    required: true,
    unique: true,
  },

  aadhar: {
    type: Number,
    required: true,
    unique: true,
  },

  pan: {
    type: String,
    required: true,
    unique: true,
  },

  gst: {
    type: String,
    required: true,
    unique: true,
  },

  accountNo: {
    type: Number,
    requied: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  verified: {
    type: Boolean,
    default: false,
  },
});

mongoose.models = {};

const Seller = mongoose.model("Seller", schema);

export default Seller;
