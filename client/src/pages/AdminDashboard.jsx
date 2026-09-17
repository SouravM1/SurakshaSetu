import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [responders, setResponders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingResponders, setLoadingResponders] = useState(true);

  const [updatingId, setUpdatingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  const [selectedResponders, setSelectedResponders] = useState({});

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // FETCH ALL REPORTS
  // =====================================================

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/emergencies`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(response.data.emergencies || []);
    } catch (error) {
      console.error("Error fetching reports:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch emergency reports"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH RESPONDERS
  // =====================================================

  const fetchResponders = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/responders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponders(response.data.responders || []);
    } catch (error) {
      console.error("Error fetching responders:", error);
    } finally {
      setLoadingResponders(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    if (token) {
      fetchReports();
      fetchResponders();
    } else {
      setLoading(false);
      setLoadingResponders(false);
    }
  }, [token]);

  // =====================================================
  // SELECT RESPONDER
  // =====================================================

  const handleResponderChange = (emergencyId, responderId) => {
    setSelectedResponders((previous) => ({
      ...previous,
      [emergencyId]: responderId,
    }));
  };

  // =====================================================
  // ASSIGN RESPONDER
  // =====================================================

  const handleAssignResponder = async (reportId) => {
    const responderId = selectedResponders[reportId];

    if (!responderId) {
      alert("Please select a responder first.");
      return;
    }

    try {
      setAssigningId(reportId);

      await axios.put(
        `${API_URL}/api/admin/emergencies/${reportId}/assign`,
        {
          responder_id: Number(responderId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Emergency assigned successfully.");

      // Refresh reports so the assigned responder
      // information comes from the backend.
      await fetchReports();

      // Clear the temporary dropdown selection.
      setSelectedResponders((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[reportId];

        return updated;
      });
    } catch (error) {
      console.error("Error assigning responder:", error);

      alert(
        error.response?.data?.message ||
          "Failed to assign responder"
      );
    } finally {
      setAssigningId(null);
    }
  };

  // =====================================================
  // MARK EMERGENCY AS RESOLVED
  // =====================================================

  const handleStatusUpdate = async (reportId) => {
    try {
      setUpdatingId(reportId);

      await axios.put(
        `${API_URL}/api/admin/emergencies/${reportId}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Emergency resolved successfully.");

      // Refresh reports after resolving.
      await fetchReports();
    } catch (error) {
      console.error("Error updating status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update emergency status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // GET RESPONDER NAME
  // =====================================================

  const getResponderName = (report) => {
    // Backend responder_name
    if (report.responder_name) {
      return report.responder_name;
    }

    // Backend assigned_responder object
    if (report.assigned_responder?.name) {
      return report.assigned_responder.name;
    }

    // Backend responder object
    if (report.responder?.name) {
      return report.responder.name;
    }

    // Backend assigned_responder_name
    if (report.assigned_responder_name) {
      return report.assigned_responder_name;
    }

    return null;
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalReports = reports.length;

  const activeEmergencies = reports.filter(
    (report) => report.status !== "resolved"
  ).length;

  const resolvedEmergencies = reports.filter(
    (report) => report.status === "resolved"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Manage emergency reports and response operations
          </p>
        </div>

        <div className="admin-profile">
          <div className="admin-user-info">
            <strong>{user?.name || "Admin"}</strong>

            <span>{user?.role || "admin"}</span>
          </div>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="admin-stats">

        {/* TOTAL REPORTS */}

        <div className="stat-card">
          <div className="stat-icon blue">
            📋
          </div>

          <div>
            <p>Total Reports</p>

            <h2>
              {loading ? "..." : totalReports}
            </h2>
          </div>
        </div>

        {/* ACTIVE EMERGENCIES */}

        <div className="stat-card">
          <div className="stat-icon red">
            🚨
          </div>

          <div>
            <p>Active Emergencies</p>

            <h2>
              {loading ? "..." : activeEmergencies}
            </h2>
          </div>
        </div>

        {/* RESOLVED */}

        <div className="stat-card">
          <div className="stat-icon green">
            ✅
          </div>

          <div>
            <p>Resolved</p>

            <h2>
              {loading ? "..." : resolvedEmergencies}
            </h2>
          </div>
        </div>

      </section>

      {/* =================================================
          EMERGENCY REPORTS
      ================================================= */}

      <section className="reports-section">

        <div className="section-heading">
          <div>
            <h2>Emergency Reports</h2>

            <p>
              All emergency reports submitted by citizens
            </p>
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="loading-box">
            Loading emergency reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="empty-box">
            No emergency reports found.
          </div>
        ) : (
          <div className="reports-list">

            {reports.map((report) => {

              const responderName =
                getResponderName(report);

              return (
                <div
                  className="report-card"
                  key={report.id}
                >

                  {/* =================================================
                      LEFT SIDE
                  ================================================= */}

                  <div className="report-left">

                    <div className="report-icon">
                      🚨
                    </div>

                    <div className="report-details">

                      <h3>
                        {report.emergency_type}
                      </h3>

                      <p className="report-description">
                        {report.description}
                      </p>

                      <p className="report-location">
                        📍 {report.location}
                      </p>

                      <p className="report-date">
                        Reported:{" "}
                        {report.created_at
                          ? new Date(
                              report.created_at
                            ).toLocaleString()
                          : "Unknown"}
                      </p>

                    </div>
                  </div>

                  {/* =================================================
                      RIGHT SIDE
                  ================================================= */}

                  <div className="report-right">

                    {/* =================================================
                        PRIORITY
                    ================================================= */}

                    <div className="priority">

                      <span>Priority</span>

                      <strong
                        className={`priority-${(
                          report.priority || "medium"
                        ).toLowerCase()}`}
                      >
                        {report.priority || "Medium"}
                      </strong>

                    </div>

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <span
                      className={`status-badge ${
                        report.status === "resolved"
                          ? "resolved"
                          : report.status === "assigned"
                            ? "assigned"
                            : report.status === "in_progress"
                              ? "in_progress"
                              : "pending"
                      }`}
                    >
                      {report.status || "pending"}
                    </span>

                    {/* =================================================
                        ASSIGNED RESPONDER
                    ================================================= */}

                    {report.responder_id && (
                      <div className="responder-info">

                        <span>Responder</span>

                        <strong>
                          {responderName ||
                            "Assigned Responder"}
                        </strong>

                      </div>
                    )}

                    {/* =================================================
                        ASSIGN RESPONDER
                    ================================================= */}

                    {report.status !== "resolved" && (
                      <div className="assign-section">

                        <select
                          value={
                            selectedResponders[
                              report.id
                            ] || ""
                          }
                          onChange={(event) =>
                            handleResponderChange(
                              report.id,
                              event.target.value
                            )
                          }
                          disabled={
                            assigningId === report.id ||
                            loadingResponders
                          }
                        >

                          <option value="">
                            {loadingResponders
                              ? "Loading Responders..."
                              : "Select Responder"}
                          </option>

                          {responders.map(
                            (responder) => (
                              <option
                                key={responder.id}
                                value={responder.id}
                              >
                                {responder.name}
                              </option>
                            )
                          )}

                        </select>

                        <button
                          className="assign-btn"
                          onClick={() =>
                            handleAssignResponder(
                              report.id
                            )
                          }
                          disabled={
                            assigningId === report.id ||
                            loadingResponders
                          }
                        >
                          {assigningId === report.id
                            ? "Assigning..."
                            : "Assign Responder"}
                        </button>

                      </div>
                    )}

                    {/* =================================================
                        MARK RESOLVED
                    ================================================= */}

                    {report.status !== "resolved" && (
                      <button
                        className="resolve-btn"
                        onClick={() =>
                          handleStatusUpdate(
                            report.id
                          )
                        }
                        disabled={
                          updatingId === report.id
                        }
                      >
                        {updatingId === report.id
                          ? "Updating..."
                          : "Mark Resolved"}
                      </button>
                    )}

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </section>
    </div>
  );
};

export default AdminDashboard;