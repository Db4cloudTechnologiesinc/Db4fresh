import { useEffect, useState } from "react";
import axios from "axios";

export default function Store() {
  const [store, setStore] = useState({
    store_name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
    latitude: "",
    longitude: "",
    is_active: true
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/delivery/store",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setStore(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:4000/api/delivery/store",
        store,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      alert("Store updated successfully");
      setEditing(false);
    } catch (error) {
      alert("Failed to update store");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Store</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">

        {[
          { label: "Store Name", key: "store_name" },
          { label: "Address", key: "address" },
          { label: "City", key: "city" },
          { label: "Pincode", key: "pincode" },
          { label: "Phone", key: "phone" },
          { label: "Latitude", key: "latitude" },
          { label: "Longitude", key: "longitude" }
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-gray-500">
              {field.label}
            </label>
            <input
              type="text"
              value={store?.[field.key] || ""}
              disabled={!editing}
              onChange={(e) =>
                setStore({ ...store, [field.key]: e.target.value })
              }
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        ))}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={store.is_active}
            disabled={!editing}
            onChange={(e) =>
              setStore({ ...store, is_active: e.target.checked })
            }
          />
          <span>Store Active</span>
        </div>

        {editing ? (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}