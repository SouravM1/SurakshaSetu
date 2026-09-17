import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Topbar from "../components/Topbar";
import API_URL from "../config";

import "./CitizenNotifications.css";

const CitizenNotifications = () => {

    const navigate = useNavigate();

    const { token } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // FETCH NOTIFICATIONS
    // =====================================================

    const fetchNotifications = async () => {

        if (!token) {
            setLoading(false);
            return;
        }

        try {

            setLoading(true);

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

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD NOTIFICATIONS
    // =====================================================

    useEffect(() => {

        fetchNotifications();

    }, [token]);


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

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) =>
                            notification.id === notificationId
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
    // MARK ALL AS READ
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
    // FORMAT TIME
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
                (now - notificationDate) / 1000
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
    // COUNT UNREAD
    // =====================================================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="notifications-page">

            <main className="notifications-main">

                {/* =================================================
                    TOPBAR
                ================================================= */}

                <Topbar
                    title="Notifications"
                    subtitle="Stay updated about your emergency reports."
                />


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <section className="notifications-content">

                    <div className="notifications-header">

                        <div>

                            <h2>
                                All Notifications
                            </h2>

                            <p>
                                {unreadCount > 0
                                    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                                    : "You're all caught up"}
                            </p>

                        </div>


                        {unreadCount > 0 && (

                            <button
                                className="mark-all-btn"
                                onClick={handleMarkAllRead}
                            >
                                Mark all as read
                            </button>

                        )}

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading ? (

                        <div className="notifications-empty">

                            <div className="notifications-empty-icon">
                                ⏳
                            </div>

                            <h3>
                                Loading notifications...
                            </h3>

                            <p>
                                Please wait while we load your notifications.
                            </p>

                        </div>

                    ) : notifications.length === 0 ? (

                        /* =================================================
                           NO NOTIFICATIONS
                        ================================================= */

                        <div className="notifications-empty">

                            <div className="notifications-empty-icon">
                                🔔
                            </div>

                            <h3>
                                No notifications
                            </h3>

                            <p>
                                You're all caught up.
                            </p>

                        </div>

                    ) : (

                        /* =================================================
                           NOTIFICATION LIST
                        ================================================= */

                        <div className="notifications-full-list">

                            {notifications.map(
                                (notification) => (

                                    <div
                                        key={notification.id}
                                        className={`full-notification-item ${
                                            !notification.isRead
                                                ? "unread"
                                                : ""
                                        }`}
                                    >

                                        {/* ICON */}

                                        <div className="full-notification-icon">

                                            {
                                                notification.icon ||
                                                "🔔"
                                            }

                                        </div>


                                        {/* CONTENT */}

                                        <div className="full-notification-content">

                                            <div className="full-notification-title">

                                                <strong>
                                                    {
                                                        notification.title
                                                    }
                                                </strong>

                                                {!notification.isRead && (

                                                    <span className="unread-label">
                                                        New
                                                    </span>

                                                )}

                                            </div>


                                            <p>
                                                {
                                                    notification.message
                                                }
                                            </p>


                                            <span className="full-notification-time">

                                                {formatNotificationTime(
                                                    notification.createdAt
                                                )}

                                            </span>

                                        </div>


                                        {/* MARK READ */}

                                        {!notification.isRead && (

                                            <button
                                                className="individual-read-btn"
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification.id
                                                    )
                                                }
                                            >
                                                Mark as read
                                            </button>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* =================================================
                        BACK BUTTON
                    ================================================= */}

                    <button
                        className="back-dashboard-btn"
                        onClick={() =>
                            navigate("/citizen")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </section>

            </main>

        </div>
    );
};

export default CitizenNotifications;