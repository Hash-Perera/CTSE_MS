import Role from "../models/role.model.js";

export const hasPermission = (requiredPermission) => {
  return async (req, res, next) => {
    const userRoleName = req.user?.role;
    if (!userRoleName) {
      return res.status(403).json({ message: "Role not assigned" });
    }

    const role = await Role.findOne({ name: userRoleName });
    if (!role || !role.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Access denied. Permission required: " + requiredPermission,
      });
    }

    next();
  };
};
