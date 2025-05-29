import express from 'express';
import department_routes from './department.routes.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        pid: process.pid,
        status: 'active',
        message: 'Dashoard Service is running!',
        timestamp: new Date().toISOString()
    });
});

router.use('/department', department_routes);

export default router;
