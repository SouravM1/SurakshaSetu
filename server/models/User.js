const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const { sequelize } = require("../config/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM(
                "citizen",
                "admin",
                "responder"
            ),
            allowNull: false,
            defaultValue: "citizen"
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },

        // =====================================================
        // NOTIFICATION PREFERENCES
        // =====================================================

        notificationPreferences: {
            type: DataTypes.JSON,

            allowNull: false,

            defaultValue: {
                emergencyNotifications: true,
                reportStatusUpdates: true
            }
        }
    },

    {
        tableName: "users",

        timestamps: true,

        hooks: {
            beforeCreate: async (user) => {

                user.password =
                    await bcrypt.hash(
                        user.password,
                        10
                    );
            },

            beforeUpdate: async (user) => {

                if (user.changed("password")) {

                    user.password =
                        await bcrypt.hash(
                            user.password,
                            10
                        );
                }
            }
        }
    }
);

module.exports = User;