import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f7fb",
                padding: "20px"
            }}
        >
            <div
                style={{
                    background: "#ffffff",
                    padding: "40px",
                    borderRadius: "16px",
                    textAlign: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    maxWidth: "450px",
                    width: "100%"
                }}
            >
                <div
                    style={{
                        fontSize: "50px",
                        marginBottom: "15px"
                    }}
                >
                    🔒
                </div>

                <h1
                    style={{
                        marginBottom: "10px",
                        color: "#172033"
                    }}
                >
                    Access Denied
                </h1>

                <p
                    style={{
                        color: "#64748b",
                        marginBottom: "25px"
                    }}
                >
                    You do not have permission to access
                    this page.
                </p>

                <button
                    onClick={() => navigate(-1)}
                    style={{
                        border: "none",
                        background: "#2563eb",
                        color: "#ffffff",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;