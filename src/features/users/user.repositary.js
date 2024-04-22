import mongoose from "mongoose";
import { UserSchema } from "./user.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";

const UserModel = mongoose.model("user", UserSchema);
export default class UserRepositary {
  async signUp(user) {
    try {
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
        throw new Error(error);
      }
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }
  async signIn(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }
  async resetPassword(userId, newpassword) {
    try {
      // Await the result of findById to get the actual user document
      const user = await UserModel.findById(userId);
      if (user) {
        user.password = newpassword;
        await user.save();
        return user;
      } else {
        return null; // Return null if user is not found
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 503);
    }
  }
}
