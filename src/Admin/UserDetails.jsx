
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl">
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p>{user.email}</p>
      <p>User ID: {user.id}</p>

      <button
        onClick={() => navigate(`/admin/users/${user.id}/history`)}
        className="mt-4 bg-pink-600 text-white px-4 py-2 rounded"
      >
        View History
      </button>
    </div>
  );
}
