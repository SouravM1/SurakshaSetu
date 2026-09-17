const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: "citizen"
        });

        res.status(201).json({
            message: "Citizen registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};

// =====================================================
// UPDATE USER PROFILE
// =====================================================

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { name, email, phone } = req.body;

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        // -----------------------------
        // FIND USER
        // -----------------------------

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // -----------------------------
        // CHECK EMAIL
        // -----------------------------

        const existingUser = await User.findOne({
            where: {
                email
            }
        });

        if (
            existingUser &&
            existingUser.id !== userId
        ) {
            return res.status(400).json({
                message: "Email is already in use"
            });
        }

        // -----------------------------
        // UPDATE USER
        // -----------------------------

        user.name = name;
        user.email = email;
        user.phone = phone || null;

        await user.save();

        // -----------------------------
        // RESPONSE
        // -----------------------------

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );

        return res.status(500).json({
            message: "Failed to update profile"
        });
    }
};

// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        // -----------------------------
        // FIND USER
        // -----------------------------

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // -----------------------------
        // CHECK CURRENT PASSWORD
        // -----------------------------

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        // -----------------------------
        // UPDATE PASSWORD
        // -----------------------------

        user.password = newPassword;

        await user.save();

        // -----------------------------
        // RESPONSE
        // -----------------------------

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {

        console.error(
            "Change password error:",
            error
        );

        return res.status(500).json({
            message: "Failed to change password"
        });
    }
};

// =====================================================
// GET NOTIFICATION PREFERENCES
// =====================================================

const getNotificationPreferences = async (req, res) => {
    try {

        const userId = req.user.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            notificationPreferences:
                user.notificationPreferences || {
                    emergencyNotifications: true,
                    reportStatusUpdates: true
                }
        });

    } catch (error) {

        console.error(
            "Get notification preferences error:",
            error
        );

        return res.status(500).json({
            message: "Failed to get notification preferences"
        });
    }
};


// =====================================================
// UPDATE NOTIFICATION PREFERENCES
// =====================================================

const updateNotificationPreferences = async (req, res) => {
    try {

        const userId = req.user.id;

        const {
            emergencyNotifications,
            reportStatusUpdates
        } = req.body;

        // -----------------------------
        // FIND USER
        // -----------------------------

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // -----------------------------
        // CURRENT PREFERENCES
        // -----------------------------

        const currentPreferences =
            user.notificationPreferences || {
                emergencyNotifications: true,
                reportStatusUpdates: true
            };

        // -----------------------------
        // UPDATE ONLY PROVIDED VALUES
        // -----------------------------

        const updatedPreferences = {
            emergencyNotifications:
                typeof emergencyNotifications === "boolean"
                    ? emergencyNotifications
                    : currentPreferences.emergencyNotifications,

            reportStatusUpdates:
                typeof reportStatusUpdates === "boolean"
                    ? reportStatusUpdates
                    : currentPreferences.reportStatusUpdates
        };

        // -----------------------------
        // SAVE
        // -----------------------------

        user.notificationPreferences =
            updatedPreferences;

        await user.save();

        // -----------------------------
        // RESPONSE
        // -----------------------------

        return res.status(200).json({
            message:
                "Notification preferences updated successfully",

            notificationPreferences:
                user.notificationPreferences
        });

    } catch (error) {

        console.error(
            "Update notification preferences error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to update notification preferences"
        });
    }
};

module.exports = {
    register,
    login,
    updateProfile,
    changePassword,
    getNotificationPreferences,
    updateNotificationPreferences
};



