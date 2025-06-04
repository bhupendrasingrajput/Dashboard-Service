import { INTEGER, JSON, STRING, UUID, UUIDV4 } from "sequelize";
import sequelize from "../config/database.js";

const Resource = sequelize.define('Access',
    {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: STRING,
            allowNull: false
        },
        actions: {
            type: JSON,
            allowNull: false
        },
        departmentId: {
            type: UUID,
            references: { model: 'departments', key: 'id' }
        },
    },
    { tableName: 'resources', timestamps: false }
)

export default Resource;