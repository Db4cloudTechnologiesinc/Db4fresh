import { useEffect, useState } from "react";

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]); // MUST be array

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${productId}/reviews`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else if (Array.isArray(data?.data)) {
          setReviews(data.data);
        } else {
          setReviews([]);
        }
      })
      .catch(() => setReviews([]));
  }, [productId]);

  if (!reviews.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <h3 className="font-semibold mb-3">Customer Reviews</h3>
        <p className="text-sm text-gray-500">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h3 className="font-semibold mb-4">Customer Reviews</h3>

      {reviews.map((r, i) => (
        <div key={i} className="border-b py-3">
          <p className="font-medium">⭐ {r.rating}</p>
          <p className="text-sm">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
