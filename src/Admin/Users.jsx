import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:4000/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

console.log("Users API Response:", data);

if (Array.isArray(data)) {
  setUsers(data);
} else {
  console.error("API Error:", data);
  setUsers([]);
}
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // Search users
  useEffect(() => {
    if (search.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:4000/api/users/search/${search}`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
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
    <div className="bg-white rounded-lg shadow p-6 relative">
      <h2 className="text-xl font-semibold mb-4">
        Users ({users.length})
      </h2>

      <input
        type="text"
        placeholder="Search by User ID or Name"
        className="border p-2 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Joined</th>
            </tr>
          </thead>

          <tbody>
           {Array.isArray(users) &&
  users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  navigate(`/admin/users/${user.id}`)
                }
              >
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  {user.phone || "-"}
                </td>
                <td className="border p-2">
                  {new Date(
                    user.created_at
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}