import express from 'express'
import { register,login,googleAuth,me } from "../controllers/userController.js";
import {protect} from '../middleware/protect.js'

const router = new express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/googleauth",googleAuth);
router.get("/me",protect,me);


export default router