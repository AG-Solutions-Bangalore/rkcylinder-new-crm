import Login from "@/app/auth/login";
import NotFound from "@/app/errors/not-found";
import Settings from "@/app/setting/setting";
import Cylinder from "@/app/cylinder/cylinder";
import Maintenance from "@/components/common/maintenance";
import ErrorBoundary from "@/components/error-boundry/error-boundry";
import ForgotPassword from "@/components/forgot-password/forgot-password";
import SignUpAuth from "@/components/auth/signup-auth";
import LoadingBar from "@/components/loader/loading-bar";
import ManufacturerList from "@/app/manufacturer/manufacturer";
import VendorList from "@/app/vendor/vendor";
import UserViewCylinder from "@/app/user-view-cylinder/user-view-cylinder";
import ViewCylinder from "@/app/view-cylinder/view-cylinder";
import VendorReport from "@/app/reports/vendor-report";
import ManufacturerReport from "@/app/reports/manufacturer-report";
import GeneralReport from "@/app/reports/general-report";
import CylinderDetailsReport from "@/app/reports/cylinder-details-report";
import AuthRoute from "./auth-route";
import ProtectedRoute from "./protected-route";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

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
            path="/view-cylinder"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ViewCylinder />
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
          {/* Reports */}
          <Route
            path="/report/vendor"
            element={
              <Suspense fallback={<LoadingBar />}>
                <VendorReport />
              </Suspense>
            }
          />
          <Route
            path="/report/manufacturer"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ManufacturerReport />
              </Suspense>
            }
          />
          <Route
            path="/report/general"
            element={
              <Suspense fallback={<LoadingBar />}>
                <GeneralReport />
              </Suspense>
            }
          />
          <Route
            path="/report/cylinder-details"
            element={
              <Suspense fallback={<LoadingBar />}>
                <CylinderDetailsReport />
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
