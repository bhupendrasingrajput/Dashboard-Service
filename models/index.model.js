import Department from "./department.model.js";
import Designation from "./designation.model.js";
import Resource from "./resource.model.js";
import Permission from "./permission.model.js";
import Team from "./team.model.js";
import Admin from "./admin.model.js";

// Department - Designation
Department.hasMany(Designation, { foreignKey: 'departmentId', as: 'designations' });
Designation.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// Department - Resource
Department.hasMany(Resource, { foreignKey: 'departmentId', as: 'resources' });
Resource.belongsTo(Department, { foreignKey: 'departmentId' });

// Designation - Permission
Designation.hasMany(Permission, { foreignKey: 'designationId', as: 'permissions', onDelete: 'CASCADE' });
Permission.belongsTo(Designation, { foreignKey: 'designationId', as: 'designation' });

// Resource - Permission
Resource.hasMany(Permission, { foreignKey: 'resourceId', as: 'permissions' });
Permission.belongsTo(Resource, { foreignKey: 'resourceId', as: 'resource' });

// Department - Team
Department.hasMany(Team, { foreignKey: 'departmentId', as: 'teams', onDelete: 'CASCADE' });
Team.belongsTo(Department, { foreignKey: 'departmentId', as: 'department', onDelete: 'CASCADE' });

// Admin - Department
Admin.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(Admin, { foreignKey: 'departmentId', as: 'users' });

// Admin - Designation
Admin.belongsTo(Designation, { foreignKey: 'designationId', as: 'designation' });
Designation.hasMany(Admin, { foreignKey: 'designationId', as: 'users' });

// Admin - Team
Admin.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });
Team.hasMany(Admin, { foreignKey: 'teamId', as: 'users' });


export {
    Department,
    Designation,
    Resource,
    Permission,
    Team,
    Admin
};
