import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Background from "./Background.jsx";

function FullScreenLoader() {
  return (
    <div className="relative grid min-h-svh place-items-center">
      <Background />
      <div
        role="status"
        aria-label="Chargement"
        className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-neon-cyan"
      />
    </div>
  );
}

// Réservé aux utilisateurs connectés
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

// Pages de connexion et d'inscription : inutiles si on est déjà connecté
export function PublicOnlyRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenLoader />;
  if (user) return <Navigate to={location.state?.from?.pathname ?? "/"} replace />;
  return <Outlet />;
}