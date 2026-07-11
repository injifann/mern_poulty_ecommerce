import express from 'express'
import { register,login,googleAuth,me ,changePassword,deleteProfile,uploadProfileImage} from "../controllers/userController.js";
import {protect} from '../middleware/protect.js'
import upload from '../middleware/uploadMiddleware.js';

const router = new express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/googleauth",googleAuth);
router.get("/me",protect,me);
router.put("/changepassword",protect,changePassword);
router.delete("/deleteprofile",protect,deleteProfile);
router.put("/uploadprofileimage",protect,upload.single("profileImage"), uploadProfileImage);




export default router