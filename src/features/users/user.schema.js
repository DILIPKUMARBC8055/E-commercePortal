import mongoose from "mongoose";
export const UserSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  type: { type: String, enum: ["Customers", "Seller"] },
});
