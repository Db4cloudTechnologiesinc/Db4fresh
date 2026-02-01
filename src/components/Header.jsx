
// import axios from "axios";
// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import LocationModal from "./LocationModal";
// import SearchSuggestions from "./SearchSuggestions";
// import OfferStrip from "./OfferStrip";
// import db4freshlogo from "../Assets/Db4freshlogo.png";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { FaHeart } from "react-icons/fa";

// export default function Header() {
//   const [locOpen, setLocOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [location, setLocation] = useState("Select Location");

//   const menuRef = useRef(null);

//   /* ================= USER FROM LOCAL STORAGE ================= */
//   const user = JSON.parse(localStorage.getItem("user"));

//   /* ================= CLOSE MENU ON OUTSIDE CLICK ================= */
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ================= LOAD DEFAULT ADDRESS ================= */
//   useEffect(() => {
//     const loadDefault = async () => {
//       try {
//         const token = user?.token;
//         if (!token) {
//           setLocation("Select Location");
//           return;
//         }

//         const res = await axios.get(
//           "http://localhost:4000/api/addresses",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const list = Array.isArray(res.data)
//           ? res.data
//           : res.data.addresses || [];

//         const def = list.find(
//           (a) => a.is_default === 1 || a.is_default === true
//         );

//         if (def?.address) setLocation(def.address);
//       } catch (err) {
//         console.error("Header address error:", err.message);
//       }
//     };

//     loadDefault();
//   }, [user]);

//   /* ================= SEARCH (BACKEND BASED) ================= */
//   useEffect(() => {
//     if (!query) {
//       setResults([]);
//       return;
//     }

//     const timeout = setTimeout(async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:4000/api/products/search?q=${query}`
//         );
//         setResults(res.data || []);
//       } catch (err) {
//         console.error("Search error:", err);
//         setResults([]);
//       }
//     }, 300); // debounce

//     return () => clearTimeout(timeout);
//   }, [query]);

//   /* ================= REDUX DATA ================= */
//   const cartCount = useSelector((s) =>
//     s.cart.items.reduce((a, b) => a + b.qty, 0)
//   );

//   const wishlistCount = useSelector(
//     (s) => s.wishlist?.items?.length || 0
//   );

//   return (
//     <>
//       <OfferStrip />

//       <header className="bg-red-600 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-2">

//           {/* LOGO */}
//           <Link to="/" className="flex-shrink-0">
//             <img
//               src={db4freshlogo}
//               alt="logo"
//               className="w-10 h-10 rounded-full"
//             />
//           </Link>

//           {/* LOCATION */}
//           <button
//             onClick={() => setLocOpen(true)}
//             className="hidden sm:flex items-center text-xs bg-red-500 px-3 py-2 rounded-lg text-white hover:bg-red-400"
//           >
//             {location}
//           </button>

//           {/* SEARCH */}
//           <div className="relative flex-1 hidden sm:block">
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search for milk, fruits, snacks..."
//               className="w-full px-4 py-2 rounded-xl text-sm outline-none"
//             />

//             {query && (
//               <SearchSuggestions
//                 results={results}
//                 onSelect={(value) => setQuery(value)}
//               />
//             )}
//           </div>

//           {/* RIGHT ACTIONS */}
//           <div className="flex items-center gap-4 text-white ml-auto">
//             <Link
//   to="/"
//   className="flex items-center gap-1 text-sm ">
//   <FiHome size={16} />
//   Home
// </Link>

//             <Link to="/wishlist" className="flex items-center gap-1 text-sm">
//               <FaHeart />
//               <span>{wishlistCount}</span>
//             </Link>

//             <Link to="/account" className="text-sm">
//               My Account
//             </Link>

//             <Link to="/cart" className="text-sm">
//               Cart ({cartCount})
//             </Link>

//             {/* USER MENU */}
//             <div className="relative" ref={menuRef}>
//               <button
//                 onClick={() => setMenuOpen((p) => !p)}
//                 className="p-2 rounded-full hover:bg-red-500"
//               >
//                 <BsThreeDotsVertical />
//               </button>

//               {menuOpen && (
//                 <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg z-50">
//                   {user ? (
//                     <>
//                       <p className="px-4 py-2 text-xs text-gray-500">
//                         Hi, {user.name}
//                       </p>

