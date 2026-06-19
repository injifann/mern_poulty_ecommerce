import express from 'express';
import dotenv from 'dotenv';


const app = express();
dotenv.config();
const port=process.env.PORT || 5000;


app.listen(port,()=>{
    console.log("the server is running on",port ," port")
})