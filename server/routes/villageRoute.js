import Router from "express";
import {addVillage, getVillagesInDay} from "../controllers/villageController.js"

const villageRouter = Router();

villageRouter.route("/addVillage").post(addVillage);
villageRouter.route("/getVillagesInDay").post(getVillagesInDay);

export default villageRouter;
