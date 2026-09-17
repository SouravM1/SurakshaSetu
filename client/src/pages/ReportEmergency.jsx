import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import "./ReportEmergency.css";

const API_URL = import.meta.env.VITE_API_URL;

const ReportEmergency = () => {
    const navigate = useNavigate();

    const { token } = useAuth();

    const [emergencyType, setEmergencyType] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [locationLoading, setLocationLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // =====================================================
    // GET CURRENT LOCATION
    // =====================================================

    const handleGetLocation = () => {
        setError("");

        setLocationLoading(true);

        if (!navigator.geolocation) {
            setError(
                "Geolocation is not supported by your browser."
            );

            setLocationLoading(false);

            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;

                setLatitude(lat);
                setLongitude(lng);

                setLocationLoading(false);

                console.log(
                    "Latitude:",
                    lat
                );

                console.log(
                    "Longitude:",
                    lng
                );
            },

            (locationError) => {
                console.error(
                    "Location error:",
                    locationError
                );

                setLocationLoading(false);

                if (locationError.code === 1) {
                    setError(
                        "Location permission was denied. Please allow location access."
                    );
                } else if (locationError.code === 2) {
                    setError(
                        "Unable to determine your current location."
                    );
                } else if (locationError.code === 3) {
                    setError(
                        "Location request timed out. Please try again."
                    );
                } else {
                    setError(
                        "Failed to get your current location."
                    );
                }
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // =====================================================
    // SUBMIT EMERGENCY
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // =================================================
        // AUTHENTICATION CHECK
        // =================================================

        if (!token) {
            setError(
                "You are not authenticated. Please login again."
            );

            return;
        }

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!emergencyType) {
            setError(
                "Please select an emergency type."
            );

            return;
        }

        if (!description.trim()) {
            setError(
                "Please provide an emergency description."
            );

            return;
        }

        if (!location.trim()) {
            setError(
                "Please provide the emergency location."
            );

            return;
        }

        try {
            setLoading(true);

            // =================================================
            // SEND EMERGENCY TO BACKEND
            // =================================================

            const response = await axios.post(
                `${API_URL}/api/emergencies`,
                {
                    emergency_type:
                        emergencyType,

                    description:
                        description.trim(),

                    location:
                        location.trim(),

                    latitude,
                    longitude
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            // =================================================
            // GET ML PREDICTED PRIORITY
            // =================================================

            const predictedPriority =
                response.data.priority;

            let successMessage =
                response.data.message ||
                "Emergency reported successfully.";

            if (predictedPriority) {
                successMessage +=
                    ` AI-assessed priority: ${predictedPriority.toUpperCase()}.`;
            }

            setSuccess(
                successMessage
            );

            // =================================================
            // CLEAR FORM
            // =================================================

            setEmergencyType("");
            setDescription("");
            setLocation("");
            setLatitude(null);
            setLongitude(null);

            // =================================================
            // RETURN TO DASHBOARD
            // =================================================

            setTimeout(() => {
                navigate("/citizen");
            }, 2000);

        } catch (error) {
            console.error(
                "Report emergency error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to report emergency."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div className="report-page">

            {/* =================================================
                COMMON SIDEBAR
            ================================================= */}

            <Sidebar
                activeItem="report-emergency"
            />

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="report-main">

                {/* =================================================
                    COMMON TOPBAR
                ================================================= */}

                <Topbar
                    title="Report Emergency"
                    subtitle="Provide emergency details and get help quickly."
                />

                {/* =================================================
                    FORM CONTENT
                ================================================= */}

                <section className="report-content">

                    {/* =================================================
                        INTRO
                    ================================================= */}

                    <div className="report-intro">

                        <div className="report-intro-icon">
                            🚨
                        </div>

                        <div>

                            <h2>
                                Emergency Report
                            </h2>

                            <p>
                                Please provide accurate information about
                                the emergency. This will help responders
                                assist you faster.
                            </p>

                        </div>

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (
                        <div className="report-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {success && (
                        <div className="report-success">
                            ✅ {success}
                        </div>
                    )}

                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        className="emergency-form"
                        onSubmit={handleSubmit}
                    >

                        {/* =================================================
                            EMERGENCY TYPE
                        ================================================= */}

                        <div className="form-group">

                            <label htmlFor="emergencyType">
                                Emergency Type
                            </label>

                            <select
                                id="emergencyType"
                                value={emergencyType}
                                onChange={(e) =>
                                    setEmergencyType(
                                        e.target.value
                                    )
                                }
                                required
                                disabled={loading}
                            >

                                <option value="">
                                    Select emergency type
                                </option>

                                <option value="Fire">
                                    🔥 Fire
                                </option>

                                <option value="Flood">
                                    🌊 Flood
                                </option>

                                <option value="Earthquake">
                                    🌍 Earthquake
                                </option>

                                <option value="Accident">
                                    🚗 Accident
                                </option>

                                <option value="Medical">
                                    🚑 Medical Emergency
                                </option>

                                <option value="Crime">
                                    🚨 Crime
                                </option>

                                <option value="Storm">
                                    🌪️ Storm
                                </option>

                                <option value="Landslide">
                                    🏔️ Landslide
                                </option>

                                <option value="Other">
                                    ⚠️ Other
                                </option>

                            </select>

                        </div>

                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <div className="form-group">

                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Describe what happened and provide any important details..."
                                rows="6"
                                required
                                disabled={loading}
                            />

                        </div>

                        {/* =================================================
                            LOCATION
                        ================================================= */}

                        <div className="form-group">

                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) =>
                                    setLocation(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter emergency location"
                                required
                                disabled={loading}
                            />

                        </div>

                        {/* =================================================
                            GPS LOCATION
                        ================================================= */}

                        <div className="location-section">

                            <button
                                type="button"
                                className="location-btn"
                                onClick={handleGetLocation}
                                disabled={
                                    locationLoading ||
                                    loading
                                }
                            >
                                {locationLoading
                                    ? "📍 Getting Location..."
                                    : "📍 Use My Current Location"}
                            </button>

                            {latitude !== null &&
                                longitude !== null && (

                                    <div className="location-success">

                                        <span>
                                            ✅
                                        </span>

                                        <div>

                                            <strong>
                                                Location captured successfully
                                            </strong>

                                            <small>
                                                Latitude:{" "}
                                                {latitude.toFixed(6)}
                                                {" | "}
                                                Longitude:{" "}
                                                {longitude.toFixed(6)}
                                            </small>

                                        </div>

                                    </div>

                                )}

                        </div>

                        {/* =================================================
                            AI PRIORITY INFORMATION
                        ================================================= */}

                        <div className="ai-priority-info">

                            <div className="ai-priority-icon">
                                🤖
                            </div>

                            <div>

                                <strong>
                                    AI-Based Priority Assessment
                                </strong>

                                <p>
                                    Emergency priority will be automatically
                                    assessed by our machine learning system
                                    based on the emergency type and description.
                                </p>

                            </div>

                        </div>

                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div className="form-buttons">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() =>
                                    navigate("/citizen")
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Analyzing & Reporting..."
                                    : "🚨 Report Emergency"}
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
};

export default ReportEmergency;