import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import L from "leaflet";

import { useAuth } from "../context/AuthContext";
import API_URL from "../config";

import "leaflet/dist/leaflet.css";


// =====================================================
// FIX LEAFLET MARKER ICON
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});


// =====================================================
// EMERGENCY MAP
// =====================================================

const EmergencyMap = () => {

    const navigate = useNavigate();

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    const { token } = useAuth();


    // =====================================================
    // STATE
    // =====================================================

    const [emergencies, setEmergencies] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // FETCH EMERGENCIES
    // =====================================================

    useEffect(() => {

        const fetchEmergencies = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/emergencies/map`,
                    {
                        method: "GET",

                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();


                // =================================================
                // SUCCESS
                // =================================================

                if (response.ok) {

                    setEmergencies(
                        data.emergencies || []
                    );

                } else {

                    setError(
                        data.message ||
                        "Failed to fetch emergency locations."
                    );

                    console.error(
                        "Failed to fetch emergencies:",
                        data.message
                    );

                }

            } catch (fetchError) {

                console.error(
                    "Fetch emergencies error:",
                    fetchError
                );

                setError(
                    "Unable to load emergency locations."
                );

            } finally {

                setLoading(false);

            }

        };


        // =====================================================
        // FETCH ONLY WHEN TOKEN EXISTS
        // =====================================================

        if (token) {

            fetchEmergencies();

        } else {

            setLoading(false);

        }

    }, [token]);


    // =====================================================
    // DEFAULT MAP LOCATION
    // KOLKATA
    // =====================================================

    const defaultPosition = [
        22.5726,
        88.3639
    ];


    // =====================================================
    // EMERGENCIES WITH VALID COORDINATES
    // =====================================================

    const emergenciesWithLocation = emergencies.filter(
        (emergency) =>
            emergency.latitude !== null &&
            emergency.longitude !== null &&
            emergency.latitude !== undefined &&
            emergency.longitude !== undefined &&
            !Number.isNaN(Number(emergency.latitude)) &&
            !Number.isNaN(Number(emergency.longitude))
    );


    // =====================================================
    // STATUS TEXT
    // =====================================================

    const formatStatus = (status) => {

        switch (status?.toLowerCase()) {

            case "pending":
                return "Pending";

            case "assigned":
                return "Assigned";

            case "in_progress":
                return "In Progress";

            case "resolved":
                return "Resolved";

            default:
                return status || "Unknown";

        }

    };


    // =====================================================
    // PRIORITY TEXT
    // =====================================================

    const formatPriority = (priority) => {

        if (!priority) {
            return "Medium";
        }

        return (
            priority.charAt(0).toUpperCase() +
            priority.slice(1)
        );

    };


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "30px"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                    gap: "20px"
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            color: "#123456"
                        }}
                    >
                        Emergency Map
                    </h1>


                    <p
                        style={{
                            color: "#66809a",
                            marginTop: "8px"
                        }}
                    >
                        View reported emergencies and their locations
                    </p>

                </div>


                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    onClick={() => navigate("/citizen")}
                    style={{
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2563eb",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    ← Back
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    style={{
                        background: "#fee2e2",
                        color: "#991b1b",
                        padding: "15px 20px",
                        borderRadius: "10px",
                        marginBottom: "20px"
                    }}
                >
                    ⚠️ {error}
                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div
                    style={{
                        background: "white",
                        padding: "40px",
                        borderRadius: "12px",
                        textAlign: "center"
                    }}
                >

                    <h3>
                        Loading emergency locations...
                    </h3>

                    <p>
                        Please wait while we load the emergency map.
                    </p>

                </div>

            ) : (

                <>

                    {/* =================================================
                        MAP
                    ================================================= */}

                    <div
                        style={{
                            background: "white",
                            padding: "15px",
                            borderRadius: "15px",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.08)"
                        }}
                    >

                        <MapContainer
                            center={defaultPosition}
                            zoom={11}
                            style={{
                                height: "600px",
                                width: "100%",
                                borderRadius: "10px"
                            }}
                        >

                            {/* =================================================
                                OPENSTREETMAP
                            ================================================= */}

                            <TileLayer
                                attribution="&copy; OpenStreetMap contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />


                            {/* =================================================
                                EMERGENCY MARKERS
                            ================================================= */}

                            {emergenciesWithLocation.map(
                                (emergency) => (

                                    <Marker
                                        key={emergency.id}
                                        position={[
                                            Number(emergency.latitude),
                                            Number(emergency.longitude)
                                        ]}
                                    >

                                        <Popup>

                                            <div
                                                style={{
                                                    minWidth: "220px"
                                                }}
                                            >

                                                {/* EMERGENCY TYPE */}

                                                <h3
                                                    style={{
                                                        marginTop: 0,
                                                        marginBottom: "12px"
                                                    }}
                                                >

                                                    🚨{" "}

                                                    {
                                                        emergency.emergency_type
                                                    }

                                                </h3>


                                                {/* LOCATION */}

                                                <p>

                                                    <strong>
                                                        Location:
                                                    </strong>{" "}

                                                    {
                                                        emergency.location ||
                                                        "Not provided"
                                                    }

                                                </p>


                                                {/* PRIORITY */}

                                                <p>

                                                    <strong>
                                                        Priority:
                                                    </strong>{" "}

                                                    {
                                                        formatPriority(
                                                            emergency.priority
                                                        )
                                                    }

                                                </p>


                                                {/* STATUS */}

                                                <p>

                                                    <strong>
                                                        Status:
                                                    </strong>{" "}

                                                    {
                                                        formatStatus(
                                                            emergency.status
                                                        )
                                                    }

                                                </p>


                                                {/* DESCRIPTION */}

                                                <p>

                                                    <strong>
                                                        Description:
                                                    </strong>

                                                    <br />

                                                    {
                                                        emergency.description ||
                                                        "No description provided"
                                                    }

                                                </p>


                                                {/* COORDINATES */}

                                                <p
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#64748b"
                                                    }}
                                                >

                                                    📍{" "}

                                                    {Number(
                                                        emergency.latitude
                                                    ).toFixed(6)}

                                                    ,{" "}

                                                    {Number(
                                                        emergency.longitude
                                                    ).toFixed(6)}

                                                </p>

                                            </div>

                                        </Popup>

                                    </Marker>

                                )
                            )}

                        </MapContainer>

                    </div>


                    {/* =================================================
                        MAP INFORMATION
                    ================================================= */}

                    <div
                        style={{
                            marginTop: "20px",
                            background: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            boxShadow:
                                "0 2px 10px rgba(0,0,0,0.05)"
                        }}
                    >

                        <h3
                            style={{
                                marginTop: 0
                            }}
                        >
                            Emergency Locations
                        </h3>

                        <p
                            style={{
                                color: "#64748b"
                            }}
                        >

                            📍{" "}

                            {emergenciesWithLocation.length}{" "}

                            emergency location
                            {emergenciesWithLocation.length !== 1
                                ? "s"
                                : ""}{" "}

                            available on the map.

                        </p>

                    </div>


                    {/* =================================================
                        NO LOCATION MESSAGE
                    ================================================= */}

                    {emergenciesWithLocation.length === 0 && (

                        <div
                            style={{
                                marginTop: "20px",
                                background: "white",
                                padding: "20px",
                                borderRadius: "10px",
                                textAlign: "center"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "35px",
                                    marginBottom: "10px"
                                }}
                            >
                                📍
                            </div>

                            <h3>
                                No Emergency Locations
                            </h3>

                            <p
                                style={{
                                    color: "#64748b"
                                }}
                            >
                                No reported emergencies with valid
                                GPS coordinates are currently available
                                on the map.
                            </p>

                        </div>

                    )}

                </>

            )}

        </div>

    );

};


export default EmergencyMap;