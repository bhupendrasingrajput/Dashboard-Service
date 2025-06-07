import { portalApi } from "../apis/index.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from '../models/index.model.js';

export const createBuilder = async (req, res, next) => {
    try {
        const { name, description, logo, bgImage, histories, employees } = req.body;
        const user = req.user;

        if (!user) {
            throw new ApiError(400, 'User is required!');
        }

        if (!name || !description || !logo || !bgImage || !histories || !employees) {
            throw new ApiError(400, 'name, description, logo, bgImage, histories, employees are required!')
        }

        const admin = await Admin.findOne({
            where: { centralUserId: user?.id }
        });

        if (!admin) throw new ApiError(401, 'No Valid Admin Found!');

        const { data } = await portalApi.post('/builder/create', {
            name,
            description,
            logo,
            bgImage,
            histories,
            employees,
            uploadedBy: admin.id
        });

        return res.json({
            status: 'success',
            message: 'Builder & Related data created!',
            builder: data?.builder
        });
    } catch (error) {
        if (error.response?.data?.message) {
            return res.status(error.response.status || 500).json({
                status: 'error',
                message: error.response.data.message,
                stack: error.response.data.stack || 'No stack!'
            });
        }
        next(error);
    }
};

export const getAllBuilders = async (req, res, next) => {
    try {
        const { exclude } = req.query;

        const { data } = await portalApi.get('/builder/all', {
            params: { exclude }
        });

        return res.json({
            success: data?.success,
            message: data?.message,
            builders: data?.builders
        })
    } catch (error) {
        if (error.response?.data?.message) {
            return res.status(error.response.status || 500).json({
                status: 'error',
                message: error.response.data.message,
                stack: error.response.data.stack || 'No stack!'
            });
        }
        next(error);
    }
}

export const getBuilderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { exclude } = req.query;

        const { data } = await portalApi.get(`/builder/${id}`, {
            params: { exclude }
        });

        return res.json({
            success: true,
            message: 'Builder Fetched!',
            builder: data?.builder
        });
    } catch (error) {
        if (error.response?.data?.message) {
            return res.status(error.response.status || 500).json({
                status: 'error',
                message: error.response.data.message,
                stack: error.response.data.stack || 'No stack!'
            });
        }
        next(error);
    }
}