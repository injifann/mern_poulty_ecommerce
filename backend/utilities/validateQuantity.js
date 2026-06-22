
export const validateQuantity = (quantity)=>
{
 if(quantity === undefined)
 {
        throw new AppError ("please Enter product quantity",404)

 }
 if(quantity < 0)
 {
    throw new AppError ("quantity cannot be less than 0",404)

 }
 return quantity
}