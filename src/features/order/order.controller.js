import OrderRepositary from "./order.repositary.js";

export default class OrderController {
  constructor() {
    this.orderRepositary = new OrderRepositary();
  }

  async placeOrder(req, res) {
    try {
      const result = await this.orderRepositary.placeOrder(req.userId);
      res.status(201).send("order placed successfully");
    } catch (error) {
      console.log(error);
    }
  }
}
