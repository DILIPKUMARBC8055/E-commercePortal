import { getDb } from "../../config/mongodb.js";
import UserRepositary from "./user.repositary.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }
  static signUp(name, email, password, type) {
    const user = new UserModel(name, email, password, type);
    return user;
  }
  static signIn(email, password) {
    return users.find((i) => i.email == email && i.password == password);
  }
  static getAllUser() {
    return users;
  }
}
const users = [new UserModel("dilip", "test@gmail.com", "123", "seller")];
