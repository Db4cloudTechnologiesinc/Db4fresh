// export default function Footer() {
//   return (
//     <footer className="bg-red-600 shadow-md text-white">
//       <div className="container py-6 text-sm text-white-600">
 
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
 
//           <div>
//             <h3 className="font-semibold text-white-800 mb-2">db4Fresh</h3>
//             <p>Fast delivery in minutes</p>
//           </div>
 
//           <div>
//             <h3 className="font-semibold text-white-800 mb-2">Company</h3>
//             <ul className="space-y-1">
//               <li>About</li>
//               <li>Careers</li>
//               <li>Help</li>
//             </ul>
//           </div>
 
//           <div>
//             <h3 className="font-semibold text-white-800 mb-2">Categories</h3>
//             <ul className="space-y-1">
//                 <li>Home</li>
//               <li>All</li>
//               <li>Groceries</li>
//               <li>Fashion</li>
//               <li>Electronics</li>
//               <li>Dairy</li>
//               <li>Snacks</li>
//             </ul>
//           </div>
 
//           <div>
//             <h3 className="font-semibold text-white-800 mb-2">Contact</h3>
//             <ul className="space-y-1">
//               <li>support@db4fresh.com</li>
//               <li>+91 1234567890</li>
//               <li>Chennai, India</li>
//             </ul>
//           </div>
 
//         </div>
 
//         <p className="text-center mt-6 text-xs">
//           © {new Date().getFullYear()} db4fresh  • All rights reserved.
//         </p>
 
//       </div>
//     </footer>
//   );
// }
 

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-red-600 text-white mt-16">

      <div className="max-w-[1300px] mx-auto px-6 py-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* BRAND */}

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Db4fresh
            </h3>

            <p className="text-sm text-red-100">
              Fresh groceries delivered to your doorstep in minutes.
            </p>
          </div>

          {/* COMPANY */}

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Company
            </h3>

            <ul className="space-y-2 text-sm text-red-100">

              <li className="hover:text-white cursor-pointer">
                About
              </li>

              <li className="hover:text-white cursor-pointer">
                Careers
              </li>

              <li className="hover:text-white cursor-pointer">
                Help
              </li>

            </ul>
          </div>

          {/* CATEGORIES */}

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Categories
            </h3>

            <ul className="space-y-2 text-sm text-red-100">

              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/">All</Link>
              </li>

              <li>Groceries</li>

              <li>Fashion</li>

              <li>Electronics</li>

              <li>Dairy</li>

              <li>Snacks</li>

            </ul>
          </div>

          {/* CONTACT */}

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Contact
            </h3>

            <ul className="space-y-2 text-sm text-red-100">

              <li>support@db4fresh.com</li>

              <li>+91 1234567890</li>

              <li>Chennai, India</li>

            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}

        <div className="border-t border-red-400 mt-8 pt-4 text-center text-xs text-red-100">

          © {new Date().getFullYear()} Db4fresh • All rights reserved.

        </div>

      </div>

    </footer>
  );
}