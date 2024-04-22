import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import { CategorySchema } from "../features/product/category.schema.js";
dotenv.config();
const url = process.env.DB_URL;

export const connectToMongoWithMongoose = async () => {
  try {
    await mongoose.connect(url);
    // {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   }
    console.log("Connected to mongodb with mongoose");
    creteCategories();
  } catch (err) {
    console.log(err);
  }
};

async function creteCategories() {
  const CategoryModel = mongoose.model("category", CategorySchema);
  const category = await CategoryModel.find();
  if (!category || category.length == 0) {
    await CategoryModel.insertMany([
      { name: "Electronics" },
      { name: "Books" },
      { name: "Toys" },
    ]);
  }
  console.log("categories created successfully");
}
