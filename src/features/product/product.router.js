import express from "express";
import ProductController from "./product.controller.js";
import uploadFile from "../../middleware/fileupload.middleware.js";

const productRouter = express.Router();
const product = new ProductController();
productRouter.get("/", (req, res) => {
  product.getAllProducts(req, res);
});
productRouter.post("/", uploadFile.single("imageurl"), (req, res) => {
  product.addProduct(req, res);
});
productRouter.get("/filter", (req, res) => {
  product.filterProducts(req, res);
});
productRouter.get("/averagePrice",(req,res)=>{
  product.getAvgPrice(req,res);
})
productRouter.get("/:id", (req, res) => {
  product.getProductByid(req, res);
});
productRouter.post("/rating", (req, res) => {
  product.rateProduct(req, res);
});

export default productRouter;
