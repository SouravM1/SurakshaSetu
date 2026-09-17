import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import API_URL from "../config";

import "./MyReports.css";

const MyReports = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH MY REPORTS
    // =====================================================

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_URL}/api/emergencies/my-reports`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setReports(response.data.emergencies || []);
            } catch (error) {
                console.error("Fetch reports error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to fetch your reports"
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchReports();
        } else {
            setLoading(false);
            setError("Authentication required");
        }
    }, [token]);

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "status-pending";

            case "assigned":
                return "status-assigned";

            case "in_progress":
                return "status-progress";

            case "resolved":
                return "status-resolved";

            default:
                return "status-default";
        }
    };

    // =====================================================
    // STATUS TEXT
    // =====================================================

    const formatStatus = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "Pending";

            case "assigned":
                return "Assigned";

            case "in_progress":
                return "In Progress";

            case "resolved":
                return "Resolved";

            default:
                return status || "Unknown";
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
    // RETURN
    // =====================================================

    return (
        <div className="dashboard">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar activeItem="my-reports" />


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="main-content">

                {/* =================================================
                    TOPBAR
                ================================================= */}

                <Topbar
                    title="My Reports"
                    subtitle="View and track your emergency reports."
                />


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <section className="reports-page-content">

                    {/* =================================================
                        HEADER ACTION
                    ================================================= */}

                    <div className="reports-page-heading">

                        <div>

                            <h2>
                                Your Emergency Reports
                            </h2>

                            <p>
                                Track the status and details of emergencies
                                you have reported.
                            </p>

                        </div>

                        <button
                            className="reports-new-btn"
                            onClick={() =>
                                navigate("/citizen/report-emergency")
                            }
                        >
                            🚨 Report Emergency
                        </button>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    {!loading && !error && reports.length > 0 && (

                        <div className="reports-summary">

                            {/* TOTAL REPORTS */}

                            <div className="reports-summary-card">

                                <div className="reports-summary-icon blue">
                                    📋
                                </div>

                                <div>

                                    <span>
                                        Total Reports
                                    </span>

                                    <strong>
                                        {reports.length}
                                    </strong>

                                    <small>
                                        Reports submitted
                                    </small>

                                </div>

                            </div>


                            {/* RESOLVED */}

                            <div className="reports-summary-card">

                                <div className="reports-summary-icon green">
                                    ✅
                                </div>

                                <div>

                                    <span>
                                        Resolved
                                    </span>

                                    <strong>
                                        {
                                            reports.filter(
                                                (report) =>
                                                    report.status === "resolved"
                                            ).length
                                        }
                                    </strong>

                                    <small>
                                        Successfully resolved
                                    </small>

                                </div>

                            </div>


                            {/* ACTIVE */}

                            <div className="reports-summary-card">

                                <div className="reports-summary-icon orange">
                                    ⚠️
                                </div>

                                <div>

                                    <span>
                                        Active
                                    </span>

                                    <strong>
                                        {
                                            reports.filter(
                                                (report) =>
                                                    report.status === "pending" ||
                                                    report.status === "assigned" ||
                                                    report.status === "in_progress"
                                            ).length
                                        }
                                    </strong>

                                    <small>
                                        Currently active
                                    </small>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="reports-state-card">

                            <div className="reports-state-icon">
                                ⏳
                            </div>

                            <h2>
                                Loading your reports...
                            </h2>

                            <p>
                                Please wait while we load your emergency
                                reports.
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {!loading && error && (

                        <div className="reports-error-card">

                            <div className="reports-state-icon">
                                ⚠️
                            </div>

                            <h2>
                                Unable to load reports
                            </h2>

                            <p>
                                {error}
                            </p>

                            <button
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try Again
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        NO REPORTS
                    ================================================= */}

                    {!loading &&
                        !error &&
                        reports.length === 0 && (

                            <div className="reports-state-card">

                                <div className="reports-state-icon">
                                    📭
                                </div>

                                <h2>
                                    No Reports Yet
                                </h2>

                                <p>
                                    You haven't submitted any emergency
                                    reports yet.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/citizen/report-emergency"
                                        )
                                    }
                                >
                                    🚨 Report Emergency
                                </button>

                            </div>

                        )}


                    {/* =================================================
                        REPORT LIST
                    ================================================= */}

                    {!loading &&
                        !error &&
                        reports.length > 0 && (

                            <div className="reports-list-container">

                                {/* LIST HEADER */}

                                <div className="reports-list-header">

                                    <div>

                                        <h2>
                                            Report History
                                        </h2>

                                        <p>
                                            All emergency reports submitted
                                            by you.
                                        </p>

                                    </div>

                                </div>


                                {/* REPORT CARDS */}

                                <div className="reports-cards">

                                    {reports.map((report) => (

                                        <article
                                            className="professional-report-card"
                                            key={report.id}
                                        >

                                            {/* =================================================
                                                CARD HEADER
                                            ================================================= */}

                                            <div className="professional-report-header">

                                                <div className="professional-report-type">

                                                    <div className="professional-report-icon">
                                                        🚨
                                                    </div>

                                                    <div>

                                                        <h2>
                                                            {report.emergency_type}
                                                        </h2>

                                                        <span>
                                                            Report #{report.id}
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* STATUS */}

                                                <span
                                                    className={`professional-status-badge ${getStatusClass(
                                                        report.status
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        report.status
                                                    )}
                                                </span>

                                            </div>


                                            {/* =================================================
                                                CARD DETAILS
                                            ================================================= */}

                                            <div className="professional-report-details">

                                                {/* DESCRIPTION */}

                                                <div className="professional-detail">

                                                    <span className="detail-label">
                                                        Description
                                                    </span>

                                                    <p>
                                                        {report.description ||
                                                            "No description provided"}
                                                    </p>

                                                </div>


                                                {/* LOCATION */}

                                                <div className="professional-detail">

                                                    <span className="detail-label">
                                                        📍 Location
                                                    </span>

                                                    <p>
                                                        {report.location ||
                                                            "Location not provided"}
                                                    </p>

                                                </div>


                                                {/* PRIORITY */}

                                                <div className="professional-detail">

                                                    <span className="detail-label">
                                                        Priority
                                                    </span>

                                                    <span
                                                        className={`professional-priority-badge ${getPriorityClass(
                                                            report.priority
                                                        )}`}
                                                    >
                                                        {report.priority ||
                                                            "Medium"}
                                                    </span>

                                                </div>


                                                {/* REPORTED DATE */}

                                                <div className="professional-detail">

                                                    <span className="detail-label">
                                                        Reported On
                                                    </span>

                                                    <p>
                                                        {report.created_at
                                                            ? new Date(
                                                                report.created_at
                                                            ).toLocaleString()
                                                            : "Not available"}
                                                    </p>

                                                </div>

                                            </div>

                                        </article>

                                    ))}

                                </div>

                            </div>

                        )}

                </section>

            </main>

        </div>
    );
};

export default MyReports;