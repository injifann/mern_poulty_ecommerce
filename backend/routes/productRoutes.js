import express from 'express'
import { getAllProducts,rateProduct,getProductByCategory,getProductById } from '../controllers/productController.js';


const router = new express.Router();

router.get("/getallproducts",getAllProducts);
router.get("/rateproduct",rateProduct);
router.get("/rateproduct",rateProduct);
router.get("/category/:id",getProductByCategory);
router.get("/product/:id",getProductById)


export default router;
