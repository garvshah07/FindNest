import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  LogoIcon,
  UsersIcon,
  BuildingIcon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  XMarkIcon,
  RefreshCwIcon,
  ShieldIcon,
  MapPinIcon,
  KeyIcon,
  TagIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ArrowLeftIcon,
} from "../components/Icons";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../redux/actions";
import "./Admin.css";
import "./Home.css";

export default function Admin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: currentUser } = useSelector((state) => state.auth);
  const reduxUsers = useSelector((state) => state.users) || [];
  const reduxProperties = useSelector((state) => state.properties) || [];

  const [activeTab, setActiveTab] = useState("users"); // "users" or "properties"
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Search & Filter
  const [userSearch, setUserSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all"); // "all", "Rent", "Sell"

  // User Modals State
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null for create, user object for edit
  const [userForm, setUserForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "user",
  });

  // Property Modals State
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyForm, setPropertyForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    propertyage: "Brand New",
    propertyfor: "Rent",
  });

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'user' | 'property', item: object }

  // Load users and properties on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-clear feedback after 4s
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  async function loadData() {
    setLoading(true);
    try {
      await Promise.all([
        dispatch(getUsers()).catch(() => {}),
        dispatch(getProperties()).catch(() => {}),
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Filtered Users
  const filteredUsers = useMemo(() => {
    const list = Array.isArray(reduxUsers) ? reduxUsers : [];
    if (!userSearch.trim()) return list;
    const q = userSearch.toLowerCase();
    return list.filter(
      (u) =>
        u.firstname?.toLowerCase().includes(q) ||
        u.lastname?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [reduxUsers, userSearch]);

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    const list = Array.isArray(reduxProperties) ? reduxProperties : [];
    return list.filter((p) => {
      if (propertyFilter !== "all") {
        if (String(p.propertyfor).toLowerCase() !== propertyFilter.toLowerCase()) {
          return false;
        }
      }
      if (propertySearch.trim()) {
        const q = propertySearch.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.propertyfor?.toLowerCase().includes(q) ||
          p.propertyage?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reduxProperties, propertyFilter, propertySearch]);

  // Metrics
  const totalUsers = Array.isArray(reduxUsers) ? reduxUsers.length : 0;
  const totalProperties = Array.isArray(reduxProperties) ? reduxProperties.length : 0;
  const rentCount = useMemo(
    () =>
      (reduxProperties || []).filter(
        (p) => String(p.propertyfor).toLowerCase() === "rent"
      ).length,
    [reduxProperties]
  );
  const sellCount = useMemo(
    () =>
      (reduxProperties || []).filter(
        (p) => String(p.propertyfor).toLowerCase() === "sell"
      ).length,
    [reduxProperties]
  );

  // ---------------------------------------------------------------------------
  // User CRUD Handlers
  // ---------------------------------------------------------------------------

  function handleOpenCreateUser() {
    setEditingUser(null);
    setUserForm({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      role: "user",
    });
    setUserModalOpen(true);
  }

  function handleOpenEditUser(user) {
    setEditingUser(user);
    setUserForm({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      password: "", // Leave blank unless changing
      role: user.role || "user",
    });
    setUserModalOpen(true);
  }

  async function handleSaveUser(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        // Update user
        const payload = {
          firstname: userForm.firstname,
          lastname: userForm.lastname,
          email: userForm.email,
          role: userForm.role,
        };
        if (userForm.password.trim()) {
          payload.password = userForm.password;
        }
        await dispatch(updateUser(editingUser._id, payload));
        setFeedback({
          type: "success",
          message: `User "${userForm.firstname}" updated successfully!`,
        });
      } else {
        // Create user
        if (!userForm.password) {
          setFeedback({ type: "error", message: "Password is required for new users." });
          setLoading(false);
          return;
        }
        await dispatch(createUser(userForm));
        setFeedback({
          type: "success",
          message: `User "${userForm.firstname}" created successfully!`,
        });
      }
      setUserModalOpen(false);
      await dispatch(getUsers());
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Operation failed." });
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Property CRUD Handlers
  // ---------------------------------------------------------------------------

  function handleOpenCreateProperty() {
    setEditingProperty(null);
    setPropertyForm({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      propertyage: "Brand New",
      propertyfor: "Rent",
    });
    setPropertyModalOpen(true);
  }

  function handleOpenEditProperty(prop) {
    setEditingProperty(prop);
    setPropertyForm({
      name: prop.name || "",
      address: prop.address || "",
      latitude: prop.latitude || "",
      longitude: prop.longitude || "",
      propertyage: prop.propertyage || "Brand New",
      propertyfor: prop.propertyfor || "Rent",
    });
    setPropertyModalOpen(true);
  }

  async function handleSaveProperty(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProperty) {
        await dispatch(updateProperty(editingProperty._id, propertyForm));
        setFeedback({
          type: "success",
          message: `Property "${propertyForm.name}" updated successfully!`,
        });
      } else {
        await dispatch(createProperty(propertyForm));
        setFeedback({
          type: "success",
          message: `Property "${propertyForm.name}" listed successfully!`,
        });
      }
      setPropertyModalOpen(false);
      await dispatch(getProperties());
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Operation failed." });
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Delete Confirmation Handlers
  // ---------------------------------------------------------------------------

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      if (deleteTarget.type === "user") {
        await dispatch(deleteUser(deleteTarget.item._id));
        setFeedback({
          type: "success",
          message: `User "${deleteTarget.item.firstname || deleteTarget.item.email}" deleted.`,
        });
        await dispatch(getUsers());
      } else if (deleteTarget.type === "property") {
        await dispatch(deleteProperty(deleteTarget.item._id));
        setFeedback({
          type: "success",
          message: `Property "${deleteTarget.item.name}" deleted from database.`,
        });
        await dispatch(getProperties());
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Delete failed." });
    } finally {
      setDeleteTarget(null);
      setLoading(false);
    }
  }

  return (
    <div className="admin-layout">
      {/* 1. Admin Sticky Navbar */}
      <header className="admin-navbar">
        <div className="admin-navbar-container">
          <div className="admin-brand-group">
            <Link to="/home" className="home-brand" title="Return to Map">
              <div className="brand-icon-wrapper">
                <LogoIcon className="brand-logo-svg" />
              </div>
              <div className="brand-text">
                <span className="brand-title">FindNest</span>
                <span className="brand-subtitle">Real Estate Map</span>
              </div>
            </Link>

            <span className="admin-portal-badge">
              <ShieldIcon className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </span>
          </div>

          <div className="admin-navbar-actions">
            <Link to="/home" className="btn-back-map" title="Return to properties map">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Map</span>
            </Link>

            <div className="nav-profile-btn active" style={{ cursor: "default" }}>
              <div className="nav-avatar">
                <span>{(currentUser?.firstname?.[0] || "A").toUpperCase()}</span>
              </div>
              <div className="nav-user-meta">
                <span className="nav-user-name">
                  {currentUser?.firstname
                    ? `${currentUser.firstname} ${currentUser?.lastname || ""}`.trim()
                    : "Admin"}
                </span>
                <span className="nav-user-role">{currentUser?.role || "Administrator"}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Admin Content Area */}
      <main className="admin-main">
        <div className="admin-container">
          {/* Header & Refresh */}
          <div className="admin-header-row">
            <div>
              <h1 className="admin-page-title">Admin Management Panel</h1>
              <p className="admin-page-subtitle">
                Complete CRUD controls for registered users and plotted property listings.
              </p>
            </div>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={loadData}
              disabled={loading}
              title="Refresh database records"
            >
              <RefreshCwIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Refreshing..." : "Refresh Data"}</span>
            </button>
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div className={`admin-feedback-banner ${feedback.type}`}>
              <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {feedback.type === "success" ? (
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircleIcon className="w-5 h-5 text-rose-400" />
                )}
                <span>{feedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 3. Stat Cards */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-icon-wrapper stat-icon-users">
                <UsersIcon className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{totalUsers}</span>
                <span className="stat-label">Registered Users</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-wrapper stat-icon-props">
                <BuildingIcon className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{totalProperties}</span>
                <span className="stat-label">Total Properties</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-wrapper stat-icon-rent">
                <KeyIcon className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{rentCount}</span>
                <span className="stat-label">Listed for Rent</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon-wrapper stat-icon-sell">
                <TagIcon className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{sellCount}</span>
                <span className="stat-label">Listed for Sell</span>
              </div>
            </div>
          </div>

          {/* 4. Tab Navigation Switcher */}
          <div className="admin-tab-nav">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <UsersIcon className="w-4 h-4" />
              <span>Users Management</span>
              <span className="tab-badge">{totalUsers}</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${activeTab === "properties" ? "active" : ""}`}
              onClick={() => setActiveTab("properties")}
            >
              <BuildingIcon className="w-4 h-4" />
              <span>Properties Management</span>
              <span className="tab-badge">{totalProperties}</span>
            </button>
          </div>

          {/* 5. TAB A: USERS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="admin-content-card">
              <div className="admin-toolbar">
                <div className="toolbar-left">
                  <div className="admin-search-wrapper">
                    <SearchIcon className="admin-search-icon" />
                    <input
                      type="text"
                      className="admin-search-input"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search users by name, email, or role..."
                    />
                    {userSearch && (
                      <button
                        type="button"
                        className="admin-search-clear"
                        onClick={() => setUserSearch("")}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-add-item"
                  onClick={handleOpenCreateUser}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add New User</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>User ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-table-state">
                          <UsersIcon className="w-8 h-8" style={{ margin: "0 auto", opacity: 0.5 }} />
                          <p>No registered users found matching "{userSearch}".</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const name = u.firstname
                          ? `${u.firstname} ${u.lastname || ""}`.trim()
                          : "FindNest User";
                        const initial = (u.firstname?.[0] || u.email?.[0] || "U").toUpperCase();
                        const isAdmin = String(u.role).toLowerCase() === "admin";

                        return (
                          <tr key={u._id}>
                            <td>
                              <div className="table-user-cell">
                                <div className="table-user-avatar">{initial}</div>
                                <div className="table-user-meta">
                                  <span className="table-user-name">{name}</span>
                                  <span className="table-user-sub">
                                    {u.lastname ? `@${u.firstname.toLowerCase()}` : "User"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`role-badge ${isAdmin ? "admin" : "user"}`}>
                                {isAdmin && <ShieldIcon className="w-3 h-3" />}
                                {u.role || "User"}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#8c7e70" }}>
                                {u._id?.slice(-8) || "—"}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="btn-icon-edit"
                                  onClick={() => handleOpenEditUser(u)}
                                  title="Edit user details"
                                >
                                  <EditIcon className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn-icon-delete"
                                  onClick={() => setDeleteTarget({ type: "user", item: u })}
                                  title="Delete user"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. TAB B: PROPERTIES MANAGEMENT */}
          {activeTab === "properties" && (
            <div className="admin-content-card">
              <div className="admin-toolbar">
                <div className="toolbar-left">
                  <div className="admin-search-wrapper">
                    <SearchIcon className="admin-search-icon" />
                    <input
                      type="text"
                      className="admin-search-input"
                      value={propertySearch}
                      onChange={(e) => setPropertySearch(e.target.value)}
                      placeholder="Search properties by title, address, or age..."
                    />
                    {propertySearch && (
                      <button
                        type="button"
                        className="admin-search-clear"
                        onClick={() => setPropertySearch("")}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <select
                    className="admin-filter-select"
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="Rent">For Rent</option>
                    <option value="Sell">For Sell</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="btn-add-item"
                  onClick={handleOpenCreateProperty}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>List New Property</span>
                </button>
              </div>

              {/* Properties Table */}
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Property Name</th>
                      <th>Type</th>
                      <th>Address</th>
                      <th>Property Age</th>
                      <th>Coordinates</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-table-state">
                          <BuildingIcon className="w-8 h-8" style={{ margin: "0 auto", opacity: 0.5 }} />
                          <p>No properties found in database matching your filter.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProperties.map((p) => {
                        const isRent = String(p.propertyfor).toLowerCase() === "rent";
                        return (
                          <tr key={p._id}>
                            <td>
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <strong style={{ color: "#ffffff", fontSize: "14px" }}>
                                  {p.name}
                                </strong>
                                <span style={{ fontSize: "11px", color: "#8c7e70" }}>
                                  ID: {p._id?.slice(-8)}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className={`type-pill ${isRent ? "rent" : "sell"}`}>
                                {isRent ? <KeyIcon className="w-3 h-3" /> : <TagIcon className="w-3 h-3" />}
                                {p.propertyfor}
                              </span>
                            </td>
                            <td>
                              <div style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.address}>
                                {p.address}
                              </div>
                            </td>
                            <td>{p.propertyage || "Ready"}</td>
                            <td>
                              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#fed7aa" }}>
                                {parseFloat(p.latitude).toFixed(4)}, {parseFloat(p.longitude).toFixed(4)}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="btn-icon-edit"
                                  onClick={() => handleOpenEditProperty(p)}
                                  title="Edit property details"
                                >
                                  <EditIcon className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  className="btn-icon-delete"
                                  onClick={() => setDeleteTarget({ type: "property", item: p })}
                                  title="Delete property from database"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ==========================================================================
          MODAL 1: Create / Edit User
          ========================================================================== */}
      {userModalOpen && (
        <div className="modal-backdrop" onClick={() => setUserModalOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-header-icon-title">
                <div className="modal-badge-icon icon-profile">
                  <UsersIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="modal-title">
                    {editingUser ? "Edit User Account" : "Create New User"}
                  </h3>
                  <p className="modal-subtitle">
                    {editingUser
                      ? "Update credentials, profile name, or administrative role"
                      : "Register a new user into FindNest database"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setUserModalOpen(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="modal-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={userForm.firstname}
                    onChange={(e) => setUserForm((p) => ({ ...p, firstname: e.target.value }))}
                    placeholder="e.g. Garv"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={userForm.lastname}
                    onChange={(e) => setUserForm((p) => ({ ...p, lastname: e.target.value }))}
                    placeholder="e.g. Shah"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="modal-input"
                  value={userForm.email}
                  onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    {editingUser ? "Password (Leave blank to keep)" : "Password"}
                  </label>
                  <input
                    type="password"
                    className="modal-input"
                    value={userForm.password}
                    onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder={editingUser ? "••••••••" : "Min 6 characters"}
                    required={!editingUser}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="modal-select"
                    value={userForm.role}
                    onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))}
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "8px" }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setUserModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Saving..." : editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL 2: Create / Edit Property
          ========================================================================== */}
      {propertyModalOpen && (
        <div className="modal-backdrop" onClick={() => setPropertyModalOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-header-icon-title">
                <div
                  className={`modal-badge-icon ${
                    propertyForm.propertyfor === "Rent" ? "icon-rent" : "icon-sell"
                  }`}
                >
                  {propertyForm.propertyfor === "Rent" ? (
                    <KeyIcon className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <TagIcon className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <h3 className="modal-title">
                    {editingProperty ? "Edit Property Listing" : "List New Property"}
                  </h3>
                  <p className="modal-subtitle">
                    Configure property details, type, and geographic coordinates
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPropertyModalOpen(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Type Toggle */}
            <div className="modal-type-toggle">
              <button
                type="button"
                className={`type-toggle-btn ${
                  propertyForm.propertyfor === "Rent" ? "active-rent" : ""
                }`}
                onClick={() => setPropertyForm((p) => ({ ...p, propertyfor: "Rent" }))}
              >
                <KeyIcon className="w-4 h-4" />
                <span>For Rent</span>
              </button>
              <button
                type="button"
                className={`type-toggle-btn ${
                  propertyForm.propertyfor === "Sell" ? "active-sell" : ""
                }`}
                onClick={() => setPropertyForm((p) => ({ ...p, propertyfor: "Sell" }))}
              >
                <TagIcon className="w-4 h-4" />
                <span>For Sell</span>
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="modal-form">
              <div className="form-group">
                <label className="form-label">Property Title / Name</label>
                <input
                  type="text"
                  className="modal-input"
                  value={propertyForm.name}
                  onChange={(e) => setPropertyForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Skyline Luxury Villa, Ahmedabad"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="modal-input"
                  value={propertyForm.address}
                  onChange={(e) => setPropertyForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Full street address, area, or landmark"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={propertyForm.latitude}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, latitude: e.target.value }))}
                    placeholder="e.g. 23.000408"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={propertyForm.longitude}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, longitude: e.target.value }))}
                    placeholder="e.g. 72.618427"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Property Age</label>
                <select
                  className="modal-select"
                  value={propertyForm.propertyage}
                  onChange={(e) => setPropertyForm((p) => ({ ...p, propertyage: e.target.value }))}
                >
                  <option value="Brand New">Brand New (Under 1 yr)</option>
                  <option value="1 - 3 Years">1 - 3 Years</option>
                  <option value="3 - 5 Years">3 - 5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                  <option value="Under Construction">Under Construction</option>
                </select>
              </div>

              <div className="modal-actions" style={{ marginTop: "8px" }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setPropertyModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Saving..." : editingProperty ? "Update Listing" : "Create Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL 3: Delete Confirmation
          ========================================================================== */}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: "420px" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="delete-confirm-box">
              <div className="delete-warning-icon">
                <TrashIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="modal-title" style={{ fontSize: "19px" }}>
                  Delete {deleteTarget.type === "user" ? "User" : "Property"}?
                </h3>
                <p className="modal-subtitle" style={{ marginTop: "8px" }}>
                  Are you sure you want to delete{" "}
                  <span className="delete-target-name">
                    "{deleteTarget.type === "user"
                      ? deleteTarget.item.firstname || deleteTarget.item.email
                      : deleteTarget.item.name}"
                  </span>
                  ? This will permanently remove the record from your MongoDB database.
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={loading}
              >
                Keep Record
              </button>
              <button
                type="button"
                className="btn-danger-outline"
                style={{ background: "#e11d48", color: "#ffffff", borderColor: "#e11d48" }}
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
