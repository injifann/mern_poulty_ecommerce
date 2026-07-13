import Product from '../models/Product.js'
import Review from '../models/Review.js';
import { updateProductRating } from '../utilities/updateProductRating.js';
import { sendErrorResponse } from '../utilities/sendErrorResponse.js';
import Category from '../models/Category.js';
import { isValidObjectId } from '../utilities/isValidObjectId.js';
import { getValidProduct } from '../utilities/getValidProduct.js';
import { buildProductQuery } from '../utilities/buildProductQuery.js';
import { buildSortBy } from '../utilities/buildSortBy.js';


export const getProductById = async (req,res,next)=>
{
   const sku = req.params.sku;
   try
   {   
      const product = await Product.findOne({sku:sku});
      if(!product)
      {
        return sendErrorResponse(res,404,"product does not found")
      }
      await product.populate("category","name");
      return res.status(200).json({message:"succesfull",product});
   }
   catch(error)
   {
    next(error)
   }
}
export const getAllProducts = async(req,res,next)=>
    {
        const {page,limit,sort,search,category,} = req.query;
        const currentPage = Math.max(Number(page)||1,1);
        const currentLimit = Math.min(Number(limit)||8,50);
        const skip= (page-1)*limit;
        try
        {
         const query = buildProductQuery(search,category);
         const sortBy = buildSortBy(sort);
         const products = await Product.find(query).sort(sortBy).skip(skip).limit(currentLimit).populate("category","name sku");
         return res.status(200).json({message:"successfull",products});
        }
        catch(error)
        {
          next(error)
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
     const product = await getValidProduct(req.params.id,true);
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
    next(error)
   }
 }
