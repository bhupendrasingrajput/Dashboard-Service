import { portalApi } from "../apis/index.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from '../models/index.model.js';

export const createCity = async (req, res, next) => {
    try {
        const { name, description, features, faqs, medias } = req.body;
        const user = req.user;

        if (!name || !description) throw new ApiError(400, 'Bad Request, City name and description is required!');

        if (!user) throw new ApiError(400, 'User Id is required in api!')

        const admin = await Admin.findOne({
            where: { centralUserId: user?.id }
        });

        if (!admin) throw new ApiError(401, 'No Valid Admin Found!');

        const { data } = await portalApi.post('/city/create', {
            name,
            description,
            features,
            faqs,
            medias,
            uploadedBy: admin.id
        })

        return res.json({
            status: 'success',
            message: 'City and related data created successfully.',
            city: data?.city
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