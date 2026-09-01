import { body } from 'express-validator';

export const registerValidator = [
  body('name').isString().isLength({ min: 2, max: 80 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({
    minLength: 8, minSymbols: 0
  }),
  body('role')
  .isIn(['user', 'admin', 'co-admin'])
  .withMessage('Invalid registration role')
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 })
];

export const changePasswordValidator = [
  body('currentPassword').isString().isLength({ min: 6 }),
  body('newPassword').isStrongPassword({ minLength: 8, minSymbols: 0 })
];

export const forgotPasswordValidator = [
  body('email').isEmail().normalizeEmail()
];

export const resetPasswordValidator = [
  body('token').isString().notEmpty(),
  body('newPassword').isStrongPassword({ minLength: 8, minSymbols: 0 })
];

// OTP-based change password validators
export const requestPasswordOtpValidator = []; // no body needed
export const changePasswordWithOtpValidator = [
  body('otp').isString().isLength({ min: 6, max: 6 }),
  body('newPassword').isStrongPassword({ minLength: 8, minSymbols: 0 })
];