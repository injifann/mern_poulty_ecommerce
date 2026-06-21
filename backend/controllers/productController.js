import Product from '../models/Product.js'
import Review from '../models/Review.js';
import { updateProductRating } from '../utilities/updateProductRating.js';


export const getAllProducts = async(req,res)=>
    {
        try
        {
         const products = await Product.find().sort({createdAt:-1});
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
    return res.status(400).json({message:"Please rate the product first"});
   }
   try
   {
     const product = await Product.findById(req.params.id);
     if(!product)
    {
        return res.status(404).json({message:"Product not found"});
     }

     const reviewExist = await Review.findOne({user:req.user._id,product:product._id,});

     if(reviewExist) return res.status(400).json({message:"you have already rated the product"});
     
     await Review.create({user:req.user._id,product:product._id,rating});
     await updateProductRating(product._id);
     return res.status(201).json({message:"successfully rated the product"});

   }
   catch(error)
   {
    return res.status(500).json({message:error.message});
   }
 }