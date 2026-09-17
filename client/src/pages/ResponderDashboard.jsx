import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";

import "./ResponderDashboard.css";

const ResponderDashboard = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // =====================================================
    // FETCH ASSIGNED EMERGENCIES
    // =====================================================

    const fetchEmergencies = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/api/responder/emergencies`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEmergencies(response.data.emergencies || []);
        } catch (error) {
            console.error(
                "Error fetching assigned emergencies:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to fetch assigned emergencies"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD ASSIGNED EMERGENCIES
    // =====================================================

    useEffect(() => {
        if (token) {
            fetchEmergencies();
        } else {
            setLoading(false);
        }
    }, [token]);

    // =====================================================
    // UPDATE EMERGENCY STATUS
    // =====================================================

    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);
            setError("");

            // =================================================
            // START RESPONSE
            // =================================================

            if (status === "in_progress") {
                await axios.put(
                    `${API_URL}/api/responder/emergencies/${id}/start`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            // =================================================
            // RESOLVE EMERGENCY
            // =================================================

            else if (status === "resolved") {
                await axios.put(
                    `${API_URL}/api/responder/emergencies/${id}/resolve`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            // =================================================
            // REFRESH DATA
            // =================================================

            await fetchEmergencies();

        } catch (error) {
            console.error(
                "Error updating emergency status:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update emergency status"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // =====================================================
    // GET ASSIGNED RESPONDER NAME
    // =====================================================

    const getResponderName = (emergency) => {
        return (
            emergency.responder_name ||
            emergency.responder?.name ||
            emergency.responderName ||
            user?.name ||
            "Assigned Responder"
        );
    };

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalAssigned = emergencies.length;

    const assignedCount = emergencies.filter(
        (emergency) =>
            emergency.status === "assigned"
    ).length;

    const inProgressCount = emergencies.filter(
        (emergency) =>
            emergency.status === "in_progress"
    ).length;

    const resolvedCount = emergencies.filter(
        (emergency) =>
            emergency.status === "resolved"
    ).length;

    // =====================================================
    // STATUS DISPLAY
    // =====================================================

    const getStatusText = (status) => {
        switch (status) {
            case "assigned":
                return "Assigned";

            case "in_progress":
                return "In Progress";

            case "resolved":
                return "Resolved";

            case "pending":
                return "Pending";

            default:
                return status || "Unknown";
        }
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "assigned":
                return "assigned";

            case "in_progress":
                return "in_progress";

            case "resolved":
                return "resolved";

            case "pending":
                return "pending";

            default:
                return "pending";
        }
    };

    // =====================================================
    // PRIORITY CLASS
    // =====================================================

    const getPriorityClass = (priority) => {
        switch (priority?.toLowerCase()) {
            case "low":
                return "priority-low";

            case "medium":
                return "priority-medium";

            case "high":
                return "priority-high";

            case "critical":
                return "priority-critical";

            default:
                return "priority-medium";
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="responder-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="responder-header">

                <div className="responder-title">

                    <h1>
                        Responder Dashboard
                    </h1>

                    <p>
                        Manage assigned emergencies and response operations
                    </p>

                </div>

                <div className="responder-profile">

                    <div className="responder-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "R"}
                    </div>

                    <div className="responder-user-info">

                        <strong>
                            {user?.name || "Responder"}
                        </strong>

                        <span>
                            Emergency Responder
                        </span>

                    </div>

                    <button
                        className="responder-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
                <div className="responder-error">
                    {error}
                </div>
            )}

            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="responder-stats">

                <div className="responder-stat-card">

                    <div className="stat-icon blue">
                        📋
                    </div>

                    <div>

                        <p>
                            Total Assigned
                        </p>

                        <h2>
                            {loading ? "..." : totalAssigned}
                        </h2>

                    </div>

                </div>

                <div className="responder-stat-card">

                    <div className="stat-icon orange">
                        🚨
                    </div>

                    <div>

                        <p>
                            Assigned
                        </p>

                        <h2>
                            {loading ? "..." : assignedCount}
                        </h2>

                    </div>

                </div>

                <div className="responder-stat-card">

                    <div className="stat-icon purple">
                        🔄
                    </div>

                    <div>

                        <p>
                            In Progress
                        </p>

                        <h2>
                            {loading ? "..." : inProgressCount}
                        </h2>

                    </div>

                </div>

                <div className="responder-stat-card">

                    <div className="stat-icon green">
                        ✅
                    </div>

                    <div>

                        <p>
                            Resolved
                        </p>

                        <h2>
                            {loading ? "..." : resolvedCount}
                        </h2>

                    </div>

                </div>

            </section>

            {/* =================================================
                ASSIGNED EMERGENCIES
            ================================================= */}

            <section className="assigned-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Assigned Emergencies
                        </h2>

                        <p>
                            Emergencies currently assigned to you
                        </p>

                    </div>

                    <button
                        className="refresh-btn"
                        onClick={fetchEmergencies}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>

                </div>

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (
                    <div className="responder-message">

                        <div className="message-icon">
                            ⏳
                        </div>

                        <h3>
                            Loading emergencies...
                        </h3>

                        <p>
                            Please wait while we load your assigned emergencies.
                        </p>

                    </div>
                )}

                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading && emergencies.length === 0 && (
                    <div className="responder-message">

                        <div className="message-icon">
                            📭
                        </div>

                        <h3>
                            No Emergencies Assigned
                        </h3>

                        <p>
                            You currently have no emergency reports assigned to you.
                        </p>

                    </div>
                )}

                {/* =================================================
                    EMERGENCY LIST
                ================================================= */}

                {!loading && emergencies.length > 0 && (

                    <div className="assigned-list">

                        {emergencies.map((emergency) => (

                            <div
                                className="assigned-card"
                                key={emergency.id}
                            >

                                {/* =================================================
                                    LEFT SIDE
                                ================================================= */}

                                <div className="assigned-left">

                                    <div className="assigned-icon">
                                        🚨
                                    </div>

                                    <div className="assigned-details">

                                        <div className="emergency-title-row">

                                            <h3>
                                                {emergency.emergency_type}
                                            </h3>

                                            <span className="report-number">
                                                #{emergency.id}
                                            </span>

                                        </div>

                                        <p className="assigned-description">
                                            {emergency.description}
                                        </p>

                                        <p className="assigned-location">
                                            📍 {emergency.location}
                                        </p>

                                        {/* =================================================
                                            ASSIGNED RESPONDER
                                        ================================================= */}

                                        <div className="assigned-responder">

                                            <span className="assigned-responder-label">
                                                👤 Assigned Responder
                                            </span>

                                            <strong>
                                                {getResponderName(emergency)}
                                            </strong>

                                        </div>

                                        <p className="assigned-date">
                                            Reported:{" "}

                                            {emergency.created_at
                                                ? new Date(
                                                    emergency.created_at
                                                ).toLocaleString()
                                                : "Unknown"}
                                        </p>

                                    </div>

                                </div>

                                {/* =================================================
                                    RIGHT SIDE
                                ================================================= */}

                                <div className="assigned-right">

                                    {/* PRIORITY */}

                                    <div className="priority">

                                        <span>
                                            Priority
                                        </span>

                                        <strong
                                            className={getPriorityClass(
                                                emergency.priority
                                            )}
                                        >
                                            {emergency.priority || "Medium"}
                                        </strong>

                                    </div>

                                    {/* STATUS */}

                                    <span
                                        className={`status-badge ${getStatusClass(
                                            emergency.status
                                        )}`}
                                    >
                                        {getStatusText(
                                            emergency.status
                                        )}
                                    </span>

                                    {/* START RESPONSE */}

                                    {emergency.status === "assigned" && (

                                        <button
                                            className="start-btn"
                                            disabled={
                                                updatingId === emergency.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    emergency.id,
                                                    "in_progress"
                                                )
                                            }
                                        >
                                            {updatingId === emergency.id
                                                ? "Starting..."
                                                : "Start Response"}
                                        </button>

                                    )}

                                    {/* RESOLVE */}

                                    {emergency.status === "in_progress" && (

                                        <button
                                            className="resolve-btn"
                                            disabled={
                                                updatingId === emergency.id
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    emergency.id,
                                                    "resolved"
                                                )
                                            }
                                        >
                                            {updatingId === emergency.id
                                                ? "Resolving..."
                                                : "Mark Resolved"}
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
};

export default ResponderDashboard;