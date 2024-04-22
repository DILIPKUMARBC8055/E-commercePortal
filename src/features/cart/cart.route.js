import express from "express";
import CartController from "./cart.controller.js";
const cartRouter = express.Router();
const cart = new CartController();

cartRouter.get("/", (req, res) => {
  cart.getCartItems(req, res);
});
cartRouter.post("/add", (req, res) => {
  cart.addToCart(req, res);
});
cartRouter.delete("/:cartId", (req, res) => {
  cart.deleteCart(req, res);
});

export default cartRouter;
