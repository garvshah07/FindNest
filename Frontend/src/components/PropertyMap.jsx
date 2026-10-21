import { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";
import {
  MapPinIcon,
  GlobeIcon,
  RefreshCwIcon,
  XMarkIcon,
} from "./Icons";

// Custom Google Maps Dark Theme styling matching FindNest Warm Amber & Terracotta aesthetic
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a1512" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1512" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a89f91" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#fed7aa" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f59e0b" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#15120f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#34d399" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#28211b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#3d332a" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#dcd3c7" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#543019" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#7a3f1d" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#fde68a" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#241d18" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#100d0b" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d97706" }],
  },
];

// Interactive Property Marker for google-map-react
function PropertyMarker({ property, isSelected, onSelect }) {
  const [showPopup, setShowPopup] = useState(false);
  const isRent = String(property.propertyfor || "").toLowerCase() === "rent";
  const markerTypeClass = isRent ? "marker-rent" : "marker-sell";
  const badgeText = isRent ? "RENT" : "SELL";
  const isOpen = showPopup || isSelected;

  return (
    <div className="gmap-marker-container">
      {/* Marker Pin */}
      <div
        className={`property-marker-pin ${markerTypeClass} ${
          isOpen ? "marker-active" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setShowPopup((prev) => !prev);
          if (onSelect) onSelect(property);
        }}
        title={`${property.name} (${property.propertyfor})`}
      >
        <div className="marker-pulse-glow" />
        <div className="marker-bubble">
          <span className="marker-badge-text">{badgeText}</span>
        </div>
        <div className="marker-triangle" />
      </div>

      {/* Rich Popup Card on Click or when Selected */}
      {isOpen && (
        <div
          className="gmap-popup-card"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`popup-header ${
              isRent ? "header-rent" : "header-sell"
            }`}
          >
            <span className="popup-badge">
              {property.propertyfor || "Property"}
            </span>
            <span className="popup-age">{property.propertyage || "Ready"}</span>
            <button
              type="button"
              className="popup-close-x"
              onClick={(e) => {
                e.stopPropagation();
                setShowPopup(false);
                if (onSelect) onSelect(null);
              }}
              title="Close"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="popup-body">
            <h4 className="popup-title">
              {property.name || "Modern Property"}
            </h4>
            <div className="popup-address">
              <MapPinIcon className="popup-pin-icon" />
              <span>{property.address || "Address not provided"}</span>
            </div>
            <div className="popup-coords">
              <span>Lat: {parseFloat(property.latitude).toFixed(4)}</span>{" "}
              &bull;{" "}
              <span>Lng: {parseFloat(property.longitude).toFixed(4)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// User Location GPS Marker
function UserMarker() {
  return (
    <div className="custom-user-marker">
      <div className="user-pulse-marker">
        <div className="pulse-ring" />
        <div className="user-pin" />
      </div>
    </div>
  );
}

export default function PropertyMap({
  properties = [],
  selectedProperty,
  onSelectProperty,
  onMapClick,
  userLocation,
}) {
  const mapRef = useRef(null);
  const mapsRef = useRef(null);
  const [mapTheme, setMapTheme] = useState("dark"); // "dark" or "light"

  // Initial Center: e.g. first property coords, user location, or default central coords
  const defaultCenter = {
    lat: properties[0]?.latitude ? parseFloat(properties[0].latitude) : 28.6139,
    lng: properties[0]?.longitude
      ? parseFloat(properties[0].longitude)
      : 77.2090,
  };

  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(12);

  // Auto-pan / fit when properties change or load
  useEffect(() => {
    if (properties.length > 0) {
      const firstLat = parseFloat(properties[0].latitude);
      const firstLng = parseFloat(properties[0].longitude);
      if (!isNaN(firstLat) && !isNaN(firstLng)) {
        setCenter({ lat: firstLat, lng: firstLng });

        if (mapRef.current) {
          if (properties.length === 1) {
            mapRef.current.panTo({ lat: firstLat, lng: firstLng });
            mapRef.current.setZoom(14);
          } else if (mapsRef.current) {
            const bounds = new mapsRef.current.LatLngBounds();
            properties.forEach((p) => {
              const lat = parseFloat(p.latitude);
              const lng = parseFloat(p.longitude);
              if (!isNaN(lat) && !isNaN(lng)) {
                bounds.extend(new mapsRef.current.LatLng(lat, lng));
              }
            });
            mapRef.current.fitBounds(bounds);
          }
        }
      }
    }
  }, [properties]);

  // Center on User Location when available
  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      const lat = parseFloat(userLocation.latitude);
      const lng = parseFloat(userLocation.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(14);
        } else {
          setCenter({ lat, lng });
          setZoom(14);
        }
      }
    }
  }, [userLocation]);

  // Pan to selected property when user clicks one
  useEffect(() => {
    if (selectedProperty?.latitude && selectedProperty?.longitude) {
      const lat = parseFloat(selectedProperty.latitude);
      const lng = parseFloat(selectedProperty.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        } else {
          setCenter({ lat, lng });
          setZoom(15);
        }
      }
    }
  }, [selectedProperty]);

  function handleGoogleMapApi(loaded) {
    mapRef.current = loaded.map;
    mapsRef.current = loaded.maps;

    // Immediately pan to first property if already loaded
    if (properties.length > 0) {
      const firstLat = parseFloat(properties[0].latitude);
      const firstLng = parseFloat(properties[0].longitude);
      if (!isNaN(firstLat) && !isNaN(firstLng)) {
        if (properties.length === 1) {
          loaded.map.panTo({ lat: firstLat, lng: firstLng });
          loaded.map.setZoom(14);
        } else {
          const bounds = new loaded.maps.LatLngBounds();
          properties.forEach((p) => {
            const lat = parseFloat(p.latitude);
            const lng = parseFloat(p.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              bounds.extend(new loaded.maps.LatLng(lat, lng));
            }
          });
          loaded.map.fitBounds(bounds);
        }
      }
    }
  }

  // Reset view to fit all properties
  function handleFitAll() {
    if (properties.length === 0) return;

    if (mapRef.current && mapsRef.current) {
      if (properties.length === 1) {
        const lat = parseFloat(properties[0].latitude);
        const lng = parseFloat(properties[0].longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(14);
        }
      } else {
        const bounds = new mapsRef.current.LatLngBounds();
        properties.forEach((p) => {
          const lat = parseFloat(p.latitude);
          const lng = parseFloat(p.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            bounds.extend(new mapsRef.current.LatLng(lat, lng));
          }
        });
        mapRef.current.fitBounds(bounds);
      }
    } else {
      setCenter(defaultCenter);
      setZoom(13);
    }
  }

  // Toggle map theme style
  function toggleMapTheme() {
    setMapTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  // Google Maps options with full smooth gesture handling
  function createMapOptions() {
    return {
      styles: mapTheme === "dark" ? darkMapStyles : [],
      disableDefaultUI: false,
      zoomControl: true,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      gestureHandling: "greedy",
      draggable: true,
      scrollwheel: true,
      clickableIcons: false,
    };
  }

  // Intercept Google Maps billing check to allow smooth demo usage without blocking alerts
  if (typeof window !== "undefined" && !window.gm_authFailure) {
    window.gm_authFailure = () => {
      // Free demo key authentication bypass
    };
  }

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    "AIzaSyASOTEoAI-2nb2VHoG-Kx4uR32UEPqJx4w";

  return (
    <div className="rectangle-map-wrapper">
      {/* Map Card Header with Controls */}
      <div className="map-toolbar">
        <div className="map-toolbar-left">
          <div className="map-status-pill">
            <span className="map-live-dot" />
            <span>Google Maps View</span>
          </div>
          <button
            type="button"
            className="map-property-counter"
            onClick={handleFitAll}
            title="Click to fly to your plotted properties"
          >
            <span>
              {properties.length} {properties.length === 1 ? "Nest" : "Nests"}{" "}
              Plotted
            </span>
          </button>
        </div>

        <div className="map-toolbar-right">
          <button
            type="button"
            className="map-control-btn"
            onClick={toggleMapTheme}
            title={`Switch to ${mapTheme === "dark" ? "light" : "dark"} mode`}
          >
            <GlobeIcon className="w-4 h-4" />
            <span>{mapTheme === "dark" ? "Dark Map" : "Standard"}</span>
          </button>

          <button
            type="button"
            className="map-control-btn"
            onClick={handleFitAll}
            title="Reset map to show all properties"
          >
            <RefreshCwIcon className="w-4 h-4" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* The Rectangle Google Map Container */}
      <div className="rectangle-map-container">
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          center={center}
          zoom={zoom}
          options={createMapOptions}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={handleGoogleMapApi}
          onClick={(clickEvent) => {
            if (onMapClick && clickEvent.lat && clickEvent.lng) {
              onMapClick({
                latitude: clickEvent.lat.toFixed(6),
                longitude: clickEvent.lng.toFixed(6),
              });
            }
          }}
          onChange={({ center: newCenter, zoom: newZoom }) => {
            setCenter(newCenter);
            setZoom(newZoom);
          }}
        >
          {/* Render Property Markers as React Components */}
          {properties.map((property) => {
            const lat = parseFloat(property.latitude);
            const lng = parseFloat(property.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <PropertyMarker
                key={property._id || `${lat}-${lng}`}
                lat={lat}
                lng={lng}
                property={property}
                isSelected={
                  selectedProperty?._id &&
                  selectedProperty?._id === property._id
                }
                onSelect={onSelectProperty}
              />
            );
          })}

          {/* User Location Marker if available */}
          {userLocation?.latitude && userLocation?.longitude && (
            <UserMarker
              lat={userLocation.latitude}
              lng={userLocation.longitude}
            />
          )}
        </GoogleMapReact>
      </div>

      {/* Empty State Banner when 0 properties are present */}
      {properties.length === 0 && (
        <div className="map-empty-state-overlay">
          <div className="empty-state-card">
            <MapPinIcon className="w-6 h-6 text-amber-400" />
            <div className="empty-state-text">
              <span className="empty-state-title">No Properties Listed Yet</span>
              <span className="empty-state-desc">
                Click the <strong className="text-amber-400">+</strong> button
                at the bottom-right to list your first property for{" "}
                <strong>Rent</strong> or <strong>Sell</strong>!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="map-legend-overlay">
        <div className="legend-item">
          <span className="legend-badge legend-rent" />
          <span>For Rent</span>
        </div>
        <div className="legend-item">
          <span className="legend-badge legend-sell" />
          <span>For Sell</span>
        </div>
        <div className="legend-tip">Click any pin for details</div>
      </div>
    </div>
  );
}
