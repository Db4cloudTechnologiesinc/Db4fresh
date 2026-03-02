import { useParams } from "react-router-dom";
import { updateOrderStatus } from "../services/deliveryApi";

export default function OrderDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("deliveryToken");

  const changeStatus = (status) => {
    updateOrderStatus(id, status, token)
      .then(() => alert("Status Updated"))
      .catch(() => alert("Error updating"));
  };

  return (
    <div className="order-details">
      <h2>Order #{id}</h2>

      <div className="status-buttons">
        <button onClick={() => changeStatus("Accepted")}>
          Accept
        </button>
        <button onClick={() => changeStatus("Out for Delivery")}>
          Out for Delivery
        </button>
        <button onClick={() => changeStatus("Delivered")}>
          Delivered
        </button>
      </div>
    </div>
  );
}
