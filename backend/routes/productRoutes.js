import express from 'express'
import { getAllProducts,rateProduct,getProductByCategory,getProductById } from '../controllers/productController.js';
import { protect } from '../middleware/protect.js';

const router = new express.Router();

router.get("/getallproducts",getAllProducts);
router.post("/rateproduct/:id",protect,rateProduct);
router.get("/category/:id",getProductByCategory);
router.get("/product/:id",getProductById)


export default router;
