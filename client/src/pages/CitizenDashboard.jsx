import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";

import Topbar from "../components/Topbar";

const CitizenDashboard = () => {
    const navigate = useNavigate();

    const { user, token, logout } = useAuth();

    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(true);


    // =====================================================
    // FETCH MY EMERGENCY REPORTS
    // =====================================================

    useEffect(() => {

        const fetchReports = async () => {

            try {

                const response = await fetch(
                    `${API_URL}/api/emergencies/my-reports`,
                    {
                        method: "GET",

                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                const data = await response.json();


                if (response.ok) {

                    setReports(
                        data.emergencies || []
                    );

                } else {

                    console.error(
                        "Failed to fetch reports:",
                        data.message
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to fetch reports:",
                    error
                );

            } finally {

                setLoadingReports(false);

            }

        };


        // =====================================================
        // NO TOKEN
        // =====================================================

        if (!token) {

            setLoadingReports(false);

            return;

        }


        // =====================================================
        // INITIAL FETCH
        // =====================================================

        fetchReports();


        // =====================================================
        // AUTO REFRESH
        // =====================================================
        // Fetch latest emergency status every 5 seconds.
        // This allows the citizen dashboard to automatically
        // show changes made by the admin/responder.
        // =====================================================

        const interval = setInterval(() => {

            fetchReports();

        }, 5000);


        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {

            clearInterval(interval);

        };

    }, [token]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    // =====================================================
    // NAVIGATION HANDLERS
    // =====================================================

    const handleDashboard = () => {

        navigate("/citizen");

    };


    const handleReportEmergency = () => {

        navigate("/citizen/report-emergency");

    };


    const handleMyReports = () => {

        navigate("/citizen/my-reports");

    };


    const handleEmergencyMap = () => {

        navigate("/citizen/emergency-map");

    };


    const handleSafetyInformation = () => {

        navigate("/citizen/safety-information");

    };


    const handleEmergencyServices = () => {

        navigate("/citizen/emergency-services");

    };


    const handleSettings = () => {

        navigate("/citizen/settings");

    };


    // =====================================================
    // COUNT REPORTS
    // =====================================================

    const totalReports = reports.length;


    const resolvedReports = reports.filter(
        (report) =>
            report.status === "resolved"
    ).length;


    const activeReports = reports.filter(
        (report) =>
            report.status === "pending" ||
            report.status === "assigned" ||
            report.status === "in_progress"
    ).length;


    // =====================================================
    // FORMAT EMERGENCY STATUS
    // =====================================================

    const formatStatus = (status) => {

        switch (status) {

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
    // RETURN
    // =====================================================

    return (

        <div className="dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="sidebar">


                {/* LOGO */}

                <div className="sidebar-logo">

                    <div className="logo-icon">
                        🛡️
                    </div>

                    <div>

                        <h2>
                            SurakshaSetu
                        </h2>

                        <span>
                            Emergency Management
                        </span>

                    </div>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav className="sidebar-nav">


                    {/* DASHBOARD */}

                    <button
                        className="nav-item active"
                        onClick={handleDashboard}
                    >

                        <span>
                            🏠
                        </span>

                        Dashboard

                    </button>


                    {/* REPORT EMERGENCY */}

                    <button
                        className="nav-item"
                        onClick={handleReportEmergency}
                    >

                        <span>
                            🚨
                        </span>

                        Report Emergency

                    </button>


                    {/* MY REPORTS */}

                    <button
                        className="nav-item"
                        onClick={handleMyReports}
                    >

                        <span>
                            📋
                        </span>

                        My Reports

                    </button>


                    {/* EMERGENCY MAP */}

                    <button
                        className="nav-item"
                        onClick={handleEmergencyMap}
                    >

                        <span>
                            📍
                        </span>

                        Emergency Map

                    </button>


                    {/* SAFETY INFORMATION */}

                    <button
                        className="nav-item"
                        onClick={handleSafetyInformation}
                    >

                        <span>
                            ℹ️
                        </span>

                        Safety Information

                    </button>

                </nav>


                {/* =================================================
                    SIDEBAR BOTTOM
                ================================================= */}

                <div className="sidebar-bottom">


                    {/* SETTINGS */}

                    <button
                        className="nav-item"
                        onClick={handleSettings}
                    >

                        <span>
                            ⚙️
                        </span>

                        Settings

                    </button>


                    {/* LOGOUT */}

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >

                        <span>
                            🚪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="main-content">


                {/* =================================================
                    REUSABLE TOPBAR
                ================================================= */}

                <Topbar
                    title="Citizen Dashboard"
                    subtitle="Stay informed. Stay safe."
                />


                {/* =================================================
                    WELCOME BANNER
                ================================================= */}

                <section className="welcome-banner">

                    <div>

                        <p className="welcome-small">
                            Welcome back
                        </p>

                        <h2>
                            Hello, {user?.name || "Citizen"} 👋
                        </h2>

                        <p>
                            We're here to help keep you and
                            your community safe.
                        </p>

                    </div>

                    <div className="welcome-icon">
                        🛡️
                    </div>

                </section>


                {/* =================================================
                    EMERGENCY BUTTON
                ================================================= */}

                <section className="emergency-section">

                    <div className="emergency-card">

                        <div className="emergency-icon">
                            🚨
                        </div>

                        <div className="emergency-content">

                            <h2>
                                Need Emergency Assistance?
                            </h2>

                            <p>
                                Report an emergency and get help
                                from emergency responders quickly.
                            </p>

                        </div>

                        <button
                            className="emergency-btn"
                            onClick={handleReportEmergency}
                        >
                            Report Emergency
                        </button>

                    </div>

                </section>


                {/* =================================================
                    DASHBOARD CARDS
                ================================================= */}

                <section className="dashboard-grid">


                    {/* MY REPORTS */}

                    <div
                        className="info-card"
                        onClick={handleMyReports}
                        style={{ cursor: "pointer" }}
                    >

                        <div className="card-icon blue">
                            📋
                        </div>

                        <div>

                            <span>
                                My Reports
                            </span>

                            <h3>

                                {loadingReports
                                    ? "..."
                                    : totalReports}

                            </h3>

                            <p>

                                {totalReports === 0
                                    ? "No reports submitted"
                                    : "Reports submitted"}

                            </p>

                        </div>

                    </div>


                    {/* RESOLVED REPORTS */}

                    <div
                        className="info-card"
                        onClick={handleMyReports}
                        style={{ cursor: "pointer" }}
                    >

                        <div className="card-icon green">
                            ✅
                        </div>

                        <div>

                            <span>
                                Resolved Reports
                            </span>

                            <h3>

                                {loadingReports
                                    ? "..."
                                    : resolvedReports}

                            </h3>

                            <p>
                                Successfully resolved
                            </p>

                        </div>

                    </div>


                    {/* ACTIVE EMERGENCIES */}

                    <div
                        className="info-card"
                        onClick={handleMyReports}
                        style={{ cursor: "pointer" }}
                    >

                        <div className="card-icon orange">
                            ⚠️
                        </div>

                        <div>

                            <span>
                                Active Emergencies
                            </span>

                            <h3>

                                {loadingReports
                                    ? "..."
                                    : activeReports}

                            </h3>

                            <p>
                                Currently active
                            </p>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="section">


                    <div className="section-header">

                        <div>

                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Access important emergency services
                            </p>

                        </div>

                    </div>


                    <div className="quick-actions">


                        {/* REPORT EMERGENCY */}

                        <button
                            className="action-card"
                            onClick={handleReportEmergency}
                        >

                            <span className="action-icon">
                                🚨
                            </span>

                            <div>

                                <strong>
                                    Report Emergency
                                </strong>

                                <p>
                                    Request immediate assistance
                                </p>

                            </div>

                        </button>


                        {/* EMERGENCY MAP */}

                        <button
                            className="action-card"
                            onClick={handleEmergencyMap}
                        >

                            <span className="action-icon">
                                📍
                            </span>

                            <div>

                                <strong>
                                    View Emergency Map
                                </strong>

                                <p>
                                    See nearby incidents
                                </p>

                            </div>

                        </button>


                        {/* EMERGENCY SERVICES */}

                        <button
                            className="action-card"
                            onClick={handleEmergencyServices}
                        >

                            <span className="action-icon">
                                🏥
                            </span>

                            <div>

                                <strong>
                                    Emergency Services
                                </strong>

                                <p>
                                    Find nearby services
                                </p>

                            </div>

                        </button>


                        {/* SAFETY GUIDELINES */}

                        <button
                            className="action-card"
                            onClick={handleSafetyInformation}
                        >

                            <span className="action-icon">
                                📖
                            </span>

                            <div>

                                <strong>
                                    Safety Guidelines
                                </strong>

                                <p>
                                    Learn emergency procedures
                                </p>

                            </div>

                        </button>

                    </div>

                </section>


                {/* =================================================
                    RECENT ACTIVITY
                ================================================= */}

                <section
                    className="section"
                    id="recent-activity"
                >


                    <div className="section-header">

                        <div>

                            <h2>
                                Recent Activity
                            </h2>

                            <p>
                                Your latest emergency activity
                            </p>

                        </div>


                        {reports.length > 0 && (

                            <button
                                className="link-button"
                                onClick={handleMyReports}
                            >

                                View All

                            </button>

                        )}

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loadingReports ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading reports...
                            </h3>

                            <p>
                                Please wait while we load your
                                emergency reports.
                            </p>

                        </div>

                    ) : reports.length === 0 ? (


                        /* =================================================
                            NO REPORTS
                        ================================================= */

                        <div className="empty-state">

                            <div className="empty-icon">
                                📭
                            </div>

                            <h3>
                                No recent activity
                            </h3>

                            <p>
                                Your emergency reports and updates
                                will appear here.
                            </p>

                            <button
                                className="primary-button"
                                onClick={handleReportEmergency}
                            >

                                Report Emergency

                            </button>

                        </div>

                    ) : (


                        /* =================================================
                            REPORTS
                        ================================================= */

                        <div className="reports-list">

                            {reports
                                .slice(0, 5)
                                .map((report) => (

                                    <div
                                        className="report-item"
                                        key={report.id}
                                    >


                                        {/* REPORT ICON */}

                                        <div className="report-item-icon">
                                            🚨
                                        </div>


                                        {/* REPORT INFORMATION */}

                                        <div className="report-item-content">

                                            <h3>
                                                {report.emergency_type}
                                            </h3>

                                            <p>
                                                {report.description}
                                            </p>

                                            <span>
                                                📍 {report.location}
                                            </span>

                                        </div>


                                        {/* STATUS */}

                                        <div
                                            className={`report-item-status status-${report.status}`}
                                        >

                                            <strong>
                                                {formatStatus(
                                                    report.status
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                ))}

                        </div>

                    )}

                </section>

            </main>

        </div>

    );

};

export default CitizenDashboard;