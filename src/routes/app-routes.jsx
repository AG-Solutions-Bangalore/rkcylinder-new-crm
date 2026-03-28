import Login from "@/app/auth/login";
import NotFound from "@/app/errors/not-found";
import Settings from "@/app/setting/setting";
import Cylinder from "@/app/cylinder/cylinder";
import UserViewCylinder from "@/app/user-view-cylinder/user-view-cylinder";
import Maintenance from "@/components/common/maintenance";
import ErrorBoundary from "@/components/error-boundry/error-boundry";
import ForgotPassword from "@/components/forgot-password/forgot-password";
import SignUpAuth from "@/components/auth/signup-auth";
import LoadingBar from "@/components/loader/loading-bar";
import ManufacturerList from "@/app/manufacturer/manufacturer";
import VendorList from "@/app/vendor/vendor";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./auth-route";
import ProtectedRoute from "./protected-route";

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Login />} />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<LoadingBar />}>
                <SignUpAuth />
              </Suspense>
            }
          />
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/settings"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="/cylinder"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Cylinder />
              </Suspense>
            }
          />
          <Route
            path="/user-view-cylinder"
            element={
              <Suspense fallback={<LoadingBar />}>
                <UserViewCylinder />
              </Suspense>
            }
          />
          <Route
            path="/manufacturer"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ManufacturerList />
              </Suspense>
            }
          />
          <Route
            path="/vendor"
            element={
              <Suspense fallback={<LoadingBar />}>
                <VendorList />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default AppRoutes;
