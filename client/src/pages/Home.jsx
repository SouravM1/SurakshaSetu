import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

const Home = () => {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);


    // =====================================================
    // CLOSE MOBILE MENU
    // =====================================================

    const closeMenu = () => {
        setMenuOpen(false);
    };


    return (
        <div className="home-page">

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <nav className="home-navbar">

                <div className="home-logo">

                    <div className="home-logo-icon">
                        🛡️
                    </div>

                    <div>
                        <h2>SurakshaSetu</h2>
                        <span>Emergency Management</span>
                    </div>

                </div>


                {/* =================================================
                    DESKTOP NAVIGATION
                ================================================= */}

                <div className="home-nav-links">

                    <a
                        href="#home"
                        onClick={closeMenu}
                    >
                        Home
                    </a>

                    <a
                        href="#features"
                        onClick={closeMenu}
                    >
                        Features
                    </a>

                    <a
                        href="#how-it-works"
                        onClick={closeMenu}
                    >
                        How It Works
                    </a>

                    <a
                        href="#technology"
                        onClick={closeMenu}
                    >
                        Technology
                    </a>

                </div>


                {/* =================================================
                    DESKTOP BUTTONS
                ================================================= */}

                <div className="home-nav-buttons">

                    <button
                        className="home-login-btn"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        className="home-start-btn"
                        onClick={() => navigate("/register")}
                    >
                        Get Started
                    </button>

                </div>


                {/* =================================================
                    MOBILE MENU BUTTON
                ================================================= */}

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

            </nav>


            {/* =====================================================
                MOBILE NAVIGATION
            ===================================================== */}

            {menuOpen && (

                <div className="mobile-nav-menu">

                    <a
                        href="#home"
                        onClick={closeMenu}
                    >
                        Home
                    </a>

                    <a
                        href="#features"
                        onClick={closeMenu}
                    >
                        Features
                    </a>

                    <a
                        href="#how-it-works"
                        onClick={closeMenu}
                    >
                        How It Works
                    </a>

                    <a
                        href="#technology"
                        onClick={closeMenu}
                    >
                        Technology
                    </a>

                    <button
                        onClick={() => {
                            closeMenu();
                            navigate("/login");
                        }}
                    >
                        Login
                    </button>

                    <button
                        className="mobile-start-btn"
                        onClick={() => {
                            closeMenu();
                            navigate("/register");
                        }}
                    >
                        Get Started
                    </button>

                </div>

            )}


            {/* =====================================================
                HERO SECTION
            ===================================================== */}

            <section
                className="home-hero"
                id="home"
            >

                <div className="hero-content">

                    <div className="hero-badge">
                        🤖 AI-Powered Emergency Response
                    </div>

                    <h1>
                        Smarter Emergency
                        <span>Management & Response</span>
                    </h1>

                    <p>
                        SurakshaSetu brings citizens, administrators,
                        and emergency responders together on one platform
                        to make emergency response faster and more organized.
                    </p>


                    <div className="hero-buttons">

                        <button
                            className="hero-primary-btn"
                            onClick={() => navigate("/register")}
                        >
                            🚨 Report an Emergency
                        </button>

                        <button
                            className="hero-secondary-btn"
                            onClick={() => navigate("/login")}
                        >
                            Login to SurakshaSetu →
                        </button>

                    </div>


                    <div className="hero-highlights">

                        <div>
                            <strong>AI</strong>
                            <span>Priority Detection</span>
                        </div>

                        <div>
                            <strong>GPS</strong>
                            <span>Location Support</span>
                        </div>

                        <div>
                            <strong>24/7</strong>
                            <span>Emergency Coordination</span>
                        </div>

                    </div>

                </div>


                {/* =================================================
                    HERO VISUAL
                ================================================= */}

                <div className="hero-visual">

                    <div className="hero-card">

                        <div className="hero-card-header">

                            <span>
                                Emergency Response
                            </span>

                            <span className="live-indicator">
                                ● LIVE
                            </span>

                        </div>


                        <div className="hero-emergency-card">

                            <div className="hero-emergency-icon">
                                🚨
                            </div>

                            <div>

                                <strong>
                                    Emergency Reported
                                </strong>

                                <p>
                                    AI priority analysis completed
                                </p>

                            </div>

                        </div>


                        <div className="hero-priority">

                            <div>

                                <span>
                                    AI Priority
                                </span>

                                <strong className="critical">
                                    Critical
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Status
                                </span>

                                <strong className="responding">
                                    Responding
                                </strong>

                            </div>

                        </div>


                        <div className="hero-response-line">

                            <div className="response-step active">

                                <span>
                                    ✓
                                </span>

                                <p>
                                    Reported
                                </p>

                            </div>


                            <div className="response-line"></div>


                            <div className="response-step active">

                                <span>
                                    ✓
                                </span>

                                <p>
                                    Assigned
                                </p>

                            </div>


                            <div className="response-line"></div>


                            <div className="response-step">

                                <span>
                                    →
                                </span>

                                <p>
                                    Responding
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FEATURES
            ===================================================== */}

            <section
                className="home-section"
                id="features"
            >

                <div className="section-heading">

                    <span>
                        PLATFORM FEATURES
                    </span>

                    <h2>
                        Everything needed for
                        <br />
                        coordinated emergency response
                    </h2>

                    <p>
                        SurakshaSetu brings emergency reporting,
                        AI-based prioritization, responder coordination,
                        and notifications together in one platform.
                    </p>

                </div>


                <div className="features-grid">

                    {/* =================================================
                        FEATURE 1
                    ================================================= */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            🚨
                        </div>

                        <h3>
                            Emergency Reporting
                        </h3>

                        <p>
                            Citizens can quickly report different types
                            of emergencies with descriptions, locations,
                            and other important details.
                        </p>

                    </div>


                    {/* =================================================
                        FEATURE 2
                    ================================================= */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            🤖
                        </div>

                        <h3>
                            AI Priority Detection
                        </h3>

                        <p>
                            The machine learning model analyzes the
                            emergency type and description to estimate
                            Low, Medium, High, or Critical priority.
                        </p>

                    </div>


                    {/* =================================================
                        FEATURE 3
                    ================================================= */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            📍
                        </div>

                        <h3>
                            GPS Location
                        </h3>

                        <p>
                            Citizens can share their current location
                            to help responders identify the emergency
                            area more accurately.
                        </p>

                    </div>


                    {/* =================================================
                        FEATURE 4
                    ================================================= */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            👨‍🚒
                        </div>

                        <h3>
                            Responder Coordination
                        </h3>

                        <p>
                            Administrators can assign emergency reports
                            to available responders and track their progress.
                        </p>

                    </div>


                    {/* =================================================
                        FEATURE 5
                    ================================================= */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            🔔
                        </div>

                        <h3>
                            Notifications
                        </h3>

                        <p>
                            Citizens receive updates when their emergency
                            is assigned, response begins, or the emergency
                            is resolved.
                        </p>

                    </div>


                    {/* =================================================
                        FEATURE 6
                    ================================================= */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            🗺️
                        </div>

                        <h3>
                            Emergency Map
                        </h3>

                        <p>
                            Location-based emergency reports can be viewed
                            through an interactive map to understand
                            emergency activity in different areas.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                HOW IT WORKS
            ===================================================== */}

            <section
                className="how-section"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span>
                        HOW IT WORKS
                    </span>

                    <h2>
                        From emergency report
                        <br />
                        to resolution
                    </h2>

                    <p>
                        A simple workflow connects citizens,
                        administrators, and responders throughout
                        the emergency response process.
                    </p>

                </div>


                <div className="workflow">

                    {/* =================================================
                        STEP 1
                    ================================================= */}

                    <div className="workflow-step">

                        <div className="step-number">
                            01
                        </div>

                        <div className="step-icon">
                            🚨
                        </div>

                        <h3>
                            Report
                        </h3>

                        <p>
                            The citizen submits an emergency report
                            with the relevant details.
                        </p>

                    </div>


                    <div className="workflow-arrow">
                        →
                    </div>


                    {/* =================================================
                        STEP 2
                    ================================================= */}

                    <div className="workflow-step">

                        <div className="step-number">
                            02
                        </div>

                        <div className="step-icon">
                            🤖
                        </div>

                        <h3>
                            AI Analysis
                        </h3>

                        <p>
                            The ML model analyzes the report and
                            estimates its priority level.
                        </p>

                    </div>


                    <div className="workflow-arrow">
                        →
                    </div>


                    {/* =================================================
                        STEP 3
                    ================================================= */}

                    <div className="workflow-step">

                        <div className="step-number">
                            03
                        </div>

                        <div className="step-icon">
                            👨‍💼
                        </div>

                        <h3>
                            Assignment
                        </h3>

                        <p>
                            An administrator assigns the emergency
                            to an available responder.
                        </p>

                    </div>


                    <div className="workflow-arrow">
                        →
                    </div>


                    {/* =================================================
                        STEP 4
                    ================================================= */}

                    <div className="workflow-step">

                        <div className="step-number">
                            04
                        </div>

                        <div className="step-icon">
                            👨‍🚒
                        </div>

                        <h3>
                            Response
                        </h3>

                        <p>
                            The responder starts working on the
                            assigned emergency.
                        </p>

                    </div>


                    <div className="workflow-arrow">
                        →
                    </div>


                    {/* =================================================
                        STEP 5
                    ================================================= */}

                    <div className="workflow-step">

                        <div className="step-number">
                            05
                        </div>

                        <div className="step-icon">
                            ✅
                        </div>

                        <h3>
                            Resolution
                        </h3>

                        <p>
                            The emergency is resolved and the
                            citizen receives an update.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                TECHNOLOGY
            ===================================================== */}

            <section
                className="technology-section"
                id="technology"
            >

                <div className="technology-content">

                    <div>

                        <span>
                            TECHNOLOGY
                        </span>

                        <h2>
                            Built with modern
                            technologies
                        </h2>

                        <p>
                            SurakshaSetu combines a modern web stack
                            with machine learning to provide an
                            intelligent emergency management system.
                        </p>

                    </div>


                    <div className="technology-grid">

                        <div>
                            React
                        </div>

                        <div>
                            Node.js
                        </div>

                        <div>
                            Express.js
                        </div>

                        <div>
                            MySQL
                        </div>

                        <div>
                            Python
                        </div>

                        <div>
                            FastAPI
                        </div>

                        <div>
                            Scikit-learn
                        </div>

                        <div>
                            Socket.IO
                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="home-cta">

                <div>

                    <h2>
                        Be prepared. Stay connected.
                    </h2>

                    <p>
                        Get started with SurakshaSetu and help make
                        emergency reporting and response more organized.
                    </p>

                    <button
                        onClick={() => navigate("/register")}
                    >
                        Get Started →
                    </button>

                </div>

            </section>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="home-footer">

                <div className="footer-brand">

                    <div className="home-logo-icon">
                        🛡️
                    </div>

                    <div>

                        <h3>
                            SurakshaSetu
                        </h3>

                        <p>
                            Smart Emergency Management &
                            Response System
                        </p>

                    </div>

                </div>


                <div className="footer-links">

                    <a href="#home">
                        Home
                    </a>

                    <a href="#features">
                        Features
                    </a>

                    <a href="#how-it-works">
                        How It Works
                    </a>

                    <button
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                </div>


                <div className="footer-bottom">

                    <span>
                        © 2026 SurakshaSetu. All rights reserved.
                    </span>

                    <p className="footer-credit">

                        Made with{" "}

                        <span className="footer-heart">
                            ❤️
                        </span>

                        {" "}by{" "}

                        <strong>
                            SOURAV
                        </strong>

                    </p>

                </div>

            </footer>

        </div>
    );
};

export default Home;