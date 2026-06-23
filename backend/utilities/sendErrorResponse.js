
export const sendErrorResponse = (res,statusCode,message)=>
{
 res.status(statusCode).json({message:message});
}