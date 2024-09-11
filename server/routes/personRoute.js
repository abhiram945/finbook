import Router from "express";
import {addPerson, getPersonsInVillage, updatePerson} from "../controllers/personController.js"

const personRouter = Router();

personRouter.route("/addPerson").post(addPerson);
personRouter.route("/getPersonsInVillage").post(getPersonsInVillage);
personRouter.route("/updatePerson").post(updatePerson);

export default personRouter;
