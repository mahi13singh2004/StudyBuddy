import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./db/connectDB.js"
dotenv.config()

const app=express()
app.use(express.json())
app.use(cookieParser())

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})