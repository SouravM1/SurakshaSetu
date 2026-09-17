import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {

    const { user, loading } = useAuth();

    const location = useLocation();


    // =====================================================
    // WAIT FOR AUTHENTICATION TO LOAD
    // =====================================================

    if (loading) {
        return (
            <div className="auth-loading">
                <h2>Loading...</h2>
                <p>Please wait while we verify your account.</p>
            </div>
        );
    }


    // =====================================================
    // USER NOT LOGGED IN
    // =====================================================

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }


    // =====================================================
    // CHECK USER ROLE
    // =====================================================

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }


    // =====================================================
    // AUTHORIZED USER
    // =====================================================

    return children;
};

export default ProtectedRoute;