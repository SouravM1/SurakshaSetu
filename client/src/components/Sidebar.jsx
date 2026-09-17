import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const role = user?.role;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =====================================================
  // CHECK ACTIVE ROUTE
  // =====================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // =====================================================
  // CITIZEN MENU
  // =====================================================

  const citizenMenu = [
    {
      label: "Dashboard",
      icon: "🏠",
      path: "/citizen",
    },
    {
      label: "Report Emergency",
      icon: "🚨",
      path: "/citizen/report-emergency",
    },
    {
      label: "My Reports",
      icon: "📋",
      path: "/citizen/my-reports",
    },
    {
      label: "Emergency Map",
      icon: "📍",
      path: "/citizen/emergency-map",
    },
  ];

  // =====================================================
  // RESPONDER MENU
  // =====================================================

  const responderMenu = [
    {
      label: "Dashboard",
      icon: "🏠",
      path: "/responder",
    },
  ];

  // =====================================================
  // ADMIN MENU
  // =====================================================

  const adminMenu = [
    {
      label: "Dashboard",
      icon: "🏠",
      path: "/admin",
    },
  ];

  // =====================================================
  // SELECT MENU BASED ON ROLE
  // =====================================================

  let menuItems = [];

  if (role === "citizen") {
    menuItems = citizenMenu;
  } else if (role === "responder") {
    menuItems = responderMenu;
  } else if (role === "admin") {
    menuItems = adminMenu;
  }

  return (
    <aside className="app-sidebar">
      {/* =================================================
                LOGO
            ================================================= */}

      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🛡️</div>

        <div className="sidebar-brand-text">
          <h2>SurakshaSetu</h2>

          <span>Emergency Management</span>
        </div>
      </div>

      {/* =================================================
                NAVIGATION
            ================================================= */}

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-menu-item ${
              isActive(item.path) ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-menu-icon">{item.icon}</span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* =================================================
                BOTTOM SECTION
            ================================================= */}

      <div className="sidebar-bottom">
        <button
          className="sidebar-menu-item"
          onClick={() => navigate("/citizen/settings")}
        >
          <span className="sidebar-menu-icon">⚙️</span>

          <span>Settings</span>
        </button>

        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-menu-icon">🚪</span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
