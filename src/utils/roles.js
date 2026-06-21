export const ROLE_HIERARCHY = {
  user: 1,
  editor: 2,
  moderator: 3,
  admin: 4,
};

export const ROUTE_ROLES = {

  ALL_AUTHENTICATED: ["user", "editor", "moderator", "admin"],
  EDITOR_AND_ABOVE:  ["editor", "moderator", "admin"],
  MODERATOR_AND_ABOVE: ["moderator", "admin"],
  ADMIN_ONLY: ["admin"],
};

export const hasRole = (userObj, allowedRoles) => {

  if (!userObj || !allowedRoles?.length) return false;
  const role = userObj?.user?.role ?? userObj?.role ?? null;
  if (!role) return false;
  return allowedRoles.includes(role);
};

export const hasMinRole = (userObj, minRole) => {

  const role = userObj?.user?.role ?? userObj?.role ?? null;
  if (!role || !minRole) return false;
  return (ROLE_HIERARCHY[role] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
};