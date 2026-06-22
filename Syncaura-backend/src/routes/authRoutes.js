import { Router } from 'express';
import {
  register, login, refresh, changePassword,
  forgotPassword, resetPassword, adminOnly,
  requestPasswordOtp, changePasswordWithOtp
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

// OTP change password flow
router.post('/request-password-otp', auth, requestPasswordOtpValidator, requestPasswordOtp);
router.post('/change-password-otp', auth, changePasswordWithOtpValidator, changePasswordWithOtp);

// Email reset flow
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password', resetPasswordValidator, resetPassword);

// Traditional change password (with current password)
router.post('/change-password', auth, changePasswordValidator, changePassword);

// Example role-based route
router.get('/admin', auth, permit('admin'), adminOnly);

export default router; 