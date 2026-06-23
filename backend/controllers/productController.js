import Product from '../models/Product.js'
import Review from '../models/Review.js';
import { updateProductRating } from '../utilities/updateProductRating.js';
import { sendErrorResponse } from '../utilities/sendErrorResponse.js';


export const getAllProducts = async(req,res)=>
    {
        try
        {
         const {category,search } = req.query;

         let query = {};

         if(category){query.category = category} 
         if(search){query.title={$regex:search,$options:'i'}};

         const products = await Product.find(query).populate("category","name slug").sort({createdAt:-1});
         return res.status(200).json({message:"successfull",products});
        }
        catch(error)
        {
          return res.status(500).json({message:error.message});
        }
 }

 export const rateProduct = async (req,res)=>{
   const{rating} = req.body;
   if(rating === undefined)
   {
    return sendErrorResponse(res,400,"Please rate the product first")
   }
   try
   {
     const product = await Product.findById(req.params.id);
     if(!product)
    {
    return sendErrorResponse(res,404,"Product not found")
     }

     const reviewExist = await Review.findOne({user:req.user._id,product:product._id,});
     
     if(reviewExist) {return sendErrorResponse(res,400,"you have already rated the product")};
     
     await Review.create({user:req.user._id,product:product._id,rating});
     await updateProductRating(product._id);
     return res.status(201).json({message:"successfully rated the product"});

   }
   catch(error)
   {
    return res.status(500).json({message:error.message});
   }
 }