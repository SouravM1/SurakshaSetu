const express = require("express");
const router = express.Router();

const Emergency = require("../models/Emergency");
const Notification = require("../models/Notification");

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// =====================================================
// GET ASSIGNED EMERGENCIES
// =====================================================

router.get(
  "/emergencies",
  authenticate,
  authorizeRoles("responder"),
  async (req, res) => {
    try {
      const emergencies = await Emergency.findAll({
        where: {
          responder_id: req.user.id,
        },
        order: [["created_at", "DESC"]],
      });

      res.status(200).json({
        emergencies,
      });
    } catch (error) {
      console.error("Fetch assigned emergencies error:", error);

      res.status(500).json({
        message: "Failed to fetch assigned emergencies",
      });
    }
  },
);

// =====================================================
// START EMERGENCY RESPONSE
// =====================================================

router.put(
  "/emergencies/:id/start",
  authenticate,
  authorizeRoles("responder"),
  async (req, res) => {
    try {
      const emergency = await Emergency.findOne({
        where: {
          id: req.params.id,
          responder_id: req.user.id,
        },
      });

      if (!emergency) {
        return res.status(404).json({
          message: "Emergency not found or not assigned to you",
        });
      }

      if (emergency.status !== "assigned") {
        return res.status(400).json({
          message: "Emergency cannot be started",
        });
      }

      emergency.status = "in_progress";

      await emergency.save();

      await Notification.create({
        userId: emergency.user_id,
        icon: "🚑",
        title: "Responder On The Way",
        message: `A responder has started working on your ${emergency.emergency_type} emergency at ${emergency.location}.`,
        isRead: false,
      });

      res.status(200).json({
        message: "Emergency response started successfully",
      });
    } catch (error) {
      console.error("Start response error:", error);

      res.status(500).json({
        message: "Failed to start emergency response",
      });
    }
  },
);

// =====================================================
// RESOLVE EMERGENCY
// =====================================================

router.put(
  "/emergencies/:id/resolve",
  authenticate,
  authorizeRoles("responder"),
  async (req, res) => {
    try {
      const emergency = await Emergency.findOne({
        where: {
          id: req.params.id,
          responder_id: req.user.id,
        },
      });

      if (!emergency) {
        return res.status(404).json({
          message: "Emergency not found or not assigned to you",
        });
      }

      if (emergency.status !== "in_progress") {
        return res.status(400).json({
          message: "Emergency must be in progress before resolving",
        });
      }

      emergency.status = "resolved";

      await emergency.save();

      await Notification.create({
        userId: emergency.user_id,
        icon: "✅",
        title: "Emergency Resolved",
        message: `Your ${emergency.emergency_type} emergency at ${emergency.location} has been resolved by the responder.`,
        isRead: false,
      });

      res.status(200).json({
        message: "Emergency resolved successfully",
      });
    } catch (error) {
      console.error("Resolve emergency error:", error);

      res.status(500).json({
        message: "Failed to resolve emergency",
      });
    }
  },
);

module.exports = router;
