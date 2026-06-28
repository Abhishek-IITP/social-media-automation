import mongoose from "mongoose";


const DBConnect= ()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error); 
        process.exit(1);
    }
}

export default DBConnect