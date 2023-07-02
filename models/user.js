import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    requied: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    requied: true,
  },

  role: {
    type: String,
    enum: ["admin", "seller", "user"],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  verified: {
    type: Boolean,
    default: false,
  },

  otp: Number,
  otp_expiry: Date,
});

schema.index(
  { otp_expiry: 1 },
  {
    expireAfterSeconds: 0,
  }
);

mongoose.models = {};

const User = mongoose.model("User", schema);

export default User;
