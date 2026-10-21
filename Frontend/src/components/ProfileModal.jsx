import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  UserCircleIcon,
  MailIcon,
  SparklesIcon,
  LogoutIcon,
  CheckCircleIcon,
} from "./Icons";
import { logout } from "../redux/actions";

export default function ProfileModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!isOpen) return null;

  function handleLogout() {
    dispatch(logout());
    onClose();
    navigate("/login", { replace: true });
  }

  const fullName = user?.firstname
    ? `${user.firstname} ${user?.lastname || ""}`.trim()
    : "FindNest Member";
  const email = user?.email || "user@findnest.com";
  const role = user?.role || "Standard User";
  const initial = (user?.firstname?.[0] || email[0] || "U").toUpperCase();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card profile-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="modal-badge-icon icon-profile">
              <UserCircleIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="modal-title">User Profile</h3>
              <p className="modal-subtitle">Manage your FindNest account details</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="profile-modal-body">
          <div className="profile-hero">
            <div className="profile-large-avatar">{initial}</div>
            <div className="profile-hero-meta">
              <h4 className="profile-hero-name">{fullName}</h4>
              <span className="profile-hero-badge">
                <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                Verified FindNest Account
              </span>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="info-label">Email Address</span>
              <div className="info-value-row">
                <MailIcon className="w-4 h-4 text-slate-400" />
                <span className="info-value">{email}</span>
              </div>
            </div>

            <div className="profile-info-item">
              <span className="info-label">Account Role</span>
              <div className="info-value-row">
                <SparklesIcon className="w-4 h-4 text-amber-400" />
                <span className="info-value">{role}</span>
              </div>
            </div>

            <div className="profile-info-item">
              <span className="info-label">Membership Status</span>
              <div className="info-value-row">
                <span className="status-dot"></span>
                <span className="info-value">Active & Authenticated</span>
              </div>
            </div>

            <div className="profile-info-item">
              <span className="info-label">Platform Access</span>
              <div className="info-value-row">
                <span className="info-value">Full Access (Rent & Sell Listings)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-actions profile-footer-actions">
          <button
            type="button"
            className="btn-danger-outline"
            onClick={handleLogout}
          >
            <LogoutIcon className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
          <button type="button" className="btn-primary-close" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
