const express = require("express");

const {
    authenticate,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/protected",
    authenticate,
    (req, res) => {
        res.json({
            message: "You are authenticated",
            user: req.user
        });
    }
);

router.get(
    "/admin",
    authenticate,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin"
        });
    }
);

router.get(
    "/responder",
    authenticate,
    authorizeRoles("responder"),
    (req, res) => {
        res.json({
            message: "Welcome Responder"
        });
    }
);

router.get(
    "/citizen",
    authenticate,
    authorizeRoles("citizen"),
    (req, res) => {
        res.json({
            message: "Welcome Citizen"
        });
    }
);

module.exports = router;