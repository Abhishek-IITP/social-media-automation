import  {  Request, Response } from 'express';
import DBConnect from '../config/db.js';
import User from '../models/User.js';
import bcrypt from "bcrypt"
import jwt  from 'jsonwebtoken';


const generateToken =(id:string)=>{
     return jwt.sign({id},process.env.JWT_SECRET || "fallback_secret", {expiresIn: '30d'})
}


export const registerUser = async(req:Request,res:Response):Promise<void>=>{

     try {
          const {name,email,password} = req.body;

          const isUserExists = await User.findOne({email})

          if(isUserExists){
               res.status(400).json({message:"user already exists"})
               return;
          }


          const hassedPassword = await bcrypt.hash(password,10);
          const NewUser = await User.create({
               name, email , password:hassedPassword
          })

          if(NewUser){
               res.status(201).json({
                    message: "User created successfully",
                    token: generateToken(NewUser._id.toString()),
                    user: NewUser,

               })
          }else{
               res.status(400).json({
                    message:"Invalid Data"
               })
          }
          
     } catch (error:any) {
           res.status(500).json({
                    message:"Error while creating user",
                    error: error?.message
               })
     }

}
export const loginUser = async(req:Request,res:Response):Promise<void>=>{

     try {
          const {email,password} = req.body;

          const user = await User.findOne({email})

          if(!user){
               res.status(400).json({message:"Invalid credentials"})
               return;
          }

          if(user && (await bcrypt.compare(password,user.password))){
                   res.status(200).json({
  message: "Login successfully",
  token: generateToken(user._id.toString()),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
  },
});
          }else{
               res.status(400).json({
                    message:"Invalid Data"
               })
          }
          
     } catch (error:any) {
           res.status(500).json({
                    message:"Error while login user",
                    error: error?.message
               })
     }

}