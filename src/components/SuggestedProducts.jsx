import { useEffect, useState } from "react";

export default function SuggestedProducts({ productId }) {
  const [items, setItems] = useState([]); // MUST be array

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${productId}/suggested`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else if (Array.isArray(data?.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]));
  }, [productId]);

  if (!items.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h3 className="font-semibold mb-3">Frequently Bought Together</h3>

      <div className="flex gap-4 overflow-x-auto">
        {items.map(p => (
          <div key={p.id} className="min-w-[140px]">
            <img
              src={p.image || p.images?.[0]?.url || "/placeholder.png"}
              className="h-24 object-contain"
            />
            <p className="text-sm">{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
