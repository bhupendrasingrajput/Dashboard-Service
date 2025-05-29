import express from 'express';
import { createDesignation, getDesignations, updateDesignation } from '../controllers/designation.controller.js';

const router = express.Router();

router.post('/create', createDesignation);
router.get('/all', getDesignations);
router.put('/:id', updateDesignation)

export default router;