import express from "express";
import emailCheck from "../middlware/emailCheck.js"
import verifyToken from "../middlware/verifyToken.js";
import {
    signup,
    signin,
 verifyAccount,
 forgotPassword,
 resetPassword} from "../controllers/users/userController.js"
const router=express.Router()
router.post('/signin',signin)
router.post('/signup',emailCheck,signup);
router.post('/forgotPassword',forgotPassword);
router.patch('/resetPassword/:token',resetPassword);

router.get('/verify/:token', verifyAccount)
export default router;