import { generateToken } from "./generateToken"

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