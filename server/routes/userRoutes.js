import express from "express"
import { changePassword, forgotPassword, loginUser, logoutUser, registerUser, verification, verifyOtp } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { emailSchema, loginSchema, otpSchema, resetPasswordSchema, userSchema, validateUser } from "../validators/uservalidate.js";

const router =express.Router();

router.post('/register',validateUser(userSchema),registerUser)

router.post('/verify',verification)

router.post('/login',validateUser(loginSchema),loginUser)

router.post('/logout',isAuthenticated,logoutUser)

router.post('/forgot-password',validateUser(emailSchema),forgotPassword)

router.post('/verify-otp/:email',validateUser(otpSchema),verifyOtp)

router.post('/change-password/:email',validateUser(resetPasswordSchema),changePassword)

export default router;