import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import { useState } from "react";

const userSchema = new mongoose.Schema({
   userName:
   {
    type:String,
    required:true,
   },
   email:
   {
      type:String,
      required:true,
      unique:true,
   },
   password:
   { 
    type:String,
   },
   phone:
   {
    type:String,
   },

   googleId:
   {
    type:String,
    unique:true,
    sparse:true,

   },
   role:
   {
        type:String,
        default:"client"
   },

   profileImage:
   {
        url:
        {
            type:String,
        },
        publicId:
        {
         type:String,
        },
        alt:String,
        isPrimary:{
            type:Boolean,
            default:false
        }

   },
   isVerified:{
    type:Boolean,
    default:false,
   }
},{timestamps:true});


userSchema.pre("save", async function (next){
    if(!this.isModified("password"))
    {
        return next;
    }

    try
    {
         const salt=await bcrypt.genSalt(10);
         this.password = await bcrypt.hash(this.password,salt)
         next;
    }
    catch(error)
    {
        return next(error);
    }
})


userSchema.methods.checkPassword = async function(currentPassword)
{
  return await bcrypt.compare(currentPassword,this.password);
}

const User = mongoose.model("User",userSchema);