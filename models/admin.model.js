import { BOOLEAN, ENUM, STRING, UUID, UUIDV4 } from "sequelize";
import sequelize from "../config/database.js";

const Admin = sequelize.define('Admin',
    {
        id: {
            type: UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        name: {
            type: STRING,
            allowNull: false
        },
        email: {
            type: STRING,
            unique: true,
            allowNull: false,
        },
        phone: {
            type: STRING,
            unique: true,
            allowNull: false
        },
        profilePic: {
            type: STRING,
            allowNull: true
        },
        designationName: {
            type: STRING,
            allowNull: false
        },
        designationId: {
            type: UUID,
            allowNull: false,
            references: { model: 'designations', key: 'id' }
        },
        departmentId: {
            type: UUID,
            allowNull: false,
            references: { model: 'departments', key: 'id' }
        },
        teamId: {
            type: UUID,
            allowNull: true,
            references: { model: 'teams', key: 'id' }
        },
        status: {
            type: ENUM('active', 'inactive'),
            defaultValue: 'active'
        },
        isVerified: {
            type: BOOLEAN,
            defaultValue: true
        },
        centralUserId: {
            type: UUID,
            unique: true,
            allowNull: false
        },
    },
    {
        tableName: 'admins',
        timestamps: true,
        indexes: [
            { unique: true, fields: ['centralUserId'] },
            { unique: true, fields: ['email'] },
            { unique: true, fields: ['phone'] },
            { fields: ['departmentId'] },
            { fields: ['designationId'] },
            { fields: ['teamId'] }
        ]
    }
);

export default Admin;
