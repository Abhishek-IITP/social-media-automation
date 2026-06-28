import {Router}  from "express"
import { loginUser, registerUser } from "../controllers/authController.js";

const route = Router();

route.post("/register",registerUser)
route.post("/login",loginUser)



export default route