import { registerOrLogin, verifyUser } from "../controllers/userController.js";
import Router from "express";

const userRouter = Router();

userRouter.route("/registerOrLogin").post(registerOrLogin);
userRouter.route("/verifyUser").post(verifyUser);

export default userRouter;
