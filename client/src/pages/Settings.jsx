import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Topbar from "../components/Topbar";
import API_URL from "../config";

import "./Settings.css";

const Settings = () => {
    const navigate = useNavigate();

    const { user, logout, token } = useAuth();

    const userName = user?.name || "Citizen";

    const userInitial =
        userName.charAt(0).toUpperCase();

    // =====================================================
    // NOTIFICATION PREFERENCES
    // =====================================================

    const [emergencyNotifications, setEmergencyNotifications] =
        useState(true);

    const [reportStatusUpdates, setReportStatusUpdates] =
        useState(true);

    const [loadingPreferences, setLoadingPreferences] =
        useState(true);

    const [savingPreference, setSavingPreference] =
        useState(false);

    // =====================================================
    // LOAD NOTIFICATION PREFERENCES FROM DATABASE
    // =====================================================

    useEffect(() => {
        const loadNotificationPreferences = async () => {
            if (!token) {
                setLoadingPreferences(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/api/auth/notification-preferences`,
                    {
                        method: "GET",

                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load notification preferences"
                    );
                }

                // -------------------------------------------------
                // GET SAVED PREFERENCES
                // -------------------------------------------------

                const preferences =
                    data.notificationPreferences;

                if (preferences) {
                    setEmergencyNotifications(
                        preferences.emergencyNotifications !== false
                    );

                    setReportStatusUpdates(
                        preferences.reportStatusUpdates !== false
                    );
                }

            } catch (error) {
                console.error(
                    "Load notification preferences error:",
                    error
                );

            } finally {
                setLoadingPreferences(false);
            }
        };

        loadNotificationPreferences();

    }, [token]);

    // =====================================================
    // SAVE NOTIFICATION PREFERENCES TO DATABASE
    // =====================================================

    const saveNotificationPreferences = async (
        emergencyValue,
        reportStatusValue
    ) => {
        if (!token) {
            return;
        }

        try {
            setSavingPreference(true);

            const response = await fetch(
                `${API_URL}/api/auth/notification-preferences`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        emergencyNotifications:
                            emergencyValue,

                        reportStatusUpdates:
                            reportStatusValue
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save notification preferences"
                );
            }

            console.log(
                "Notification preferences saved successfully"
            );

        } catch (error) {
            console.error(
                "Save notification preferences error:",
                error
            );

        } finally {
            setSavingPreference(false);
        }
    };

    // =====================================================
    // TOGGLE EMERGENCY NOTIFICATIONS
    // =====================================================

    const handleEmergencyNotifications = () => {
        const newValue =
            !emergencyNotifications;

        setEmergencyNotifications(newValue);

        saveNotificationPreferences(
            newValue,
            reportStatusUpdates
        );
    };

    // =====================================================
    // TOGGLE REPORT STATUS UPDATES
    // =====================================================

    const handleReportStatusUpdates = () => {
        const newValue =
            !reportStatusUpdates;

        setReportStatusUpdates(newValue);

        saveNotificationPreferences(
            emergencyNotifications,
            newValue
        );
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        logout();

        navigate("/login");
    };

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


                {/* NAVIGATION */}

                <nav className="sidebar-nav">

                    {/* DASHBOARD */}

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/citizen")
                        }
                    >
                        <span>🏠</span>
                        Dashboard
                    </button>


                    {/* REPORT EMERGENCY */}

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/citizen/report-emergency"
                            )
                        }
                    >
                        <span>🚨</span>
                        Report Emergency
                    </button>


                    {/* MY REPORTS */}

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/citizen/my-reports"
                            )
                        }
                    >
                        <span>📋</span>
                        My Reports
                    </button>


                    {/* EMERGENCY MAP */}

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/citizen/emergency-map"
                            )
                        }
                    >
                        <span>📍</span>
                        Emergency Map
                    </button>


                    {/* SAFETY INFORMATION */}

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/citizen/safety-information"
                            )
                        }
                    >
                        <span>ℹ️</span>
                        Safety Information
                    </button>

                </nav>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    {/* SETTINGS */}

                    <button
                        className="nav-item settings-active"
                        onClick={() =>
                            navigate(
                                "/citizen/settings"
                            )
                        }
                    >
                        <span>⚙️</span>
                        Settings
                    </button>


                    {/* LOGOUT */}

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        <span>🚪</span>
                        Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="main-content">

                <Topbar
                    title="Settings"
                    subtitle="Manage your account and preferences."
                />


                <section className="settings-page">

                    {/* =================================================
                        SETTINGS HEADER
                    ================================================= */}

                    <div className="settings-welcome-card">

                        <div className="settings-user-avatar">
                            {userInitial}
                        </div>

                        <div className="settings-user-info">

                            <h2>
                                {userName}
                            </h2>

                            <p>
                                Citizen Account
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        ACCOUNT SETTINGS
                    ================================================= */}

                    <section className="settings-card">

                        <div className="settings-card-header">

                            <div>

                                <h2>
                                    Account Settings
                                </h2>

                                <p>
                                    Manage your personal account information.
                                </p>

                            </div>

                            <span className="settings-card-icon">
                                👤
                            </span>

                        </div>


                        <div className="settings-list">

                            {/* MY PROFILE */}

                            <button
                                className="settings-item"
                                onClick={() =>
                                    navigate(
                                        "/citizen/profile"
                                    )
                                }
                            >

                                <div className="settings-item-icon">
                                    👤
                                </div>

                                <div className="settings-item-content">

                                    <strong>
                                        My Profile
                                    </strong>

                                    <span>
                                        View and update your personal information.
                                    </span>

                                </div>

                                <span className="settings-item-arrow">
                                    →
                                </span>

                            </button>


                            {/* CHANGE PASSWORD */}

                            <button
                                className="settings-item"
                                onClick={() =>
                                    navigate(
                                        "/citizen/change-password"
                                    )
                                }
                            >

                                <div className="settings-item-icon">
                                    🔐
                                </div>

                                <div className="settings-item-content">

                                    <strong>
                                        Change Password
                                    </strong>

                                    <span>
                                        Update your account password securely.
                                    </span>

                                </div>

                                <span className="settings-item-arrow">
                                    →
                                </span>

                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        NOTIFICATION SETTINGS
                    ================================================= */}

                    <section className="settings-card">

                        <div className="settings-card-header">

                            <div>

                                <h2>
                                    Notification Preferences
                                </h2>

                                <p>
                                    Manage how you receive emergency updates.
                                </p>

                            </div>

                            <span className="settings-card-icon">
                                🔔
                            </span>

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loadingPreferences ? (

                            <div className="settings-preference">

                                <div className="settings-preference-content">

                                    <strong>
                                        Loading preferences...
                                    </strong>

                                    <p>
                                        Please wait while we load your notification settings.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <>

                                {/* =================================================
                                    EMERGENCY NOTIFICATIONS
                                ================================================= */}

                                <div className="settings-preference">

                                    <div className="settings-preference-content">

                                        <strong>
                                            Emergency Notifications
                                        </strong>

                                        <p>
                                            Receive important emergency alerts and report updates.
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className={`settings-toggle ${
                                            emergencyNotifications
                                                ? "enabled"
                                                : "disabled"
                                        }`}
                                        onClick={
                                            handleEmergencyNotifications
                                        }
                                        disabled={savingPreference}
                                        aria-label="Toggle emergency notifications"
                                        aria-pressed={
                                            emergencyNotifications
                                        }
                                    >

                                        <span className="toggle-slider"></span>

                                        <span className="toggle-text">
                                            {emergencyNotifications
                                                ? "Enabled"
                                                : "Disabled"}
                                        </span>

                                    </button>

                                </div>


                                {/* =================================================
                                    REPORT STATUS UPDATES
                                ================================================= */}

                                <div className="settings-preference">

                                    <div className="settings-preference-content">

                                        <strong>
                                            Report Status Updates
                                        </strong>

                                        <p>
                                            Get notified when your emergency report status changes.
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className={`settings-toggle ${
                                            reportStatusUpdates
                                                ? "enabled"
                                                : "disabled"
                                        }`}
                                        onClick={
                                            handleReportStatusUpdates
                                        }
                                        disabled={savingPreference}
                                        aria-label="Toggle report status updates"
                                        aria-pressed={
                                            reportStatusUpdates
                                        }
                                    >

                                        <span className="toggle-slider"></span>

                                        <span className="toggle-text">
                                            {reportStatusUpdates
                                                ? "Enabled"
                                                : "Disabled"}
                                        </span>

                                    </button>

                                </div>

                            </>

                        )}

                    </section>


                    {/* =================================================
                        SECURITY
                    ================================================= */}

                    <section className="settings-card">

                        <div className="settings-card-header">

                            <div>

                                <h2>
                                    Security
                                </h2>

                                <p>
                                    Keep your SurakshaSetu account secure.
                                </p>

                            </div>

                            <span className="settings-card-icon">
                                🛡️
                            </span>

                        </div>


                        {/* ACCOUNT STATUS */}

                        <div className="settings-preference">

                            <div className="settings-preference-content">

                                <strong>
                                    Account Status
                                </strong>

                                <p>
                                    Your account is currently active.
                                </p>

                            </div>

                            <div className="setting-status active">
                                ● Active
                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="settings-preference">

                            <div className="settings-preference-content">

                                <strong>
                                    Password
                                </strong>

                                <p>
                                    Your password is securely protected.
                                </p>

                            </div>

                            <button
                                className="settings-secondary-btn"
                                onClick={() =>
                                    navigate(
                                        "/citizen/change-password"
                                    )
                                }
                            >
                                Change Password
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        BACK TO DASHBOARD
                    ================================================= */}

                    <div className="settings-back-section">

                        <button
                            className="settings-back-btn"
                            onClick={() =>
                                navigate("/citizen")
                            }
                        >
                            ← Back to Dashboard
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Settings;