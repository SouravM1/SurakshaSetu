import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Topbar from "../components/Topbar";

import "./SafetyInformation.css";

const SafetyInformation = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    // =====================================================
    // NAVIGATION
    // =====================================================

    const handleDashboard = () => {
        navigate("/citizen");
    };

    const handleReportEmergency = () => {
        navigate("/citizen/report-emergency");
    };

    const handleMyReports = () => {
        navigate("/citizen/my-reports");
    };

    const handleEmergencyMap = () => {
        navigate("/citizen/emergency-map");
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div className="safety-page">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="safety-sidebar">

                {/* LOGO */}

                <div className="safety-sidebar-brand">

                    <div className="safety-brand-icon">
                        🛡️
                    </div>

                    <div className="safety-brand-text">

                        <h2>
                            SurakshaSetu
                        </h2>

                        <span>
                            Emergency Management
                        </span>

                    </div>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav className="safety-sidebar-menu">

                    <button
                        className="safety-nav-item"
                        onClick={handleDashboard}
                    >
                        <span>🏠</span>
                        Dashboard
                    </button>


                    <button
                        className="safety-nav-item"
                        onClick={handleReportEmergency}
                    >
                        <span>🚨</span>
                        Report Emergency
                    </button>


                    <button
                        className="safety-nav-item"
                        onClick={handleMyReports}
                    >
                        <span>📋</span>
                        My Reports
                    </button>


                    <button
                        className="safety-nav-item"
                        onClick={handleEmergencyMap}
                    >
                        <span>📍</span>
                        Emergency Map
                    </button>


                    <button
                        className="safety-nav-item active"
                    >
                        <span>ℹ️</span>
                        Safety Information
                    </button>

                </nav>


                {/* =================================================
                    BOTTOM
                ================================================= */}

                <div className="safety-sidebar-bottom">

                    <button
                        className="safety-nav-item"
                        onClick={() =>
                            navigate("/citizen/settings")
                        }
                    >
                        <span>⚙️</span>
                        Settings
                    </button>


                    <button
                        className="safety-logout"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        <span>🚪</span>
                        Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="safety-main">

                {/* =================================================
                    TOPBAR
                ================================================= */}

                <Topbar
                    title="Safety Information"
                    subtitle="Learn how to stay safe during emergencies."
                />


                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="safety-content">

                    {/* INTRODUCTION */}

                    <div className="safety-intro">

                        <div className="safety-intro-icon">
                            🛡️
                        </div>

                        <div>

                            <h2>
                                Emergency Safety Guidelines
                            </h2>

                            <p>
                                Learn what to do before, during and
                                after common emergencies. Staying
                                prepared can help protect you,
                                your family and your community.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        SAFETY CARDS
                    ================================================= */}

                    <div className="safety-grid">

                        {/* FIRE */}

                        <article className="safety-card">

                            <div className="safety-card-icon fire">
                                🔥
                            </div>

                            <div className="safety-card-content">

                                <h3>
                                    Fire Safety
                                </h3>

                                <p>
                                    Stay calm and leave the building
                                    using the nearest safe exit.
                                </p>

                                <ul>
                                    <li>
                                        Do not use elevators.
                                    </li>

                                    <li>
                                        Stay low if there is smoke.
                                    </li>

                                    <li>
                                        Never go back inside a burning
                                        building.
                                    </li>

                                    <li>
                                        Call emergency services.
                                    </li>
                                </ul>

                            </div>

                        </article>


                        {/* FLOOD */}

                        <article className="safety-card">

                            <div className="safety-card-icon flood">
                                🌊
                            </div>

                            <div className="safety-card-content">

                                <h3>
                                    Flood Safety
                                </h3>

                                <p>
                                    Move to higher ground and avoid
                                    flooded roads.
                                </p>

                                <ul>
                                    <li>
                                        Avoid walking through floodwater.
                                    </li>

                                    <li>
                                        Never drive through flooded roads.
                                    </li>

                                    <li>
                                        Stay away from electrical equipment
                                        in wet areas.
                                    </li>

                                    <li>
                                        Follow official evacuation instructions.
                                    </li>
                                </ul>

                            </div>

                        </article>


                        {/* EARTHQUAKE */}

                        <article className="safety-card">

                            <div className="safety-card-icon earthquake">
                                🌍
                            </div>

                            <div className="safety-card-content">

                                <h3>
                                    Earthquake Safety
                                </h3>

                                <p>
                                    Protect yourself from falling objects
                                    and remain calm.
                                </p>

                                <ul>
                                    <li>
                                        Drop, cover and hold on.
                                    </li>

                                    <li>
                                        Stay away from windows and glass.
                                    </li>

                                    <li>
                                        Do not use elevators.
                                    </li>

                                    <li>
                                        Move to an open area after shaking
                                        stops if it is safe.
                                    </li>
                                </ul>

                            </div>

                        </article>


                        {/* MEDICAL */}

                        <article className="safety-card">

                            <div className="safety-card-icon medical">
                                🚑
                            </div>

                            <div className="safety-card-content">

                                <h3>
                                    Medical Emergency
                                </h3>

                                <p>
                                    Get professional medical help as
                                    quickly as possible.
                                </p>

                                <ul>
                                    <li>
                                        Call emergency medical services.
                                    </li>

                                    <li>
                                        Keep the person calm.
                                    </li>

                                    <li>
                                        Do not move an injured person
                                        unless necessary for safety.
                                    </li>

                                    <li>
                                        Provide basic first aid if trained.
                                    </li>
                                </ul>

                            </div>

                        </article>


                        {/* CYCLONE */}

                        <article className="safety-card">

                            <div className="safety-card-icon storm">
                                🌪️
                            </div>

                            <div className="safety-card-content">

                                <h3>
                                    Storm & Cyclone Safety
                                </h3>

                                <p>
                                    Stay indoors and follow official
                                    weather and evacuation instructions.
                                </p>

                                <ul>
                                    <li>
                                        Stay away from windows.
                                    </li>

                                    <li>
                                        Secure loose outdoor objects.
                                    </li>

                                    <li>
                                        Keep emergency supplies ready.
                                    </li>

                                    <li>
                                        Follow official warnings.
                                    </li>
                                </ul>

                            </div>

                        </article>


                        {/* GENERAL */}

                        <article className="safety-card">

                            <div className="safety-card-icon general">
                                🚨
                            </div>

                            <div className="safety-card-content">

                                <h3>
                                    General Emergency
                                </h3>

                                <p>
                                    Stay calm, assess the situation and
                                    contact appropriate emergency services.
                                </p>

                                <ul>
                                    <li>
                                        Move away from immediate danger.
                                    </li>

                                    <li>
                                        Keep your phone charged.
                                    </li>

                                    <li>
                                        Share your location when requesting help.
                                    </li>

                                    <li>
                                        Follow instructions from authorities.
                                    </li>
                                </ul>

                            </div>

                        </article>

                    </div>


                    {/* =================================================
                        EMERGENCY NUMBERS
                    ================================================= */}

                    <section className="emergency-numbers">

                        <div className="numbers-header">

                            <div className="numbers-icon">
                                📞
                            </div>

                            <div>

                                <h2>
                                    Important Emergency Numbers
                                </h2>

                                <p>
                                    Keep these numbers available when
                                    you need immediate assistance.
                                </p>

                            </div>

                        </div>


                        <div className="numbers-grid">

                            <div className="number-card">

                                <span>
                                    🚨
                                </span>

                                <div>
                                    <strong>
                                        112
                                    </strong>

                                    <p>
                                        National Emergency Number
                                    </p>
                                </div>

                            </div>


                            <div className="number-card">

                                <span>
                                    🚑
                                </span>

                                <div>
                                    <strong>
                                        108
                                    </strong>

                                    <p>
                                        Ambulance Emergency Service
                                    </p>
                                </div>

                            </div>


                            <div className="number-card">

                                <span>
                                    🔥
                                </span>

                                <div>
                                    <strong>
                                        101
                                    </strong>

                                    <p>
                                        Fire & Rescue Services
                                    </p>
                                </div>

                            </div>


                            <div className="number-card">

                                <span>
                                    👮
                                </span>

                                <div>
                                    <strong>
                                        100
                                    </strong>

                                    <p>
                                        Police
                                    </p>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        FINAL REMINDER
                    ================================================= */}

                    <div className="safety-reminder">

                        <span>
                            💡
                        </span>

                        <div>

                            <strong>
                                Stay prepared
                            </strong>

                            <p>
                                In a serious emergency, prioritize your
                                safety, follow official instructions and
                                contact emergency services when necessary.
                            </p>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default SafetyInformation;