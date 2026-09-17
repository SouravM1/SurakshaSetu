import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import CitizenProfile from "./pages/CitizenProfile";
import ChangePassword from "./pages/ChangePassword";
import Settings from "./pages/Settings";

import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenNotifications from "./pages/CitizenNotifications";
import ReportEmergency from "./pages/ReportEmergency";
import SafetyInformation from "./pages/SafetyInformation";
import MyReports from "./pages/MyReports";
import EmergencyMap from "./pages/EmergencyMap";

import ResponderDashboard from "./pages/ResponderDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";


// =====================================================
// ROOT REDIRECT
// =====================================================

const RootRedirect = () => {

    const { user, token } = useAuth();


    // =================================================
    // NOT LOGGED IN
    // =================================================
    // Show the professional landing/home page
    // instead of directly showing the login page.
    // =================================================

    if (!token || !user) {
        return <Home />;
    }


    // =================================================
    // ADMIN
    // =================================================

    if (user.role === "admin") {
        return <Navigate to="/admin" replace />;
    }


    // =================================================
    // RESPONDER
    // =================================================

    if (user.role === "responder") {
        return <Navigate to="/responder" replace />;
    }


    // =================================================
    // CITIZEN
    // =================================================

    if (user.role === "citizen") {
        return <Navigate to="/citizen" replace />;
    }


    // =================================================
    // UNKNOWN ROLE
    // =================================================

    return <Navigate to="/unauthorized" replace />;
};


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =================================================
                    HOME / LANDING PAGE
                ================================================= */}

                <Route
                    path="/"
                    element={<RootRedirect />}
                />


                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =================================================
                    UNAUTHORIZED
                ================================================= */}

                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />


                {/* =================================================
                    CITIZEN PROFILE
                ================================================= */}

                <Route
                    path="/citizen/profile"
                    element={
                        <ProtectedRoute
                            allowedRoles={["citizen"]}
                        >
                            <CitizenProfile />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    CITIZEN CHANGE PASSWORD
                ================================================= */}

                <Route
                    path="/citizen/change-password"
                    element={
                        <ProtectedRoute
                            allowedRoles={["citizen"]}
                        >
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    CITIZEN SETTINGS
                ================================================= */}

                <Route
                    path="/citizen/settings"
                    element={
                        <ProtectedRoute
                            allowedRoles={["citizen"]}
                        >
                            <Settings />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    CITIZEN NOTIFICATIONS
                ================================================= */}

                <Route
                    path="/citizen/notifications"
                    element={
                        <ProtectedRoute
                            allowedRoles={["citizen"]}
                        >
                            <CitizenNotifications />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    CITIZEN DASHBOARD
                ================================================= */}

                <Route
                    path="/citizen"
                    element={
                        <ProtectedRoute
                            allowedRoles={["citizen"]}
                        >
                            <CitizenDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    REPORT EMERGENCY
                ================================================= */}

                <Route
                    path="/citizen/report-emergency"
                    element={
                        <ProtectedRoute
                            allowedRoles={["citizen"]}
                        >
                            <ReportEmergency />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    SAFETY INFORMATION
                ================================================= */}

                <Route
                    path="/citizen/safety-information"
                    element={
                        <ProtectedRoute
                            allowedRoles={["citizen"]}
                        >
                            <SafetyInformation />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    MY REPORTS
                ================================================= */}

                <Route
                    path="/citizen/my-reports"
                    element={
                        <ProtectedRoute
                            allowedRoles={["citizen"]}
                        >
                            <MyReports />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    EMERGENCY MAP
                ================================================= */}

                <Route
                    path="/citizen/emergency-map"
                    element={
                        <ProtectedRoute
                            allowedRoles={["citizen"]}
                        >
                            <EmergencyMap />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    RESPONDER DASHBOARD
                ================================================= */}

                <Route
                    path="/responder"
                    element={
                        <ProtectedRoute
                            allowedRoles={["responder"]}
                        >
                            <ResponderDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    ADMIN DASHBOARD
                ================================================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    UNKNOWN URL
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};


export default App;