const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Emergency = sequelize.define(
    "Emergency",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        emergency_type: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        location: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },

        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },

        priority: {
            type: DataTypes.ENUM(
                "low",
                "medium",
                "high",
                "critical"
            ),
            defaultValue: "medium"
        },

        status: {
            type: DataTypes.ENUM(
                "pending",
                "assigned",
                "in_progress",
                "resolved"
            ),
            defaultValue: "pending"
        },

        responder_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        tableName: "emergencies",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Emergency;