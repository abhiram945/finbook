import { registerOrLogin, verifyUser, getAllUsers, deleteUserAccount } from "../controllers/userController.js";
import Router from "express";

const userRouter = Router();

userRouter.route("/registerOrLogin").post(registerOrLogin);
userRouter.route("/verifyUser").post(verifyUser);
userRouter.route("/getAllUsers").get(getAllUsers);
userRouter.route("/deleteUserAccount").post(deleteUserAccount);

export default userRouter;
