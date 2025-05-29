import { UUID, UUIDV4, JSONB } from "sequelize";
import sequelize from "../config/database.js";

const Permission = sequelize.define('Permission', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    designationId: {
        type: UUID,
        allowNull: false,
        references: { model: 'designations', key: 'id' },
    },
    resourceId : {
        type: UUID,
        allowNull: false,
        references: { model: 'resources', key: 'id' },
    },
    actions: {
        type: JSONB,
        allowNull: false,
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
