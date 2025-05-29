import { BOOLEAN, ENUM, STRING, UUID, UUIDV4 } from "sequelize";
import sequelize from "../config/database.js";

const Department = sequelize.define('Department',
    {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        name: {
            type: STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        isVerified: {
            type: BOOLEAN,
            defaultValue: true
        }
    },
    { tableName: 'departments', timestamps: true }
)

export default Department;