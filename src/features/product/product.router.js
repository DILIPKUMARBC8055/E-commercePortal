import express from "express";
import ProductController from "./product.controller.js";

const productRouter= express.Router();
const product =new ProductController();
productRouter.get("/",product.getAllProducts);


export default productRouter;