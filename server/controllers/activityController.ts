import { Response } from "express";
import { AuthRequest } from "../middlewares/authmiddleware.js";
import ActivityLogs from "../models/ActivityLogs.js";

export const getActivity = async(req:AuthRequest, res: Response): Promise<void> =>{
     try {
          const activity = await ActivityLogs.find({user: req.user._id}).sort({createdAt: -1}).limit(10).populate("relatedPost","content");
          res.json(activity);
     } catch (error: any) {
           res.status(500).json({
               success: false,
               message: error.message || "Failed to schedule posts"
          });   
     }
}