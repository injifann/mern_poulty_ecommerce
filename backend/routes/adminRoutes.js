
import express from 'express';
import { admin } from '../middleware/protect.js';
import { addProduct,updateProduct, deleteProduct } from '../controllers/adminController.js';

const router = new express.Router();

router.post("/addproduct",admin,upload.single("image"),addProduct);
router.post("/updateproduct",admin,upload.single("image"),updateProduct);
router.post("/deleteproduct",admin,deleteProduct);

export default router