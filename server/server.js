const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, connectDB } = require("./config/database");

const User = require("./models/User");
const Emergency = require("./models/Emergency");
const Notification = require("./models/Notification");


const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const responderRoutes = require("./routes/responderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();


// =====================================================
// CORS
// =====================================================

app.use(
    cors({
        origin: process.env.CLIENT_URL
    })
);


// =====================================================
// JSON BODY PARSER
// =====================================================

app.use(express.json());


// =====================================================
// API ROUTES
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/responder", responderRoutes);
app.use("/api/notifications", notificationRoutes);


// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.json({
        message: "SurakshaSetu API is running"
    });

});


// =====================================================
// PORT
// =====================================================

const PORT = process.env.PORT || 5000;


// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {

    await connectDB();

    await sequelize.sync();

    console.log(
        "Database tables synchronized"
    );

    app.listen(
        PORT,
        () => {

            console.log(
                `Server running on port ${PORT}`
            );

        }
    );

};


startServer();