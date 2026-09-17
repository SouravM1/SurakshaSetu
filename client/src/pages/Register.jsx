import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import API_URL from "../config";

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // =====================================================
    // REGISTER USER
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError(
                "Name, email and password are required."
            );
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/api/auth/register`,
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    phone: phone.trim()
                }
            );

            setMessage(
                response.data.message ||
                "Registration successful."
            );

            // =================================================
            // REDIRECT TO LOGIN
            // =================================================

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="brand-section">

                    <div className="brand-icon">
                        🛡️
                    </div>

                    <h1>
                        SurakshaSetu
                    </h1>

                    <p>
                        Emergency Management & Response System
                    </p>

                </div>


                {/* =================================================
                    HEADING
                ================================================= */}

                <div className="auth-heading">

                    <h2>
                        Create Account
                    </h2>

                    <p>
                        Register as a citizen
                    </p>

                </div>


                {/* =================================================
                    REGISTRATION FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    {/* =================================================
                        FULL NAME
                    ================================================= */}

                    <div className="form-group">

                        <label htmlFor="register-name">
                            Full Name
                        </label>

                        <input
                            id="register-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* =================================================
                        EMAIL
                    ================================================= */}

                    <div className="form-group">

                        <label htmlFor="register-email">
                            Email Address
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* =================================================
                        PASSWORD
                    ================================================= */}

                    <div className="form-group">

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* =================================================
                        PHONE
                    ================================================= */}

                    <div className="form-group">

                        <label htmlFor="register-phone">
                            Phone Number
                        </label>

                        <input
                            id="register-phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* =================================================
                        ERROR MESSAGE
                    ================================================= */}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}


                    {/* =================================================
                        SUCCESS MESSAGE
                    ================================================= */}

                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}


                    {/* =================================================
                        CREATE ACCOUNT BUTTON
                    ================================================= */}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                {/* =================================================
                    DIVIDER
                ================================================= */}

                <div className="auth-divider"></div>


                {/* =================================================
                    LOGIN
                ================================================= */}

                <div className="register-section">

                    <p>
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate("/login")}
                        disabled={loading}
                    >
                        Back to Login
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Register;