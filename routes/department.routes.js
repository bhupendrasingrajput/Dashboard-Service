import express from 'express';
import { createDepartment, getDepartments, updateDepartment } from '../controllers/department.controller.js';
const router = express.Router();

router.put('/:departmentId', updateDepartment);
router.get('/all', getDepartments);
router.post('/create', createDepartment);

export default router;