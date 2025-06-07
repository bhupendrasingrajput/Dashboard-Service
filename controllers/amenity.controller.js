import { portalApi } from "../apis/index.js";
import { ApiError } from "../utils/ApiError.js";

export const createAmenity = async (req, res, next) => {
    try {
        const { name, image } = req.body;

        if (!name || !image) throw new ApiError(400, 'Amenity name & image is required!');

        const { data } = await portalApi.post('/amenity', { name, image });

        return res.json({
            success: true,
            message: 'Amenity Created!',
            amenity: data?.amenity
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
};

export const updateAmenity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;

        if (!id) throw new ApiError(400, 'Amenity id is required!')

        if (!name && !image) throw new ApiError(400, "At least name or image is required to update.");

        const { data } = await portalApi.put(`/amenity/${id}`, { name, image });

        res.json({
            success: true,
            message: "Amenity updated!",
            amenity: data?.amenity
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

export const deleteAmenity = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) throw new ApiError(400, 'Amenity id is required!');

        await portalApi.delete(`/amenity/${id}`);

        res.json({
            success: true,
            message: "Amenity deleted!"
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

export const getAllAmenities = async (req, res, next) => {
    try {
        const { data } = await portalApi.get('/amenity');

        res.json({
            success: true,
            message: 'Amenities Fetched!',
            amenities: data?.amenities
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
