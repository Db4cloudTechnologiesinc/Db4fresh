

 
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { FaTruck, FaFire, FaTags } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
 
// // import TopPicks from "../components/TopPicks";
// // import CategoryRow from "../components/CategoryRow";
 
// // const API_BASE = "http://localhost:4000";
 
// // /* 🚧 COMING SOON CATEGORIES */
// // const COMING_SOON = [
// //   "beauty",
// //   "gym freak",
// //   "fashion",
// //   "electronics",
// //   "pharmacy",
// //   "healthy",
// // ];
 
// // /* ⭐ PRIORITY ORDER */
// // const PRIORITY_CATEGORIES = ["fruits", "vegetables"];
 
// // export default function Home() {
// //   const navigate = useNavigate();
 
// //   const [categories, setCategories] = useState([]);
// //   const [products, setProducts] = useState([]);
// //   const [topPicks, setTopPicks] = useState([]);
// //   const [loading, setLoading] = useState(true);
 
// //   /* ================= LOAD DATA ================= */
// //   useEffect(() => {
// //     async function loadHome() {
// //       try {
// //         setLoading(true);
 
// //         const [catRes, prodRes, topRes] = await Promise.all([
// //           axios.get(`${API_BASE}/api/categories/with-subcategories`),
// //           axios.get(`${API_BASE}/api/products`),
// //           axios.get(`${API_BASE}/api/products/top-picks`),
// //         ]);
 
// //         setCategories(Array.isArray(catRes.data) ? catRes.data : []);
// //         setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
// //         setTopPicks(Array.isArray(topRes.data) ? topRes.data : []);
// //       } catch (err) {
// //         console.error("Home load error", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
 
// //     loadHome();
// //   }, []);
 
// //   /* ================= CATEGORY CLICK ================= */
// //   const onCategoryClick = (cat) => {
// //     if (COMING_SOON.includes(cat.name.toLowerCase())) {
// //       // alert(`${cat.name} is coming soon 🚧`);
// //       const onCategoryClick = (cat) => {
// //   if (COMING_SOON.includes(cat.name.toLowerCase())) {
// //     navigate(`/coming-soon/${cat.name}`);
// //     return;
// //   }

// //   navigate(`/category/${cat.id}`);
// // };
// //       return;
// //     }
// //     navigate(`/category/${cat.id}`);
// //   };
 
// //   /* ================= SHOP NOW → VEGETABLES ================= */
// //   const goToVegetables = () => {
// //     const vegCategory = categories.find(
// //       (c) => c.name.toLowerCase() === "vegetables"
// //     );
 
// //     if (!vegCategory) {
// //       alert("Vegetables category not found");
// //       return;
// //     }
 
// //     navigate(`/category/${vegCategory.id}`);
// //   };
 
// //   /* ================= PRODUCTS BY CATEGORY ================= */
// //   const getProductsForCategory = (categoryId) =>
// //     products.filter(
// //       (p) => String(p.category_id) === String(categoryId)
// //     );
 
// //   /* ================= CATEGORY ORDER ================= */
// //   const orderedCategories = [
// //     ...categories.filter((c) =>
// //       PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
// //     ),
// //     ...categories.filter(
// //       (c) => !PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
// //     ),
// //   ];
 
// //   return (
// //     <div className="bg-white min-h-screen">
// //   <div
// //     onClick={goToVegetables}
// //     className="bg-white rounded-2xl shadow overflow-hidden cursor-pointer hover:scale-[1.01] transition"
// //   >
// //     <div className="relative w-full h-[280px]">

// //       <img
// //         src="/banner.png"
// //         alt="Fresh Vegetables"
// //         className="w-full h-full object-cover"
// //       />

// //       {/* Overlay */}
// //       <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none">
       
// //       </div>

// //     </div>
// //   </div>
// // {/* ===== PROMO BANNERS ===== */}

// //   {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">

// //   <div className="h-52">
// //     <img
// //       src="/free-delivery.png"
// //       alt="Free Delivery"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// //   <div className="h-52">
// //     <img
// //       src="/offer-zone.png"
// //       alt="Offer Zone"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// //   <div className="h-52">
// //     <img
// //       src="/super-store.png"
// //       alt="Super Store"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// //   <div className="h-52">
// //     <img
// //       src="/50-off.png"
// //       alt="50% Off"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// //   <div className="h-52">
// //     <img
// //       src="/todays-deal.png"
// //       alt="Today's Deal"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// // </div> */}
// // <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 mt-6">

