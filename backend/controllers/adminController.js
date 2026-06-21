import mongoose from "mongoose";
import Product from "../models/Product.js";
import { generateUniqueSKU } from "../utilities/generateUniqueSKU.js";
import {cloudinary} from '../config/cloudinary.js';

export const addProduct = async (req , res)=>{

    const {title,description,price,quantity,category}=req.body;

    if(!title|| !description || price===undefined || quantity===undefined || !category)
    {
        return res.status(400).json({message:"please Enter all fields"});
    }

    if(!req.files || req.files.length===0)
    {
        return res.status(400).json({message:"please upload images"});
    }


    try
    {    
        if( await Product.findOne({title:title, category:category}))
         {
            return res.status(409).json({message:"this product already exist with the same title and category"});
         }
        
        const sku=await generateUniqueSKU(category,title);

        const upLoadedImages=[];

         
        for (const file of req.files)
        {
              const result=await cloudinary.uploader.upload(file.path,{folder:"products" });

              upLoadedImages.push({ url:result.secure_url,publicId:result.public_id,alt:title})
        }

        upLoadedImages[0].isPrimary=true;


        const product = await Product.create({title,sku,description,price,quantity,category,images:upLoadedImages});
        return res.status(201).json({message:"successfully created product",product});
    
    }
    catch(error)
    {
      return res.status(500).json({message:error.message});
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
              return res.status(400).json({message:"this product is not in the list . please add it first"});
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
         return res.status(500).json({message:error.message});
       }

}
