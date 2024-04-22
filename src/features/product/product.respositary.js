import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import userRoute from "../users/user.router.js";
import { reviewSchema } from "./review.schema.js";
import mongoose from "mongoose";
import { ProductSchema } from "./product.schema.js";
import { CategorySchema } from "./category.schema.js";

const ReviewModel = mongoose.model("review", reviewSchema);
const ProductModel = mongoose.model("products", ProductSchema);
const CategoryModel = mongoose.model("category", CategorySchema);
export default class ProductRepositary {
  constructor() {
    this.collections = "products";
  }
  async getAllProduct() {
    try {
      const db = getDb();
      const collection = db.collection(this.collections);
      return await collection
        .find()
        .project({ name: 1, price: 1, rating: { $slice: 1 } })
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }
  async addProduct(productData) {
    try {
      //product added
      const product = new ProductModel(productData);
      const savedProduct = await product.save();
      //adding product to the categories

      await CategoryModel.updateMany(
        {
          _id: { $in: savedProduct.category },
        },
        {
          $push: { products: new ObjectId(savedProduct._id) },
        }
      );
      return savedProduct;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        console.log("this is the validation error");
      }
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }
  async getProductByid(id) {
    try {
      const db = getDb();
      const collection = db.collection(this.collections);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }
  async filterProducts(minPrice, maxPrice, category) {
    try {
      const db = getDb();
      const collection = db.collection(this.collections);
      const filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }

      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        filterExpression.category = category;
      }
      return await collection.find(filterExpression).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }

  async rateProduct(userId, productId, rating) {
    try {
      console.log(productId);
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("product not found");
      }
      const review = await ReviewModel.findOne({
        productId: new ObjectId(productId),
        userId: new ObjectId(userId),
      });
      if (review) {
        review.rating = rating;
        await review.save();
      } else {
        const newReview = new ReviewModel({
          productId: new ObjectId(productId),
          userId: new ObjectId(userId),
          rating: rating,
        });
        await newReview.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }

  async getAvgPrice() {
    try {
      const db = getDb();
      const collection = db.collection(this.collections);

      return await collection
        .aggregate([
          { $group: { _id: "$category", averagePrice: { $avg: "$price" } } },
        ])
        .toArray();
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }
}
