import { Response } from "express";
import { AuthRequest } from "../middlewares/authmiddleware.js";

import { GoogleGenAI } from "@google/genai";
import { cloudinary } from "../config/cloudinary.js";
import Generation from "../models/Generation.js";
import Post from "../models/Post.js";



export const generatedPost= async(req:AuthRequest, res:Response):Promise<void>=>{

     try {
          const {prompt, tone, generateImage} = req.body;

          const apiKey = process.env.GEMINI_API_KEY;
               if(!apiKey){
               res.status(400).json({
                    message:"Gemini API key is missing."
               })
               return
          }

          const ai = new GoogleGenAI({apiKey});

          const textResponse = await ai.models.generateContent({
               model: "gemini-2.5-flash",
               contents: `Generate a social media post based on this prompt: "${prompt}".
               Tone: ${tone}.
               Include relevant hashtags.
               Format the response as JSON with "content" and "imagePrompt" fields.
               The "imagePrompt" should be a highly descriptive prompt for an image generator that complements the post.
               `,
          });

          let content = "";
          let imagePrompt = prompt;
          try {
               const rawText = textResponse.text || " ";
               const jsonMatch = rawText.match(/\{[\s\S]*\}/);
               const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: rawText, imagePrompt: prompt };
               content = data.content;
               imagePrompt = data.imagePrompt;
          } catch (error: any) {
               content = textResponse.text || " ";
          }

          let mediaUrl = "";
          if (generateImage) {
               try {
                    const response = await ai.models.generateImages({
                         model: 'imagen-3.0-generate-002',
                         prompt: imagePrompt,
                         config: {
                              numberOfImages: 1,
                              aspectRatio: '1:1'
                         }
                    });
                    const image = response?.generatedImages?.[0]?.image;
                    if (image && image.imageBytes) {
                         mediaUrl = `data:${image.mimeType || 'image/jpeg'};base64,${image.imageBytes}`;
                         
                         const uploadResult = await cloudinary.uploader.upload(mediaUrl, {
                              folder: "ai-generations",
                         });
                         mediaUrl = uploadResult.secure_url;
                    }
               } catch (error: any) {
                    console.error("Error generating/uploading image:", error);
               }
          }

          const generation = await Generation.create({
               user: req.user?._id,
               prompt,
               content,
               mediaUrl: mediaUrl || undefined,
               mediaType: mediaUrl ? "image" : undefined,
               tone
          });

          res.status(200).json({
               success: true,
               generation
          });

     } catch (error: any) {
          res.status(500).json({
               success: false,
               message: error.message || "Failed to generate post"
          });
     }
     
}

export const getGenerations= async(req:AuthRequest, res:Response):Promise<void>=>{

     try {
          const generations = await Generation.find({user:req.user?._id}).sort({createdAt: -1})
          res.json(generations);
          
     } catch (error:any) {
          res.status(500).json({
               success: false,
               message: error.message || "Failed to fetch generated post"
          });
     }

}
export const getPosts= async(req:AuthRequest, res:Response):Promise<void>=>{
     try {

          const posts = await Post.find({user:req.user?._id})
          res.json(posts)
          
     } catch (error:any) {
          res.status(500).json({
               success: false,
               message: error.message || "Failed to fetch generated post"
          });
     }

}
export const schedulePosts= async(req:AuthRequest, res:Response):Promise<void>=>{

     try {

          const {content, platforms, scheduledFor, status} = req.body;

          let parsedPlatforms = platforms;
          if(typeof platforms === "string"){
               try {
                    parsedPlatforms = JSON.parse(platforms)
               } catch (error:any) {
                    parsedPlatforms = platforms.split(",");
               }
          }

          const platformArray: string[] = Array.isArray(parsedPlatforms)
               ? parsedPlatforms
               : parsedPlatforms
               ? [parsedPlatforms]
               : [];

          if (platformArray.length === 0) {
               res.status(400).json({
                    success: false,
                    message: "At least one platform must be specified."
               });
               return;
          }

          let mediaUrl : string | undefined = req.body.mediaUrl;
          let mediaType : "image" | "video" | undefined = req.body.mediaType

          if(req.file){
               const result = await new Promise<any>((resolve,reject)=>{
                    const stream = cloudinary.uploader.upload_stream(
                         {resource_type:"auto", folder:"SOCIAL-MEDIA-AUTOMATION"},
                         (error, uploadResult) => {
                              if(error) reject(error);
                              else resolve(uploadResult);
                         }
                    );
                    stream.end(req.file!.buffer)
               })

               mediaUrl = result.secure_url;
               mediaType = result.resource_type === "video"?"video":"image";
          }

          // Create a separate post entry for each platform as required by the schema (since the schema has `platform: String` and not `platforms: Array`)
          const createdPosts = await Promise.all(
               platformArray.map((plat: string) =>
                    Post.create({
                         user: req.user?._id,
                         content,
                         platform: plat.trim().toLowerCase() as "twitter" | "linkedin" | "facebook" | "instagram" | "facebook_page" | "linkedin_page" | "instagram_business",
                         mediaUrl: mediaUrl || undefined,
                         mediaType,
                         scheduledFor,
                         status: status || "scheduled",
                    })
               )
          );

          res.status(201).json({
               success: true,
               posts: createdPosts
          });
          
     } catch (error:any) {
          res.status(500).json({
               success: false,
               message: error.message || "Failed to schedule posts"
          });
     }
}

