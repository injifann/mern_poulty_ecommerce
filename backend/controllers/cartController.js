import mongoose, { isValidObjectId } from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { validateQuantity } from "../utilities/validateQuantity.js";
import { getValidProduct } from "../utilities/getValidProduct.js";
import { findCart } from "../utilities/findCart.js";
import { sendErrorResponse } from "../utilities/sendErrorResponse.js";
import { sendCartResponse } from "../utilities/sendCartResponse.js";


export const getMyCart = async (req,res,next)=>
{
  try
  {
    let cart = await findCart(req.user._id,true);
    if(!cart)
    {
      return sendErrorResponse(res,404,"cart not found");
    }
    
    await cart.populate("items.product","title");
    return sendCartResponse(res,200,"cart successfully fetched",cart);

  }
  catch(error)
  {
    next(error)
  }
}

export const updateCart = async (req,res,next) =>
{
  const {updatedItems} = req.body;
  if(!Array.isArray(updatedItems) || updatedItems.length===0)
  {
    return sendErrorResponse(res,400,"please update products first");
  }

  for (const item of updatedItems)
  {
    if(typeof item.quantity !== "number" || item.quantity<1 || !item.productId || !isValidObjectId(item.productId) )
    {
      return sendErrorResponse(res,400,"invalid product or quantity");
    }
  }

  try
  {
    let cart = await findCart(req.user._id,true);
    if(!cart)
    {
      return sendErrorResponse(res,404,"cart not found");
    }

    for (const Item of updatedItems)
    {
        const cartItem = cart.items.find((item)=>
        item.product._id.toString() === Item.productId.toString());
        if(!cartItem)
        {
          return sendErrorResponse(res,404,`Product ${Item.productId} not found in cart`);

        }
    }


     const updates = new Map(updatedItems.map((item)=>[
      item.productId.toString(),
      item.quantity,
     ]))

     for (const item of cart.items)
      {
       const quantity = updates.get(item.product._id.toString());
       if(quantity !== undefined)
       {
        item.quantity = quantity;
       }
      }

    await cart.save();
    return sendCartResponse(res,200,"successfully updated cart",cart);
    
  }
  catch(error)
  {
    next(error);
  }
}

export const addToCart = async (req,res,next) =>
{
    const {productId,quantity} = req.body;
    if(!productId|| !quantity)
    {
      return sendErrorResponse(res,400,"please enter product and and quantity");
    }
    try
    {   
        const validQuantity = validateQuantity(quantity);
        const product = await getValidProduct(productId,true);

         let cart = await findCart(req.user._id,true);
         if(!cart)
          { if(product.quantity<validQuantity){ return sendErrorResponse(res,400,"in sufficient stock");}
            cart = await Cart.create({user:req.user._id,items:[{product:productId,quantity:quantity,priceAtTimeOfOrder:product.price}]});
            sendCartResponse(res,201,"cart successfully created",cart);
          }

        const existItemIndex = cart.items.findIndex((item)=>item.product.toString()===productId);

        if(existItemIndex>-1)
        {   if(product.quantity<validQuantity +cart.items[existItemIndex].quantity){ return sendErrorResponse(res,400,"product is out of stock")}
            cart.items[existItemIndex].quantity += validQuantity;            

            cart.items[existItemIndex].priceAtTimeOfOrder = product.price;
        }
        else
        {   if(product.quantity<validQuantity){ return sendErrorResponse(res,400,"insufficient stock")}
            cart.items.push({product:productId,quantity:validQuantity,priceAtTimeOfOrder:product.price})
        }
        cart = await cart.save();
        sendCartResponse(res,200,"cart successfully updated",cart);

    }
    catch(error)
    {
      next(error)
    }

}
export const RemoveProductFromCart = async (req,res,next)=>    
{
   const {productId} = req.body;
   
  try
  {
    await getValidProduct(productId,false)
    let cart = await findCart(req.user._id,false);

    const itemExist = cart.items.some(item=>item.product.toString()===productId.toString());
    if(!itemExist)
    {
       return sendErrorResponse(res,404,"product does not exist in the cart")
    }
    cart.items = cart.items.filter(item=>item.product.toString()!==productId.toString());
    cart = await cart.save();
    sendCartResponse(res,200,"product removed successfully",cart);

  }
  catch(error)
  {
      next(error)
  }
}

export const updateCartQuantity = async (req,res,next)=>
{
    const {productId,quantity} = req.body;

    try
    {
       const validQuantity = validateQuantity(quantity);
       const product = await getValidProduct(productId,false);

       let cart = await findCart(req.user._id,false);

       const itemIndex = cart.items.findIndex(item=>item.product.toString() === productId.toString());

       if(itemIndex === -1){ return sendErrorResponse(res,404,"product does not found in a cart")};
       if(product.quantity < validQuantity)
       {
        return sendErrorResponse(res,400,"insufficient stock");
       }

       if(validQuantity === 0)
       {
        cart.items = cart.items.filter((item,index)=>index !==itemIndex);
        cart = await cart.save();
        return sendCartResponse(res,200,"successfully removed product form cart",cart);

       }

        cart.items[itemIndex].quantity=validQuantity;
        cart = await cart.save();
        return sendCartResponse(res,200,"successfully updated",cart);

    }
    catch(error)
    {
      next(error)
    }
   
}

export const deleteCart = async (req,res,next)=>
{
   try 
   {
    const cart = await findCart (req.user._id,false);
    await cart.deleteOne();
    return res.status(200).json({message:"cart successfully deleted"})
   }
   catch(error)
   {
      next(error)
   }
}
