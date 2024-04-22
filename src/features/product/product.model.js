import UserModel from "../users/user.model.js";
export default class ProductModel {
  
  constructor(name, desc, category, price, imageurl, sizes,id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.category = category;
    this.imageurl = imageurl;
    this.price = parseFloat(price);
    this.sizes = sizes;
  }


  static getProductByid(id) {
    return products.find((i) => i.id == id);
  }
  static filterProducts(minPrice, maxPrice, category) {
    return products.filter((i) => {
      return (
        (!minPrice || i.price >= minPrice) &&
        (!maxPrice || i.price <= maxPrice) &&
        (!category || i.category == category)
      );
    });
  }
  static rateProduct(userId, productId, rating) {
    const user = UserModel.getAllUser().find((u) => u.id == userId);
    if (!user) {
      return "user not found";
    }
    const product = ProductModel.getAllProduct().find((p) => p.id == productId);
    console.log(product + "  " + productId);

    if (!product) return "product not found";

    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({ userId: userId, rating: rating });
    } else {
      const index = product.ratings.findIndex((ui) => ui.userId == userId);
      if (index != -1) {
        product.ratings[index] = { userId: userId, rating: rating };
      } else {
        product.ratings.push({ userId: userId, rating: rating });
      }
    }
  }
}
