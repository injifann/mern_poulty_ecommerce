import mongoose from "mongoose";
import Product from "../models/Product";

export const getValidProduct = async(productId,isretun)=>
{
 if(!productId)
  {
   throw new AppError ("please Enter product id",404)
 }
 if(!mongoose.Types.ObjectId.isValid(productId))
  {
    throw new AppError ("invalid product id",404)

 }
  if(isretun)
  {
  const product = await Product.findById(productId);
  if(!product)
  {
    throw new AppError ("product does not exist",404)

  }

  if(product.status==="out_of_stock")
  {
    throw new AppError ("product is out of stock",404)

  }
   return product
}
return productId;
 
}