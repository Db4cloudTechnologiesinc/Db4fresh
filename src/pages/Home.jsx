
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
import TopPicks from "../components/TopPicks";
import CategoryRow from "../components/CategoryRow";
 
const API_BASE = "http://localhost:4000";
 
const COMING_SOON = [
  "beauty",
  "gym freaks",
  "fashion",
  "electronics",
  "pharmacy",
  "healthy"
];
 
const PRIORITY_CATEGORIES = ["fruits", "vegetables"];
 
export default function Home() {
 
  const navigate = useNavigate();
 
  const [categories, setCategories] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
 
    async function loadHome() {
      try {
        setLoading(true);
 
        const [catRes, topRes] = await Promise.all([
          axios.get(`${API_BASE}/api/categories/with-subcategories`),
          axios.get(`${API_BASE}/api/products/top-picks`)
        ]);
 
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
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
      // navigate(`/coming-soon/${name}`);
      navigate(`/category/coming-soon-${name.replace(/\s+/g, "-")}`);
      return;
    }
 
    navigate(`/category/${cat.id}`);
 
  };
 
  const goToVegetables = () => {
    const vegCategory = categories.find(
      (c) => c.name.toLowerCase() === "vegetables"
    );
 
    if (!vegCategory) return;
 
    navigate(`/category/${vegCategory.id}`);
  };
 
  const orderedCategories = [
    ...categories.filter((c) =>
      PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
    ),
    ...categories.filter(
      (c) => !PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
    )
  ];
 
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1300px] mx-auto px-4">
 
        {/* HERO */}
        <div
          onClick={goToVegetables}
          className="mt-4 rounded-2xl overflow-hidden shadow cursor-pointer"
        >
          <img src="/banner.png" className="w-full h-[320px] object-cover" />
        </div>
     
  <div className="w-full px-4">
 
 {/* 5 PROMO BANNERS */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
 
  {[
    { img: "/free-delivery.png", link: "/banner/free-delivery" },
   
    { img: "/todays-deal.png", link: "/banner/todays-deal" },
    { img: "/offer-zone.png", link: "/banner/offer-zone" },
    { img: "/super-store.png", link: "/banner/super-store" },
    { img: "/50-off.png", link: "/banner/50-off" }
  ].map((banner, i) => (
    <div
      key={i}
      onClick={() => navigate(banner.link)}
      className="w-full h-[200px] rounded-xl overflow-hidden shadow cursor-pointer group"
    >
      <img
        src={banner.img}
        alt="banner"
        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  ))}
 
</div>
</div>
 
        {/* CATEGORY GRID */}
        <div className="bg-white mt-8 rounded-2xl shadow p-6">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 text-center">
 
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer bg-gray-100 rounded-xl h-[130px] flex flex-col items-center justify-center"
            >
              <img src="/categories/all.png" className="w-20 h-20" />
              <p>All</p>
            </div>
 
            {categories.map((cat) => {
              const imageName = cat.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");
 
              return (
                <div
                  key={cat.id}
                  onClick={() => onCategoryClick(cat)}
                  className="cursor-pointer bg-gray-100 rounded-xl h-[130px] flex flex-col items-center justify-center"
                >
                  <img
                    src={`/categories/${imageName}.png`}
                    className="w-20 h-20 object-contain"
                  />
                  <p>{cat.name}</p>
                </div>
              );
            })}
          </div>
        </div>
 
        {/* CONTENT */}
        <div className="py-8">
 
          {loading ? (
  <p>Loading...</p>
) : (
            <>
              <TopPicks products={topPicks} />
 
              {orderedCategories.map((cat) => {
 
                if (COMING_SOON.includes(cat.name.toLowerCase()))
                  return null;
 
                return (
                  <CategoryRow
                    key={cat.id}
                    title={cat.name}
                    categoryId={cat.id}
                  />
                );
 
              })}
            </>
          )}
 
        </div>
 
      </div>
    </div>
  );
}
 