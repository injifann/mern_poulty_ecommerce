import mongoose from "mongoose";
import Product from "../models/Product.js";
import { generateUniqueSKU } from "../utilities/generateUniqueSKU.js";
import cloudinary from '../config/cloudinary.js';
import { sendErrorResponse } from "../utilities/sendErrorResponse.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

export const getProducts = async(req,res,next)=>
{
    const page = Number(req.query.page)||1;
    const limit = Number(req.query.limit)||10;
    const skip = (page-1)*limit;
    try
    {
     const products = await Product.find().skip(skip).limit(limit).populate("category","name");
     return res.status(200).json({message:"successfull",products});
    }
    catch(error)
    {
        next(error);
    }
}
export const getstats = async(req, res, next)=>
{
  try 
  {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();
    res.status(200).json({message:"successfull",stats:{totalProducts,totalCategories,totalUsers}});
  }
  catch(error)
  {
    next(error);
  }
}
export const addProduct = async (req , res,next)=>{

    const {title,description,price,quantity,category}=req.body;

    if(!title|| !description || price===undefined || quantity===undefined || !category)
    {
        return sendErrorResponse(res,400,"please Enter all fields")
    }

    if(!req.files || req.files.length===0)
    {
        return sendErrorResponse(res,400,"please upload images")
    }
    try
    {    
        if( await Product.findOne({title:title, category:category}))
         {
            return sendErrorResponse(res,400,"this product already exist with the same title and category")
         }
        
        const sku=await generateUniqueSKU(category,title);
        const upLoadedImages=[];

        for (const file of req.files)
        {
              const result=await cloudinary.uploader.upload(file.path,{folder:"products" });
              upLoadedImages.push({ url:result.secure_url,publicId:result.public_id,alt:title})
        }

        upLoadedImages[0].isPrimary=true;

        const products = await Product.create({title,sku,description,price,quantity,category,images:upLoadedImages});
        return res.status(201).json({message:"successfully created product",products});
    
    }
    catch(error)
    {
      next(error)
    }

}

export const updateProduct = async(req,res)=>
{
       const {title,description,price,quantity,category}=req.body;

       if(!title && !description && price === undefined && quantity === undefined && !category )
       {
        return res.status(400).json({message:"please enter new informatin"});
       }

       try
       {
            const productExist = await Product.findById(req.params.id);

            if(!productExist)
            {
              return sendErrorResponse(res,400,"this product is not in the list . please add it first");
            }

            const upLoadedImages=[];
            if(req.files && req.files.length>0)
            {
                for(const file of req.files)
                {
                    const result = await cloudinary.uploader.upload(file.path,{folder:"product"});
                    upLoadedImages.push({
                        url:result.secure_url,
                        publicId:result.public_id,
                        alt:title,
                    })
                }
            }

            let updateFields={};
            if(title) updateFields.title=title.trim();
            if(description) updateFields.description=description.trim();
            if(price !==undefined) updateFields.price=price
            if(quantity !==undefined) updateFields.quantity=quantity
            if(category) updateFields.category=category;
            if(upLoadedImages.length>0) updateFields.images=upLoadedImages;

           const updatedProduct = await Product.findByIdAndUpdate(req.params.id,updateFields,{new:true,runValidators:true});
           return res.status(201).json({message:"successfully updated",product:updatedProduct});


       }
       catch(error)
       {
        next(error)
       }

}

export const deleteProduct = async (req,res)=>{
    try
    {
       const product = await Product.findById(req.params.id);
       if(!product)
       {
        return sendErrorResponse(res,404,"product not found")
       }
       if(product.images && product.images.length>0)
        {
          for (const img of product.images)
          {
            if(img.publicId)
            {  await cloudinary.uploader.destroy(img.publicId)
            }
          }
       }
       await Product.findByIdAndDelete(req.params.id);
       return res.status(200).json({message:"Product deleted successfully"});
    }
    catch(error)
    {
      next(error)
    }
}
