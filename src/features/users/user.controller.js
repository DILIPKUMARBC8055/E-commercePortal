import { getDb } from "../../config/mongodb.js";
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepositary from "./user.repositary.js";
import bcrypt from "bcrypt";
import ApplicationError from "../../error-handler/applicationError.js";

export default class UserController {
  constructor() {
    this.userRepositary = new UserRepositary();
  }
  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userRepositary.signIn(email);

      if (!user) {
        return res.status(400).send("invalid credentials");
      }

      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const token = jwt.sign(
          { userId: user._id, email: email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).send(token);
      } else {
        res.status(400).send("invalid credentials");
      }
    } catch (err) {
      console.log(err);
    }
  }
  async signUp(req, res) {
    try {
      const { name, email, password, type } = req.body;
      const hashPassword = await bcrypt.hash(password, 12);
      const newuser = UserModel.signUp(name, email, hashPassword, type);
      await this.userRepositary.signUp(newuser);
      res.status(201).send(newuser);
    } catch (err) {
      console.log(err);
    }
  }

  async resetPassword(req, res) {
    try {
      const newpassword = req.body.newpassword;
      const encryptedPassword = await bcrypt.hash(newpassword, 12);
      const user = await this.userRepositary.resetPassword(
        req.userId,
        encryptedPassword
      );
      if (user) {
        res.status(200).send("password Updated successfully");
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }
}
