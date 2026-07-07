import AppError from "./CustomError.js"

export const validateQuantity = (quantity)=>
{
 if(quantity === undefined)
 {
        throw new AppError ("please Enter product quantity",404)

 }
 if(typeof quantity === "number")
 {
   throw new AppError("quantity must be number");
 }
 if(quantity < 0)
 {
    throw new AppError ("quantity cannot be less than 0",404)

 }
 return quantity
}