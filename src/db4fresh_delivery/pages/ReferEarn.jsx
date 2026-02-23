import { useState } from "react";
import {
  Gift,
  Copy,
  Send,
  Mail,
  MessageCircle
} from "lucide-react";

export default function ReferEarn() {
  const referralCode = "DB4FRESH2026";
  const referralLink = `https://db4fresh.com/signup?ref=${referralCode}`;

  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Join DB4Fresh Delivery and earn rewards! Use my referral code: ${referralCode} \n${referralLink}`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Gift /> Refer & Earn
      </h1>

      {/* Intro Card */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <p className="text-gray-600">
          Invite your friends and earn ₹500 for each successful referral.
        </p>
      </div>

      {/* Referral Code Card */}
      <div className="bg-purple-600 text-white p-6 rounded-xl shadow mb-6">
        <h3 className="mb-3">Your Referral Code</h3>

        <div className="flex items-center justify-between bg-white text-black px-4 py-3 rounded">
          <span className="font-semibold">{referralCode}</span>

          <button
            onClick={copyLink}
            className="flex items-center gap-1 text-purple-600 font-semibold"
          >
            <Copy size={16} /> Copy
          </button>
        </div>

        {copied && (
          <p className="text-green-200 mt-2 text-sm">
            Link copied successfully!
          </p>
        )}
      </div>

      {/* Share Buttons */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4">Share Via</h3>

        <div className="grid md:grid-cols-3 gap-4">

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg"
          >
            <Send size={18} /> Telegram
          </a>

          <a
            href={`mailto:?subject=Join DB4Fresh&body=${encodeURIComponent(shareText)}`}
            className="flex items-center justify-center gap-2 bg-gray-700 text-white py-3 rounded-lg"
          >
            <Mail size={18} /> Email
          </a>

        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-4">Referral History</h3>

        <div className="space-y-3">

          <div className="flex justify-between border-b pb-2">
            <span>Rahul Kumar</span>
            <span className="text-green-600 font-semibold">₹500</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Priya Sharma</span>
            <span className="text-green-600 font-semibold">₹500</span>
          </div>

          <div className="flex justify-between">
            <span>Amit Verma</span>
            <span className="text-yellow-600 font-semibold">Pending</span>
          </div>

        </div>
      </div>
    </div>
  );
}
