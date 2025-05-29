import Department from "./department.model.js";
import Designation from "./designation.model.js";
import Resource from "./resource.model.js";
import Permission from "./permission.model.js";

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

export {
    Department,
    Designation,
    Resource,
    Permission
};
