import Product from "../models/Product"
import Review from "../models/Review"

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
    throw error;

  }
}