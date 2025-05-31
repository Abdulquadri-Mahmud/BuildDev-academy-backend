import express from 'express';
import { verifyEmail } from '../controllers/verifyEmail.controller.js';
const router = express.Router();

// GET /api/auth/verify-email?token=...
router.get('/verify-email', verifyEmail);

export default router;
