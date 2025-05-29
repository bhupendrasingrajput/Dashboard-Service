import { JSON, STRING, UUID, UUIDV4 } from "sequelize";
import sequelize from "../config/database.js";

const Module = sequelize.define('Access',
    {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        departmentId: {
            type: UUID,
            references: { model: 'departments', key: 'id' }
        },
        title: {
            type: STRING,
            allowNull: false
        },
        actions: {
            type: JSON,
            allowNull: false
        },
    },
    { tableName: 'modules', timestamps: true }
)

export default Module;