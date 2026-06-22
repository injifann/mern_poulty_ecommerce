
export const validateQuantity = (quantity)=>
{
 if(quantity === undefined)
 {
    throw new Error({status:400,message:"please Enter product quantity"});
 }
 if(quantity < 0)
 {
    throw new Error ({status:400,message:"quantity cannot be less than 0"});
 }
 return quantity
}