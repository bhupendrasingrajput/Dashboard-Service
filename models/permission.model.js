import { JSON, STRING, UUID, UUIDV4 } from "sequelize";
import sequelize from "../config/database.js";

const Permission = sequelize.define('Permission',
    {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        desigationId: {
            type: UUID,
            references: { model: 'designations', key: 'id' }
        },
        moduleId: {
            type: UUID,
            references: { model: 'modules', key: 'id' }
        },
        action: {
            type: STRING,
            allowNull: false
        },
    },
    { tableName: 'permissions', timestamps: true }
)

export default Permission;