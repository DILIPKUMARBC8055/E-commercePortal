db.products.aggregate([
  {
    $unwind: "$ratings",
  },
  {
    $group: {
      _id: "$name",
      averageRating: { $size: "$ratings" },
    },
  },
]);


db.cartItems.aggregate([
   
    {
      $lookup: {
        from: "products",
         localField: "productId",
         foreignField: "_id",
         as: "ProductInfo"
      }
    }
  ])
