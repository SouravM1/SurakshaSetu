import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import API_URL from "../config";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                {
                    email,
                    password
                }
            );

            const { token, user } = response.data;

            // Store authentication information
            login(token, user);

            // Role-based redirection
            if (user.role === "admin") {
                navigate("/admin");
            } else if (user.role === "responder") {
                navigate("/responder");
            } else if (user.role === "citizen") {
                navigate("/citizen");
            } else {
                setError("Invalid user role");
            }

        } catch (error) {

            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Brand */}
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


                {/* Heading */}
                <div className="auth-heading">

                    <h2>
                        Welcome Back
                    </h2>

                    <p>
                        Login to access your account
                    </p>

                </div>


                {/* Login Form */}
                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
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


                    {/* Password */}
                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}


                    {/* Login Button */}
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                {/* Divider */}
                <div className="auth-divider"></div>


                {/* Register */}
                <div className="register-section">

                    <p>
                        Don't have an account?
                    </p>

                    <button
                        type="button"
                        className="link-button"
                        onClick={() =>
                            navigate("/register")
                        }
                        disabled={loading}
                    >
                        Create Account
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Login;