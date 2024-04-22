import express from "express";
import LikeController from "./like.controller.js";

const LikeRoute = express.Router();
const like = new LikeController();
LikeRoute.post("/", (req, res) => {
  like.likeItem(req, res);
});
LikeRoute.get("/", (req, res) => {
  like.getLikes(req, res);
});

export default LikeRoute;
