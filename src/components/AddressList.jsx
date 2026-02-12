
import axios from "axios";
import { useEffect, useState } from "react";

export default function AddressList({ onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const token = localStorage.getItem("token");

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:4000/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setAddresses(list);

        if (list[0]) {
          setSelected(list[0]);
          onSelect(list[0]);
        }
      })
      .catch(console.error);
  }, [token, onSelect]);

  /* ================= SELECT ================= */
  const handleSelect = (addr) => {
    setSelected(addr);
    onSelect(addr);
    setOpen(false);
  };

  /* ================= START EDIT ================= */
  const startEdit = (addr, e) => {
    e.stopPropagation();
    setEditingId(addr.id);

    setForm({
      name: addr.name ?? "",
      phone: addr.phone ?? "",
      address_line1: addr.address_line1 ?? "",
      address_line2: addr.address_line2 ?? "",
      landmark: addr.landmark ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "",
      pincode: addr.pincode ?? "",
      address_type: addr.address_type ?? "HOME",
    });
  };

  /* ================= CANCEL ================= */
  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setForm({});
  };

  /* ================= SAVE EDIT (🔥 FIXED) ================= */
  const saveEdit = async (addr, e) => {
  e.stopPropagation();

  try {
    const payload = { ...form };

    const res = await axios.put(
      `http://localhost:4000/api/addresses/${addr.id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔒 SAFETY CHECK
    const updated = res.data?.address;

    if (!updated || !updated.id) {
      // Backend saved but didn't return updated row
      // 👉 Fallback: update locally using form data
      const merged = { ...addr, ...payload };

      setAddresses((prev) =>
        prev.map((a) => (a.id === addr.id ? merged : a))
      );

      if (selected?.id === addr.id) {
        setSelected(merged);
        onSelect(merged);
      }

      setEditingId(null);
      setOpen(false);
      return;
    }

    // ✅ NORMAL FLOW
    setAddresses((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );

    if (selected?.id === updated.id) {
      setSelected(updated);
      onSelect(updated);
    }

    setEditingId(null);
    setOpen(false);
  } catch (err) {
    console.error("UPDATE ADDRESS ERROR:", err);
    alert("Failed to update address ❌");
  }
};

  return (
    <div className="relative">
      {/* ===== DROPDOWN HEADER ===== */}
      <div
        onClick={() => setOpen(!open)}
        className="border rounded-lg p-4 cursor-pointer flex justify-between items-center"
      >
        <div>
          <p className="font-semibold">{selected?.name}</p>
          <p className="text-sm text-gray-600">
            {selected?.address_line1}, {selected?.address_line2}
          </p>
          <p className="text-sm text-gray-600">
            {selected?.city}, {selected?.state} – {selected?.pincode}
          </p>
        </div>
        <span>▼</span>
      </div>

      {/* ===== DROPDOWN LIST ===== */}
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-[420px] overflow-auto">
          {addresses.map((addr) => {
            const isEditing = editingId === addr.id;

            return (
              <div
                key={addr.id}
                onClick={() => !isEditing && handleSelect(addr)}
                className="p-4 border-b hover:bg-gray-50"
              >
                {!isEditing ? (
                  <>
                    <p className="font-semibold">
                      {addr.name} ({addr.address_type})
                    </p>
                    <p className="text-sm">
                      {addr.address_line1}, {addr.address_line2}
                    </p>
                    <p className="text-sm">{addr.landmark}</p>
                    <p className="text-sm">
                      {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p className="text-sm">📞 {addr.phone}</p>

                    <button
                      onClick={(e) => startEdit(addr, e)}
                      className="mt-2 text-sm text-red-600 hover:underline"
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    {[
                      ["name", "Name"],
                      ["phone", "Phone"],
                      ["address_line1", "Address line 1"],
                      ["address_line2", "Address line 2"],
                      ["landmark", "Landmark"],
                      ["city", "City"],
                      ["state", "State"],
                      ["pincode", "Pincode"],
                    ].map(([key, label]) => (
                      <input
                        key={key}
                        placeholder={label}
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        className="w-full border p-2 rounded mb-2"
                      />
                    ))}

                    <select
                      value={form.address_type}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          address_type: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded mb-3"
                    >
                      <option value="HOME">Home</option>
                      <option value="WORK">Work</option>
                      <option value="OTHER">Other</option>
                    </select>

                    <div className="flex gap-3">
                      <button
                        onClick={(e) => saveEdit(addr, e)}
                        className="bg-red-600 text-white px-4 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
