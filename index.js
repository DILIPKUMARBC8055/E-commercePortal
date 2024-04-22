import dotenv from "dotenv";
dotenv.config();
import express from "express";
import productRouter from "./src/features/product/product.router.js";
import bodyParser from "body-parser";
import userRoute from "./src/features/users/user.router.js";
import basicAuth from "./src/middleware/basicAuth.middleware.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";
import cartRouter from "./src/features/cart/cart.route.js";
import swagger from "swagger-ui-express";
import apiDocs from "./swagger.json" assert { type: "json" };
import cors from "cors";
import loggerMiddleware from "./src/middleware/logger.middleware.js";
import ApplicationError from "./src/error-handler/applicationError.js";
import { connectToMongoDb } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.route.js";
import { connectToMongoWithMongoose } from "./src/config/mongooseConfig.js";
import LikeRoute from "./src/features/like/like.route.js";
const server = express();
server.use(bodyParser.json());

server.use(cors({ origin: "http://127.0.0.1:5500" }));
server.use(loggerMiddleware);

// server.use((req,res,next)=>{
//   res.header('Access-Control-Allow-Origin','*');
//   res.header('Access-Control-Allow-Headers','*');

//   if(req.method=='OPTIONS')
//   {
//     res.sendStatus(200);
//   }
//   next();

// });
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use("/api/product", jwtAuth, productRouter);
server.use("/api/user", userRoute);
server.use("/api/cart", jwtAuth, cartRouter);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/like",jwtAuth,LikeRoute);
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
    return res.status(err.code).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }
  res.status(500).send("Fixing the Server, please trying agian later");
  next();
});
server.get("/", (req, res) => {
  res.end("welcome to e-com website");
});

server.use((req, res) => {
  res.send(
    "API not found please refer localhost:8080/api-docs for more info on documentation"
  );
});
server.listen(8080, () => {
  console.log("The server is listening at 8080");
  // connectToMongoDb();
  connectToMongoWithMongoose();
});
