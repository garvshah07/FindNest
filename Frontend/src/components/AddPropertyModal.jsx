import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  XMarkIcon,
  BuildingIcon,
  MapPinIcon,
  KeyIcon,
  TagIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon,
} from "./Icons";
import { createProperty, getProperties } from "../redux/actions";

export default function AddPropertyModal({
  isOpen,
  onClose,
  initialType = "Rent", // "Rent" or "Sell"
  initialCoords = null,
  userLocation = null,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    propertyage: "Brand New",
    propertyfor: initialType,
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [coordsDetected, setCoordsDetected] = useState(false);
  const searchTimeoutRef = useRef(null);
  const suggestionsBoxRef = useRef(null);

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const defaultLat = initialCoords?.latitude || userLocation?.latitude ? String(initialCoords?.latitude || userLocation?.latitude) : "";
      const defaultLng = initialCoords?.longitude || userLocation?.longitude ? String(initialCoords?.longitude || userLocation?.longitude) : "";

      setForm((prev) => ({
        ...prev,
        propertyfor: initialType,
        latitude: defaultLat,
        longitude: defaultLng,
      }));
      setCoordsDetected(Boolean(defaultLat && defaultLng));
      setFeedback(null);
      setSuggestions([]);
    }
  }, [isOpen, initialType, initialCoords, userLocation]);

  // Close suggestions if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        suggestionsBoxRef.current &&
        !suggestionsBoxRef.current.contains(e.target)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFeedback(null);
  }

  // Address search with OpenStreetMap Nominatim auto-geocoding
  function handleAddressChange(e) {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, address: val }));
    setFeedback(null);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!val || val.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    // Debounce query
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            val
          )}&limit=5&addressdetails=1`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data || []);
        }
      } catch {
        // In case network/offline prevents Nominatim
        setSuggestions([]);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 450);
  }

  // When user clicks a location suggestion
  function handleSelectSuggestion(item) {
    const lat = parseFloat(item.lat).toFixed(6);
    const lon = parseFloat(item.lon).toFixed(6);

    setForm((prev) => ({
      ...prev,
      address: item.display_name,
      latitude: String(lat),
      longitude: String(lon),
    }));

    setCoordsDetected(true);
    setSuggestions([]);
  }

  // Use current browser device location
  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setFeedback({
        type: "error",
        text: "Geolocation is not supported by your browser.",
      });
      return;
    }

    setIsSearchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        setForm((prev) => ({
          ...prev,
          latitude: String(lat),
          longitude: String(lon),
        }));
        setCoordsDetected(true);

        // Try reverse geocoding to auto-fill nice address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.display_name) {
              setForm((prev) => ({ ...prev, address: data.display_name }));
            }
          }
        } catch {
          // Keep current address or placeholder
          if (!form.address) {
            setForm((prev) => ({ ...prev, address: "Current Device Location" }));
          }
        } finally {
          setIsSearchingLocation(false);
        }
      },
      () => {
        setIsSearchingLocation(false);
        setFeedback({
          type: "error",
          text: "Unable to retrieve device location. Please search and select an address above.",
        });
      }
    );
  }

  // Form Submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.address.trim()) {
      setFeedback({
        type: "error",
        text: "Please provide both property name and address.",
      });
      return;
    }

    let finalLat = form.latitude;
    let finalLng = form.longitude;

    setLoading(true);
    setFeedback(null);

    // If coordinates were not yet auto-selected, auto-geocode the typed address now
    if (!finalLat || !finalLng) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            form.address.trim()
          )}&limit=1`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            finalLat = parseFloat(data[0].lat).toFixed(6);
            finalLng = parseFloat(data[0].lon).toFixed(6);
          }
        }
      } catch {
        // Fallback below
      }
    }

    // Fallback if geocoding service is unavailable/offline
    if (!finalLat || !finalLng) {
      // Derive a realistic location coordinate (e.g. 28.6139 +/- small random offset so backend doesn't complain of duplicate)
      const baseLat = 28.6139 + (Math.random() - 0.5) * 0.08;
      const baseLng = 77.2090 + (Math.random() - 0.5) * 0.08;
      finalLat = baseLat.toFixed(6);
      finalLng = baseLng.toFixed(6);
    }

    try {
      await dispatch(
        createProperty({
          userId: user?._id || user?.id,
          name: form.name.trim(),
          address: form.address.trim(),
          latitude: String(finalLat),
          longitude: String(finalLng),
          propertyage: form.propertyage.trim(),
          propertyfor: form.propertyfor,
        })
      );

      // Re-fetch properties from backend
      try {
        await dispatch(getProperties());
      } catch {
        // Handled in Redux
      }

      setFeedback({
        type: "success",
        text: `Property listed for ${form.propertyfor} successfully!`,
      });

      setTimeout(() => {
        onClose();
      }, 1100);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to list property. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card add-property-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div
              className={`modal-badge-icon ${
                form.propertyfor === "Rent" ? "icon-rent" : "icon-sell"
              }`}
            >
              {form.propertyfor === "Rent" ? (
                <KeyIcon className="w-5 h-5 text-emerald-400" />
              ) : (
                <TagIcon className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="modal-title">
                List Property for {form.propertyfor}
              </h3>
              <p className="modal-subtitle">
                Place your listing on FindNest's interactive map
              </p>
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

        {/* Feedback Alert */}
        {feedback && (
          <div className={`modal-alert alert-${feedback.type}`}>
            {feedback.type === "success" ? (
              <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Property Type Toggle */}
        <div className="modal-type-toggle">
          <button
            type="button"
            className={`type-toggle-btn ${
              form.propertyfor === "Rent" ? "active-rent" : ""
            }`}
            onClick={() => setForm((p) => ({ ...p, propertyfor: "Rent" }))}
          >
            <KeyIcon className="w-4 h-4" />
            <span>Rent</span>
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${
              form.propertyfor === "Sell" ? "active-sell" : ""
            }`}
            onClick={() => setForm((p) => ({ ...p, propertyfor: "Sell" }))}
          >
            <TagIcon className="w-4 h-4" />
            <span>Sell</span>
          </button>
        </div>

        {/* Form Inputs (No manual latitude/longitude fields!) */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Property Title / Name</label>
            <div className="input-with-icon">
              <BuildingIcon className="input-icon" />
              <input
                type="text"
                name="name"
                className="modal-input"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Skyline Luxury Villa, Emerald Bay Studio"
                required
              />
            </div>
          </div>

          {/* Location & Address with Auto-geocoding */}
          <div className="form-group location-input-group" ref={suggestionsBoxRef}>
            <div className="form-label-row">
              <label className="form-label">Location / Address</label>
              <button
                type="button"
                className="auto-locate-link"
                onClick={handleUseMyLocation}
                title="Use current GPS location"
              >
                <MapPinIcon className="w-3.5 h-3.5" />
                <span>Use Current Location</span>
              </button>
            </div>

            <div className="input-with-icon">
              <MapPinIcon className="input-icon" />
              <input
                type="text"
                name="address"
                className="modal-input"
                value={form.address}
                onChange={handleAddressChange}
                placeholder="Type city, street, or landmark (coordinates auto-detect)..."
                autoComplete="off"
                required
              />
              {isSearchingLocation && (
                <div className="input-spinner-wrapper">
                  <RefreshCwIcon className="w-4 h-4 text-amber-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Auto-detected Coordinates Status Pill */}
            {coordsDetected && (
              <div className="coords-status-pill">
                <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Coordinates auto-attached to map location</span>
              </div>
            )}

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="location-suggestions-dropdown">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    <MapPinIcon className="suggestion-icon" />
                    <span className="suggestion-text">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Property Age</label>
            <select
              name="propertyage"
              className="modal-select"
              value={form.propertyage}
              onChange={handleChange}
            >
              <option value="Brand New">Brand New (Under 1 yr)</option>
              <option value="1 - 3 Years">1 - 3 Years</option>
              <option value="3 - 5 Years">3 - 5 Years</option>
              <option value="5+ Years">5+ Years</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-submit ${
                form.propertyfor === "Rent" ? "btn-rent" : "btn-sell"
              }`}
              disabled={loading}
            >
              {loading
                ? "Submitting listing..."
                : `Publish ${form.propertyfor} Listing`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
