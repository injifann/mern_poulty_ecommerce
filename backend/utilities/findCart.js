import mongoose from "mongoose";
import Cart from "../models/Cart";
import AppError from "./CustomError";

export const findCart = async (userId,isReturn)=>
{
     const cart = await Cart.findOne({user:userId});

    if(isReturn) {return cart}

    if(!cart)
    {
            
        throw new AppError ("cart does not found",404)
    }

 return cart;
}