// //   <div className="h-52">
// //     <img
// //       src="/free-delivery.png"
// //       alt="Free Delivery"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// //   <div className="h-52">
// //     <img
// //       src="/offer-zone.png"
// //       alt="Offer Zone"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// //   <div className="h-52">
// //     <img
// //       src="/super-store.png"
// //       alt="Super Store"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// //   <div className="h-52">
// //     <img
// //       src="/50-off.png"
// //       alt="50% Off"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// //   <div className="h-52">
// //     <img
// //       src="/todays-deal.png"
// //       alt="Today's Deal"
// //       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"
// //     />
// //   </div>

// // </div>
// //  {/* ================= CATEGORY BAR ================= */}

// // <div className="bg-white px-4 py-6 shadow-sm mt-6 rounded-xl">

// //   <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 text-center">

// //     {/* ALL CATEGORY */}
// //     <div
// //       onClick={() => navigate("/")}
// //       className="cursor-pointer group"
// //     >
// //       <img
// //         src="/categories/all.png"
// //         alt="All"
// //         className="w-28 h-28 mx-auto object-contain rounded-lg group-hover:scale-105 transition"
// //       />

// //       <p className="text-sm mt-2 font-medium">
// //         All
// //       </p>
// //     </div>

// //     {categories.map((cat) => {

// //       const imageName = cat.name
// //         .toLowerCase()
// //         .replace(/[^a-z0-9]/g, "");

// //       return (

// //         <div
// //           key={cat.id}
// //           onClick={() => onCategoryClick(cat)}
// //           className="cursor-pointer group"
// //         >

// //           <img
// //             src={`/categories/${imageName}.png`}
// //             alt={cat.name}
// //             className="w-28 h-28 mx-auto object-contain rounded-lg group-hover:scale-105 transition"
// //           />

// //           <p className="text-sm mt-2 font-medium leading-tight">
// //             {cat.name}
// //           </p>

// //         </div>

// //       );

// //     })}

// //   </div>

// // </div>
// //       {/* ================= HOME CONTENT ================= */}
// //       <div className="px-4 py-6">
// //         {loading ? (
// //           <p className="text-gray-500">Loading products...</p>
// //         ) : (
// //           <>
// //             <TopPicks products={topPicks} />
 
// //             {orderedCategories.map((cat) => {
// //               if (COMING_SOON.includes(cat.name.toLowerCase())) return null;
 
// //               const catProducts = getProductsForCategory(cat.id);
// //               if (!catProducts.length) return null;
 
// //               return (
// //                 <CategoryRow
// //                   key={cat.id}
// //                   title={cat.name}
// //                   categoryId={cat.id}
// //                   products={catProducts}
// //                 />
// //               );
// //             })}
// //           </>
// //         )}
// //       </div>
 
// //       {/* ================= FOOTER ================= */}
// //       <div className="mt-16 py-6 text-center text-sm text-gray-500">
// //         © 2026 Db4fresh. All rights reserved.
// //       </div>
// //     </div>
    
// //   );
// // }
 
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaTruck, FaFire, FaTags } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// import TopPicks from "../components/TopPicks";
// import CategoryRow from "../components/CategoryRow";

// const API_BASE = "http://localhost:4000";

// /* 🚧 COMING SOON CATEGORIES */
// const COMING_SOON = [
// "beauty",
// "gym freak",
// "fashion",
// "electronics",
// "pharmacy",
// "healthy",
// ];

// /* ⭐ PRIORITY ORDER */
// const PRIORITY_CATEGORIES = ["fruits", "vegetables"];

// export default function Home() {
// const navigate = useNavigate();

// const [categories, setCategories] = useState([]);
// const [products, setProducts] = useState([]);
// const [topPicks, setTopPicks] = useState([]);
// const [loading, setLoading] = useState(true);

// /* ================= LOAD DATA ================= */
// useEffect(() => {

//   const loadHome = async () => {

//     try {

//       setLoading(true);

//       const responses = await Promise.all([
//         axios.get(`${API_BASE}/api/categories/with-subcategories`),
//         axios.get(`${API_BASE}/api/products`),
//         axios.get(`${API_BASE}/api/products/top-picks`)
//       ]);

//       const catRes = responses[0];
//       const prodRes = responses[1];
//       const topRes = responses[2];

//       setCategories(Array.isArray(catRes.data) ? catRes.data : []);
//       setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
//       setTopPicks(Array.isArray(topRes.data) ? topRes.data : []);

//     } catch (err) {

//       console.error("Home load error", err);

//     } finally {

//       setLoading(false);

//     }

//   };

//   loadHome();

// }, []);

// /* ================= CATEGORY CLICK ================= */
// const onCategoryClick = (cat) => {
// const name = cat.name.toLowerCase();

// ```
// if (COMING_SOON.includes(name)) {
//   navigate(`/coming-soon/${name}`);
//   return;
// }

