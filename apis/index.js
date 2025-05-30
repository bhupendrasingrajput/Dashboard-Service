import axios from 'axios';
import config from '../config/index.js';

const { crmService, userService, portalService } = config.services;

const createServiceApi = (baseURL) => axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const userApi = createServiceApi(userService);
const crmApi = createServiceApi(crmService);
const portalApi = createServiceApi(portalService);

export { userApi, crmApi, portalApi };