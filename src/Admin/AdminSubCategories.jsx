
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000";

export default function AdminSubCategories() {
  /* ================= STATES ================= */
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [selectedSubId, setSelectedSubId] = useState("NEW");

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get(`${API_BASE}/api/categories`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    setCategories(res.data || []);
  };

  /* ================= LOAD SUBCATEGORIES ================= */
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    fetchSubcategories(categoryId);
  }, [categoryId]);

  const fetchSubcategories = async (catId) => {
    const res = await axios.get(
      `${API_BASE}/api/subcategories/${catId}`
    );
    setSubcategories(res.data || []);
  };

  /* ================= SELECT SUBCATEGORY (FORM) ================= */
  const handleSubcategorySelect = (value) => {
    setSelectedSubId(value);

    if (value === "NEW") {
      setName("");
      setPreview(null);
      setEditImage(null);
      return;
    }

    const sub = subcategories.find(
      (s) => s.id === Number(value)
    );
    if (!sub) return;

    setName(sub.name);
    setPreview(
      sub.image
        ? `${API_BASE}/uploads/subcategories/${sub.image}`
        : null
    );
    setEditImage(null);
  };

  /* ================= SAVE ================= */
  const handleSave = async (e) => {
    e.preventDefault();

    if (!categoryId || !name.trim()) {
      alert("Category and name required");
      return;
    }

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("category_id", categoryId);

    if (selectedSubId === "NEW") {
      if (!image) {
        alert("Image required for new subcategory");
        return;
      }
      fd.append("image", image);

      await axios.post(
        `${API_BASE}/api/subcategories`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
    } else {
      if (editImage) fd.append("image", editImage);

      await axios.put(
        `${API_BASE}/api/subcategories/${selectedSubId}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
    }

    // reset form
    setSelectedSubId("NEW");
    setName("");
    setImage(null);
    setEditImage(null);
    setPreview(null);

    fetchSubcategories(categoryId);
    alert("Saved successfully");
  };

  /* ================= EDIT FROM LIST ================= */
  const handleEditFromList = (sub) => {
    setSelectedSubId(sub.id.toString());
    setName(sub.name);
    setPreview(
      sub.image
        ? `${API_BASE}/uploads/subcategories/${sub.image}`
        : null
    );
    setEditImage(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg space-y-8">
      {/* ================= FORM ================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Add / Update Subcategory
        </h2>

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {/* SUBCATEGORY DROPDOWN */}
          <select
            value={selectedSubId}
            onChange={(e) =>
              handleSubcategorySelect(e.target.value)
            }
            className="border p-3 rounded"
            disabled={!categoryId}
          >
            <option value="NEW">➕ Add New Subcategory</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* CATEGORY */}
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSelectedSubId("NEW");
              setName("");
              setPreview(null);
            }}
            className="border p-3 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* NAME */}
          {selectedSubId === "NEW" ? (
            <input
              type="text"
              placeholder="Subcategory name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded"
            />
          ) : (
            <input
              type="text"
              value={name}
              disabled
              className="border p-3 rounded bg-gray-100"
            />
          )}

          {/* IMAGE */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              if (selectedSubId === "NEW") {
                setImage(file);
              } else {
                setEditImage(file);
              }
              setPreview(URL.createObjectURL(file));
            }}
            className="border p-3 rounded"
          />

          <button className="bg-red-600 text-white rounded px-4 py-3 md:col-span-4">
            Save
          </button>
        </form>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-16 h-16 mt-4 rounded object-cover"
          />
        )}
      </div>

      {/* ================= SUBCATEGORY LIST ================= */}
      {categoryId && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Existing Subcategories
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subcategories.map((sub) => (
              <div
                key={sub.id}
                className="border p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      sub.image
                        ? `${API_BASE}/uploads/subcategories/${sub.image}`
                        : "/no-image.png"
                    }
                    className="w-12 h-12 rounded object-cover"
                    alt={sub.name}
                  />
                  <span className="font-medium">
                    {sub.name}
                  </span>
                </div>

                <button
                  onClick={() => handleEditFromList(sub)}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
