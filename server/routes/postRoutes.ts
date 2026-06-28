import {Router}  from "express"
import { protect } from "../middlewares/authmiddleware.js";
import { generatedPost, getGenerations, getPosts, schedulePosts } from "../controllers/postController.js";
import { upload } from "../config/multer.js";

const route = Router();

route.get("/",protect,getPosts)
route.get("/generations",protect,getGenerations)
route.post("/",protect,upload.single("media"),schedulePosts)
route.post("/generate",protect,generatedPost)




export default route