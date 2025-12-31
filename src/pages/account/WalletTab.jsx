import { useEffect, useState } from "react";

export default function WalletTab() {
  const [wallet, setWallet] = useState({
    balance: 0,
    points: 0,
  });

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    fetch("http://localhost:4000/api/wallet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setWallet(data));
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Wallet & Rewards</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">

        {/* WALLET */}
        <div className="border rounded-lg p-5 bg-green-50">
          <p className="text-sm text-gray-600">Wallet Balance</p>
          <p className="text-2xl font-bold text-green-700">
            ₹{wallet.balance}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Used for refunds & cashback
          </p>
        </div>

        {/* REWARDS */}
        <div className="border rounded-lg p-5 bg-yellow-50">
          <p className="text-sm text-gray-600">Reward Points</p>
          <p className="text-2xl font-bold text-yellow-700">
            {wallet.points} pts
          </p>
          <p className="text-xs text-gray-500 mt-1">
            100 pts = ₹10
          </p>
        </div>

      </div>

      {/* INFO */}
      <div className="mt-6 text-sm text-gray-600">
        <p>• Earn reward points on every order</p>
        <p>• Wallet balance is auto-applied on checkout</p>
        <p>• Points are non-transferable</p>
      </div>
    </div>
  );
}
