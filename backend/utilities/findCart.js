import mongoose from "mongoose";
import Cart from "../models/Cart";

export const findCart = async (userId,isReturn)=>
{
     const cart = await Cart.findOne({user:userId})
    if(isReturn) {return cart}

    if(!cart)
    {
        throw error ({
            status:404,
            message:"cart does not found";
        })
    }

 
}