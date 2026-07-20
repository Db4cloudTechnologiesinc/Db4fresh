import { useEffect, useState } from "react";

export default function AddressTab() {
  const [addresses, setAddresses] = useState([]);

  // Use the same token approach as the rest of the project
  const token = localStorage.getItem("token");

  const loadAddresses = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to load addresses");
        setAddresses([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setAddresses(data);
      } else if (Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Address Error:", err);
      setAddresses([]);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const setDefault = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/addresses/${id}/default`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>

      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses saved.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="border p-4 rounded flex justify-between items-start"
            >
              <div>
  <p className="font-semibold">{a.name}</p>

  <p className="text-gray-600">
    📞 {a.phone}
  </p>

  <p className="text-gray-600">
    {a.address_line1 || a.address_line2}
  </p>

  {a.landmark && (
    <p className="text-gray-500">
      {a.landmark}
    </p>
  )}

  <p className="text-gray-500">
    {a.city}, {a.state}
  </p>

  <p className="text-gray-500">
    Pincode: {a.pincode}
  </p>

  {a.is_default == 1 && (
    <span className="text-green-600 text-sm font-semibold">
      Default
    </span>
  )}
</div>

              {!a.is_default && (
                <button
                  onClick={() => setDefault(a.id)}
                  className="text-sm text-red-600"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}