import { Navigate } from "react-router-dom";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) throw new Error("Unauthenticated");
    return res.json();
  });

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { error, isLoading } = useSWR("https://backend-73ny.onrender.com/api/auth/me", fetcher);

  if (isLoading) return null;

  if (error) {
    return <Navigate to="/" replace />;
  }

  return children;
}
