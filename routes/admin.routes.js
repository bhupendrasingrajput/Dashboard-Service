import express from 'express';
import { createAdmin, getAdminPermissions } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/create', createAdmin);
router.get('/permissions/:id', getAdminPermissions);

export default router;