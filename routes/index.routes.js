import express from 'express';
import department_routes from './department.routes.js';
import designation_routes from './designation.routes.js';
import team_routes from './team.routes.js';
import admin_routes from './admin.routes.js';
import city_routes from './city.routes.js';
import zone_routes from './zone.routes.js';
import location_routes from './location.routes.js';
import builder_routes from './builder.routes.js';
import amenity_routes from './amenity.routes.js';

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
router.use('/city', city_routes);
router.use('/zone', zone_routes);
router.use('/location', location_routes);
router.use('/builder', builder_routes);
router.use('/amenity', amenity_routes);

export default router;
