
import express from 'express';
import { admin,protect } from '../middleware/protect.js';
import { addProduct,updateProduct, deleteProduct } from '../controllers/adminController.js';
import upload from '../middleware/uploadMiddleware.js';


const router = new express.Router();

router.post("/addproduct",protect, admin,upload.single("image"),addProduct);
router.post("/updateproduct",protect,admin,upload.single("image"),updateProduct);
router.post("/deleteproduct",protect,admin,deleteProduct);

export default router