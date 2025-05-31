import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { Department, Designation, Permission, Resource } from '../models/index.model.js';
import { deleteCache } from '../services/caching.service.js';
import { ApiError } from '../utils/ApiError.js';

export const createDesignation = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { name, departmentId, permissions = {} } = req.body;

        if (!name) throw new ApiError(400, 'Designation name is required');
        if (!departmentId) throw new ApiError(400, 'Department ID is required');

        const existingDesignation = await Designation.findOne({
            where: { name, departmentId },
            transaction: t
        });

        if (existingDesignation) {
            throw new ApiError(409, "Designation already exists in this department");
        }

        const newDesignation = await Designation.create(
            { name, departmentId, isVerified: true },
            { transaction: t }
        );

        const permissionEntries = [];

        if (permissions && typeof permissions === 'object') {
            for (const [resourceId, actions] of Object.entries(permissions)) {
                if (!Array.isArray(actions) || actions.length === 0) {
                    throw new ApiError(400, `Actions for resourceId ${resourceId} must be a non-empty array`);
                }

                permissionEntries.push({
                    id: newDesignation.id,
                    resourceId,
                    actions,
                });
            }

            await Permission.bulkCreate(permissionEntries, { transaction: t });
        }

        await t.commit();

        res.status(201).json({
            success: true,
            message: "Designation created successfully",
            designation: newDesignation,
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const getDesignations = async (req, res, next) => {
    try {
        const { departmentId } = req.query;

        const designations = await Designation.findAll({
            where: departmentId ? { departmentId } : undefined,
            attributes: ['id', 'name', 'status'],
            include: [
                {
                    model: Department,
                    as: 'department',
                    attributes: ['name'],
                },
                {
                    model: Permission,
                    as: 'permissions',
                    attributes: ['actions'],
                    include: [{
                        model: Resource,
                        as: 'resource',
                        attributes: ['title'],
                    }],
                },
            ],
        });

        if (departmentId && designations.length === 0) {
            throw new ApiError(404, 'No designations found for this Department');
        }

        res.status(200).json({
            message: 'Designations retrieved successfully',
            data: designations,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDesignation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;
        let updatedPermissions = [];

        const designation = await Designation.findByPk(id);

        if (!designation) throw new ApiError(404, "Designation not found");

        if (name && name !== designation.name) {
            const exists = await Designation.findOne({
                where: { name, id: { [Op.ne]: id } },
            });
            if (exists) throw new ApiError(400, "Designation name already in use");
            designation.name = name;
        }

        if (permissions && typeof permissions === 'object') {
            await Permission.destroy({ where: { designationId: id } });

            const permissionData = Object.entries(permissions).map(
                ([resourceId, actions]) => {
                    if (!Array.isArray(actions) || actions.length === 0) {
                        throw new ApiError(400, `Actions for resource ${resourceId} must be a non-empty array`);
                    }

                    return {
                        designationId: id,
                        resourceId,
                        actions,
                    };
                }
            );

            updatedPermissions = await Permission.bulkCreate(permissionData);
        }

        await designation.save();

        await deleteCache(`dashboard:permissions:${id}`);

        const result = {
            success: true,
            message: "Designation updated successfully",
            designation: designation,
            permissions: updatedPermissions
        }

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};