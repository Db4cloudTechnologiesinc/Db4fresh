
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LocationModal from "./LocationModal";
import SearchSuggestions from "./SearchSuggestions";
import db4freshlogo from "../Assets/Db4freshlogo.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import Fuse from "fuse.js";

export default function Header() {

  const [locOpen, setLocOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("Select Location");

  const menuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || localStorage.getItem("token");

  /* ================= CLOSE MENU ================= */

  useEffect(() => {

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  /* ================= LOAD ADDRESS ================= */

  useEffect(() => {

    const loadAddress = async () => {

      const saved = localStorage.getItem("selected_address");

      if (saved) {
        const addr = JSON.parse(saved);
        setLocation(`${addr.address_line1}${addr.city ? ", " + addr.city : ""}`);
        return;
      }

      if (!token) return;

      try {

        const res = await axios.get(
          "http://localhost:4000/api/addresses",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const list = Array.isArray(res.data) ? res.data : [];

        const def = list.find(
          (a) => a.is_default === 1 || a.is_default === true
        );

        if (def) {
          localStorage.setItem("selected_address", JSON.stringify(def));
          setLocation(`${def.address_line1}${def.city ? ", " + def.city : ""}`);
        }

      } catch (err) {
        console.error("Header address load error:", err.message);
      }

    };

    loadAddress();

  }, [token]);

/* ================= SEARCH ================= */
useEffect(() => {

  const fetchSuggestions = async () => {

    try {

      const cleanQuery =
        query.trim().toLowerCase();

      /* EMPTY INPUT */
      if (!cleanQuery) {
        setResults([]);
        return;
      }

      /* API CALL */
      const res = await axios.get(
        `http://localhost:4000/api/products/search?q=${cleanQuery}`
      );

      const products =
        res.data || [];

      /* FUZZY SEARCH */
      const fuse = new Fuse(products, {

        keys: [
          "name",
          "category_name",
          "subcategory_name",
        ],

        threshold: 0.4,

        includeScore: true,

      });

      const fuzzyResults =
        fuse.search(cleanQuery);

      /* FINAL RESULTS */
      const finalResults =
        fuzzyResults.map((r) => r.item);

      setResults(finalResults);

    } catch (err) {

      console.log(
        "SEARCH ERROR =>",
        err
      );

      setResults([]);

    }

  };

  /* DEBOUNCE */
  const delay =
    setTimeout(fetchSuggestions, 300);

  return () =>
    clearTimeout(delay);

}, [query]);
  /* ================= REDUX ================= */

  const cartCount = useSelector((s) =>
    s.cart.items.reduce((a, b) => a + b.qty, 0)
  );

  const wishlistCount = useSelector(
    (s) => s.wishlist?.items?.length || 0
  );

  return (
    <>
      {/* HEADER */}

      <header className="bg-red-600 sticky top-0 z-50 shadow-md">

        <div className="max-w-[1300px] mx-auto flex items-center gap-6 px-6 py-4">

          {/* LOGO */}

          <Link to="/" className="flex items-center">
            <img src={db4freshlogo} alt="logo" className="h-11" />
          </Link>

          {/* LOCATION */}

          <button
            onClick={() => setLocOpen(true)}
            className="hidden md:flex items-center bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-400 transition"
          >
            {location}
          </button>

          {/* SEARCH */}

          <div className="relative flex-1 hidden md:block">

  <input
  value={query}

  onChange={(e) =>
    setQuery(e.target.value)
  }

  onKeyDown={(e) => {

    if (e.key === "Enter") {

      const cleanQuery =
        query.trim();

      if (!cleanQuery) return;

      window.location.href =
        `/search?q=${cleanQuery}`;

    }

  }}

  placeholder="Search for vegetables, fruits, snacks..."

  className="w-full px-5 py-3 rounded-xl text-sm outline-none bg-white"
/>
            {query.trim() && results.length > 0 && (
  <SearchSuggestions
    results={results}
    search={query}
    onSelect={(value) => {
      setQuery("");
      setResults([]);
    }
    }
  />
)}

          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-6 text-white text-sm ml-auto">

            <Link to="/" className="flex items-center gap-1 hover:text-gray-200">
              <FiHome size={18} />
              Home
            </Link>

            <Link to="/wishlist" className="flex items-center gap-1 hover:text-gray-200">
              <FaHeart />
              {wishlistCount}
            </Link>

            <Link to="/account" className="hover:text-gray-200">
              My Account
            </Link>

            {/* CART */}

            <Link
              to="/cart"
              className="bg-white text-red-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Cart ({cartCount})
            </Link>

            {/* MENU */}

            <div className="relative" ref={menuRef}>

              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="p-2 rounded-full hover:bg-red-500"
              >
                <BsThreeDotsVertical />
              </button>

              {menuOpen && (

                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg z-50">

                  {user ? (
                    <>

                      <p className="px-4 py-2 text-xs text-gray-500">
                        Hi, {user.name}
                      </p>

                      <Link
                        to="/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Orders
                      </Link>

                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Profile
                      </Link>

                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.href = "/login";
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        Logout
                      </button>

                    </>
                  ) : (

                    <Link
                      to="/auth"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </Link>

                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </header>

      {/* LOCATION MODAL */}

      {locOpen && (
        <LocationModal
          isOpen={locOpen}
          onClose={() => setLocOpen(false)}
          onSelect={(addr) => {
            localStorage.setItem("selected_address", JSON.stringify(addr));
            setLocation(`${addr.address_line1}${addr.city ? ", " + addr.city : ""}`);
          }}
        />
      )}

    </>
  );
}