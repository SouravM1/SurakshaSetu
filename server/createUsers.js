require("dotenv").config();

const { connectDB } = require("./config/database");
const User = require("./models/User");

const createUsers = async () => {
    try {

        await connectDB();


        // =====================================================
        // CHECK REQUIRED ENVIRONMENT VARIABLES
        // =====================================================

        const requiredVariables = [
            "ADMIN_EMAIL",
            "ADMIN_PASSWORD",
            "ADMIN_PHONE",
            "RESPONDER_EMAIL",
            "RESPONDER_PASSWORD",
            "RESPONDER_PHONE"
        ];


        for (const variable of requiredVariables) {

            if (!process.env[variable]) {

                throw new Error(
                    `${variable} is missing from environment variables`
                );
            }
        }


        // =====================================================
        // CREATE ADMIN
        // =====================================================

        await User.create({

            name: "Admin User",

            email:
                process.env.ADMIN_EMAIL,

            password:
                process.env.ADMIN_PASSWORD,

            role:
                "admin",

            phone:
                process.env.ADMIN_PHONE
        });


        // =====================================================
        // CREATE RESPONDER
        // =====================================================

        await User.create({

            name: "Responder User",

            email:
                process.env.RESPONDER_EMAIL,

            password:
                process.env.RESPONDER_PASSWORD,

            role:
                "responder",

            phone:
                process.env.RESPONDER_PHONE
        });


        console.log(
            "Admin and responder users created successfully"
        );


        process.exit(0);


    } catch (error) {

        console.error(
            "Error creating users:",
            error.message
        );

        process.exit(1);
    }
};


createUsers();