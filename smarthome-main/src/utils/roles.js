// Sunucudaki User.role ile aynı roller: user | editor | admin | superadmin
export const ROLE_HIERARCHY = {
  user: 1,
  editor: 2,
  admin: 3,
  superadmin: 4,
};

export const ROUTE_ROLES = {

  ALL_AUTHENTICATED: ["user", "editor", "admin", "superadmin"],
  EDITOR_AND_ABOVE:  ["editor", "admin", "superadmin"],
  ADMIN_ONLY: ["admin", "superadmin"],
};

export const getRole = (userObj) => userObj?.user?.role ?? userObj?.role ?? null;

export const hasRole = (userObj, allowedRoles) => {

  if (!userObj || !allowedRoles?.length) return false;
  const role = getRole(userObj);
  if (!role) return false;
  return allowedRoles.includes(role);
};

export const hasMinRole = (userObj, minRole) => {

  const role = getRole(userObj);
  if (!role || !minRole) return false;
  return (ROLE_HIERARCHY[role] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
};

// Girişten sonra rolüne göre açılacak panel
export const homePathFor = (userObj) => {

  const role = getRole(userObj);
  if (role === 'admin' || role === 'superadmin') return '/admin/dashboard';
  if (role === 'editor') return '/editor/dashboard';
  return '/user/dashboard';
};
