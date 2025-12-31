
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import LocationModal from "./LocationModal";
// import SearchSuggestions from "./SearchSuggestions";
// import OfferStrip from "./OfferStrip";
// import db4freshlogo from "../Assets/Db4freshlogo.png";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { FaHeart } from "react-icons/fa";

// export default function Header() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [locOpen, setLocOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [location, setLocation] = useState("Select Location");

//   /* LOAD DEFAULT ADDRESS */
//   useEffect(() => {
//     const loadDefault = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const res = await axios.get(
//           "http://localhost:4000/api/addresses",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const list = Array.isArray(res.data)
//           ? res.data
//           : res.data.addresses || [];

//         const def = list.find((a) => a.is_default);
//         if (def) setLocation(def.address);
//       } catch (err) {
//         console.error("Header address error:", err.response?.data);
//       }
//     };

//     loadDefault();
//   }, []);

//   const cartCount = useSelector((s) =>
//     s.cart.items.reduce((a, b) => a + b.qty, 0)
//   );
//   const wishlistCount = useSelector(
//     (s) => s.wishlist?.items?.length || 0
//   );
//   const products = useSelector((s) => s.products.items);

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
//                 results={products.filter((p) =>
//                   p.name.toLowerCase().includes(query.toLowerCase())
//                 )}
//                 onSelect={(name) => setQuery(name)}
//               />
//             )}
//           </div>

//           {/* RIGHT ACTIONS */}
//           <div className="flex items-center gap-4 text-white ml-auto">

//             <Link to="/wishlist" className="flex items-center gap-1 text-sm">
//               <FaHeart />
//               <span>{wishlistCount}</span>
//             </Link>

//             <Link to="/cart" className="text-sm font-medium">
//               Cart ({cartCount})
//             </Link>

//             {/* USER / MENU */}
//             <div
//               className="relative cursor-pointer"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               <BsThreeDotsVertical />

//               {menuOpen && (
//                 <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-md overflow-hidden">
//                   {user ? (
//                     <>
//                       <p className="px-4 py-2 text-xs text-gray-500">
//                         Hi, {user.name}
//                       </p>
//                       <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
//                         My Orders
//                       </Link>
//                       {/* <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
//                         Profile
//                       </Link> */}
//                       <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
//                       <button
//                         onClick={() => {
//                           localStorage.clear();
//                           window.location.reload();
//                         }}
//                         className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LocationModal from "./LocationModal";
import SearchSuggestions from "./SearchSuggestions";
import OfferStrip from "./OfferStrip";
import db4freshlogo from "../Assets/Db4freshlogo.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";

export default function Header() {

  const [locOpen, setLocOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("Select Location");

  /* ================= LOAD DEFAULT ADDRESS ================= */
  useEffect(() => {
    const loadDefault = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
const token = user?.token;

if (!token) {
  setLocation("Select Location");
  return;
}
        if (!token) return;

        const res = await axios.get(
          "http://localhost:4000/api/addresses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let list = [];

        // ✅ Normalize response safely
        if (Array.isArray(res.data)) {
          list = res.data;
        } else if (Array.isArray(res.data.addresses)) {
          list = res.data.addresses;
        } else {
          console.warn("Unexpected address response:", res.data);
          return;
        }

        // ✅ Find default address
        const def = list.find(
          (a) => a.is_default === 1 || a.is_default === true
        );

        if (def?.address) {
          setLocation(def.address);
        }
      } catch (err) {
        console.error(
          "Header address error:",
          err.response?.data?.message || err.message
        );
      }
    };

    loadDefault();
  }, []);

  /* ================= REDUX DATA ================= */
  const cartCount = useSelector((s) =>
    s.cart.items.reduce((a, b) => a + b.qty, 0)
  );

  const wishlistCount = useSelector(
    (s) => s.wishlist?.items?.length || 0
  );

  const products = useSelector((s) => s.products.items);

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
                results={products.filter((p) =>
                  p.name.toLowerCase().includes(query.toLowerCase())
                )}
                onSelect={(name) => setQuery(name)}
              />
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4 text-white ml-auto">

            {/* WISHLIST */}
            <Link to="/wishlist" className="flex items-center gap-1 text-sm">
              <FaHeart />
              <span>{wishlistCount}</span>
            </Link>
            <Link to="/account" className="flex items-center gap-1 text-sm">My Account</Link>

            {/* CART */}
            <Link to="/cart" className="text-sm font-medium">
              Cart ({cartCount})
            </Link>

            {/* USER MENU */}
            <div
              className="relative cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <BsThreeDotsVertical />

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-md overflow-hidden">
                  {user ? (
                    <>
                      <p className="px-4 py-2 text-xs text-gray-500">
                        Hi, {user.name}
                      </p>

                      <Link
                        to="/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>

                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>

                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
