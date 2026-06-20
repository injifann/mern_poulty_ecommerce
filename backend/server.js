import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'


const app = express();
dotenv.config();
const port=process.env.PORT || 5000;

connectDB();
app.listen(port,()=>{
    console.log("the server is running on",port ," port")
})