//                       <Link
//                         to="/orders"
//                         className="block px-4 py-2 hover:bg-gray-100"
//                         onClick={() => setMenuOpen(false)}
//                       >
//                         My Orders
//                       </Link>

//                       <Link
//                         to="/profile"
//                         className="block px-4 py-2 hover:bg-gray-100"
//                         onClick={() => setMenuOpen(false)}
//                       >
//                         My Profile
//                       </Link>

//                       <button
//                         onClick={() => {
//                           localStorage.clear();
//                           window.location.href = "/login";
//                         }}
//                         className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                       >
//                         Logout
//                       </button>
//                     </>
//                   ) : (
//                     <Link
//                       to="/auth"
//                       className="block px-4 py-2 hover:bg-gray-100"
//                     >
//                       Login
//                     </Link>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* LOCATION MODAL */}
//       {locOpen && (
//         <LocationModal
//           isOpen={locOpen}
//           onClose={() => setLocOpen(false)}
//           onSelect={(loc) => {
//             setLocation(loc);
//             localStorage.setItem("user_location", loc);
//           }}
//         />
//       )}
//     </>
//   );
// }

 
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LocationModal from "./LocationModal";
import SearchSuggestions from "./SearchSuggestions";
import OfferStrip from "./OfferStrip";
import db4freshlogo from "../Assets/Db4freshlogo.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
 
export default function Header() {
  const [locOpen, setLocOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("Select Location");
 
  const menuRef = useRef(null);
 
  /* ================= USER FROM LOCAL STORAGE ================= */
  const user = JSON.parse(localStorage.getItem("user"));
 
  /* ================= CLOSE MENU ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  /* ================= LOAD DEFAULT ADDRESS ================= */
  useEffect(() => {
    const loadDefault = async () => {
      try {
        const token = user?.token;
        if (!token) {
          setLocation("Select Location");
          return;
        }
 
        const res = await axios.get(
          "http://localhost:4000/api/addresses",
          { headers: { Authorization: `Bearer ${token}` } }
        );
 
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.addresses || [];
 
        const def = list.find(
          (a) => a.is_default === 1 || a.is_default === true
        );
 
        if (def?.address) setLocation(def.address);
      } catch (err) {
        console.error("Header address error:", err.message);
      }
    };
 
    loadDefault();
  }, [user]);
 
  /* ================= SEARCH (BACKEND BASED) ================= */
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
 
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/products/search?q=${query}`
        );
        setResults(res.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      }
    }, 300); // debounce
 
    return () => clearTimeout(timeout);
  }, [query]);
 
  /* ================= REDUX DATA ================= */
  const cartCount = useSelector((s) =>
    s.cart.items.reduce((a, b) => a + b.qty, 0)
  );
 
  const wishlistCount = useSelector(
    (s) => s.wishlist?.items?.length || 0
  );
 
  return (
    <>
      <OfferStrip />
 
      <header className="bg-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-2">
 
          {/* LOGO */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={db4freshlogo}
              alt="logo"
              className="w-10 h-10 rounded-full"
            />
          </Link>
 
          {/* LOCATION */}
          <button
            onClick={() => setLocOpen(true)}
            className="hidden sm:flex items-center text-xs bg-red-500 px-3 py-2 rounded-lg text-white hover:bg-red-400"
          >
            {location}
          </button>
 
          {/* SEARCH */}
          <div className="relative flex-1 hidden sm:block">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for milk, fruits, snacks..."
              className="w-full px-4 py-2 rounded-xl text-sm outline-none"
            />
 
            {query && (
              <SearchSuggestions
                results={results}
                onSelect={(value) => setQuery(value)}
              />
            )}
          </div>
 
          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4 text-white ml-auto">
            {/* HOME */}
<Link
  to="/"
  className="flex items-center gap-1 text-sm ">
  <FiHome size={16} />
  Home
</Link>
 
            <Link to="/wishlist" className="flex items-center gap-1 text-sm">
              <FaHeart />
              <span>{wishlistCount}</span>
            </Link>
           
            <Link to="/account" className="text-sm">My Account</Link>
 
            <Link to="/cart" className="text-sm">
              Cart ({cartCount})
            </Link>
 
            {/* USER MENU */}
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
          onSelect={(loc) => {
            setLocation(loc);
            localStorage.setItem("user_location", loc);
          }}
        />
      )}
    </>
  );
}
 
 