import { useEffect, useState } from "react";
import axios from "axios";

export default function CODHistory() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await axios.get(
        "/api/delivery/cod-transactions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("deliveryToken")}`,
          },
        }
      );
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        COD Transactions
      </h1>

      {transactions.map((t) => (
        <div
          key={t.id}
          className="bg-white shadow-md rounded-xl p-4 mb-3"
        >
          <p>Order ID: {t.order_id}</p>
          <p>Amount: ₹{t.amount}</p>
          <p>Status: {t.status}</p>
          <p>
            Collected At:{" "}
            {new Date(t.collected_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}