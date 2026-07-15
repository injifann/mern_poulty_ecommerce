import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js';
import userRouter from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import productRoute from './routes/productRoutes.js'
import cartRoute from './routes/cartRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import addressRoute from './routes/addressRoute.js'
import cors from 'cors';

const app = express();
dotenv.config();
const port=process.env.PORT || 5001;
app.use(express.json());
app.use(cors({origin:[
      'https://mern-poulty-ecommerce-rosy.vercel.app',
      'http://localhost:5173',
]}));
app.use("/uploads", express.static("uploads"));
app.use("/api/user",userRouter);
app.use("/api/admin",adminRoutes);
app.use("/api/products/",productRoute);
app.use("/api/cart",cartRoute);
app.use("/api/category",categoryRoute);
app.use("/api/address",addressRoute);
app.use(errorHandler);

connectDB();
app.listen(port,()=>{
    console.log("the server is running on",port ," port")
})

