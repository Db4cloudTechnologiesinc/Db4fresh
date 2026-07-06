
import React, { useEffect, useState } from "react";
import axios from "axios";
// import ProductCard from "../../components/ProductCard";

const API_BASE = "http://localhost:4000";

export default function OfferZone() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  axios
    .get(`${API_BASE}/api/offers`)
    .then((res) => {
      console.log("OFFERS:", res.data);
      setOffers(res.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);

  return (
    <section className="px-4 py-6">
  <h2 className="text-lg font-bold mb-4">
    🔥 Offer Zone
  </h2>

  {loading && (
    <p className="text-sm text-gray-500">
      Loading offers...
    </p>
  )}

  {!loading && offers.length === 0 && (
    <p className="text-sm text-gray-500">
      No offers available right now
    </p>
  )}

  {offers.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="bg-white shadow rounded-xl p-4 border"
        >
          <h3 className="font-bold text-red-600">
            🎁 {offer.title}
          </h3>

          <p className="mt-2">
            Buy {offer.buy_qty} {offer.buy_product_name}
          </p>

          <p className="text-green-600 font-semibold">
            Get {offer.free_qty} {offer.free_product_name} FREE
          </p>
        </div>
      ))}
    </div>
  )}
</section>
  );
}