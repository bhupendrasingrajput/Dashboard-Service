import express from 'express';
import department_routes from './department.routes.js';
import designation_routes from './designation.routes.js';
import team_routes from './team.routes.js';
import admin_routes from './admin.routes.js';

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
router.use('/designation', designation_routes);
router.use('/team', team_routes);
router.use('/admin', admin_routes);

export default router;
