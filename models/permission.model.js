import { UUID, UUIDV4, JSONB, INTEGER } from "sequelize";
import sequelize from "../config/database.js";

const Permission = sequelize.define('Permission', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    resourceId: {
        type: INTEGER,
        allowNull: false,
        references: { model: 'resources', key: 'id' },
    },
    actions: {
        type: JSONB,
        allowNull: false,
    },
    designationId: {
        type: UUID,
        allowNull: false,
        references: { model: 'designations', key: 'id' },
    },
}, {
    tableName: 'permissions',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['designationId', 'resourceId'],
        },
    ],
});

export default Permission;
