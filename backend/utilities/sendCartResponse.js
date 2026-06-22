
export const sendCartResponse =(req,statusCode,message,cart)=>
{
 return res.status(statusCode).json({message:message,cart});
}