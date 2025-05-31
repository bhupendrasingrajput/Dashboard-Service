import { Admin, Department, Designation, Permission, Resource, Team } from '../models/index.model.js';
import { createUser } from '../services/users.service.js';
import { ApiError } from '../utils/ApiError.js';
import { getCache, setCache } from '../services/caching.service.js';

export const createAdmin = async (req, res, next) => {
    try {
        const { name, email, password, phone, designationId, departmentId, teamId } = req.body;

        if (!name || !email || !password || !phone || !departmentId || !designationId) {
            throw new ApiError(400, 'Bad Request! Please provide all required fields.');
        }

        const existing = await Admin.findOne({
            where: { email, phone },
            attributes: ['id'],
            raw: true
        });

        if (existing) throw new ApiError(400, 'Admin with this email or phone already exists.');

        const designation = await Designation.findOne({
            where: { id: designationId },
            attributes: ['id', 'name'],
            include: [{
                model: Department,
                where: { id: departmentId },
                as: 'department',
                attributes: ['id', 'name'],
                required: true,
            }],
        });

        if (!designation) throw new ApiError(404, 'Designation & Department Validation Failed!');

        let team = null;

        if (teamId) {
            team = await Team.findOne({
                where: { id: teamId },
                attributes: ['id', 'name'],
                raw: true
            });

            if (!team) throw new ApiError(404, 'Team not found!');
        }

        const centralUser = await createUser({ name, email, phone, password, service: 'dashboard' });

        if (!centralUser) throw new ApiError(500, 'Failed to create central user.');

        const admin = await Admin.create({
            centralUserId: centralUser.id,
            name,
            email,
            phone,
            designationId: designation.id,
            designationName: designation.name,
            departmentId: designation.department.id,
            teamId: teamId || null,
        });

        if (!admin) throw new ApiError(500, 'Failed to create admin.');

        res.status(201).json({
            status: 'success',
            message: 'Admin created successfully.',
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                designation: designation.name,
                department: designation.department.name,
                teamId: admin.teamId,
                teamName: team ? team.name : null,
                status: admin.status,
                isVerified: admin.isVerified,
            }
        });

    } catch (error) {
        next(error);
    }
};

export const getAdminPermissions = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, 'Bad Request! Admin ID is required.');
        }

        const adminMeta = await Admin.findByPk(id, {
            attributes: ['id', 'designationId']
        });

        if (!adminMeta) throw new ApiError(404, 'Admin not found.');

        const cacheKey = `dashboard:permissions:${adminMeta.designationId}`;
        const cached = await getCache(cacheKey);

        if (cached) {
            return res.status(200).json({
                status: 'success',
                cached: true,
                permissions: cached,
            });
        }

        const designation = await Designation.findByPk(adminMeta.designationId, {
            include: {
                model: Permission,
                as: 'permissions',
                attributes: ['actions'],
                include: {
                    model: Resource,
                    as: 'resource',
                    attributes: ['title']
                }
            }
        });

        if (!designation) throw new ApiError(404, 'Designation not found.');

        const permissions = designation?.permissions.reduce((acc, curr) => {
            const resourceTitle = curr.resource?.title;
            if (resourceTitle) {
                acc[resourceTitle] = curr.actions;
            }
            return acc;
        }, {});

        await setCache(cacheKey, permissions, 900);

        return res.status(200).json({
            status: 'success',
            cached: false,
            permissions,
        });

    } catch (error) {
        next(error);
    }
}

export const getAdmins = async (req, res, next) => {
    try {
        const { id } = req.query;
        const admins = await Admin.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'designationId', 'departmentId', 'teamId']
            },
            include: [
                { model: Department, as: 'department', attributes: ['id', 'name'] },
                { model: Team, as: 'team', attributes: ['id', 'name'] },
            ]
        });

        res.json({
            success: true,
            message: 'Admins Fetched Successfully!',
            admins
        });

    } catch (error) {
        next(error)
    }
}