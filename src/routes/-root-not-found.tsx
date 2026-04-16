import { Navigate } from "@tanstack/react-router";

export function RootNotFound() {
  return <Navigate to="/" replace />;
}
