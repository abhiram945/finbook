import { registerOrLogin, googleSignIn, verifyUser, getAllUsers, deleteUserAccount } from "../controllers/userController.js";
import Router from "express";
import adminAuth from "../middlewares/adminAuth.js";

const userRouter = Router();

userRouter.route("/registerOrLogin").post(registerOrLogin);
userRouter.route("/googleSignIn").post(googleSignIn);
userRouter.route("/verifyUser").post(verifyUser);
userRouter.route("/getAllUsers").post(adminAuth, getAllUsers);
userRouter.route("/deleteUserAccount").post(deleteUserAccount);

export default userRouter;
