import LoadingBar from "@/components/loader/loading-bar";
import { PANEL_CHECK } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import apiClient from "@/api/apiClient";
import { setCompanyDetails, setCompanyImage } from "@/store/auth/companySlice";
import appLogout from "@/utils/logout";
import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const Logout = appLogout();
  const { trigger, loading } = useApiMutation();
  const token = useSelector((state) => state.auth.token);

  const [isPanelUp, setIsPanelUp] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [userInfo, setUserInfo] = useState({
    branchId: null,
    userTypeId: null,
  });

  const initializeApp = async () => {
    try {
      const panelRes = await trigger({ url: PANEL_CHECK.getPanelStatus });
      const statusMessage = panelRes?.message || panelRes?.msg || panelRes?.success;

      if (statusMessage?.toLowerCase() === "success" || statusMessage?.toLowerCase() === "ok") {
        setIsPanelUp(true);

        if (panelRes?.code === 201) {
          dispatch(setCompanyDetails(panelRes.company_detils));
          dispatch(setCompanyImage(panelRes.company_image));
        }
      } else {
        console.warn("Panel check response:", panelRes);
        console.warn("Panel check status message:", statusMessage);
        // We still set initialized to true to allow the app to load
      }

      // Initialization successful, but we don't force navigate to "/"
      // to avoid overriding protected routes.
      setInitialized(true);
    } catch (error) {
      console.error("Initialization error:", error.message);
      setInitialized(true);
      // No navigate("/") here either
    }
  };

  const pollPanelStatus = async () => {
    try {
      // Use direct apiClient call to avoid triggering root-level re-render via useApiMutation's loading state
      const res = await apiClient.get(PANEL_CHECK.getPanelStatus);
      const panelRes = res.data;
      const statusMessage = panelRes?.message || panelRes?.msg || panelRes?.success;
      if (statusMessage?.toLowerCase() !== "success" && statusMessage?.toLowerCase() !== "ok") {
        throw new Error();
      }
      setIsPanelUp(true);
    } catch {
      setIsPanelUp(false);
    }
  };

  useEffect(() => {
    initializeApp();
    const interval = setInterval(pollPanelStatus, 30000);
    return () => clearInterval(interval);
  }, [token]);

  if (!initialized) return null;

  return (
    <ContextPanel.Provider value={{ isPanelUp, userInfo, setUserInfo }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
