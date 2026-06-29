import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import fs from "fs";
import path from "path";
import Account from "./models/Account.js";



import DBConnect from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import socialAuthRouter from "./routes/socialAuthRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import postRouter from "./routes/postRoutes.js";
import activityRouter from "./routes/activityRoutes.js";
import { initScheduler } from "./services/schedulerService.js";

const app = express();

await DBConnect();
// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});



app.use("/api/auth",authRouter)
app.use("/api/oauth",socialAuthRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/posts",postRouter)
app.use("/api/activity",activityRouter)

app.get("/api/debug-accounts", async (req: Request, res: Response) => {
    try {
        const accounts = await Account.find({});
        res.json(accounts);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});


initScheduler();

app.use((err:any, _req:Request, res:Response, _next:NextFunction)=>{
    console.error(err);
    res.status(500).send(err?.response?.data?.message || err?.message)
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});