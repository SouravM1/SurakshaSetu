const Notification = require("../models/Notification");

// =====================================================
// GET USER NOTIFICATIONS
// =====================================================

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.findAll({
            where: {
                userId
            },

            order: [
                ["createdAt", "DESC"]
            ]
        });

        return res.status(200).json({
            notifications
        });

    } catch (error) {

        console.error(
            "Get notifications error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch notifications"
        });
    }
};


// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================

const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        const notificationId =
            req.params.id;

        const notification =
            await Notification.findOne({
                where: {
                    id: notificationId,
                    userId
                }
            });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        return res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {

        console.error(
            "Mark notification as read error:",
            error
        );

        return res.status(500).json({
            message: "Failed to update notification"
        });
    }
};


// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.update(
            {
                isRead: true
            },
            {
                where: {
                    userId,
                    isRead: false
                }
            }
        );

        return res.status(200).json({
            message: "All notifications marked as read"
        });

    } catch (error) {

        console.error(
            "Mark all notifications as read error:",
            error
        );

        return res.status(500).json({
            message: "Failed to update notifications"
        });
    }
};


// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async (req, res) => {
    try {
        const {
            userId,
            icon,
            title,
            message
        } = req.body;

        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (
            !userId ||
            !title ||
            !message
        ) {
            return res.status(400).json({
                message:
                    "userId, title and message are required"
            });
        }

        // ---------------------------------------------
        // CREATE NOTIFICATION
        // ---------------------------------------------

        const notification =
            await Notification.create({
                userId,
                icon: icon || "🔔",
                title,
                message,
                isRead: false
            });

        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        return res.status(201).json({
            message: "Notification created successfully",
            notification
        });

    } catch (error) {

        console.error(
            "Create notification error:",
            error
        );

        return res.status(500).json({
            message: "Failed to create notification"
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    createNotification
};