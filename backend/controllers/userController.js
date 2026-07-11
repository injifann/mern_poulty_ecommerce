import { generateToken } from "../utilities/generateToken.js";
import User from "../models/User.js"
import cloudinary from "../config/cloudinary.js";
import { OAuth2Client } from "google-auth-library";
import { sendAuthResponse } from "../utilities/sendAuthResponse.js";
import {sendErrorResponse} from "../utilities/sendErrorResponse.js";
import { isValidObjectId } from "../utilities/isValidObjectId.js";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import Order from '../models/Order.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req,res,next)=>
{
  const {token} = req.body;
  try
  {
    const ticket = await client.verifyIdToken({idToken:token,audience:process.env.GOOGLE_CLIENT_ID});
    const payLoad = ticket.getPayload();
    if(!payLoad || !payLoad.email){return sendErrorResponse(res,400,"invalid google token")};

    const{sub,name,email} = payLoad;

    let user = await User.findOne({email});
    if(!user)
    {
      user = await User.create({userName:name || email.split("@")[0],email:email,googleId:sub});
      const Apptoken = generateToken(user);
      return sendAuthResponse(201,"user successfully created",user);
    }
        if(!user.googleId)
        { user.googleId=sub;
          await user.save();
          return sendAuthResponse(res,200,"google account successfully linked",user)
        }
       return sendAuthResponse(res,200,"successfully logged in",user);
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
    return sendErrorResponse(res,400,"please fill all fields");
  }

  try
  {
   const userExist  = await User.findOne({email});
    if(userExist)
    {
       return sendErrorResponse(res,400,"this email is already registered. please login with your credentials");
    }
    const user = await User.create({userName,email,password});
    const appToken = generateToken(user._id);
    return sendAuthResponse(res,201,"account successfully created",user);
  }
  catch(error)
  {
    next(error)
  }
}
export const login = async (req,res,next) =>
{
    const {email,password} = req.body;
    if(!email){return sendErrorResponse(res,400,"please enter all information")};
      
    try
    {
        const user = await User.findOne({email});

        if(!user){return sendErrorResponse(res,401,"you do not have account.please create one")};
        if(user && !user.password && user.googleId)
        {
          return sendErrorResponse(res,400,"you registered with google, please login with google");
        }
        if(!password)
        {
          sendErrorResponse(res,400,"please enter all information");
        }
        if(!await user.checkPassword(password)){return sendErrorResponse(res,401,"invalid password or email")};
        sendAuthResponse(res,200,"Login successful",user);
    }
    catch(error)
    {
        next(error)
    }
}

export const me = async(req,res)=>
{ if (!req.user) {
    {return sendErrorResponse(res,401,"User not found'")};
  }
  return res.status(200).json({user:req.user});
}

export const changePassword = async (req,res,next)=>
{
  const id = req.user._id;
  const {currentPassword,newPassword} = req.body;
  if(!currentPassword || !newPassword)
  {
    return sendErrorResponse(res,400,"Please Enter current and new password");
  }
  if(!isValidObjectId(id))
   {
    return sendErrorResponse(res,400,"invalid user id");
   }
  try 
  {
    let user = await User.findById(id);
    if(!user)
    {
      return sendErrorResponse(res,404,"user not found")
    }
    const isMatch = user.checkPassword(currentPassword);
    if(!isMatch)
    {
      return sendErrorResponse(res,400,"password does not match");
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({message:"password changed successfully"});
  }
  catch(error)
  {
    next(error)
  }

}


export const deleteProfile = async (req,res,next)=>
{
      const id = req.user._id;
      if(!id)
      {
        return sendErrorResponse(res,400,"please enter user id");
      }
      if(!isValidObjectId(id))
      {
        return sendErrorResponse(res,400,"invalid user id");
      }
      try{
      const user = await User.findById(id);
      if(!user)
      {
        return sendErrorResponse(res,404,"user does not found");
      }
      const cart = await Cart.findOne({user:id});

      if(cart)
      {
        await cart.deleteOne();
      }

      const address = await Address.findOne({user:id});

      if(address)
      {
        await address.deleteOne()
      }
     
    const paidOrder = await Order.exists({user:id,paymentStatus:"paid"});

    if(paidOrder)
    {
      return sendErrorResponse(res,400,"you cannot delete profile because you have paid orders. wait for your order ")
    }
   await user.deleteOne()
   return res.status(200).json({message:"profile deleted successfully"})
  }
  catch(error)
  {
    next(error);
  }
}

export const uploadProfileImage = async (req,res,next) =>
{
  const id = req.user?._id;
  if(!isValidObjectId(id))
  {
    return sendErrorResponse(res,400,"invalid user id");
  }
  if(!req.file)
  {
    return sendErrorResponse(res,400,"please upload image first")
  }
  try
  {
    const user = await User.findById(id);
    if(!user)
    {
      return sendErrorResponse(res,404,"user does not found");
    }
    if(user.profileImage?.publicId)
    {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path,{folder:"profile_images"});
    user.profileImage.url=result.secure_url;
    user.profileImage.publicId=result.public_id;
    user.profileImage.isPrimary=true;
    await user.save();
    return res.status(200).json({message:"profile image successfuly updated",user})
  }
  catch(error)
  {
    next(error)
  }
}

