import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeNavbar from "../components/HomeNavbar";
import SearchBar from "../components/SearchBar";
import PropertyMap from "../components/PropertyMap";
import AddPropertyFab from "../components/AddPropertyFab";
import AddPropertyModal from "../components/AddPropertyModal";
import ProfileModal from "../components/ProfileModal";
import { getProperties } from "../redux/actions";
import "./Home.css";

export default function Home() {
  const dispatch = useDispatch();
  const reduxProperties = useSelector((state) => state.properties) || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "Rent", "Sell"
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState("Rent");
  const [clickedCoords, setClickedCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Load properties from backend
  useEffect(() => {
    dispatch(getProperties()).catch(() => {
      // Handled in Redux
    });
  }, [dispatch]);

  // Use only real properties from database/Redux (no hardcoded defaults)
  const allProperties = useMemo(() => {
    return Array.isArray(reduxProperties) ? reduxProperties : [];
  }, [reduxProperties]);

  // Filtered properties based on search and type
  const filteredProperties = useMemo(() => {
    return allProperties.filter((item) => {
      // Type filter
      if (
        filterType !== "all" &&
        item.propertyfor?.toLowerCase() !== filterType.toLowerCase()
      ) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(query);
        const addressMatch = item.address?.toLowerCase().includes(query);
        const forMatch = item.propertyfor?.toLowerCase().includes(query);
        return nameMatch || addressMatch || forMatch;
      }

      return true;
    });
  }, [allProperties, filterType, searchTerm]);

  // Counts
  const rentCount = useMemo(() => {
    return allProperties.filter(
      (p) => String(p.propertyfor).toLowerCase() === "rent"
    ).length;
  }, [allProperties]);

  const sellCount = useMemo(() => {
    return allProperties.filter(
      (p) => String(p.propertyfor).toLowerCase() === "sell"
    ).length;
  }, [allProperties]);

  // Locate Me button handler
  function handleLocateMe() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setIsLocating(false);
        alert("Unable to fetch location. Please check your permissions.");
      }
    );
  }

  // Open Add Property modal from FAB
  function handleOpenAddOption(type) {
    setAddModalType(type);
    setAddModalOpen(true);
  }

  // Map click handler (auto-fills coords in add modal)
  function handleMapClick(coords) {
    setClickedCoords(coords);
  }

  return (
    <div className="home-page-layout">
      {/* 1. Navigation Bar with User Profile Select & Options (Profile, Logout) */}
      <HomeNavbar onOpenProfile={() => setProfileModalOpen(true)} />

      {/* Main Content Area */}
      <main className="home-main-content">
        <div className="home-container">
          {/* 2. Search Bar right below the Navigation Bar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            totalCount={allProperties.length}
            filteredCount={filteredProperties.length}
            rentCount={rentCount}
            sellCount={sellCount}
            onLocateMe={handleLocateMe}
            isLocating={isLocating}
            properties={filteredProperties}
            onSelectProperty={setSelectedProperty}
            selectedProperty={selectedProperty}
          />

          {/* 3. Rectangle Map */}
          <PropertyMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
            onMapClick={handleMapClick}
            userLocation={userLocation}
          />
        </div>
      </main>

      {/* 4. Floating Action Button on right side bottom (+ button with Rent and Sell options) */}
      <AddPropertyFab onSelectOption={handleOpenAddOption} />

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        initialType={addModalType}
        initialCoords={clickedCoords}
        userLocation={userLocation}
      />

      {/* User Profile Details Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
