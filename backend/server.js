import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js';


const app = express();
dotenv.config();
const port=process.env.PORT || 5000;
app.use(express.json());
app.use(errorHandler);

connectDB();
app.listen(port,()=>{
    console.log("the server is running on",port ," port")
})