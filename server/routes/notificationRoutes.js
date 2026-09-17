const express = require("express");

const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    createNotification
} = require("../controllers/notificationController");

const {
    authenticate
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GET NOTIFICATIONS
// =====================================================

router.get(
    "/",
    authenticate,
    getNotifications
);


// =====================================================
// MARK ALL AS READ
// =====================================================

router.put(
    "/read-all",
    authenticate,
    markAllNotificationsAsRead
);


// =====================================================
// MARK ONE AS READ
// =====================================================

router.put(
    "/:id/read",
    authenticate,
    markNotificationAsRead
);


// =====================================================
// CREATE NOTIFICATION
// =====================================================

router.post(
    "/",
    authenticate,
    createNotification
);


module.exports = router;