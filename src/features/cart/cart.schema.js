import mongoose from "mongoose";
export const CartSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  productId: { typeof: mongoose.Schema.Types.ObjectId, ref: "products" },
  quantity: Number,
});
