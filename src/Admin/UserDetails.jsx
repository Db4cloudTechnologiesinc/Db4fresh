import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:4000/api/users/details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <div>Loading...</div>;

  const { user, stats, addresses, orders } = data;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-2xl font-bold mb-4">
    User Profile
  </h2>

  <div className="grid grid-cols-2 gap-4">
    <p><strong>ID:</strong> {user.id}</p>
    <p><strong>Name:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Phone:</strong> {user.phone}</p>
    <p>
      <strong>Joined:</strong>{" "}
      {new Date(user.created_at).toLocaleDateString()}
    </p>
  </div>
</div>
<div className="grid md:grid-cols-3 gap-4">

  <div className="bg-white p-5 rounded-xl shadow">
    <h3 className="text-gray-500">
      Total Orders
    </h3>

    <p className="text-3xl font-bold">
      {stats.totalOrders}
    </p>
  </div>

  <div className="bg-white p-5 rounded-xl shadow">
    <h3 className="text-gray-500">
      Total Spent
    </h3>

    <p className="text-3xl font-bold">
      ₹{stats.totalSpent}
    </p>
  </div>

  <div className="bg-white p-5 rounded-xl shadow">
    <h3 className="text-gray-500">
      Last Order
    </h3>

    <p>
      {stats.lastOrderDate
        ? new Date(
            stats.lastOrderDate
          ).toLocaleDateString()
        : "No Orders"}
    </p>
  </div>

</div>
<div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-xl font-semibold mb-4">
    Saved Addresses
  </h3>

  {addresses.length === 0 ? (
    <p>No addresses found</p>
  ) : (
    addresses.map((address) => (
      <div
        key={address.id}
        className="border rounded p-3 mb-3"
      >
        <p>{address.address_line}</p>
        <p>{address.city}</p>
        <p>{address.pincode}</p>
      </div>
    ))
  )}
</div>
<div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-xl font-semibold mb-4">
    Order History
  </h3>

  <table className="w-full border">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2">
          Order ID
        </th>

        <th className="border p-2">
          Amount
        </th>

        <th className="border p-2">
          Status
        </th>

        <th className="border p-2">
          Date
        </th>
      </tr>
    </thead>

    <tbody>
      {orders.map((order) => (
        <tr key={order.id}>
          <td className="border p-2">
            #{order.id}
          </td>

          <td className="border p-2">
            ₹{order.total_amount}
          </td>

          <td className="border p-2">
            {order.order_status}
          </td>

          <td className="border p-2">
            {new Date(
              order.created_at
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