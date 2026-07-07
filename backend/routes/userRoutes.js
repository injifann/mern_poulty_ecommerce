import express from 'express'
import { register,login,googleAuth,me ,changePassword,deleteprofile} from "../controllers/userController.js";
import {protect} from '../middleware/protect.js'

const router = new express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/googleauth",googleAuth);
router.get("/me",protect,me);
router.put("/changepassword",protect,changePassword);
router.delete("/deleteprofile",protect,deleteprofile);



export default router