
import React from "react";
import { Link } from "react-router-dom";

export default function SubcategoryCard({ subcategory }) {
  return (
    <Link to={`/subcategory/${subcategory.id}`}>
      <div className="relative w-[220px] h-[220px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">

        {/* FULL IMAGE */}
        <img
          src={subcategory.image || "/placeholder.png"}
          alt={subcategory.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY (readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        {/* TITLE */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white text-base font-semibold leading-tight line-clamp-2">
            {subcategory.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
