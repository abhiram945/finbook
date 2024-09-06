import Router from "express";
import {getAllDaysData} from "../controllers/dayController.js"

const dayRouter = Router();

dayRouter.route("/getAllDaysData").post(getAllDaysData);

export default dayRouter;
