import mongoose from "mongoose";
export const ProductSchema = mongoose.Schema({
  //name, desc, category, price, imageurl, sizes,id
  name: String,
  desc: String,
  price: Number,
  imageurl: String,
  sizes: String,
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
});
