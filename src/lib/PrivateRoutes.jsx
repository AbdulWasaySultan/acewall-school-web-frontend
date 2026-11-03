import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({
  user,
  allowedRole,
  redirectTo = "/login",
  loading,
}) => {
  if (loading) return null; // or spinner
  if (!user) return <Navigate to={redirectTo} />;

  const userRole = (user?.role || "").toLowerCase();
  const roles = (Array.isArray(allowedRole) ? allowedRole : [allowedRole]).map(
    (r) => r.toLowerCase()
  );

  if (!roles.includes(userRole)) {
    return null; // render nothing while auth is refreshing
  }

  return roles.includes(userRole) ? <Outlet /> : <Navigate to="/" />;
};

const PublicRoute = ({ user, redirectTo }) => {
  return user ? <Navigate to={redirectTo} /> : <Outlet />;
};

export { PublicRoute, PrivateRoute };