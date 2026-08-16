import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import AppLoading from "../pages/amkoloading";

const ProtectedRoute = ({
  children,
}) => {
  const location = useLocation();
  const token = Cookies.get("access_token");

  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
