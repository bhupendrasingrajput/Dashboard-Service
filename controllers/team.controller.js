import config from '../config/index.js';
import { Department, Team } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';

const isDev = config.environment === 'development';

export const createTeam = async (req, res, next) => {
    try {
        const { name, departmentId } = req.body;

        if (!name || !departmentId) throw new ApiError(404, 'Team Name & Department ID is required!');

        const existingTeam = await Team.findOne({
            where: { name, departmentId },
            attributes: ['id'],
            raw: true,
        });

        if (existingTeam) throw new ApiError(400, 'Team Already Exists!');

        const department = await Department.findOne({
            where: { id: departmentId },
            attributes: ['name'],
            raw: true,
        });

        if (!department) throw new ApiError(404, 'Department not found!');

        const team = await Team.create({ name, departmentId, });

        res.status(200).json({
            success: true,
            message: "Team Created successfully",
            team: { id: team.id, name: team.name, departmentId: team.departmentId, departmentName: department.name },
        });
    } catch (error) {
        if (isDev) console.error('[TEAM_ERROR]', error);
        next(error);
    }
};