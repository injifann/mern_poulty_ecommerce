import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js';
import userRouter from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import productRoute from './routes/productRoutes.js'
import cors from 'cors';

const app = express();
dotenv.config();
const port=process.env.PORT || 5001;
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/user",userRouter);
app.use("/api/admin",adminRoutes);
app.use("/api/product/",productRoute);
app.use(errorHandler);

connectDB();
app.listen(port,()=>{
    console.log("the server is running on",port ," port")
})

