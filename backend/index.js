import express from "express"
import connectDB from "./db.js"
import dotenv from "dotenv"
dotenv.config()

connectDB();

const app = express()

app.get("/",(req,res)=>{
    res.send("Hello MongoDB!");
})

app.listen(process.env.PORT,()=>{
    console.log(`server is running on PORT ${process.env.PORT}`)
})