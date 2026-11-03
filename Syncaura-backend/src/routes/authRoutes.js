import { Router } from 'express';

import {
  register,
  login,
  refresh,
  changePassword,
  forgotPassword,
  resetPassword,
  adminOnly,
  requestPasswordOtp,
  changePasswordWithOtp,
  getProfile,
  logout
} from '../controllers/authController.js';

import { activateAccount } from '../controllers/accountController.js';
import {
  initiateGoogleLogin,
  handleGoogleCallback,
  handleGithubCallback
} from '../controllers/oauthController.js';

import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/role.js';

import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  requestPasswordOtpValidator,
  changePasswordWithOtpValidator
} from '../validators/authValidators.js';

import {
  activateAccountValidator
} from '../validators/accountValidators.js';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/refresh', refresh);

// Social Login
router.get('/google', initiateGoogleLogin);
router.get('/google/callback', handleGoogleCallback);
router.post('/github/callback', handleGithubCallback);

router.get('/me', auth, getProfile);

// OTP change password flow
router.post(
  '/request-password-otp',
  auth,
  requestPasswordOtpValidator,
  requestPasswordOtp
);

router.post(
  '/change-password-otp',
  auth,
  changePasswordWithOtpValidator,
  changePasswordWithOtp
);

// Email reset flow
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password', resetPasswordValidator, resetPassword);

// Traditional change password
router.put('/change-password', auth, changePasswordValidator, changePassword);

// Role-based route
router.get('/admin', auth, permit('admin'), adminOnly);

// Logout
router.post('/logout', logout);

router.post(
  '/activate-account',
  activateAccountValidator,
  activateAccount
);

export default router;