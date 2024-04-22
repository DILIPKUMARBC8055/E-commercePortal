import { ObjectId } from "mongodb";
import { getClient, getDb } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const db = getDb();
    const client = getClient();
    const session = client.startSession();

    try {
      session.startTransaction();
      const orderCollection = db.collection(this.collection);

      // Get total amount of the cart items
      const items = await this.getTotalAmountOfCartItems(userId, session);

      if (!items || items.length === 0) {
        throw new Error("No items in cart to place an order.");
      }

      const total = items.reduce((acc, item) => acc + item.totalAmount, 0);
      console.log(`Total amount: ${total}`);

      // Add the order to the db
      const newOrder = new OrderModel(new ObjectId(userId), total, new Date());
      await orderCollection.insertOne(newOrder, { session });

      // Reduce the stock quantity and delete cart items
      await this.updateProductStockAndDeleteCartItems(
        items,
        userId,
        db,
        session
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("Error placing order:", error);
    } finally {
      session.endSession();
    }
  }

  async getTotalAmountOfCartItems(userId, session) {
    try {
      const db = getDb();
      const collection = db.collection("cartItems");
      const items = await collection
        .aggregate([
          { $match: { userId: new ObjectId(userId) } },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          { $unwind: "$productInfo" },
          {
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ])
        .toArray();
      return items;
    } catch (error) {
      console.error("Error getting total amount of cart items:", error);
      // Return an empty array if there was an error
      return [];
    }
  }

  async updateProductStockAndDeleteCartItems(items, userId, db, session) {
    try {
      // Update stock quantity and delete cart items
      for (const item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      // Delete the cart for the user
      await db
        .collection("cartItems")
        .deleteMany({ userId: new ObjectId(userId) }, { session });
    } catch (error) {
      console.error(
        "Error updating product stock or deleting cart items:",
        error
      );
      throw error;
    }
  }
}
