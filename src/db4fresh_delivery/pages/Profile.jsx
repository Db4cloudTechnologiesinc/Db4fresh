import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Clock,
  History,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Camera,
  Edit
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/delivery/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setName(res.data?.name || "");
        setPhone(res.data?.phone || "");

        if (res.data?.profile_image) {
          setProfileImage(
            `http://localhost:4000/uploads/${res.data.profile_image}`
          );
        }

      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  /* ================= IMAGE CAPTURE ================= */
  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);

      if (selectedFile) {
        formData.append("profile_image", selectedFile);
      }

      await axios.put(
        "http://localhost:4000/api/delivery/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Profile updated successfully");
      setShowModal(false);

    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    }
  };

  const menuItems = [
    { label: "My Store Location", icon: <MapPin size={18} />, path: "/delivery/store" },
    { label: "Slot History", icon: <Clock size={18} />, path: "/delivery/slots" },
    { label: "Order History", icon: <History size={18} />, path: "/delivery/history" },
    { label: "Help & Support", icon: <HelpCircle size={18} />, path: "/delivery/help" },
    { label: "Documents", icon: <FileText size={18} />, path: "/delivery/documents" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">

          {/* Profile Image */}
          <div className="relative">
            <img
              src={
                profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full"
            >
              <Camera size={14} color="white" />
            </button>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              hidden
              onChange={handleImageCapture}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm text-gray-500">{phone}</p>
            <p className="text-xs text-gray-400">Partner since Jan 2026</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            <Edit size={14} /> Edit
          </button>

        </div>
      </div>

      {/* ================= MENU SECTION ================= */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronRight size={18} className="opacity-60" />
          </button>
        ))}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/delivery/login");
          }}
          className="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full border p-2 rounded mb-3"
            />

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}