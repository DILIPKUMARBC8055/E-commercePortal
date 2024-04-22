import ApplicationError from "../../error-handler/applicationError.js";

export default class CartModel {
  constructor(userId, productId, quantity) {
    this.userId = userId;
    this.productId = productId;
    this.quantity = quantity;
  }
}
