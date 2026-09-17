import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";

import "./Topbar.css";

const Topbar = ({ title, subtitle }) => {
    const navigate = useNavigate();

    const { user, logout, token } = useAuth();

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [showProfile, setShowProfile] =
        useState(false);

    const [notifications, setNotifications] =
        useState([]);

    const [loadingNotifications, setLoadingNotifications] =
        useState(true);

    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // =====================================================
    // USER INFORMATION
    // =====================================================

    const userName = user?.name || "Citizen";

    const userInitial =
        userName.charAt(0).toUpperCase();

    // =====================================================
    // FETCH NOTIFICATIONS
    // =====================================================

    const fetchNotifications = async () => {

        if (!token) {
            setLoadingNotifications(false);
            return;
        }

        try {

            setLoadingNotifications(true);

            const response = await fetch(
                `${API_URL}/api/notifications`,
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
                    "Failed to fetch notifications"
                );
            }

            setNotifications(
                data.notifications || []
            );

        } catch (error) {

            console.error(
                "Fetch notifications error:",
                error
            );

        } finally {

            setLoadingNotifications(false);
        }
    };

    // =====================================================
    // LOAD NOTIFICATIONS WHEN USER LOGS IN
    // =====================================================

    useEffect(() => {

        fetchNotifications();

    }, [token]);

    // =====================================================
    // NOTIFICATION STATUS
    // =====================================================

    const hasUnreadNotifications =
        notifications.some(
            (notification) =>
                !notification.isRead
        );

    // =====================================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================================

    const handleMarkAsRead = async (notificationId) => {

        if (!token) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/api/notifications/${notificationId}/read`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to mark notification as read"
                );
            }

            // ---------------------------------------------
            // UPDATE UI IMMEDIATELY
            // ---------------------------------------------

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) =>
                            notification.id ===
                            notificationId
                                ? {
                                    ...notification,
                                    isRead: true
                                }
                                : notification
                    )
            );

        } catch (error) {

            console.error(
                "Mark notification as read error:",
                error
            );
        }
    };

    // =====================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =====================================================

    const handleMarkAllRead = async () => {

        if (!token) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/api/notifications/read-all`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to mark all notifications as read"
                );
            }

            // ---------------------------------------------
            // UPDATE UI
            // ---------------------------------------------

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) => ({
                            ...notification,
                            isRead: true
                        })
                    )
            );

        } catch (error) {

            console.error(
                "Mark all notifications as read error:",
                error
            );
        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        setShowProfile(false);

        logout();

        navigate("/login");
    };

    // =====================================================
    // PROFILE
    // =====================================================

    const handleProfile = () => {

        setShowProfile(false);

        navigate("/citizen/profile");
    };

    // =====================================================
    // SETTINGS
    // =====================================================

    const handleSettings = () => {

        setShowProfile(false);

        navigate("/citizen/settings");
    };

    // =====================================================
    // VIEW ALL NOTIFICATIONS
    // =====================================================

    const handleViewNotifications = () => {

        setShowNotifications(false);

        navigate("/citizen/notifications");
    };

    // =====================================================
    // FORMAT NOTIFICATION TIME
    // =====================================================

    const formatNotificationTime = (createdAt) => {

        if (!createdAt) {
            return "";
        }

        const notificationDate =
            new Date(createdAt);

        const now = new Date();

        const difference =
            Math.floor(
                (now - notificationDate) /
                1000
            );

        if (difference < 60) {
            return "Just now";
        }

        if (difference < 3600) {

            const minutes =
                Math.floor(
                    difference / 60
                );

            return `${minutes} ${
                minutes === 1
                    ? "minute"
                    : "minutes"
            } ago`;
        }

        if (difference < 86400) {

            const hours =
                Math.floor(
                    difference / 3600
                );

            return `${hours} ${
                hours === 1
                    ? "hour"
                    : "hours"
            } ago`;
        }

        if (difference < 604800) {

            const days =
                Math.floor(
                    difference / 86400
                );

            return `${days} ${
                days === 1
                    ? "day"
                    : "days"
            } ago`;
        }

        return notificationDate.toLocaleDateString();
    };

    // =====================================================
    // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    // =====================================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setShowNotifications(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(
                    event.target
                )
            ) {
                setShowProfile(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <header className="topbar">

            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <div className="topbar-title">

                <h1>
                    {title}
                </h1>

                {subtitle && (
                    <p>
                        {subtitle}
                    </p>
                )}

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="topbar-actions">


                {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

                <div
                    className="notification-wrapper"
                    ref={notificationRef}
                >

                    <button
                        className="notification-button"
                        onClick={() => {

                            setShowNotifications(
                                !showNotifications
                            );

                            setShowProfile(false);

                        }}
                        aria-label="Notifications"
                    >

                        <span className="notification-icon">
                            🔔
                        </span>

                        {hasUnreadNotifications && (
                            <span className="notification-dot"></span>
                        )}

                    </button>


                    {/* =================================================
                        NOTIFICATION DROPDOWN
                    ================================================= */}

                    {showNotifications && (

                        <div className="notification-dropdown">

                            {/* HEADER */}

                            <div className="notification-header">

                                <div>

                                    <h3>
                                        Notifications
                                    </h3>

                                    <span>
                                        Recent updates
                                    </span>

                                </div>


                                {hasUnreadNotifications && (

                                    <button
                                        className="mark-read-btn"
                                        onClick={
                                            handleMarkAllRead
                                        }
                                    >
                                        Mark as read
                                    </button>

                                )}

                            </div>


                            {/* =================================================
                                NOTIFICATION LIST
                            ================================================= */}

                            <div className="notification-list">

                                {loadingNotifications ? (

                                    <div className="notification-empty">

                                        <div>
                                            🔔
                                        </div>

                                        <strong>
                                            Loading notifications...
                                        </strong>

                                    </div>

                                ) : notifications.length === 0 ? (

                                    <div className="notification-empty">

                                        <div>
                                            🔔
                                        </div>

                                        <strong>
                                            No notifications
                                        </strong>

                                        <p>
                                            You're all caught up.
                                        </p>

                                    </div>

                                ) : (

                                    notifications
                                        .slice(0, 5)
                                        .map(
                                            (
                                                notification
                                            ) => (

                                                <div
                                                    key={
                                                        notification.id
                                                    }
                                                    className={`notification-item ${
                                                        !notification.isRead
                                                            ? "unread"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        !notification.isRead &&
                                                        handleMarkAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                >

                                                    {/* ICON */}

                                                    <div className="notification-item-icon">

                                                        {
                                                            notification.icon ||
                                                            "🔔"
                                                        }

                                                    </div>


                                                    {/* CONTENT */}

                                                    <div className="notification-item-content">

                                                        <strong>
                                                            {
                                                                notification.title
                                                            }
                                                        </strong>

                                                        <p>
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        <span>
                                                            {formatNotificationTime(
                                                                notification.createdAt
                                                            )}
                                                        </span>

                                                    </div>


                                                    {/* UNREAD DOT */}

                                                    {!notification.isRead && (

                                                        <span className="notification-unread-dot"></span>

                                                    )}

                                                </div>

                                            )
                                        )

                                )}

                            </div>


                            {/* =================================================
                                FOOTER
                            ================================================= */}

                            <div className="notification-footer">

                                <button
                                    onClick={
                                        handleViewNotifications
                                    }
                                >
                                    View all notifications
                                </button>

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    PROFILE
                ================================================= */}

                <div
                    className="profile-wrapper"
                    ref={profileRef}
                >

                    <button
                        className="profile-button"
                        onClick={() => {

                            setShowProfile(
                                !showProfile
                            );

                            setShowNotifications(false);

                        }}
                    >

                        <div className="profile-avatar">
                            {userInitial}
                        </div>


                        <div className="profile-info">

                            <strong>
                                {userName}
                            </strong>

                            <span>
                                Citizen
                            </span>

                        </div>


                        <span className="profile-arrow">
                            ▾
                        </span>

                    </button>


                    {/* =================================================
                        PROFILE DROPDOWN
                    ================================================= */}

                    {showProfile && (

                        <div className="profile-dropdown">

                            <div className="profile-dropdown-header">

                                <div className="profile-dropdown-avatar">
                                    {userInitial}
                                </div>

                                <div>

                                    <strong>
                                        {userName}
                                    </strong>

                                    <span>
                                        Citizen
                                    </span>

                                </div>

                            </div>


                            <div className="profile-dropdown-divider"></div>


                            {/* MY PROFILE */}

                            <button
                                className="profile-dropdown-item"
                                onClick={handleProfile}
                            >

                                <span>
                                    👤
                                </span>

                                <span>
                                    My Profile
                                </span>

                            </button>


                            {/* SETTINGS */}

                            <button
                                className="profile-dropdown-item"
                                onClick={handleSettings}
                            >

                                <span>
                                    ⚙️
                                </span>

                                <span>
                                    Settings
                                </span>

                            </button>


                            <div className="profile-dropdown-divider"></div>


                            {/* LOGOUT */}

                            <button
                                className="profile-dropdown-item logout-item"
                                onClick={handleLogout}
                            >

                                <span>
                                    🚪
                                </span>

                                <span>
                                    Logout
                                </span>

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
};

export default Topbar;