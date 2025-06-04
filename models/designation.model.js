import { BOOLEAN, ENUM, STRING, UUID, UUIDV4 } from "sequelize";
import sequelize from "../config/database.js";

const Designation = sequelize.define('Designation',
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
        },
        departmentId: {
            type: UUID,
            references: { model: 'departments', key: 'id' }
        },
    },
    { tableName: 'designations', timestamps: true }
)

export default Designation;