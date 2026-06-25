
import express from 'express';
import { admin,protect } from '../middleware/protect.js';
import { addProduct,updateProduct, deleteProduct } from '../controllers/adminController.js';
import upload from '../middleware/uploadMiddleware.js';
import { addCategory,deleteCategory,updateCategory ,getAllCategory,getCategoryById } from '../controllers/categoryController.js';

const router = new express.Router();

router.post("/addproduct",protect, admin,upload.array("images"),addProduct);
router.post("/updateproduct",protect,admin,upload.array("images"),updateProduct);
router.post("/deleteproduct",protect,admin,deleteProduct);
router.post("/addcategory",protect,admin,addCategory);
router.post("/deletecategory",protect,admin,deleteCategory);
router.post("/updatecategory",protect,admin,updateCategory);




export default router