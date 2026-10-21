import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  LogoIcon,
  UserCircleIcon,
  LogoutIcon,
  ChevronDownIcon,
  SparklesIcon,
  ShieldIcon,
} from "./Icons";
import { logout } from "../redux/actions";

export default function HomeNavbar({ onOpenProfile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click (mouse + touch) or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleLogout() {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login", { replace: true });
  }

  const displayName = user?.firstname
    ? `${user.firstname} ${user?.lastname || ""}`.trim()
    : "FindNest User";
  const displayEmail = user?.email || "member@findnest.com";
  const userInitial = (user?.firstname?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <header className="home-navbar">
      <div className="home-navbar-container">
        {/* Clickable Brand Logo */}
        <Link
          to="/home"
          className="home-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="FindNest Home"
          aria-label="FindNest Home"
        >
          <div className="brand-icon-wrapper">
            <LogoIcon className="brand-logo-svg" />
          </div>
          <div className="brand-text">
            <span className="brand-title">FindNest</span>
            <span className="brand-subtitle">Real Estate Map</span>
          </div>
        </Link>

        {/* Center Live Marketplace Badge */}
        <div className="market-badge" title="Live Interactive Properties Active">
          <span className="pulse-indicator"></span>
          <SparklesIcon className="market-badge-icon" />
          <span>Interactive Properties</span>
        </div>

        {/* Right Section: Single, Sleek Interactive Profile Avatar & Dropdown */}
        <div className="nav-user-section" ref={menuRef}>
          {String(user?.role).toLowerCase() === "admin" && (
            <Link
              to="/admin"
              className="nav-admin-link"
              title="Open Admin Control Center"
            >
              <ShieldIcon className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          <button
            type="button"
            className={`nav-profile-btn ${dropdownOpen ? "active" : ""}`}
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            id="nav-profile-btn"
          >
            <div className="nav-avatar">
              <span>{userInitial}</span>
            </div>
            <div className="nav-user-meta">
              <span className="nav-user-name">{displayName}</span>
              <span className="nav-user-role">{user?.role || "Member"}</span>
            </div>
            <ChevronDownIcon
              className={`nav-chevron ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Floating Glassmorphic Dropdown Menu */}
          {dropdownOpen && (
            <div className="nav-dropdown-menu" role="menu">
              <div className="dropdown-user-header">
                <div className="dropdown-avatar">{userInitial}</div>
                <div className="dropdown-user-info">
                  <div className="dropdown-name" title={displayName}>
                    {displayName}
                  </div>
                  <div className="dropdown-email" title={displayEmail}>
                    {displayEmail}
                  </div>
                  <div className="dropdown-role-badge">
                    {user?.role || "Verified User"}
                  </div>
                </div>
              </div>

              <div className="dropdown-divider" />

              <div className="dropdown-items">
                {String(user?.role).toLowerCase() === "admin" && (
                  <>
                    <button
                      type="button"
                      className="dropdown-item"
                      role="menuitem"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/admin");
                      }}
                    >
                      <ShieldIcon className="dropdown-item-icon" style={{ color: "#fbbf24" }} />
                      <div className="dropdown-item-text">
                        <span className="item-title" style={{ color: "#fbbf24" }}>
                          Admin Control Center
                        </span>
                        <span className="item-sub">Manage users & properties</span>
                      </div>
                    </button>
                    <div className="dropdown-divider" />
                  </>
                )}

                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenProfile();
                  }}
                >
                  <UserCircleIcon className="dropdown-item-icon" />
                  <div className="dropdown-item-text">
                    <span className="item-title">Profile</span>
                    <span className="item-sub">View account details</span>
                  </div>
                </button>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  className="dropdown-item logout-item"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogoutIcon className="dropdown-item-icon logout-icon" />
                  <div className="dropdown-item-text">
                    <span className="item-title">Logout</span>
                    <span className="item-sub">Sign out of FindNest</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
