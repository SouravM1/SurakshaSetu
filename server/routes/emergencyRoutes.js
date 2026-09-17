const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");

const Emergency = require("../models/Emergency");
const Notification = require("../models/Notification");
const User = require("../models/User");

const {
    authenticate,
    authorizeRoles
} = require("../middleware/authMiddleware");


// =====================================================
// ML SERVICE — PREDICT EMERGENCY PRIORITY
// =====================================================

const predictEmergencyPriority = async (
    emergencyType,
    description
) => {

    try {

        const response = await fetch(
            `${process.env.ML_SERVICE_URL}/predict`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    emergency_type: emergencyType,
                    description: description
                })
            }
        );


        // =================================================
        // CHECK ML SERVICE RESPONSE
        // =================================================

        if (!response.ok) {

            throw new Error(
                `ML service returned status ${response.status}`
            );
        }


        const data =
            await response.json();


        // =================================================
        // VALIDATE PREDICTION
        // =================================================

        if (!data.priority) {

            throw new Error(
                "ML service did not return a priority"
            );
        }


        // =================================================
        // CONVERT TO LOWERCASE
        // =================================================

        const priority =
            data.priority.toLowerCase();


        const allowedPriorities = [
            "low",
            "medium",
            "high",
            "critical"
        ];


        if (!allowedPriorities.includes(priority)) {

            throw new Error(
                `Invalid priority returned by ML service: ${data.priority}`
            );
        }


        console.log(
            `ML predicted priority: ${priority}`
        );


        return priority;


    } catch (error) {

        console.error(
            "ML priority prediction error:",
            error
        );

        throw error;
    }
};


// =====================================================
// HELPER — CREATE STATUS NOTIFICATION
// =====================================================

const createStatusNotification = async (
    emergency,
    oldStatus,
    newStatus
) => {

    try {

        // =================================================
        // DO NOT CREATE NOTIFICATION IF STATUS DID NOT CHANGE
        // =================================================

        if (oldStatus === newStatus) {

            console.log(
                "Status did not change. Notification not created."
            );

            return;
        }


        // =================================================
        // FIND CITIZEN
        // =================================================

        const citizen =
            await User.findByPk(
                emergency.user_id
            );


        if (!citizen) {

            console.log(
                "Citizen not found for notification"
            );

            return;
        }


        // =================================================
        // CHECK NOTIFICATION PREFERENCE
        // =================================================

        const preferences =
            citizen.notificationPreferences || {};

        const reportStatusUpdates =
            preferences.reportStatusUpdates !== false;


        // =================================================
        // DO NOT CREATE IF DISABLED
        // =================================================

        if (!reportStatusUpdates) {

            console.log(
                "Report status notifications disabled for citizen"
            );

            return;
        }


        // =================================================
        // STATUS NOTIFICATION DATA
        // =================================================

        let title = "Emergency Status Updated";

        let message =
            `Your ${emergency.emergency_type} emergency at ${emergency.location} has been updated.`;

        let icon = "🔔";


        // =================================================
        // PENDING
        // =================================================

        if (newStatus === "pending") {

            title =
                "Emergency Report Pending";

            message =
                `Your ${emergency.emergency_type} emergency at ${emergency.location} is currently pending.`;

            icon = "⏳";
        }


        // =================================================
        // ASSIGNED
        // =================================================

        else if (newStatus === "assigned") {

            title =
                "Responder Assigned";

            message =
                `A responder has been assigned to your ${emergency.emergency_type} emergency at ${emergency.location}.`;

            icon = "🚑";
        }


        // =================================================
        // IN PROGRESS
        // =================================================

        else if (newStatus === "in_progress") {

            title =
                "Emergency In Progress";

            message =
                `Your ${emergency.emergency_type} emergency at ${emergency.location} is now being handled by the responder.`;

            icon = "🚨";
        }


        // =================================================
        // RESOLVED
        // =================================================

        else if (newStatus === "resolved") {

            title =
                "Emergency Resolved";

            message =
                `Your ${emergency.emergency_type} emergency at ${emergency.location} has been successfully resolved.`;

            icon = "✅";
        }


        // =================================================
        // CREATE NOTIFICATION
        // =================================================

        await Notification.create({

            userId:
                emergency.user_id,

            icon,

            title,

            message,

            isRead: false
        });


        console.log(
            `Notification created: ${title}`
        );


    } catch (error) {

        console.error(
            "Create status notification error:",
            error
        );

        // =================================================
        // IMPORTANT
        // Notification failure should NOT break
        // emergency status update.
        // =================================================

    }
};


