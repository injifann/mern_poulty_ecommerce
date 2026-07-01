import express from 'express'
import { getAllProducts,rateProduct,getProductByCategory,getProductById } from '../controllers/productController.js';


const router = new express.Router();

router.get("/getallproducts",getAllProducts);
router.post("/rateproduct/:id",rateProduct);
router.get("/category/:id",getProductByCategory);
router.get("/product/:id",getProductById)


export default router;
