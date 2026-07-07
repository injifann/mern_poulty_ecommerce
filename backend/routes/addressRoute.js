import express from 'express';
import { addAddress,updateAddress,getmyaddress } from '../controllers/addressController.js';
import { protect } from '../middleware/protect.js';

const router = new express.Router();
router.post("/addaddress",protect,addAddress);
router.put("/updateaddress",protect,updateAddress);
router.get("/getmyaddress",protect,getmyaddress);

export default router;