// navigate(`/category/${cat.id}`);
// ```

// };

// /* ================= SHOP NOW → VEGETABLES ================= */
// const goToVegetables = () => {
// const vegCategory = categories.find(
// (c) => c.name.toLowerCase() === "vegetables"
// );

// ```
// if (!vegCategory) {
//   alert("Vegetables category not found");
//   return;
// }

// navigate(`/category/${vegCategory.id}`);
// ```

// };

// /* ================= PRODUCTS BY CATEGORY ================= */
// const getProductsForCategory = (categoryId) =>
// products.filter(
// (p) => String(p.category_id) === String(categoryId)
// );

// /* ================= CATEGORY ORDER ================= */
// const orderedCategories = [
// ...categories.filter((c) =>
// PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
// ),
// ...categories.filter(
// (c) => !PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
// ),
// ];

// return ( <div className="bg-white min-h-screen">

// ```
//   {/* HERO BANNER */}
//   <div
//     onClick={goToVegetables}
//     className="bg-white rounded-2xl shadow overflow-hidden cursor-pointer hover:scale-[1.01] transition"
//   >
//     <div className="relative w-full h-[280px]">
//       <img
//         src="/banner.png"
//         alt="Fresh Vegetables"
//         className="w-full h-full object-cover"
//       />
//     </div>
//   </div>

//   {/* PROMO BANNERS */}
//   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 mt-6">

//     <div className="h-52">
//       <img src="/free-delivery.png" alt="Free Delivery"
//       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
//     </div>

//     <div className="h-52">
//       <img src="/offer-zone.png" alt="Offer Zone"
//       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
//     </div>

//     <div className="h-52">
//       <img src="/super-store.png" alt="Super Store"
//       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
//     </div>

//     <div className="h-52">
//       <img src="/50-off.png" alt="50% Off"
//       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
//     </div>

//     <div className="h-52">
//       <img src="/todays-deal.png" alt="Today's Deal"
//       className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
//     </div>

//   </div>

//   {/* CATEGORY BAR */}
//   <div className="bg-white px-4 py-6 shadow-sm mt-6 rounded-xl">

//     <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 text-center">

//       <div
//         onClick={() => navigate("/")}
//         className="cursor-pointer group"
//       >
//         <img
//           src="/categories/all.png"
//           alt="All"
//           className="w-28 h-28 mx-auto object-contain rounded-lg group-hover:scale-105 transition"
//         />
//         <p className="text-sm mt-2 font-medium">All</p>
//       </div>

//       {categories.map((cat) => {

//         const imageName = cat.name
//           .toLowerCase()
//           .replace(/[^a-z0-9]/g, "");

//         return (
//           <div
//             key={cat.id}
//             onClick={() => onCategoryClick(cat)}
//             className="cursor-pointer group"
//           >
//             <img
//               src={`/categories/${imageName}.png`}
//               alt={cat.name}
//               className="w-28 h-28 mx-auto object-contain rounded-lg group-hover:scale-105 transition"
//             />

//             <p className="text-sm mt-2 font-medium leading-tight">
//               {cat.name}
//             </p>
//           </div>
//         );

//       })}

//     </div>
//   </div>

//   {/* HOME CONTENT */}
//   <div className="px-4 py-6">
//     {loading ? (
//       <p className="text-gray-500">Loading products...</p>
//     ) : (
//       <>
//         <TopPicks products={topPicks} />

//         {orderedCategories.map((cat) => {

//           if (COMING_SOON.includes(cat.name.toLowerCase()))
//             return null;

//           const catProducts = getProductsForCategory(cat.id);
//           if (!catProducts.length) return null;

//           return (
//             <CategoryRow
//               key={cat.id}
//               title={cat.name}
//               categoryId={cat.id}
//               products={catProducts}
//             />
//           );

//         })}

//       </>
//     )}
//   </div>

//   {/* FOOTER */}
//   <div className="mt-16 py-6 text-center text-sm text-gray-500">
//     © 2026 Db4fresh. All rights reserved.
//   </div>

// </div>
// ```

// );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import TopPicks from "../components/TopPicks";
import CategoryRow from "../components/CategoryRow";

const API_BASE = "http://localhost:4000";

/* 🚧 COMING SOON CATEGORIES */
const COMING_SOON = [
"beauty",
"gym freaks",
"fashion",
"electronics",
"pharmacy",
"healthy"
];

/* ⭐ PRIORITY ORDER */
const PRIORITY_CATEGORIES = ["fruits", "vegetables"];

