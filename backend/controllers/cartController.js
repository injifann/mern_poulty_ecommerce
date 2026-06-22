import mongoose from "mongoose";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { validateQuantity } from "../utilities/validateQuantity";
import { getValidProduct } from "../utilities/getValidProduct";
import { findCart } from "../utilities/findCart";

export const addToCart = async (req,res,next) =>
{
    const {productId,quantity} = req.body;
    try
    {   
        const validQuantity = validateQuantity(quantity);
        const product = await getValidProduct(productId,true);

         let cart = await findCart(req.user._id,true);

         if(!cart)
        { if(product.quantity<validQuantity){ return res.status(400).json({message:"in sufficient stock"});}
          await Cart.create({user:req.user._id,items:[{product:productId,quantity:quantity,priceAtTimeOfOrder:product.price}]});
          return res.status(201).json({message:"cart successfully created"});
        }

        const existItemIndex = cart.items.findIndex((item)=>item.product.toString()===productId);

        if(existItemIndex>-1)
        {   if(product.quantity<validQuantity +cart.items[existItemIndex]){ return res.status(400).json({message:"product is out of stock"});}
            cart.items[existItemIndex].quantity += validQuantity;
            cart.items[existItemIndex].priceAtTimeOfOrder = product.price;
        }
        else
        {   if(product.quantity<validQuantity){ return res.status(400).json({message:"in sufficient stock"});}
            cart.items.push({product:productId,quantity:validQuantity,priceAtTimeOfOrder:product.price})
        }
        await cart.save();
        return res.status(200).json({ message: "cart successfully updated"});

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
           return res.status(404).json({message:"product does not exist in the cart"});
    }
    cart.items = cart.items.filter(item=>item.product.toString()!==productId.toString());
    await cart.save();
    return res.status(200).json({message:"removed successfully"});

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

       const itemIndex = cart.items.findIndex(item=>item.product.toString()===productId.toString());

       if(itemIndex === -1){return res.status(404).json({message:"product does not found in a cart"})};
       if(product.quantity < validQuantity)
       {
        return res.status(400).json({message:"insufficient stock. Only ${product.quantity} items available"});
       }

       if(validQuantity === 0)
       {
        cart.items = cart.items.filter((item,index)=>index !==itemIndex);
        await cart.save();
        return res.status(200).json({message:"successfully removed product form cart"});
       }

        cart.items[itemIndex].quantity=validQuantity;
        await cart.save();
        return res.status(200).json({message:"successfully updated"});
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
