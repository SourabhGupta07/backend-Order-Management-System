/*import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderQuantity,
  deleteOrder
} from '../controllers/orderController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Validation rules
const orderValidation = [
  body('customerName')
    .isLength({ min: 3, max: 30 })
    .withMessage('Customer name must be between 3-30 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('contactNumber')
    .matches(/^\d{10}$/)
    .withMessage('Contact number must be exactly 10 digits'),
  body('shippingAddress')
    .isLength({ max: 100 })
    .withMessage('Shipping address cannot exceed 100 characters'),
  body('productName')
    .isLength({ min: 3, max: 50 })
    .withMessage('Product name must be between 3-50 characters'),
  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1-100')
];

// Routes
//router.post('/', upload.single('productImage'), orderValidation, createOrder);
router.post('/', authMiddleware, upload.single('productImage'), orderValidation, createOrder);
router.get('/', authMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/quantity', authMiddleware, updateOrderQuantity);
router.delete('/:id', authMiddleware, deleteOrder);

export default router;  */


import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderQuantity,
  deleteOrder
} from '../controllers/orderController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Multer error handling wrapper
const uploadMiddleware = (req: any, res: any, next: any) => {
  upload.single('productImage')(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// Validation rules
const orderValidation = [
  body('customerName')
    .isLength({ min: 3, max: 30 })
    .withMessage('Customer name must be between 3-30 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('contactNumber')
    .matches(/^\d{10}$/)
    .withMessage('Contact number must be exactly 10 digits'),
  body('shippingAddress')
    .isLength({ max: 100 })
    .withMessage('Shipping address cannot exceed 100 characters'),
  body('productName')
    .isLength({ min: 3, max: 50 })
    .withMessage('Product name must be between 3-50 characters'),
  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1-100')
];

// Routes
router.post('/', authMiddleware, uploadMiddleware, orderValidation, createOrder);
router.get('/', authMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/quantity', authMiddleware, updateOrderQuantity);
router.delete('/:id', authMiddleware, deleteOrder);

export default router;
