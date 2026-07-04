
export const sendCartResponse =(res,statusCode,message,cart)=>
{
 return res.status(statusCode).json({message:message,cart});
}