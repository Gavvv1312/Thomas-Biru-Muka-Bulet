import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Calculator from "./pages/Calculator.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PartnerDashboard from "./pages/PartnerDashboard.jsx";
import ManageLocation from "./pages/ManageLocation.jsx";
import MapPage from "./pages/MapPage.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kalkulator" element={<Calculator />} />
        <Route
          path="/peta"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["owner", "admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mitra"
          element={
            <ProtectedRoute roles={["teknisi", "recycler", "admin"]}>
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mitra/lokasi"
          element={
            <ProtectedRoute roles={["teknisi", "recycler"]}>
              <ManageLocation />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
