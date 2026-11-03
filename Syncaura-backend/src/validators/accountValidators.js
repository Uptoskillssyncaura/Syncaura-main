import { body } from 'express-validator';

export const activateAccountValidator = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Invitation token is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
];