// =====================================================
// REPORT EMERGENCY - CITIZEN
// =====================================================

router.post(
    "/",
    authenticate,
    authorizeRoles("citizen"),
    async (req, res) => {

        try {

            const {
                emergency_type,
                description,
                location,
                latitude,
                longitude
            } = req.body;


            // =================================================
            // VALIDATE REQUIRED FIELDS
            // =================================================

            if (
                !emergency_type ||
                !description ||
                !location
            ) {

                return res.status(400).json({

                    message:
                        "Please provide all required fields"

                });
            }


            // =================================================
            // ASK ML SERVICE FOR PRIORITY
            // =================================================

            console.log(
                "Sending emergency to ML service..."
            );


            let predictedPriority;


            try {

                predictedPriority =
                    await predictEmergencyPriority(
                        emergency_type,
                        description
                    );


            } catch (mlError) {

                console.error(
                    "ML service unavailable:",
                    mlError
                );


                return res.status(503).json({

                    message:
                        "Emergency priority prediction service is currently unavailable. Please try again shortly."

                });
            }


            // =================================================
            // CREATE EMERGENCY
            // =================================================

            const emergency =
                await Emergency.create({

                    // Logged-in citizen ID
                    user_id:
                        req.user.id,

                    emergency_type,

                    description,

                    location,

                    latitude:
                        latitude || null,

                    longitude:
                        longitude || null,

                    // =================================================
                    // PRIORITY IS NOW PROVIDED BY ML
                    // =================================================

                    priority:
                        predictedPriority,

                    status:
                        "pending"
                });


            // =================================================
            // LOG ML RESULT
            // =================================================

            console.log(
                `Emergency ${emergency.id} created with ML priority: ${predictedPriority}`
            );


            // =================================================
            // CREATE SUBMISSION NOTIFICATION
            // =================================================

            await Notification.create({

                userId:
                    req.user.id,

                icon:
                    "🚨",

                title:
                    "Emergency Report Submitted",

                message:
                    `Your ${emergency.emergency_type} emergency report at ${emergency.location} has been successfully submitted.`,

                isRead:
                    false
            });


            // =================================================
            // RESPONSE
            // =================================================

            res.status(201).json({

                message:
                    "Emergency reported successfully",

                emergency_id:
                    emergency.id,

                priority:
                    predictedPriority

            });


        } catch (error) {

            console.error(
                "Emergency creation error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to report emergency"

            });
        }
    }
);


// =====================================================
// GET MY EMERGENCY REPORTS - CITIZEN
// =====================================================

router.get(
    "/my-reports",
    authenticate,
    authorizeRoles("citizen"),
    async (req, res) => {

        try {

            const emergencies =
                await Emergency.findAll({

                    where: {

                        user_id:
                            req.user.id

                    },

                    order: [
                        ["created_at", "DESC"]
                    ]
                });


            res.status(200).json({

                emergencies

            });


        } catch (error) {

            console.error(
                "Fetch emergency reports error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch emergency reports"

            });
        }
    }
);


// =====================================================
// GET EMERGENCIES FOR CITIZEN MAP
// =====================================================

