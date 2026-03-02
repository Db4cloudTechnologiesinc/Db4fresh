// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function CODHistory() {
//   const [transactions, setTransactions] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const token = localStorage.getItem("deliveryToken");

//         const { data } = await axios.get(
//           "http://localhost:4000/api/delivery/cod-transactions",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setTransactions(data);
//       } catch (err) {
//         console.error("COD Fetch Error:", err);
//         setError("Failed to load COD transactions");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   if (loading) return <p className="p-6">Loading...</p>;
//   if (error) return <p className="p-6 text-red-500">{error}</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">
//         COD Transactions
//       </h1>

//       {transactions.length === 0 ? (
//         <p>No COD transactions found.</p>
//       ) : (
//         transactions.map((t) => (
//           <div
//             key={t.id}
//             className="bg-white shadow-md rounded-xl p-4 mb-3"
//           >
//             <p>Order ID: {t.order_id}</p>
//             <p>Amount: ₹{t.amount}</p>
//             <p>Status: {t.status}</p>
//             <p>
//               Collected At:{" "}
//               {t.collected_at
//                 ? new Date(t.collected_at).toLocaleString()
//                 : "N/A"}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";

export default function CODHistory() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // ✅ Support both possible token keys
        const token =
          localStorage.getItem("deliveryToken") ||
          localStorage.getItem("delivery_token");

        if (!token) {
          setError("Unauthorized. Please login again.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          "http://localhost:4000/api/delivery/cod-transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ Handle both possible backend responses
        if (Array.isArray(data)) {
          setTransactions(data);
        } else if (Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          setTransactions([]);
        }

      } catch (err) {
        console.error("COD Fetch Error:", err);

        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("deliveryToken");
          localStorage.removeItem("delivery_token");
        } else {
          setError("Failed to load COD transactions");
        }

      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        COD Transactions
      </h1>

      {transactions.length === 0 ? (
        <p>No COD transactions found.</p>
      ) : (
        transactions.map((t) => (
          <div
            key={t.id || t._id}
            className="bg-white shadow-md rounded-xl p-4 mb-3"
          >
            <p>Order ID: {t.order_id}</p>
            <p>Amount: ₹{t.amount}</p>
            <p>Status: {t.status}</p>
            <p>
              Collected At:{" "}
              {t.collected_at
                ? new Date(t.collected_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}