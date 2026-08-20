// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "../components/ProductCard";

// const API_BASE = "http://localhost:4000";

// function BannerPage() {
//   const { type } = useParams();

//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, [type]);

//   useEffect(() => {
//     setSearchTerm("");
//   }, [type]);

//   // ===============================
//   // FETCH BANNER PRODUCTS
//   // ===============================
//   const fetchProducts = async () => {
//     try {
//       let data = [];

//       if (type === "offer-zone") {
//         const res = await axios.get(
//           `${API_BASE}/api/offers`
//         );

//         data = res.data.map((offer) => ({
//           id: offer.buy_product_id,
//           name: offer.buy_product_name,
//           image: offer.buy_product_image,
//           images: offer.buy_product_images
//             ? JSON.parse(offer.buy_product_images)
//             : [],
//           price: offer.price,
//           mrp: offer.mrp,
//           stock: offer.stock,
//           variant_label: offer.variant_label,
//           category_id: offer.category_id,

//           title: offer.title,
//           buy_qty: offer.buy_qty,
//           free_qty: offer.free_qty,
//           free_product_name: offer.free_product_name,
//         }));
//       } else {
//         const res = await axios.get(
//           `${API_BASE}/api/banner-products/${type}`
//         );

//         data = Array.isArray(res.data)
//           ? res.data
//           : [];
//       }

//       // Get product category information
//       const productRes = await axios.get(
//         `${API_BASE}/api/products`
//       );

//       const allProducts = Array.isArray(productRes.data)
//         ? productRes.data
//         : [];

//       const productMap = {};

//       allProducts.forEach((product) => {
//         productMap[product.id] = product;
//       });

//       // Attach category_id to banner products
//       data = data.map((product) => {
//         const original = productMap[product.id];

//         return {
//           ...product,
//           category_id:
//             product.category_id ||
//             original?.category_id ||
//             null,
//         };
//       });

//       setProducts(data);
//     } catch (error) {
//       console.error(
//         "Error loading banner products:",
//         error
//       );

//       setProducts([]);
//     }
//   };

//   // ===============================
//   // FETCH CATEGORIES
//   // ===============================
//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/api/categories/with-subcategories`
//       );

//       setCategories(
//         Array.isArray(res.data)
//           ? res.data
//           : []
//       );
//     } catch (error) {
//       console.error(
//         "Error loading categories:",
//         error
//       );

//       setCategories([]);
//     }
//   };

//   // ===============================
//   // SEARCH
//   // ===============================
//   const filteredProducts = products.filter(
//     (product) => {
//       const search = searchTerm
//         .trim()
//         .toLowerCase();

//       if (!search) {
//         return true;
//       }

//       const name = String(
//         product.name || ""
//       ).toLowerCase();

//       const brand = String(
//         product.brand || ""
//       ).toLowerCase();

//       const variant = String(
//         product.variant_label || ""
//       ).toLowerCase();

//       return (
//         name.includes(search) ||
//         brand.includes(search) ||
//         variant.includes(search)
//       );
//     }
//   );

//   // ===============================
//   // BANNER TITLE
//   // ===============================
//   const bannerName = type
//     .replace(/-/g, " ")
//     .toUpperCase();

//   // ===============================
//   // GROUP PRODUCTS BY CATEGORY
//   // ===============================
//   const groupedCategories = categories
//   .map((category) => {
//     const categoryProducts =
//       filteredProducts.filter(
//         (product) =>
//           Number(product.category_id) ===
//           Number(category.id)
//       );

//     return {
//       ...category,
//       products: categoryProducts,
//     };
//   })
//   .filter(
//     (category) =>
//       category.products.length > 0
//   );

// // Keep products that could not be mapped to a category
// const groupedProductIds = new Set(
//   groupedCategories.flatMap((category) =>
//     category.products.map((product) =>
//       Number(product.id)
//     )
//   )
// );

// const uncategorizedProducts =
//   filteredProducts.filter(
//     (product) =>
//       !groupedProductIds.has(
//         Number(product.id)
//       )
//   );

// if (uncategorizedProducts.length > 0) {
//   groupedCategories.push({
//     id: "other-products",
//     name: "Other Products",
//     products: uncategorizedProducts,
//   });
// }

//   return (
//     <div className="p-4">

//       {/* ===============================
//           BANNER TITLE
//       =============================== */}
//       <h2 className="text-2xl font-bold">
//         {bannerName}
//       </h2>

//       {/* ===============================
//           SEARCH
//       =============================== */}
//       <div className="mt-4 mb-5">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) =>
//             setSearchTerm(e.target.value)
//           }
//           placeholder={`Search ${bannerName.toLowerCase()} products...`}
//           className="w-full max-w-[500px] border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
//         />
//       </div>

