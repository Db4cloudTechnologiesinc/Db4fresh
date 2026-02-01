import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API_BASE = "http://localhost:4000";

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productsRef = useRef(null);

  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubId, setActiveSubId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  /* ================= LOAD CATEGORY ================= */
  useEffect(() => {
    async function loadCategory() {
      try {
        const res = await axios.get(
          `${API_BASE}/api/categories/with-subcategories`
        );

        const cats = Array.isArray(res.data) ? res.data : [];
        setAllCategories(cats);

        const found = cats.find(
          (c) => String(c.id) === String(id)
        );

        if (!found) return;

        setCategory(found);
        setSubcategories(found.subcategories || []);

        if (found.subcategories?.length > 0) {
          loadProducts(found.subcategories[0].id);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadCategory();
  }, [id]);

  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = async (subId) => {
    try {
      setActiveSubId(subId);
      setLoadingProducts(true);

      const res = await axios.get(
        `${API_BASE}/api/products/subcategory/${subId}`
      );

      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
      setTimeout(() => {
        productsRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  if (!category) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading category…
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6">
      {/* ================= CATEGORY ROW (2 ROWS) ================= */}
      <div className="bg-white px-4 py-4 mb-6 shadow-sm rounded-xl">
        <div className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-3 overflow-x-auto">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition
                ${
                  String(cat.id) === String(id)
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ================= PAGE TITLE ================= */}
      <h1 className="text-xl font-bold mb-4">
        {category.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* ================= LEFT: SUBCATEGORIES ================= */}
        <div className="bg-white rounded-xl shadow-sm p-4 h-fit">
          <h2 className="font-semibold mb-4">
            {category.name}
          </h2>

          {subcategories.length === 0 && (
            <p className="text-sm text-gray-400">
              No subcategories available
            </p>
          )}

          <div className="flex flex-col gap-2">
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => loadProducts(sub.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-left transition
                  ${
                    activeSubId === sub.id
                      ? "bg-red-100 text-red-600"
                      : "hover:bg-gray-100"
                  }`}
              >
                <img
                  src={
                    sub.image
                      ? `${API_BASE}/uploads/subcategories/${sub.image}`
                      : "/placeholder.png"
                  }
                  alt={sub.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <span className="font-medium">
                  {sub.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT: PRODUCTS ================= */}
        <div ref={productsRef}>
          {loadingProducts && (
            <p className="text-gray-500 mb-3">
              Loading products…
            </p>
          )}

          {!loadingProducts && products.length === 0 && (
            <p className="text-gray-400">
              No products found
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
