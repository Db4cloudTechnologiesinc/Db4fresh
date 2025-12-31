import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:4000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: user.name,
        phone: user.phone,
      }),
    });

    const data = await res.json();
    alert(data.message);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Name"
        />

        <input
          className="w-full border p-2 rounded bg-gray-100"
          value={user.email}
          disabled
        />

        <input
          className="w-full border p-2 rounded"
          value={user.phone || ""}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          placeholder="Phone"
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
