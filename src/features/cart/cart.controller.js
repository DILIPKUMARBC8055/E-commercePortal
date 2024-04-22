import CartModel from "./cart.model.js";
import CartRepositary from "./cart.repositary.js";

export default class CartController {
  constructor() {
    this.cartRepositary = new CartRepositary();
  }
  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      await this.cartRepositary.add(req.userId, productId, quantity);
      return res.status(201).send("added to cart successfully");
    } catch (error) {
      console.log(error);
      throw new ApplicationError("there was problem in db", 500);
    }
  }
  async deleteCart(req, res) {
    try {
      const cartId = req.params.cartId;
      const isDeleted = await this.cartRepositary.deleteCart(
        req.userId,
        cartId
      );
      if (isDeleted)
        return res.status(200).send("cart Items delete successfully");
      else return res.status(200).send("There was no items to delete");
    } catch (error) {
      console.log(error);
      throw new ApplicationError("there was problem in db", 500);
    }
  }
  async getCartItems(req, res) {
    try {
      const items = await this.cartRepositary.getCart(req.userId);
      if (items) {
        return res.status(200).send(items);
      } else {
        return res.status(200).send("there is no cart items in you profile");
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError("there was problem in db", 500);
    }
  }
}
