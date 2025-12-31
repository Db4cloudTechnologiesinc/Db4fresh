import axios from "axios";
import { useEffect, useState } from "react";

export default function AddressList({ onSelect }) {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    axios.get("/api/addresses", authHeader())
      .then(res => {
        setAddresses(res.data);
        const def = res.data.find(a => a.is_default);
        if (def) onSelect(def);
      });
  }, []);

  return (
    <div>
      {addresses.map(a => (
        <div key={a.id} className="border p-3 mb-2">
          <input
            type="radio"
            name="address"
            defaultChecked={a.is_default}
            onChange={() => onSelect(a)}
          />
          <span className="ml-2">
            {a.address_line1}, {a.city}
          </span>
        </div>
      ))}
    </div>
  );
}
