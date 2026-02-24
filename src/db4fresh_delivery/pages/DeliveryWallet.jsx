import { useEffect, useState } from "react";
import axios from "axios";

export default function DeliveryWallet() {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      const { data } = await axios.get(
        "/api/delivery/wallet",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("deliveryToken")}`,
          },
        }
      );
      setWallet(data);
    };

    fetchWallet();
  }, []);

  if (!wallet) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        COD Wallet
      </h1>

      <div className="bg-white shadow-xl rounded-xl p-6">
        <p className="text-lg">
          Total COD Collected:
          <span className="font-bold text-blue-600 ml-2">
            ₹{wallet.total_cod_collected}
          </span>
        </p>

        <p className="text-lg mt-2">
          Total Settled:
          <span className="font-bold text-green-600 ml-2">
            ₹{wallet.total_settled}
          </span>
        </p>

        <p className="text-lg mt-2">
          Pending Settlement:
          <span className="font-bold text-red-600 ml-2">
            ₹{wallet.pending}
          </span>
        </p>
      </div>
    </div>
  );
}