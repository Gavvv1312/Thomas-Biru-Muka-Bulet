import { Navigate, useLocation } from "react-router-dom";
import { useAuth, homeForRole } from "../lib/AuthContext.jsx";

export default function ProtectedRoute({ roles, children }) {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />;
  }

  return children;
}
