export const getDashboardPath = (user) => {
  if (!user) return "/";

  if ((user.branch_id === 1 || user.branch_id === 2) && user.user_type_id === 2) {
    return "/cylinder";
  } else if (
    (user.branch_id === 1 || user.branch_id === 2) &&
    user.user_type_id === 1
  ) {
    return "/user-view-cylinder";
  }
  
  return "/"; // Default or Access Denied
};
