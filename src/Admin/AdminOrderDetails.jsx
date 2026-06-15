
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
const [partners, setPartners] = useState([]);
const [selectedPartner, setSelectedPartner] = useState("");
  const updateStatus = async () => {
  try {
    const res = await fetch(
      `http://localhost:4000/api/orders/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: order.order_status,
        }),
      }
    );

    const data = await res.json();

    alert(data.message || "Status updated");
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
};

const assignPartner = async () => {
  try {
    const res = await fetch(
      `http://localhost:4000/api/orders/${id}/assign-partner`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          partnerId: selectedPartner,
        }),
      }
    );

    const data = await res.json();

    alert(data.message);

    const partner = partners.find(
      (p) => p.id === Number(selectedPartner)
    );

    if (partner) {
      setOrder((prev) => ({
        ...prev,
        delivery_partner_name: partner.name,
      }));
    }
  } catch (err) {
    console.error(err);
    alert("Failed to assign partner");
  }
};
  useEffect(() => {
  // Order Details
  fetch(`http://localhost:4000/api/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setOrder({
        ...data.order,
        items: data.items,
      });
    })
    .catch(console.error);

  // Timeline
  fetch(`http://localhost:4000/api/orders/${id}/timeline`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setTimeline(data.timeline || []))
    .catch(console.error);

  // Delivery Partners
  fetch(`http://localhost:4000/api/orders/${id}/delivery-partners`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setPartners(data.partners || []))
    .catch(console.error);
}, [id]);
  if (!order) return <p className="p-6">Loading order...</p>;

  return (
    <div className="flex gap-6 p-6">

      {/* LEFT SIDE */}
      <div className="flex-1 space-y-6">

        {/* Order Card */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Order #{String(order.id).padStart(4, "0")}
            </h2>

            <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 text-sm">
              {order.order_status}
            </span>
          </div>

          <p className="text-gray-500 mt-2">
            {new Date(order.created_at).toLocaleString()}
          </p>

          {/* ITEMS */}
          <h3 className="mt-6 font-semibold">Order Items</h3>

          <div className="mt-3 space-y-3">
            {order.items?.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border p-3 rounded-lg"
              >
                <img
                  src={item.image || "https://via.placeholder.com/60"}
                  alt=""
                  className="w-14 h-14 rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>

                <div className="bg-red-100 px-3 py-1 rounded font-semibold">
                  {item.quantity}
                </div>

                <div className="font-semibold">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="text-right mt-4 font-bold text-lg text-red-600">
            Total: ₹{order.total_amount}
          </div>
        </div>

        {/* CUSTOMER */}
      <div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-semibold mb-4">
    Customer Information
  </h3>

  <div className="space-y-2">
    <p>
      <b>User ID:</b> {order.user_id}
    </p>

    <p>
      <b>Name:</b> {order.name || "N/A"}
    </p>

    <p>
      <b>Phone:</b> {order.phone || "N/A"}
    </p>
  </div>
</div>
{/* <div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-semibold mb-4">
    Delivery Information
  </h3>
  <div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-semibold mb-4">
    Order Timeline
  </h3>

  <div className="space-y-4">
    {timeline.length > 0 ? (
      timeline.map((item, index) => (
        <div key={index} className="flex gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>

          <div>
            <p className="font-medium">
              {item.status}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(
                item.created_at
              ).toLocaleString()}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">
        No timeline available
      </p>
    )}
  </div>
</div> */}
{/* Delivery Information */}
<div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-semibold mb-4">
    Delivery Information
  </h3>

  <p>
    <b>Slot:</b>{" "}
    {order.delivery_slot || "Not Assigned"}
  </p>

  <p>
    <b>Partner:</b>{" "}
    {order.delivery_partner_name || "Not Assigned"}
  </p>
</div>

{/* Order Timeline */}
<div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-semibold mb-4">
    Order Timeline
  </h3>

  <div className="space-y-4">
    {timeline.length > 0 ? (
      timeline.map((item, index) => (
        <div key={index} className="flex gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>

          <div>
            <p className="font-medium">
              {item.status}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">
        No timeline available
      </p>
    )}
  </div>


  <p>
    <b>Slot:</b>{" "}
    {order.delivery_slot || "Not Assigned"}
  </p>

  <p>
    <b>Partner:</b>{" "}
    {order.delivery_partner_name ||
      "Not Assigned"}
  </p>
</div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-80 space-y-6">

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
  <div className="flex justify-between">
    <span>Subtotal</span>
    <span>₹{order.total_amount}</span>
  </div>

  <div className="flex justify-between text-green-600">
    <span>Delivery</span>
    <span>FREE</span>
  </div>

  <hr />

  <div className="flex justify-between font-bold text-lg">
    <span>Total</span>
    <span>₹{order.total_amount}</span>
  </div>
</div>

        </div>
        <div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-semibold mb-3">
    Payment Details
  </h3>

  <p>
    <b>Method:</b>{" "}
    {order.payment_method}
  </p>

  <p>
    <b>Status:</b>{" "}
    {order.payment_status}
  </p>

  <p>
    <b>Payment ID:</b>{" "}
    {order.payment_id || "N/A"}
  </p>
</div>
<div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-semibold mb-3">
    Assign Delivery Partner
  </h3>

  <select
    value={selectedPartner}
    onChange={(e) =>
      setSelectedPartner(e.target.value)
    }
    className="w-full border p-2 rounded"
  >
    <option value="">
      Select Partner
    </option>

    {partners.map((partner) => (
      <option
        key={partner.id}
        value={partner.id}
      >
        {partner.name}
      </option>
    ))}
  </select>

  <button
    onClick={assignPartner}
    className="w-full bg-blue-500 text-white py-2 rounded mt-3"
  >
    Assign Partner
  </button>
</div>

        {/* STATUS UPDATE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Update Status</h3>

          <select
            value={order.order_status}
            onChange={(e) =>
              setOrder({ ...order, order_status: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option>PLACED</option>
            <option>CONFIRMED</option>
            <option>PACKED</option>
            <option>OUT_FOR_DELIVERY</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>

         <button
  onClick={updateStatus}
  className="w-full bg-red-500 text-white py-2 rounded mt-3"
>
  Update Status
</button>
        </div>


        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="w-full border py-2 rounded"
        >
          ← Back
        </button>

      </div>

    </div>
  );
}