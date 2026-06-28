import {Router}  from "express"
import { protect } from "../middlewares/authmiddleware.js";
import { addAccount, disconnectAccount, getAccount } from "../controllers/accountControllers.js";

const route = Router();

route.get("/",protect,getAccount)
route.post("/",protect,addAccount)
route.delete("/:id",protect,disconnectAccount)




export default route