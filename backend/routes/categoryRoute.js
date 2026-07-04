import express from 'express';
import { addCategory,deleteCategory,updateCategory,getAllCategory,getCategoryById } from '../controllers/categoryController';
import { protect,admin } from '../middleware/protect';

export const router = new express.Router();
router.post("/addcategory",protect,admin,addCategory);
router.post("/deletecategory",protect,admin,deleteCategory);
router.put("/updatecategory",protect,admin,updateCategory);
router.get("/getallcategory",protect,admin,getAllCategory);
router.get("/getcategorybyid/:id",protect,admin,getCategoryById);






