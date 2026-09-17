import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Topbar from "../components/Topbar";
import API_URL from "../config";

import "./ChangePassword.css";

const ChangePassword = () => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError("All fields are required.");
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "New password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "New password and confirm password do not match."
            );
            return;
        }

        // -----------------------------
        // TOKEN
        // -----------------------------

        const token = localStorage.getItem("token");

        if (!token) {
            setError("You are not authenticated.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/auth/change-password`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            // -----------------------------
            // ERROR
            // -----------------------------

            if (!response.ok) {
                setError(
                    data.message ||
                    "Failed to change password."
                );

                return;
            }

            // -----------------------------
            // SUCCESS
            // -----------------------------

            setMessage(
                data.message ||
                "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {

            console.error(
                "Change password error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">

            {/* SIDEBAR */}

            <aside className="sidebar">

                {/* LOGO */}

                <div className="sidebar-logo">

                    <div className="logo-icon">
                        🛡️
                    </div>

                    <div>
                        <h2>
                            SurakshaSetu
                        </h2>

                        <span>
                            Emergency Management
                        </span>
                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="sidebar-nav">

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/citizen")
                        }
                    >
                        <span>🏠</span>
                        Dashboard
                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/citizen/report-emergency"
                            )
                        }
                    >
                        <span>🚨</span>
                        Report Emergency
                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/citizen/my-reports"
                            )
                        }
                    >
                        <span>📋</span>
                        My Reports
                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/citizen/emergency-map"
                            )
                        }
                    >
                        <span>📍</span>
                        Emergency Map
                    </button>


                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/citizen/safety-information"
                            )
                        }
                    >
                        <span>ℹ️</span>
                        Safety Information
                    </button>

                </nav>


                {/* BOTTOM */}

                <div className="sidebar-bottom">

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate(
                                "/citizen/settings"
                            )
                        }
                    >
                        <span>⚙️</span>
                        Settings
                    </button>


                    <button
                        className="logout-btn"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        <span>🚪</span>
                        Logout
                    </button>

                </div>

            </aside>


            {/* MAIN CONTENT */}

            <main className="main-content">

                <Topbar
                    title="Change Password"
                    subtitle="Update your account password securely."
                />


                <section className="password-page">

                    <div className="password-card">

                        <div className="password-header">

                            <div>
                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Enter your current password
                                    and choose a new password.
                                </p>
                            </div>

                            <span className="password-icon">
                                🔐
                            </span>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="password-form"
                        >

                            {/* CURRENT PASSWORD */}

                            <div className="form-group">

                                <label>
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter current password"
                                />

                            </div>


                            {/* NEW PASSWORD */}

                            <div className="form-group">

                                <label>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter new password"
                                />

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="form-group">

                                <label>
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm new password"
                                />

                            </div>


                            {/* ERROR */}

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}


                            {/* SUCCESS */}

                            {message && (
                                <div className="success-message">
                                    {message}
                                </div>
                            )}


                            {/* BUTTONS */}

                            <div className="password-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        navigate(
                                            "/citizen/profile"
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-password-btn"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Changing..."
                                        : "Change Password"}
                                </button>

                            </div>

                        </form>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default ChangePassword;