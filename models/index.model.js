import Department from "./department.model.js";
import Designation from "./designation.model.js";
import Module from "./module.model.js";
import Permission from "./permission.model.js";

// Department - Designation
Department.hasMany(Designation, { foreignKey: 'departmentId', as: 'designations' });
Designation.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// Department - Module
Department.hasMany(Module, { foreignKey: 'departmentId', as: 'modules' });
Module.belongsTo(Department, { foreignKey: 'departmentId' });

// Designation - Permission
Designation.hasMany(Permission, { foreignKey: 'designationId', as: 'permissions', onDelete: 'CASCADE' });
Permission.belongsTo(Designation, { foreignKey: 'designationId', as: 'designation' });

// Module - Permission
Module.hasMany(Permission, { foreignKey: 'moduleId', as: 'permissions' });
Permission.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });

export {
    Department,
    Designation,
    Module,
    Permission
};
