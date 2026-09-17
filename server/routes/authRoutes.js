const express = require("express");

const {
    register,
    login,
    updateProfile,
    changePassword,
    getNotificationPreferences,
    updateNotificationPreferences
} = require("../controllers/authController");

const {
    authenticate
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// AUTH ROUTES
// =====================================================

// Register citizen
router.post("/register", register);


// Login
router.post("/login", login);


// Update profile
router.put(
    "/profile",
    authenticate,
    updateProfile
);


// Change password
router.put(
    "/change-password",
    authenticate,
    changePassword
);

// =====================================================
// NOTIFICATION PREFERENCES
// =====================================================

// Get notification preferences

router.get(
    "/notification-preferences",
    authenticate,
    getNotificationPreferences
);


// Update notification preferences

router.put(
    "/notification-preferences",
    authenticate,
    updateNotificationPreferences
);

module.exports = router;