import UserModel from "../users/user.model.js";
import ProductModel from "./product.model.js";
import ProductRepositary from "./product.respositary.js";

export default class ProductController {
  constructor() {
    this.productRepo = new ProductRepositary();
  }
  async getAllProducts(req, res) {
    try {
      res.status(200).send(await this.productRepo.getAllProduct());
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }
  async addProduct(req, res) {
    const { name, desc, category, price, sizes } = req.body;
    const product = new ProductModel(
      name,
      desc,
      category,
      parseFloat(price),
      // req.file.filename,
      null,
      // sizes.split(",")
      null
    );

    const addedProduct = await this.productRepo.addProduct(product);
    if (addedProduct) {
      res.status(201).send(addedProduct);
    } else {
      res.status(400).send("the product failed to upload");
    }
  }

  deleteProduct(req, res) {}

  async filterProducts(req, res) {
    try {
      const minprice = req.query.minprice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const result = await this.productRepo.filterProducts(
        minprice,
        maxPrice,
        category
      );
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with dataBase", 503);
    }
  }
  async getProductByid(req, res) {
    const id = req.params.id;
    const product = await this.productRepo.getProductByid(id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send("product didn't find ");
    }
  }

  async rateProduct(req, res) {
    try {
      const userid = req.userId;
      const productid = req.query.productId;
      const rating = req.query.rating;
      await this.productRepo.rateProduct(userid, productid, rating);

      return res.status(201).send("rating done successfully");
    } catch (err) {
      console.log(err);
    }
  }
  async getAvgPrice(req, res) {
    try {
      const result = await this.productRepo.getAvgPrice();
      return res.status(200).send(result);
    } catch (error) {}
  }
}
