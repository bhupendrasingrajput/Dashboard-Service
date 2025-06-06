import { portalApi } from "../apis/index.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from '../models/index.model.js';

export const createLocation = async (req, res, next) => {
    try {
        const { name, description, coordinates, cityId, zoneId, features, faqs, medias } = req.body;
        const user = req.user;

        if (!name || !description || !cityId) throw new ApiError(400, 'Name, Description & City ID is required!');

        if (!user.id) throw new ApiError(400, 'User Id is required in api!');

        const admin = await Admin.findOne({
            where: { centralUserId: user?.id }
        });

        if (!admin) throw new ApiError(401, 'No Valid Admin Found!');

        const { data } = await portalApi.post('/location/create', {
            name,
            description,
            coordinates,
            features,
            faqs,
            medias,
            cityId,
            zoneId,
            uploadedBy: admin.id
        })

        return res.json({
            status: 'success',
            message: 'Location and related data created successfully.',
            city: data?.location
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

export const getAllLocations = async (req, res, next) => {
    try {
        const { cityId, exclude } = req.query;

        if (!cityId) throw new ApiError(400, 'City ID is required!');

        const { data } = await portalApi.get('/location/all', {
            params: { cityId, exclude }
        });

        return res.json({
            success: true,
            message: "Locations Fetched!",
            locations: data?.locations
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