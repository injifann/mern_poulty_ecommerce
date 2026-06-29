import Product from "../models/Product.js"
import Review from "../models/Review.js"
import AppError from "./CustomError.js";

export const updateProductRating = async (productId)=>
{
  try
  {
    const reviews = await Review.find({product:productId});
    const totalReview=reviews.length;
     
    const totalRating = reviews.reduce((sum,reveiw)=>sum+reveiw.rating,0);
    const averageRating=Number((totalRating/totalReview).toFixed(1));
    
    await Product.findByIdAndUpdate(productId,{
        averageRating:averageRating,
        numReviews:totalReview
    })

  }
  catch(error)
  {
    throw new AppError(error.message);

  }
}