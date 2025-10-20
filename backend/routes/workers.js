import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/database.js';
import { auth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM workers ORDER BY full_name', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

router.post('/', auth, upload.single('photo'), (req, res) => {
  const {
    full_name, address, bank_name, ifsc_code, account_number,
    phone, emergency_contact, blood_group, date_of_joining, designation
  } = req.body;

  if (!full_name) {
    return res.status(400).json({ error: 'Full name is required' });
  }

  const photo = req.file ? req.file.filename : null;

  const sql = `INSERT INTO workers (
    full_name, photo, address, bank_name, ifsc_code, account_number,
    phone, emergency_contact, blood_group, date_of_joining, designation
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [
    full_name, photo, address, bank_name, ifsc_code, account_number,
    phone, emergency_contact, blood_group, date_of_joining, designation
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ 
      id: this.lastID, 
      message: 'Worker added successfully'
    });
  });
});

export default router;
