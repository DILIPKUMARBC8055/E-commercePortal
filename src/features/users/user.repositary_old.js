import { getDb } from "../../config/mongodb.js";

export default class UserRepositary {
  async signUp(newUser) {
    try {
      const db = getDb();
      const collections = db.collection("users");
      console.log(newUser);
      await collections.insertOne(newUser);
      
    } catch (err) {
      console.log(err);
    }
  }

  async signIn(email) {
    try {
      const db = getDb();
      const collections = db.collection("users");
      return await collections.findOne({email});
      
    } catch (err) {
      console.log(err);
    }
  }
}
