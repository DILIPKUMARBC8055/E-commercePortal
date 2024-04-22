import { ObjectId, ReturnDocument } from "mongodb";
import { getDb } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import CartModel from "./cart.model.js";
export default class CartRepositary {
  constructor() {
    this.collection = "cartItems";
  }
  async add(userId, productId, quantity) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      //   console.log(id);
      await collection.updateOne(
        {
          userId: new ObjectId(userId),
          productId: new ObjectId(productId),
        },
        {
          $setOnInsert: { _id: id },
          $inc: { quantity: quantity },
        },
        {
          upsert: true,
        }
      );
    } catch (error) {
      console.log(error);
      throw new ApplicationError("there was problem in db", 500);
    }
  }
  async getCart(userId) {
    try {
      const db = getDb();
      const collection = db.collection(this.collection);
      return await collection.find({ userId: new ObjectId(userId) }).toArray();
    } catch (error) {
      console.log(error);
      throw new ApplicationError("there was problem in db", 500);
    }
  }
  async deleteCart(userId, cardId) {
    try {
      const db = getDb();

      const collection = db.collection(this.collection);
      const Delted = await collection.deleteOne({
        userId: new ObjectId(userId),
        _id: new ObjectId(cardId),
      });

      return Delted.deletedCount > 0;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("there was problem in db", 500);
    }
  }
  async getNextCounter(db) {
    const counter = await db
      .collection("counter")
      .findOneAndUpdate(
        { _id: "cartItemsId" },
        { $inc: { value: 1 } },
        { ReturnDocument: "after" }
      );
    //   console.log(counter);
    return counter.value;
  }
}
