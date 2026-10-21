import { useState, useRef, useEffect } from "react";
import { PlusIcon, KeyIcon, TagIcon, XMarkIcon } from "./Icons";

export default function AddPropertyFab({ onSelectOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleOptionClick(type) {
    setIsOpen(false);
    onSelectOption(type);
  }

  return (
    <div className="fab-container" ref={fabRef}>
      {/* Floating Menu with Rent and Sell options */}
      {isOpen && (
        <div className="fab-menu" role="menu">
          {/* Sell Option */}
          <div className="fab-item fab-item-sell">
            <span className="fab-item-label">List for Sell</span>
            <button
              type="button"
              className="fab-sub-btn fab-btn-sell"
              onClick={() => handleOptionClick("Sell")}
              title="Add property for sale"
            >
              <TagIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Rent Option */}
          <div className="fab-item fab-item-rent">
            <span className="fab-item-label">List for Rent</span>
            <button
              type="button"
              className="fab-sub-btn fab-btn-rent"
              onClick={() => handleOptionClick("Rent")}
              title="Add property for rent"
            >
              <KeyIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main + Action Button */}
      <button
        type="button"
        className={`fab-main-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Add new property"
        aria-expanded={isOpen}
      >
        <span className="fab-icon-wrapper">
          <PlusIcon className="fab-plus-svg" />
        </span>
      </button>
    </div>
  );
}
