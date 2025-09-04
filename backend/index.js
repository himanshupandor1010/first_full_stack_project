import express from "express"
import connectDB from "./db.js"
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";



dotenv.config()

connectDB();

const app = express()

app.get("/",(req,res)=>{
    res.send("Hello MongoDB!");
})

app.use(cookieParser());


// Middleware
app.use(express.json());

app.use("/api/user",userRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`server is running on PORT ${process.env.PORT}`)
})