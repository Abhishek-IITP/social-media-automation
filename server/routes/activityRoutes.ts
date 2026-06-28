import {Router}  from "express"
import { protect } from "../middlewares/authmiddleware.js";
import { getActivity } from "../controllers/activityController.js";


const route = Router();

route.get("/",protect,getActivity);




export default route