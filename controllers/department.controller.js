import sequelize from '../config/database.js';
import config from '../config/index.js';
import { Department, Resource } from '../models/index.model.js';
import { ApiError } from '../utils/ApiError.js';


export const createDepartment = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { departmentName, accessForDepartment } = req.body;

        if (!departmentName) throw new ApiError(400, 'Department name is required');

        if (!Array.isArray(accessForDepartment) || accessForDepartment.length === 0)
            throw new ApiError(400, 'At least one permission resource is required');

        const existing = await Department.findOne({ where: { name: departmentName } });
        if (existing) throw new ApiError(409, 'Department already exists');

        const department = await Department.create({ name: departmentName }, { transaction: t });

        const resources = accessForDepartment.map(resource => ({
            ...resource,
            departmentId: department.id,
        }));

        await Resource.bulkCreate(resources, { transaction: t });

        await t.commit();

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: { department },
        });
    } catch (error) {
        await t.rollback();

        next(error);
    }
};

export const getDepartments = async (req, res, next) => {
    try {
        const departments = await Department.findAll({
            attributes: ['id', 'name', 'status', 'isVerified'],
            include: [
                { model: Resource, as: 'resources', attributes: ['id', 'title', 'actions'] }
            ]
        });

        res.status(200).json({
            success: true,
            success: "Departments retrieved successfully",
            departments,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDepartment = async (req, res, next) => {
    try {
        const { departmentId } = req.params;
        const { departmentName, accessForDepartment } = req.body;

        if (!departmentId) throw new ApiError(400, 'Department ID is required');

        const existingDepartment = await Department.findByPk(departmentId, {
            attributes: ['id', 'name', 'status'],
            include: [
                { model: Resource, as: 'resources', attributes: ['id', 'title', 'actions'] }
            ]
        });

        if (!existingDepartment) throw new ApiError(404, 'Department not found');

        if (departmentName && departmentName !== existingDepartment.name) {
            const nameExists = await Department.findOne({
                where: { name: departmentName },
            });

            if (nameExists) throw new ApiError(409, 'Another department with this name already exists');

            existingDepartment.name = departmentName;
        }

        if (Array.isArray(accessForDepartment)) {
            await Resource.destroy({ where: { departmentId } });

            await Resource.bulkCreate(
                accessForDepartment.map(resource => ({
                    ...resource,
                    departmentId,
                }))
            );
        }

        await existingDepartment.save();

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            department: existingDepartment,
        });

    } catch (error) {

        next(error);
    }
};