//       {/* ===============================
//           COUNT
//       =============================== */}
//       <p className="text-gray-500 mb-6">
//         {filteredProducts.length} Product
//         {filteredProducts.length !== 1
//           ? "s"
//           : ""}{" "}
//         Found
//       </p>

//       {/* ===============================
//           NO PRODUCTS
//       =============================== */}
//       {filteredProducts.length === 0 ? (
//         <div className="w-full flex flex-col items-center justify-center py-20">
//           <h2 className="text-2xl font-bold text-gray-700">
//             No Products Found
//           </h2>

//           <p className="text-gray-500 mt-2">
//             No matching products are available
//             in this section.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-8">

//           {groupedCategories.map(
//             (category) => (
//               <div
//                 key={category.id}
//                 className="w-full"
//               >

//                 {/* CATEGORY HEADER */}
//                 <div className="flex items-center justify-between mb-3">
//                   <h2 className="text-xl font-semibold">
//                     {category.name}
//                   </h2>

//                   <span className="text-red-500 text-sm">
//                     See All →
//                   </span>
//                 </div>

//                 {/* HORIZONTAL SWIPING PRODUCTS */}
//                 <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">

//                   {category.products.map(
//                     (product, index) => (
//                       <div
//                         key={`${type}-${category.id}-${product.id}-${index}`}
//                         className="flex-shrink-0"
//                       >
//                         <ProductCard
//                           p={product}
//                         />
//                       </div>
//                     )
//                   )}

//                 </div>

//               </div>
//             )
//           )}

//         </div>
//       )}

//     </div>
//   );
// }

// export default BannerPage;


import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API_BASE = "http://localhost:4000";

