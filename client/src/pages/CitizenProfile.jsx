import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Topbar from "../components/Topbar";
import API_URL from "../config";

import "./CitizenProfile.css";

const CitizenProfile = () => {
  const navigate = useNavigate();

  const { user, token, logout, updateUser } = useAuth();

  // =====================================================
  // USER INFORMATION
  // =====================================================

  const userName = user?.name || "Citizen";
  const userEmail = user?.email || "Not available";
  const userPhone = user?.phone || "Not available";

  const userInitial = userName.charAt(0).toUpperCase();

  // =====================================================
  // EDIT PROFILE STATE
  // =====================================================

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");

  const [email, setEmail] = useState(user?.email || "");

  const [phone, setPhone] = useState(user?.phone || "");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  // =====================================================
  // START EDITING
  // =====================================================

  const handleEditProfile = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");

    setSuccess("");
    setError("");

    setIsEditing(true);
  };

  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");

    setSuccess("");
    setError("");

    setIsEditing(false);
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          }),
        }
      );

      const data = await response.json();

      // -----------------------------
      // ERROR
      // -----------------------------

      if (!response.ok) {
        setError(
          data.message ||
          "Failed to update profile."
        );

        return;
      }

      // -----------------------------
      // SUCCESS
      // -----------------------------

      setSuccess(
        data.message ||
        "Profile updated successfully."
      );

      // -----------------------------
      // UPDATE AUTH USER
      // -----------------------------

      if (data.user) {
        updateUser(data.user);
      }

      setIsEditing(false);

    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

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


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

          <button
            className="nav-item"
            onClick={() =>
              navigate("/citizen")
            }
          >
            <span>🏠</span>
            Dashboard
          </button>


          {/* REPORT EMERGENCY */}

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


          {/* MY REPORTS */}

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


          {/* EMERGENCY MAP */}

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


          {/* SAFETY INFORMATION */}

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


        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div className="sidebar-bottom">

          {/* SETTINGS */}

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


          {/* LOGOUT */}

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        <Topbar
          title="My Profile"
          subtitle="Manage your personal information."
        />


        {/* =================================================
            PROFILE CONTENT
        ================================================= */}

        <section className="profile-page">

          {/* SUCCESS MESSAGE */}

          {success && (
            <div className="profile-success">
              ✅ {success}
            </div>
          )}


          {/* ERROR MESSAGE */}

          {error && (
            <div className="profile-error">
              ⚠️ {error}
            </div>
          )}


          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div className="profile-header-card">

            <div className="large-profile-avatar">
              {userInitial}
            </div>

            <div className="profile-header-info">

              <h2>
                {userName}
              </h2>

              <p>
                Citizen
              </p>

              <span>
                SurakshaSetu Member
              </span>

            </div>

            {!isEditing && (
              <button
                className="edit-profile-btn"
                onClick={handleEditProfile}
              >
                ✏️ Edit Profile
              </button>
            )}

          </div>


          {/* =================================================
              EDIT PROFILE FORM
          ================================================= */}

          {isEditing && (

            <section className="profile-card">

              <div className="profile-card-header">

                <div>

                  <h2>
                    Edit Personal Information
                  </h2>

                  <p>
                    Update your account information
                  </p>

                </div>

                <span className="profile-card-icon">
                  ✏️
                </span>

              </div>


              <form
                className="profile-edit-form"
                onSubmit={handleUpdateProfile}
              >

                {/* NAME */}

                <div className="profile-form-group">

                  <label htmlFor="profileName">
                    Full Name
                  </label>

                  <input
                    id="profileName"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="profile-form-group">

                  <label htmlFor="profileEmail">
                    Email Address
                  </label>

                  <input
                    id="profileEmail"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    required
                  />

                </div>


                {/* PHONE */}

                <div className="profile-form-group">

                  <label htmlFor="profilePhone">
                    Phone Number
                  </label>

                  <input
                    id="profilePhone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Enter your phone number"
                  />

                </div>


                {/* BUTTONS */}

                <div className="profile-form-buttons">

                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : "💾 Save Changes"}
                  </button>

                </div>

              </form>

            </section>

          )}


          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          {!isEditing && (

            <section className="profile-card">

              <div className="profile-card-header">

                <div>

                  <h2>
                    Personal Information
                  </h2>

                  <p>
                    Your basic account information
                  </p>

                </div>

                <span className="profile-card-icon">
                  👤
                </span>

              </div>


              <div className="profile-details-grid">

                <div className="profile-detail">

                  <span className="detail-label">
                    Full Name
                  </span>

                  <strong>
                    {userName}
                  </strong>

                </div>


                <div className="profile-detail">

                  <span className="detail-label">
                    Email Address
                  </span>

                  <strong>
                    {userEmail}
                  </strong>

                </div>


                <div className="profile-detail">

                  <span className="detail-label">
                    Phone Number
                  </span>

                  <strong>
                    {userPhone}
                  </strong>

                </div>


                <div className="profile-detail">

                  <span className="detail-label">
                    Account Type
                  </span>

                  <strong>
                    Citizen
                  </strong>

                </div>

              </div>

            </section>

          )}


          {/* =================================================
              ACCOUNT INFORMATION
          ================================================= */}

          <section className="profile-card">

            <div className="profile-card-header">

              <div>

                <h2>
                  Account Information
                </h2>

                <p>
                  Your SurakshaSetu account status
                </p>

              </div>

              <span className="profile-card-icon">
                🛡️
              </span>

            </div>


            <div className="account-status-row">

              <div>

                <span className="detail-label">
                  Account Status
                </span>

                <strong>
                  Active
                </strong>

              </div>

              <span className="active-badge">
                ● Active
              </span>

            </div>


            <div className="account-status-row">

              <div>

                <span className="detail-label">
                  Role
                </span>

                <strong>
                  Citizen
                </strong>

              </div>

            </div>

          </section>


          {/* =================================================
              SECURITY
          ================================================= */}

          <section className="profile-card">

            <div className="profile-card-header">

              <div>

                <h2>
                  Security
                </h2>

                <p>
                  Keep your account secure
                </p>

              </div>

              <span className="profile-card-icon">
                🔐
              </span>

            </div>


            <div className="security-row">

              <div>

                <strong>
                  Password
                </strong>

                <p>
                  Your password is securely protected.
                </p>

              </div>

              <button
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    "/citizen/change-password"
                  )
                }
              >
                Change Password
              </button>

            </div>

          </section>


          {/* =================================================
              BACK TO DASHBOARD
          ================================================= */}

          <div className="profile-back-section">

            <button
              className="back-dashboard-btn"
              onClick={() =>
                navigate("/citizen")
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        </section>

      </main>

    </div>
  );
};

export default CitizenProfile;