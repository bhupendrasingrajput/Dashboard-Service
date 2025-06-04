import { BOOLEAN, ENUM, STRING, UUID, UUIDV4 } from "sequelize";
import sequelize from "../config/database.js";

const Team = sequelize.define('Team',
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
            allowNull: false,
            references: { model: 'departments', key: 'id' }
        },
    },
    {
        tableName: 'teams',
        timestamps: true,
        indexes: [
            { fields: ['departmentId'] },
            { fields: ['status'] },
            { fields: ['isVerified'] },
            {
                unique: true,
                fields: ['name', 'departmentId'],
                name: 'uniqueTeamNamePerDepartment'
            }
        ]
    }
);

export default Team;
