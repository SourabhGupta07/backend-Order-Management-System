import express from 'express';
import { body } from 'express-validator';
import { adminLogin } from '../controllers/authController';

const router = express.Router();

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

router.post('/admin/login', loginValidation, adminLogin);

export default router;