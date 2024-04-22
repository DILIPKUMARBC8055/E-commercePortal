import { MongoGridFSChunkError, ObjectId } from "mongodb";
import mongoose from "mongoose";
import { LikeSchema } from "./like.schema.js";

const LikeModel = mongoose.model("like", LikeSchema);
export default class LikeRepositary {
  async likeProduct(userid, productId) {
    try {
      const checkLiked = await LikeModel.findOne({
        userId: new ObjectId(userid),
        likeables: new ObjectId(productId),
      });
      if (checkLiked) {
        return checkLiked;
      }
      const like = new LikeModel({
        userId: new ObjectId(userid),
        likeables: new ObjectId(productId),
        types: "product",
      });
      await like.save();
      return like;
    } catch (error) {
      console.log(error);
      res.status(400).send("something went wrong");
    }
  }
  async likeCategory(userid, categoryId) {
    try {
      const checkLiked = await LikeModel.findOne({
        userId: new ObjectId(userid),
        likeables: new ObjectId(categoryId),
      });
      if (checkLiked) {
        return checkLiked;
      }
      const like = new LikeModel({
        userId: new ObjectId(userid),
        likeables: new ObjectId(categoryId),
        types: "category",
      });
      await like.save();
      return like;
    } catch (error) {
      console.log(error);
      res.status(400).send("something went wrong");
    }
  }

  async getLikes(userid) {
    try {
      return await LikeModel.find({
        userId: new ObjectId(userid),
      });
    } catch (error) {
      console.log(error);
      res.status(400).send("something went wrong");
    }
  }
}
