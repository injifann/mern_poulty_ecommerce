import express from 'express'
import { getMyCart,addToCart,deleteCart,RemoveProductFromCart,updateCartQuantity,updateCart } from '../controllers/cartController.js';
import { protect } from '../middleware/protect.js';

const router = new express.Router();

router.get("/getmycart",protect,getMyCart);
router.post("/addtocart",protect,addToCart);
router.delete("/removefromcart",protect,RemoveProductFromCart)
router.delete("/deletecart",protect,deleteCart);
router.put("/updatecartquantity",protect,updateCartQuantity);
router.put("/updateCart",protect,updateCart);


export default router;