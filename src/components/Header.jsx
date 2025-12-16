import axios from "axios";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LocationModal from "./LocationModal";
import SearchSuggestions from "./SearchSuggestions";
import OfferStrip from "./OfferStrip";
import { useSelector } from "react-redux";
import db4freshlogo from "../Assets/Db4freshlogo.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";

export default function Header() {
  const [locOpen, setLocOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // ⭐ SHOW SAVED LOCATION IN HEADER
  const [location, setLocation] = useState("Select Location");

  useEffect(() => {
  const loadDefault = async () => {
    const res = await axios.get("http://localhost:4000/api/addresses", {
      headers: { "x-user-id": "user123" },
    });

    const list = res.data.addresses;
    const def = list.find((a) => a.is_default);

    if (def) setLocation(def.address);
  };

  loadDefault();
}, []);


  // 🛒 CART COUNT
  const cartCount = useSelector((s) =>
    s.cart.items.reduce((a, b) => a + b.qty, 0)
  );

  // ❤️ WISHLIST COUNT
  const wishlistCount = useSelector((s) => s.wishlist?.items?.length || 0);

  // SEARCH PRODUCTS
  const products = useSelector((s) => s.products.items);

  // ⭐ When user selects a location from modal
  const handleSelectLocation = (loc) => {
    setLocation(loc);
    localStorage.setItem("user_location", loc);
  };

  return (
    <>
      <OfferStrip />

      <header className="bg-red-600 shadow-md">
        <div className="container flex items-center justify-between py-4 relative">

          {/* LEFT SECTION */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <img
                src={db4freshlogo}
                alt="logo"
                className="w-12 h-12 rounded-full"
              />
            </Link>

            <button
              onClick={() => setLocOpen(true)}
              className="text-sm p-3 hover:bg-red-300 rounded transition "
            >
              {location}
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden sm:block relative w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for items..."
              className="px-3 py-2 rounded-md w-full hover:bg-red-300 transition outline-none"
            />

            {query && (
              <SearchSuggestions
                results={products.filter((p) =>
                  p.name.toLowerCase().includes(query.toLowerCase())
                )}
                onSelect={(name) => setQuery(name)}
              />
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4 text-white">

            <Link to="/" className="text-sm p-3 hover:bg-red-300 rounded transition">
              Home
            </Link>

            <Link to="/auth" className="text-sm p-3 hover:bg-red-300 rounded transition">
              Login
            </Link>

            {/* ❤️ WISHLIST */}
            <Link
              to="/wishlist"
              className="flex items-center gap-1 text-sm p-3 hover:bg-red-300 rounded transition"
            >
              <FaHeart size={18} className="text-white" />
              <span>{wishlistCount}</span>
            </Link>

            {/* 🛒 CART */}
            <Link
              to="/cart"
              className="flex items-center gap-1 text-sm p-3 hover:bg-red-300 rounded transition"
            >
              Cart <span>{cartCount}</span>
            </Link>

            {/* 3-DOTS MENU */}
            <div
              className="cursor-pointer relative p-3 hover:bg-red-300 rounded transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <BsThreeDotsVertical size={22} />

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                    🛒 My Orders
                  </Link>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    👤 Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                    ⚙️ Settings
                  </Link>
                  <Link to="/help" className="block px-4 py-2 hover:bg-gray-100">
                    ❓ Help
                  </Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ⭐ LOCATION MODAL */}
      {locOpen && (
        <LocationModal
          isOpen={locOpen}
          onClose={() => setLocOpen(false)}
          onSelect={handleSelectLocation}
        />
      )}
    </>
  );
}
