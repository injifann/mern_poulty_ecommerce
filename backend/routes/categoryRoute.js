import express from 'express';
import { addCategory,deleteCategory,updateCategory,getAllCategory,getCategoryById } from '../controllers/categoryController.js';
import { protect,admin } from '../middleware/protect.js';

const router = new express.Router();
router.post("/addcategory",protect,admin,addCategory);
router.delete("/deletecategory/:id",protect,admin,deleteCategory);
router.put("/updatecategory/:id",protect,admin,updateCategory);
router.get("/getallcategory",protect,admin,getAllCategory);
router.get("/getcategorybyid/:id",protect,admin,getCategoryById);

export default router






