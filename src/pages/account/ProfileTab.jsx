import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileTab() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ SAFE TOKEN HANDLING
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || localStorage.getItem("token");

  useEffect(() => {
  const fetchProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:4000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.clear();
        navigate("/auth");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [token, navigate]);

  const updateProfile = async () => {
    if (!token) return;

    const res = await fetch("http://localhost:4000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: profile.name,
        phone: profile.phone,
      }),
    });

    const data = await res.json();
    alert(data.message || "Profile updated");
  };

  if (loading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  if (!token) {
    return (
      <p className="text-gray-500">
        Please login to view your profile.
      </p>
    );
  }

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold mb-4">Profile</h3>

      <div className="space-y-4">
        <input
          className="w-full border p-3 rounded"
          placeholder="Name"
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />

        <input
          className="w-full border p-3 rounded "
          placeholder="Email"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Phone"
          value={profile.phone}
          onChange={(e) =>
            setProfile({ ...profile, phone: e.target.value })
          }
        />

        <button
          onClick={updateProfile}
          className="bg-red-600 text-white px-6 py-2 rounded"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
