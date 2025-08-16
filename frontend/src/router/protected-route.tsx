import { Navigate } from "react-router-dom";
import useSWR from "swr";
import { LineSpinner } from "ldrs/react";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) throw new Error("Unauthenticated");
    return res.json();
  });

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // const { error, isLoading } = useSWR("https://backend-73ny.onrender.com/api/auth/me", fetcher);
  const { error, isLoading } = useSWR("https://fullstack-kanban-backend.vercel.app/api/auth/me", fetcher);

  if (isLoading) {
    return (<div>
        <LineSpinner size="36" stroke="3" speed="1" color="white" />
    </div>)
  }
    
  if (error) {
    return <Navigate to="/" replace />;
  }

  return children;
}
