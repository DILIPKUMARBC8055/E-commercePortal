import mongoose from "mongoose";

export const LikeSchema = mongoose
  .Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    likeables: { type: mongoose.Schema.Types.ObjectId, refPath: "types" },
    types: { type: String, enum: ["product", "category"] },
  })
  .pre("save", (next) => {
    console.log("someone liked initialted");
    next();
  })
  .post("save", (doc) => {
    console.log("someone liked the things ");
    console.log(doc);
  })
  .pre("find", (next) => {
    console.log("someone is finding the like data");
    next();
  })
  .post("find", (doc) => {
    console.log("found the data ");
    console.log(doc);
  });
