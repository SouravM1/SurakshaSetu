const express = require("express");
const router = express.Router();

const Emergency = require("../models/Emergency");
const User = require("../models/User");
const Notification = require("../models/Notification");

const {
    authenticate,
    authorizeRoles
} = require("../middleware/authMiddleware");


// =====================================================
// GET ALL EMERGENCY REPORTS
// =====================================================

router.get(
    "/emergencies",
    authenticate,
    authorizeRoles("admin"),
    async (req, res) => {

        try {

            const emergencies = await Emergency.findAll({
                order: [
                    ["created_at", "DESC"]
                ]
            });

            // =================================================
            // GET RESPONDER NAMES
            // =================================================

            const responderIds = emergencies
                .map((emergency) => emergency.responder_id)
                .filter((id) => id);

            let responderMap = {};

            if (responderIds.length > 0) {

                const responders = await User.findAll({
                    where: {
                        id: responderIds,
                        role: "responder"
                    },

                    attributes: [
                        "id",
                        "name"
                    ]
                });

                responderMap = responders.reduce(
                    (map, responder) => {

                        map[responder.id] =
                            responder.name;

                        return map;

                    },
                    {}
                );
            }

            // =================================================
            // ADD RESPONDER NAME TO EACH EMERGENCY
            // =================================================

            const formattedEmergencies =
                emergencies.map((emergency) => {

                    const emergencyData =
                        emergency.toJSON();

                    return {
                        ...emergencyData,

                        responder_name:
                            emergency.responder_id
                                ? responderMap[
                                      emergency.responder_id
                                  ] || null
                                : null
                    };

                });

            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({
                emergencies: formattedEmergencies
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
// GET ALL RESPONDERS
// =====================================================

router.get(
    "/responders",
    authenticate,
    authorizeRoles("admin"),
    async (req, res) => {

        try {

            const responders = await User.findAll({

                where: {
                    role: "responder"
                },

                attributes: [
                    "id",
                    "name",
                    "email",
                    "phone"
                ]

            });

            res.status(200).json({
                responders
            });

        } catch (error) {

            console.error(
                "Fetch responders error:",
                error
            );

            res.status(500).json({
                message: "Failed to fetch responders"
            });

        }
    }
);


// =====================================================
// ASSIGN EMERGENCY TO RESPONDER
// =====================================================

router.put(
    "/emergencies/:id/assign",
    authenticate,
    authorizeRoles("admin"),
    async (req, res) => {

        try {

            const emergencyId = req.params.id;

            const {
                responder_id
            } = req.body;


            // =================================================
            // VALIDATE RESPONDER ID
            // =================================================

            if (!responder_id) {

                return res.status(400).json({
                    message: "Responder ID is required"
                });

            }


            // =================================================
            // CHECK EMERGENCY EXISTS
            // =================================================

            const emergency =
                await Emergency.findByPk(emergencyId);

            if (!emergency) {

                return res.status(404).json({
                    message: "Emergency not found"
                });

            }


            // =================================================
            // CHECK RESPONDER EXISTS
            // =================================================

            const responder =
                await User.findOne({

                    where: {
                        id: responder_id,
                        role: "responder"
                    }

                });


            if (!responder) {

                return res.status(404).json({
                    message: "Responder not found"
                });

            }


            // =================================================
            // ASSIGN RESPONDER
            // =================================================

            emergency.responder_id =
                responder.id;

            emergency.status = "assigned";

            await emergency.save();


            // =================================================
            // NOTIFICATION FOR RESPONDER
            // =================================================

            await Notification.create({

                userId: responder.id,

                icon: "🚨",

                title: "Emergency Assigned",

                message:
                    `A ${emergency.emergency_type} emergency has been assigned to you at ${emergency.location}.`,

                isRead: false

            });


            // =================================================
            // NOTIFICATION FOR CITIZEN
            // =================================================

            await Notification.create({

                userId: emergency.user_id,

                icon: "🚑",

                title: "Responder Assigned",

                message:
                    `A responder has been assigned to your ${emergency.emergency_type} emergency at ${emergency.location}.`,

                isRead: false

            });


            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({

                message:
                    "Emergency assigned successfully",

                emergency: {

                    id: emergency.id,

                    responder_id:
                        emergency.responder_id,

                    status:
                        emergency.status

                }

            });


        } catch (error) {

            console.error(
                "Assign emergency error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to assign emergency"

            });

        }
    }
);


// =====================================================
// MARK EMERGENCY AS RESOLVED
// =====================================================

router.put(
    "/emergencies/:id/resolve",
    authenticate,
    authorizeRoles("admin"),
    async (req, res) => {

        try {

            const emergencyId = req.params.id;


            // =================================================
            // CHECK EMERGENCY EXISTS
            // =================================================

            const emergency =
                await Emergency.findByPk(emergencyId);


            if (!emergency) {

                return res.status(404).json({
                    message: "Emergency not found"
                });

            }


            // =================================================
            // CHECK IF ALREADY RESOLVED
            // =================================================

            if (emergency.status === "resolved") {

                return res.status(400).json({
                    message: "Emergency is already resolved"
                });

            }


            // =================================================
            // UPDATE EMERGENCY STATUS
            // =================================================

            emergency.status = "resolved";

            await emergency.save();


            // =================================================
            // NOTIFICATION FOR CITIZEN
            // =================================================

            await Notification.create({

                userId: emergency.user_id,

                icon: "✅",

                title: "Emergency Resolved",

                message:
                    `Your ${emergency.emergency_type} emergency at ${emergency.location} has been successfully resolved.`,

                isRead: false

            });


            // =================================================
            // RESPONSE
            // =================================================

            res.status(200).json({

                message:
                    "Emergency resolved successfully",

                emergency: {

                    id: emergency.id,

                    status:
                        emergency.status

                }

            });


        } catch (error) {

            console.error(
                "Resolve emergency error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to resolve emergency"

            });

        }
    }
);

// =====================================================
// MARK EMERGENCY AS RESOLVED
// =====================================================


module.exports = router;