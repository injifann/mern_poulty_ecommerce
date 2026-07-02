import express from 'express'
import { getMyCart,addToCart,deleteCart,RemoveProductFromCart,updateCartQuantity } from '../controllers/cartController.js';

const router = new express.Router();

router.get("/getmycart",getMyCart);
router.post("/addtocart",addToCart);
router.put("/removefromcart",RemoveProductFromCart)
router.delete("/deletecart",deleteCart);
router.put("/updatecartquantity",updateCartQuantity);

export default router;