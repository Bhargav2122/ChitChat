import type { ReactNode } from "react";
import { useAppSelector } from "../app/hooks";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAppSelector((s) => s.auth);
    if(loading) return null;
    if(!user) {
        return <Navigate to='/signin' replace/>
    }

    return <>{children}</>
}

export default ProtectedRoute;