import {Router}  from "express"
import { generateAuthUrl, syncAccounts } from "../controllers/socialAuthController.js";
import { protect } from "../middlewares/authmiddleware.js";

const route = Router();

route.get("/:platform/url",protect,generateAuthUrl)
route.get("/sync",protect,syncAccounts)



export default route