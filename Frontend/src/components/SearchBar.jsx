import {
  SearchIcon,
  XMarkIcon,
  KeyIcon,
  TagIcon,
  MapPinIcon,
  BuildingIcon,
} from "./Icons";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  totalCount,
  filteredCount,
  rentCount,
  sellCount,
  onLocateMe,
  isLocating,
  properties = [],
  onSelectProperty,
  selectedProperty,
}) {
  return (
    <div className="home-search-section">
      <div className="search-bar-card">
        {/* Main Search Input */}
        <div className="search-input-wrapper">
          <SearchIcon className="search-glass-icon" />
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search properties by name, address, or location (e.g. Skyline, Downtown, Brooklyn)..."
            aria-label="Search properties"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm("")}
              title="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills and Locate Button */}
        <div className="search-actions">
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              <BuildingIcon className="w-3.5 h-3.5" />
              <span>All</span>
              <span className="pill-badge">{totalCount}</span>
            </button>

            <button
              type="button"
              className={`filter-pill rent-pill ${
                filterType === "Rent" ? "active" : ""
              }`}
              onClick={() => setFilterType("Rent")}
            >
              <KeyIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rent</span>
              <span className="pill-badge rent-badge">{rentCount}</span>
            </button>

            <button
              type="button"
              className={`filter-pill sell-pill ${
                filterType === "Sell" ? "active" : ""
              }`}
              onClick={() => setFilterType("Sell")}
            >
              <TagIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Sell</span>
              <span className="pill-badge sell-badge">{sellCount}</span>
            </button>
          </div>

          {/* Locate Me Button */}
          <button
            type="button"
            className="locate-me-btn"
            onClick={onLocateMe}
            disabled={isLocating}
            title="Center map on your location"
          >
            <MapPinIcon className={`w-4 h-4 ${isLocating ? "animate-pulse" : ""}`} />
            <span className="locate-text">
              {isLocating ? "Locating..." : "My Location"}
            </span>
          </button>
        </div>
      </div>

      {/* Results summary bar with quick property chips */}
      <div className="search-stats-row">
        <span className="results-text">
          Showing <strong className="highlight-count">{filteredCount}</strong>{" "}
          {filteredCount === 1 ? "property" : "properties"} on map
          {searchTerm && ` matching "${searchTerm}"`}
          {filterType !== "all" && ` for ${filterType}`}
        </span>

        {/* Quick nest chips to jump directly to property */}
        {properties.length > 0 && properties.length <= 4 && onSelectProperty && (
          <div className="quick-nest-chips">
            {properties.map((p) => (
              <button
                key={p._id}
                type="button"
                className={`quick-nest-chip ${
                  selectedProperty?._id === p._id ? "active" : ""
                }`}
                onClick={() => onSelectProperty(p)}
                title={`Click to focus map on ${p.name}`}
              >
                <MapPinIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{p.name}</span>
                <span
                  className={`chip-badge ${
                    String(p.propertyfor).toLowerCase() === "rent"
                      ? "rent"
                      : "sell"
                  }`}
                >
                  {p.propertyfor}
                </span>
              </button>
            ))}
          </div>
        )}

        {searchTerm && (
          <button
            type="button"
            className="reset-filters-link"
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
            }}
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
