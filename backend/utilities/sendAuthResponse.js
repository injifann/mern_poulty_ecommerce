import { generateToken } from "./generateToken.js"

export const sendAuthResponse = async (res,statusCode,message , user)=>
{
    const token = generateToken(user._id);
    res.status(statusCode).json({
        message:message,
        status:statusCode,
        token:token,
        user:user
    })
}