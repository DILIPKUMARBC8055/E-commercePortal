import LikeRepositary from "./like.respositary.js";

export default class LikeController {
  constructor() {
    this.likeRepositary = new LikeRepositary();
  }
  async likeItem(req, res) {
    try {
      let liked;
      const { id, type } = req.body;

      if (type == "product") {
        liked = await this.likeRepositary.likeProduct(req.userId, id);
      } else if (type == "category") {
        liked = await this.likeRepositary.likeCategory(req.userId, id);
      } else {
        return res.status(400).send("invalid type");
      }
      if (liked) {
        res.status(201).send(liked);
      } else {
        res.status(400).send("Couldn't like try again");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("something went wrong");
    }
  }
  async getLikes(req, res) {
    try {
      //const { id, type } = req.query;
      const likes = await this.likeRepositary.getLikes(req.userId);
      res.status(200).send(likes);
    } catch (error) {
      console.log(error);
      res.status(400).send("something went wrong");
    }
  }
}
