import { useEffect, useState } from "react";

export default function AddressTab() {
  const [addresses, setAddresses] = useState([]);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const loadAddresses = async () => {
    const res = await fetch("http://localhost:4000/api/addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setAddresses(data.addresses || data);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const setDefault = async (id) => {
    await fetch(`http://localhost:4000/api/addresses/${id}/default`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadAddresses();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>

      {addresses.length === 0 && (
        <p className="text-gray-500">No addresses saved.</p>
      )}

      <div className="space-y-4">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="border p-4 rounded flex justify-between items-start"
          >
            <div>
              <p className="font-medium">{a.address}</p>
              <p className="text-sm text-gray-500">{a.type}</p>

              {a.is_default && (
                <span className="text-xs text-green-600 font-semibold">
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
    </div>
  );
}
