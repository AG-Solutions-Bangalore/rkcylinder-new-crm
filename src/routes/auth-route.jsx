import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/api/use-auth";
import { getDashboardPath } from "@/utils/navigation";
import { useSelector } from "react-redux";
import DashboardSkeleton from "@/components/skeleton-loader/dashboard-skeleton";
import { isAuthRoute } from "./common/route-paths";

const AuthRoute = () => {
  const location = useLocation();
  const { isLoading, isAuthenticated } = useAuth();
  const isPublicAuthRoute = isAuthRoute(location.pathname);

  const user = useSelector((state) => state.auth.user);

  if (isLoading && !isPublicAuthRoute) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to={getDashboardPath(user)} replace />;
};

export default AuthRoute;