export default function Home() {

const navigate = useNavigate();

const [categories, setCategories] = useState([]);
const [products, setProducts] = useState([]);
const [topPicks, setTopPicks] = useState([]);
const [loading, setLoading] = useState(true);

/* ================= LOAD DATA ================= */

useEffect(() => {


async function loadHome() {

  try {

    setLoading(true);

    const [catRes, prodRes, topRes] = await Promise.all([
      axios.get(`${API_BASE}/api/categories/with-subcategories`),
      axios.get(`${API_BASE}/api/products`),
      axios.get(`${API_BASE}/api/products/top-picks`)
    ]);

    setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
    setTopPicks(Array.isArray(topRes.data) ? topRes.data : []);

  } catch (err) {

    console.error("Home load error", err);

  } finally {

    setLoading(false);

  }

}

loadHome();


}, []);

/* ================= CATEGORY CLICK ================= */

const onCategoryClick = (cat) => {


const name = cat.name.toLowerCase();

if (COMING_SOON.includes(name)) {
  navigate(`/coming-soon/${name}`);
  return;
}

navigate(`/category/${cat.id}`);


};

/* ================= SHOP NOW → VEGETABLES ================= */

const goToVegetables = () => {


const vegCategory = categories.find(
  (c) => c.name.toLowerCase() === "vegetables"
);

if (!vegCategory) return;

navigate(`/category/${vegCategory.id}`);


};

/* ================= PRODUCTS BY CATEGORY ================= */

const getProductsForCategory = (categoryId) =>
products.filter(
(p) => String(p.category_id) === String(categoryId)
);

/* ================= CATEGORY ORDER ================= */

const orderedCategories = [


...categories.filter((c) =>
  PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
),

...categories.filter(
  (c) => !PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
),


];

return (


<div className="bg-white min-h-screen">

  {/* HERO BANNER */}

  <div
    onClick={goToVegetables}
    className="bg-white rounded-2xl shadow overflow-hidden cursor-pointer hover:scale-[1.01] transition"
  >

    <div className="relative w-full h-[280px]">

      <img
        src="/banner.png"
        alt="Fresh Vegetables"
        className="w-full h-full object-cover"
      />

    </div>

  </div>


  {/* PROMO BANNERS */}

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 mt-6">

    <div className="h-52">
      <img src="/free-delivery.png" alt="Free Delivery"
      className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
    </div>

    <div className="h-52">
      <img src="/offer-zone.png" alt="Offer Zone"
      className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
    </div>

    <div className="h-52">
      <img src="/super-store.png" alt="Super Store"
      className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
    </div>

    <div className="h-52">
      <img src="/50-off.png" alt="50% Off"
      className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
    </div>

    <div className="h-52">
      <img src="/todays-deal.png" alt="Today's Deal"
      className="w-[180px] h-full object-cover rounded-xl shadow-md hover:scale-105 transition"/>
    </div>

  </div>
<h1>Nikhil</h1>

  {/* CATEGORY BAR */}

  <div className="bg-white px-4 py-6 shadow-sm mt-6 rounded-xl">

    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 text-center">

      {/* ALL CATEGORY */}

      <div
        onClick={() => navigate("/")}
        className="cursor-pointer group"
      >

        <img
          src="/categories/all.png"
          alt="All"
          className="w-28 h-28 mx-auto object-contain rounded-lg group-hover:scale-105 transition"
        />

        <p className="text-sm mt-2 font-medium">
          All
        </p>

      </div>


      {categories.map((cat) => {

        const imageName = cat.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        return (

          <div
            key={cat.id}
            onClick={() => onCategoryClick(cat)}
            className="cursor-pointer group"
          >

            <img
              src={`/categories/${imageName}.png`}
              alt={cat.name}
              className="w-28 h-28 mx-auto object-contain rounded-lg group-hover:scale-105 transition"
            />

            <p className="text-sm mt-2 font-medium leading-tight">
              {cat.name}
            </p>

          </div>

        );

      })}

    </div>

  </div>


  {/* HOME CONTENT */}

  <div className="px-4 py-6">

    {loading ? (

      <p className="text-gray-500">Loading products...</p>

    ) : (

      <>

        <TopPicks products={topPicks} />

        {orderedCategories.map((cat) => {

          if (COMING_SOON.includes(cat.name.toLowerCase()))
            return null;

          const catProducts = getProductsForCategory(cat.id);
          if (!catProducts.length) return null;

          return (

            <CategoryRow
              key={cat.id}
              title={cat.name}
              categoryId={cat.id}
              products={catProducts}
            />

          );

        })}

      </>

    )}

  </div>


  {/* FOOTER */}

  <div className="mt-16 py-6 text-center text-sm text-gray-500">
    © 2026 Db4fresh. All rights reserved.
  </div>

</div>


);

}
