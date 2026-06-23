import { generateToken } from "../utilities/generateToken.js";
import User from "../models/User.js"
import { OAuth2Client } from "google-auth-library";
import { sendAuthResponse } from "../utilities/sendAuthResponse.js";
import {sendErrorResponse} from "../utilities/sendErrorResponse.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req,res,next)=>
{
  const {token} = req.body;
  try
  {
    const ticket = await client.verifyIdToken({idToken:token,audience:process.env.GOOGLE_CLIENT_ID});
    const payLoad = ticket.getPayload();
    if(!payLoad || !payLoad.email){return res.status(400).json({message:"Invalid google token"})};

    const{sub,name,email} = payLoad;

    let user = await User.findOne({email});
    if(!user)
    {
      user = await User.create({userName:name || email.split("@")[0],email:email,googleId:sub});
      const Apptoken = generateToken(user._id);
      return res.status(201).json({message:"user successfully created",User:{_id:user._id,email:user.email},token:Apptoken});
    }
        if(!user.googleId)
        { user.googleId=sub;
          await user.save();
          sendAuthResponse(res,200,"google account successfully linked",user)
        }
       sendAuthResponse(res,200,"successfully logged in",user);
  }
  catch(error)
  {
    next(error)
  }
}

export const register = async (req,res,next) =>
{
  const {userName,email,password} = req.body;

  if(!userName || !email || !password)
  {
    sendErrorResponse(res,400,"please fill all fields");
  }

  try
  {
   const userExist  = await User.findOne({email});
    if(userExist)
    {
       sendErrorResponse(res,400,"this email is already registered. please login with your credentials");
    }
    const user = await User.create({userName,email,password});
    sendAuthResponse(res,201,"account successfully created",user);
  }
  catch(error)
  {
    next(error)
  }
}
export const login = async (req,res,next) =>
{
    const {email,password} = req.body;
    if(!email || !password){ sendErrorResponse(res,400,"please enter all information")};
      
    try
    {
        const user = await User.findOne({email});
        if(!user){sendErrorResponse(res,401,"invalid password or email")};
        if(!await user.checkPassword(password)){sendErrorResponse(res,401,"invalid password or email")};
        sendAuthResponse(res,200,"Login successful",user);
    }
    catch(error)
    {
        next(error)
    }

}
export const me = async(req,res)=>
{ if (!req.user) {
    {sendErrorResponse(res,401,"User not found'")};
  }
  return res.status(200).json(req.user);
}


