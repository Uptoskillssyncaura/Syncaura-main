import { Router } from 'express';
import {
  register, login, refresh, changePassword,
  forgotPassword, resetPassword, adminOnly,
  requestPasswordOtp, changePasswordWithOtp, logout,
  getProfile, updateProfile
} from '../controllers/authController.js';
import  {auth}  from '../middlewares/auth.js';
import  {permit}  from '../middlewares/role.js';
import {
  registerValidator, loginValidator, changePasswordValidator,
  forgotPasswordValidator, resetPasswordValidator,
  requestPasswordOtpValidator, changePasswordWithOtpValidator
} from '../validators/authValidators.js';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/refresh', refresh);

//setting upgrades 

// OTP change password flow
router.post('/request-password-otp', auth, requestPasswordOtpValidator, requestPasswordOtp);
router.post('/change-password-otp', auth, changePasswordWithOtpValidator, changePasswordWithOtp);

// Email reset flow
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password', resetPasswordValidator, resetPassword);

// Traditional change password (with current password)
router.put('/change-password', auth, changePasswordValidator, changePassword);
//new 

// Profile endpoints
router.get('/profile', auth, getProfile);
router.get('/me', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Example role-based route
router.get('/admin', auth, permit('admin'), adminOnly);

router.post("/logout", logout);
export default router;