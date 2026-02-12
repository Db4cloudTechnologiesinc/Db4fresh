
import React from "react";
import { FaTruck, FaTags, FaFire } from "react-icons/fa";
import "./AdStrip.css";

export default function AdStrip() {
  return (
    <div className="adstrip-wrapper">
      <div className="adstrip">
        <div className="ad-card">
          <FaTruck className="ad-icon" />
          <h4>Free Delivery</h4>
          <p>On orders above ₹199</p>
        </div>

        <div className="ad-card">
          <FaFire className="ad-icon" />
          <h4>Today’s Deals</h4>
          <p>Fresh offers every day</p>
        </div>

        <div className="ad-card">
          <FaTags className="ad-icon" />
          <h4>Offer Zone</h4>
          <p>Save up to 40%</p>
        </div>
      </div>
    </div>
  );
}
