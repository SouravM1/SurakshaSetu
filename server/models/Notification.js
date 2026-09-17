const { DataTypes } = require("sequelize");

const { sequelize } = require("../config/database");

const Notification = sequelize.define(
    "Notification",
    {
        // =====================================================
        // NOTIFICATION ID
        // =====================================================

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        // =====================================================
        // USER ID
        // =====================================================

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        // =====================================================
        // NOTIFICATION ICON
        // =====================================================

        icon: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "🔔"
        },

        // =====================================================
        // NOTIFICATION TITLE
        // =====================================================

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // =====================================================
        // NOTIFICATION MESSAGE
        // =====================================================

        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        // =====================================================
        // READ / UNREAD
        // =====================================================

        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: "notifications",

        timestamps: true
    }
);

module.exports = Notification;