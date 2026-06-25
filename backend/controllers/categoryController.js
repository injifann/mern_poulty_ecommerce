
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import { sendErrorResponse } from '../utilities/sendErrorResponse.js';
import Product from '../models/Product.js';
import  {isValidObjectId}  from '../utilities/isValidObjectId.js';


export const getCategoryById = async(req,res,next)=>
{
    const id =req.params.id;
    if(!isValidObjectId(id))
    {
        return sendErrorResponse(res,400,"invalid category id");
    }
    try
    {
     const category = await Category.findById(id).populate("parent","name");
     return category ? res.status(200).json({message:"successfully fetched category",category}):
     sendErrorResponse(res,404,"category does not exist");
    }
    catch(error)
    {
        next(error);
    }
}
export const getAllCategory  = async (_,res,next)=>
{
     try
     {
       const categories = await Category.find().populate("parent","name");
       return res.status(200).json({message:"success fully fetched all category",categories});
     }
     catch(error)
     {
        next(error);
     }
}

export const addCategory = async (req,res,next) =>
{
   const {name,description,parent} = req.body;
   if(!name)  
   {
    return sendErrorResponse(res,400,"Please Enter category name");
   }
   if(parent && !isValidObjectId(id))
   {
       return sendErrorResponse(res,400,"invalid parent id");
   }
   try
   { 
     const categoryExist = await Category.findOne({name:{$regex : `^${name}$`,$options:"i"} });
     if(categoryExist) { return sendErrorResponse(res,400,"category already exist")};

     if(parent)
    {
     const parentExist = await Category.findById(parent);
     if(!parentExist) {  return sendErrorResponse(res,404,"parent category did not found")}
     }
     const category = await Category.create({ name:name, description:description || "", parent:parent || null,});
     return res.status(201).json({message:"successfully created category",category});

   }
   catch(error)
   {
    next(error);
   }
}

export const updateCategory = async (req,res,next)=>
{
    const categoryId = req.params.id;
    const {name,description,parent} = req.body;

    if(!isValidObjectId(categoryId))
    {
        return sendErrorResponse(res,400,"invalid category id");
    }
    if(!name && !description && !parent)
    {
        return sendErrorResponse(res,400,"Please provide at least one field to update");
    }
    try 
    {
      const categoryExist = await Category.findById(categoryId);  
      if(!categoryExist) { return sendErrorResponse(res,404,"category does not exist")};

      let updateCategory ={};

      if(name)
      {
        const existingCategoryName = await Category.findOne({name : {$regex:`^${name.trim()}$`,$options:"i"}});
        if(existingCategoryName && existingCategoryName._id.toString() !== categoryId)
        {
            return sendErrorResponse(res,400,"category with this name exist");
        }
        updateCategory.name=name.trim();
      }

      if(parent)
      { if(!isValidObjectId(parent))
        {
            return sendErrorResponse(res,400,"invalid parent id")
        }
        const parentExist = await Category.findById(parent);
        if(!parentExist) { return sendErrorResponse(res,404,"there is no parent category")};
        if(parent.toString() === categoryId.toString()) return sendErrorResponse(res,400,"Category cannot be parents of its own");
        updateCategory.parent=parent;
      }

      if(description) updateCategory.description = description;
      const updatedCategory = await Category.findByIdAndUpdate(categoryId,updateCategory,{new:true});
      return res.status(200).json({message:"successfully updated category",updatedCategory});

    }
    catch(error)
    {
          next(error);
    }
}
export const deleteCategory = async (req,res,next) =>
{
    const categoryId = req.params.id;
    if(!isValidObjectId(id))
    {
        return sendErrorResponse (res,400,"invalid category id")
    }

    try
     {
          const productExist = await Product.findOne({category:categoryId});
          if(productExist){ return sendErrorResponse(res,400,"cannot delete category,product is linked to it") };

          const subCategoryExist = await Category.findOne({parent:categoryId});
          if(subCategoryExist)
          {
            return sendErrorResponse(res,400,"Please delete or reassign its subcategories first")
         }
          const deletedCategory = await Category.findByIdAndDelete(categoryId);
         return  deletedCategory ? res.status(200).json({message:"category successfull deleted",deletedProduct}) :
         sendErrorResponse(res,404,"category does not exist");

    }
    catch(error)
    {
        next(error)
    }

} 