
import express from 'express';
import { admin,protect } from '../middleware/protect.js';
import { addProduct,updateProduct, deleteProduct,getstats ,getProducts,getUsers,deleteUser,changeUserStatus} from '../controllers/adminController.js';
import upload from '../middleware/uploadMiddleware.js';
import { addCategory,deleteCategory,updateCategory ,getAllCategory,getCategoryById } from '../controllers/categoryController.js';

const router = new express.Router();

router.post("/addproduct",protect, admin,upload.array("images"),addProduct);
router.put("/updateproduct/:id",protect,admin,upload.array("images"),updateProduct);
router.delete("/deleteproduct/:id",protect,admin,deleteProduct);
router.post("/addcategory",protect,admin,addCategory);
router.post("/deletecategory",protect,admin,deleteCategory);
router.post("/updatecategory/:id",protect,admin,updateCategory);
router.get("/getstats",protect,admin,getstats);
router.get("/getProducts",protect,admin,getProducts);
router.get("/getusers",protect,admin,getUsers);
router.delete("/deleteuser/:id",protect,admin,deleteUser)
router.put("/changeuserstatus/:id",protect,admin,changeUserStatus)


export default router