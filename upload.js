import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/analyzeController.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const result = await analyzeResume(req.file);
    // delete uploaded file after processing
    try { fs.unlinkSync(req.file.path); } catch(e) {}
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
