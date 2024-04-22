import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import userRoute from "../users/user.router.js";
import { reviewSchema } from "./review.schema.js";
import mongoose from "mongoose";

const ReviewModel = mongoose.model("review", reviewSchema);

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
  async addProduct(product) {
    try {
      const db = getDb();
      const collection = db.collection(this.collections);
      await collection.insertOne(product);
      return product;
    } catch (err) {
      console.log(err);
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

  async rateProduct(userid, productid, rating) {
    try {
      const db = getDb();
      const collection = db.collection(this.collections);
      //pull the rating if exits
      await collection.updateOne(
        { _id: new ObjectId(productid) },
        { $pull: { rating: { userId: userid } } }
      );
      //push the rating or update
      await collection.updateOne(
        { _id: new ObjectId(productid) },
        { $push: { rating: { userId: userid, rating: rating } } }
      );
      //   return await collection.findOne({ _id: new ObjectId(productId) });
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
