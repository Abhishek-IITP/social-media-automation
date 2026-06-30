import {Router}  from "express"
import { protect } from "../middlewares/authmiddleware.js";
import { generatedPost, getGenerations, getPosts, schedulePosts, deleteGeneration, deletePost, updatePost } from "../controllers/postController.js";
import { upload } from "../config/multer.js";

const route = Router();

route.get("/",protect,getPosts)
route.get("/generations",protect,getGenerations)
route.delete("/generations/:id",protect,deleteGeneration)
route.post("/",protect,upload.single("media"),schedulePosts)
route.post("/generate",protect,generatedPost)
route.delete("/:id",protect,deletePost)
route.put("/:id",protect,upload.single("media"),updatePost)

export default route