function BannerPage() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* ===============================
     LOAD DATA
  ================================ */
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [type]);

  /* ===============================
     CLEAR SEARCH WHEN TYPE CHANGES
  ================================ */
  useEffect(() => {
    setSearchTerm("");
  }, [type]);

  /* ===============================
     FETCH CATEGORIES
  ================================ */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/categories/with-subcategories`
      );

      setCategories(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (error) {
      console.error(
        "Error loading categories:",
        error
      );

      setCategories([]);
    }
  };

  /* ===============================
     FETCH PRODUCTS
  ================================ */
  const fetchProducts = async () => {
    try {
      let data = [];

      /* ==========================================
         OFFER ZONE
         Existing offers + all fruits & vegetables
      ========================================== */
      if (type === "offer-zone") {
        let offerProducts = [];
        let bannerProducts = [];

        /* Existing Offer Zone products */
        try {
          const offerRes = await axios.get(
            `${API_BASE}/api/offers`
          );

          offerProducts = Array.isArray(
            offerRes.data
          )
            ? offerRes.data.map((offer) => ({
                id: offer.buy_product_id,
                name: offer.buy_product_name,
                brand: offer.brand || "",
                image: offer.buy_product_image,

                images: offer.buy_product_images
                  ? typeof offer.buy_product_images ===
                    "string"
                    ? JSON.parse(
                        offer.buy_product_images
                      )
                    : offer.buy_product_images
                  : [],

                price: offer.price,
                mrp: offer.mrp,
                stock: offer.stock,
                variant_label:
                  offer.variant_label,

                category_id:
                  offer.category_id || null,

                title: offer.title,
                buy_qty: offer.buy_qty,
                free_qty: offer.free_qty,
                free_product_name:
                  offer.free_product_name,
              }))
            : [];
        } catch (error) {
          console.error(
            "Error loading existing offers:",
            error
          );
        }

        /* Fruits + Vegetables */
        try {
          const bannerRes = await axios.get(
            `${API_BASE}/api/banner-products/offer-zone`
          );

          bannerProducts = Array.isArray(
            bannerRes.data
          )
            ? bannerRes.data
            : [];
        } catch (error) {
          console.error(
            "Error loading offer-zone banner products:",
            error
          );
        }

        /* Remove duplicate products */
        const existingIds = new Set(
          offerProducts.map((product) =>
            Number(product.id)
          )
        );

        const additionalProducts =
          bannerProducts.filter(
            (product) =>
              !existingIds.has(
                Number(product.id)
              )
          );

        data = [
          ...offerProducts,
          ...additionalProducts,
        ];
      } else {
        /* ==========================================
           ALL OTHER BANNERS
        ========================================== */
        const res = await axios.get(
          `${API_BASE}/api/banner-products/${type}`
        );

        data = Array.isArray(res.data)
          ? res.data
          : [];
      }

      /* ==========================================
         GET ALL PRODUCTS
         Used to find category_id for offer products
      ========================================== */
      try {
        const productRes = await axios.get(
          `${API_BASE}/api/products`
        );

        const allProducts = Array.isArray(
          productRes.data
        )
          ? productRes.data
          : [];

        const productMap = {};

        allProducts.forEach((product) => {
          productMap[Number(product.id)] =
            product;
        });

        data = data.map((product) => {
          const original =
            productMap[Number(product.id)];

          return {
            ...product,

            category_id:
              product.category_id ||
              original?.category_id ||
              null,

            brand:
              product.brand ||
              original?.brand ||
              "",

            image:
              product.image ||
              original?.image ||
              "",

            images:
              product.images ||
              original?.images ||
              [],
          };
        });
      } catch (error) {
        console.error(
          "Error loading product category information:",
          error
        );
      }

      setProducts(data);
    } catch (error) {
      console.error(
        "Error loading banner products:",
        error
      );

      setProducts([]);
    }
  };

  /* ===============================
     SEARCH
  ================================ */
  const filteredProducts = products.filter(
    (product) => {
      const search = searchTerm
        .trim()
        .toLowerCase();

      if (!search) {
        return true;
      }

      const name = String(
        product.name || ""
      ).toLowerCase();

      const brand = String(
        product.brand || ""
      ).toLowerCase();

      const variant = String(
        product.variant_label || ""
      ).toLowerCase();

      return (
        name.includes(search) ||
        brand.includes(search) ||
        variant.includes(search)
      );
    }
  );

  /* ===============================
     BANNER TITLE
  ================================ */
  const bannerName = type
    ? type.replace(/-/g, " ").toUpperCase()
    : "";

  /* ===============================
     GROUP PRODUCTS BY CATEGORY
  ================================ */
  const groupedCategories = categories
    .map((category) => {
      const categoryProducts =
        filteredProducts.filter(
          (product) =>
            Number(product.category_id) ===
            Number(category.id)
        );

      return {
        ...category,
        products: categoryProducts,
      };
    })
    .filter(
      (category) =>
        category.products.length > 0
    );

  /* ===============================
     PRODUCTS WITHOUT CATEGORY
  ================================ */
  const groupedProductIds = new Set(
    groupedCategories.flatMap(
      (category) =>
        category.products.map((product) =>
          Number(product.id)
        )
    )
  );

  const uncategorizedProducts =
    filteredProducts.filter(
      (product) =>
        !groupedProductIds.has(
          Number(product.id)
        )
    );

  if (uncategorizedProducts.length > 0) {
    groupedCategories.push({
      id: "other-products",
      name: "Other Products",
      products: uncategorizedProducts,
    });
  }

  /* ===============================
     SEE ALL CATEGORY
  ================================ */
  const handleSeeAll = (category) => {
    if (category.id === "other-products") {
      return;
    }

    navigate(`/category/${category.id}`);
  };

  return (
    <div className="p-4">

      {/* ===============================
          BANNER TITLE
      ================================ */}
      <h2 className="text-2xl font-bold">
        {bannerName}
      </h2>

      {/* ===============================
          SEARCH
      ================================ */}
      <div className="mt-4 mb-5">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          placeholder={`Search ${bannerName.toLowerCase()} products...`}
          className="w-full max-w-[500px] border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
      </div>

      {/* ===============================
          COUNT
      ================================ */}
      <p className="text-gray-500 mb-6">
        {filteredProducts.length} Product
        {filteredProducts.length !== 1
          ? "s"
          : ""}{" "}
        Found
      </p>

      {/* ===============================
          NO PRODUCTS
      ================================ */}
      {filteredProducts.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20">

          <h2 className="text-2xl font-bold text-gray-700">
            No Products Found
          </h2>

          <p className="text-gray-500 mt-2">
            No matching products are available
            in this section.
          </p>

        </div>
      ) : (
        /* ===============================
           CATEGORY SECTIONS
        ================================ */
        <div className="space-y-8">

          {groupedCategories.map(
            (category) => (
              <div
                key={category.id}
                className="w-full"
              >

                {/* ===============================
                    CATEGORY HEADER
                ================================ */}
                <div className="flex items-center justify-between mb-3">

                  <h2 className="text-xl font-semibold">
                    {category.name}
                  </h2>

                  {category.id !==
                    "other-products" && (
                    <button
                      onClick={() =>
                        handleSeeAll(
                          category
                        )
                      }
                      className="text-red-500 text-sm font-medium hover:underline"
                    >
                      See All →
                    </button>
                  )}

                </div>

                {/* ===============================
                    HORIZONTAL SWIPING PRODUCTS
                ================================ */}
                <div
                  className="flex gap-6 overflow-x-auto pb-4"
                  style={{
                    scrollbarWidth: "thin",
                  }}
                >

                  {category.products.map(
                    (product, index) => (
                      <div
                        key={`${type}-${category.id}-${product.id}-${index}`}
                        className="flex-shrink-0"
                      >

                        <ProductCard
                          p={product}
                        />

                      </div>
                    )
                  )}

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default BannerPage;