router.get(
    "/map",
    authenticate,
    authorizeRoles("citizen"),
    async (req, res) => {

        try {

            const emergencies =
                await Emergency.findAll({

                    attributes: [

                        "id",

                        "emergency_type",

                        "description",

                        "location",

                        "latitude",

                        "longitude",

                        "priority",

                        "status",

                        "created_at"

                    ],

                    where: {

                        latitude: {
                            [Op.ne]: null
                        },

                        longitude: {
                            [Op.ne]: null
                        }

                    },

                    order: [
                        ["created_at", "DESC"]
                    ]

                });


            res.status(200).json({

                emergencies

            });


        } catch (error) {

            console.error(
                "Fetch map emergencies error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch emergency map data"

            });
        }
    }
);


// =====================================================
// GET ALL EMERGENCY REPORTS - ADMIN
// =====================================================

router.get(
    "/",
    authenticate,
    authorizeRoles("admin"),
    async (req, res) => {

        try {

            const emergencies =
                await Emergency.findAll({

                    order: [
                        ["created_at", "DESC"]
                    ]

                });


            res.status(200).json({

                emergencies

            });


        } catch (error) {

            console.error(
                "Fetch all emergencies error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch emergencies"

            });
        }
    }
);


// =====================================================
// NOTE:
// Generic ADMIN status update route has been removed.
//
// Previously:
// PUT /api/emergencies/:id/status
//
// That route allowed an admin to directly change an
// emergency from pending → resolved or bypass other
// workflow steps.
//
// Admin should use the dedicated routes in adminRoutes.js:
//
// PUT /api/admin/emergencies/:id/assign
// PUT /api/admin/emergencies/:id/resolve
//
// Responder uses the protected responder routes below.
// =====================================================


// =====================================================
// GET ASSIGNED EMERGENCIES - RESPONDER
// =====================================================

router.get(
    "/assigned",
    authenticate,
    authorizeRoles("responder"),
    async (req, res) => {

        try {

            const emergencies =
                await Emergency.findAll({

                    where: {

                        responder_id:
                            req.user.id

                    },

                    order: [
                        ["created_at", "DESC"]
                    ]

                });


            res.status(200).json({

                emergencies

            });


        } catch (error) {

            console.error(
                "Fetch assigned emergencies error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch assigned emergencies"

            });
        }
    }
);


// =====================================================
// UPDATE EMERGENCY STATUS - RESPONDER
// =====================================================

router.patch(
    "/:id/status",
    authenticate,
    authorizeRoles("responder"),
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const { status } =
                req.body;


            // =================================================
            // RESPONDER ALLOWED STATUSES
            // =================================================

            const allowedStatuses = [

                "in_progress",

                "resolved"

            ];


            // =================================================
            // VALIDATE STATUS
            // =================================================

            if (
                !status ||
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid status"

                });
            }


            // =================================================
            // FIND ASSIGNED EMERGENCY
            // =================================================

            const emergency =
                await Emergency.findOne({

                    where: {

                        id: id,

                        responder_id:
                            req.user.id

                    }

                });


            if (!emergency) {

                return res.status(404).json({

                    message:
                        "Emergency not found or not assigned to you"

                });
            }


            // =================================================
            // SAVE OLD STATUS
            // =================================================

            const oldStatus =
                emergency.status;


            // =================================================
            // DO NOT UPDATE IF SAME STATUS
            // =================================================

            if (oldStatus === status) {

                return res.status(200).json({

                    message:
                        "Emergency status is already " +
                        status,

                    emergency

                });
            }


            // =================================================
            // UPDATE STATUS
            // =================================================

            emergency.status =
                status;

            await emergency.save();


            // =================================================
            // CREATE CITIZEN NOTIFICATION
            // =================================================

            await createStatusNotification(

                emergency,

                oldStatus,

                status

            );


            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({

                message:
                    "Emergency status updated successfully",

                emergency

            });


        } catch (error) {

            console.error(
                "Responder status update error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to update emergency status"

            });
        }
    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;