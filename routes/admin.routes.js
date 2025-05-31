import express from 'express';
import { createAdmin, getAdminPermissions, getAdmins } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/', getAdmins);
router.post('/create', createAdmin);
router.get('/permissions/:id', getAdminPermissions);

export default router;