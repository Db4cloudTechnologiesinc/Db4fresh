
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Do nothing if search is empty
    if (search.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/users/search/${search}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          console.error("Search API failed");
          return;
        }

        const data = await res.json();
        console.log("Suggestions:", data); // 🔍 DEBUG

        setSuggestions(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      }
    };

    fetchSuggestions();

    return () => controller.abort();
  }, [search]);

  const handleSelect = (userId) => {
    setSearch("");
    setSuggestions([]);
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl relative">
      <h2 className="text-xl font-semibold mb-4">Users</h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search by User ID or Name"
        className="border p-2 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🔽 Suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute left-6 right-6 bg-white border rounded shadow mt-1 z-50">
          {suggestions.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user.id)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">
                ID: {user.id} • {user.email}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
