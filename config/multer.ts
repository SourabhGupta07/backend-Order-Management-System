import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req: Request, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.png', '.jpg', '.jpeg'];
  if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
    return cb(new Error('Only .png, .jpg and .jpeg allowed'));
  }
  cb(null, true);
};

export default multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter
});
