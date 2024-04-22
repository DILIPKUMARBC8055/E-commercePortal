import { Router } from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";
const user = new UserController();

const userRoute = Router();

userRoute.post("/signup", (req, res) => {
  user.signUp(req, res);
});
userRoute.post("/signin", (req,res)=>{
    user.signIn(req,res);
});
userRoute.post("/resetPassword",jwtAuth,(req,res)=>{
  user.resetPassword(req,res);
})

export default userRoute;
