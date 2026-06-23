import Product from '../models/Product.js'
import Review from '../models/Review.js';
import { updateProductRating } from '../utilities/updateProductRating.js';
import { sendErrorResponse } from '../utilities/sendErrorResponse.js';
import Category from '../models/Category.js';
import { isValidObjectId } from '../utilities/isValidObjectId.js';
import { getValidProduct } from '../utilities/getValidProduct.js';


export const getProductById = async (req,res,next)=>
{
   const productId = req.params.id;
   try
   {   
      const product = await getValidProduct(productId,true);
      await product.populate ("category","name");
      return res.status(200).json({message:"succesfull",product});
   }
   catch(error)
   {
    next(error)
   }
}
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

 export const getProductByCategory = async (req,res,next)=>
{
    const categoryId = req.params.id;

    if(!isValidObjectId(categoryId))
    {
      return sendErrorResponse(res,400,"invalid category id");
    }
    try
    {
      const category = await Category.findById(categoryId);
      if(!category)
      {
        return sendErrorResponse(res,404,"category does not exist");
      }
      const products = await Product.find({category:categoryId}).populate("category","name");
      if(!products || products.length === 0)
      {
        return sendErrorResponse(res,404,"no product with this category");
      }
      return res.status(200).json({message:"successfully fetched",products})
    }
    catch(error)
    {
      next(error);
    }
}


 export const rateProduct = async (req,res)=>{
   const{rating} = req.body;
   if(rating === undefined)
   {
    return sendErrorResponse(res,400,"Please rate the product first")
   }
   if(typeof rating !=="number" || rating>5 || rating < 1)
   {
        return sendErrorResponse(res,400,"invalid rating range")
   }
   try
   {
     const product = await getValidProduct(req.params.id);
     const reviewExist = await Review.findOne({user:req.user._id,product:product._id,});
     
     if(reviewExist) 
      {
        if(reviewExist.rating === rating)
        {
         return sendErrorResponse(res,400,"you have already submitted this rating");
        }
        reviewExist.rating = rating;
        await reviewExist.save();
        await updateProductRating(product._id);
        return res.status(201).json({message:"successfully updated"});

      }
     else
    {
     await Review.create({user:req.user._id,product:product._id,rating});
     await updateProductRating(product._id);
     return res.status(201).json({message:"successfully rated the product"});
    }

   }
   catch(error)
   {
    return res.status(500).json({message:error.message});
   }
 }
