import mongoose from "mongoose";
import Product from "../models/Product";

export const getValidProduct = async(productId,quantity,isretun)=>
{
 if(!productId)
  {
   throw("please Enter Product id");
 }
 if(!mongoose.Types.ObjectId.isValid(productId))
  {
    throw error( {status:400,message:"invalid product id"});
 }
  if(isretun)
  {
  const product = await Product.findById(productId);
  if(!product)
  {
    throw error ({status:404,message:"product does not exist"});
  }

  if(product.status==="out_of_stock")
  {
    throw error({status:400,message:"product is out of stock"});
  }

  if(product.quantity <quantity)
  {
    throw error ({status:404,message:"product is out of stock"});
  }

   return product
}
return productId;
 
}