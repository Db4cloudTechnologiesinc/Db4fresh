import { useEffect, useState } from "react";
import axios from "axios";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [file, setFile] = useState(null);

  const documentTypes = [
    "Aadhaar Card",
    "PAN Card",
    "Driving License",
    "Vehicle RC",
    "Bank Passbook"
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/delivery/documents",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDocuments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async () => {
    if (!selectedType || !file) {
      alert("Select document type and file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("document_type", selectedType);
      formData.append("document", file);

      await axios.post(
        "http://localhost:4000/api/delivery/documents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Document uploaded successfully");
      setFile(null);
      setSelectedType("");
      fetchDocuments();

    } catch (error) {
      alert("Upload failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Documents</h1>

      {/* Upload Section */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 space-y-4">

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Document Type</option>
          {documentTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-semibold mb-4">Uploaded Documents</h2>

        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="border-b py-3">
              <p className="font-semibold">{doc.document_type}</p>
              <p className="text-sm">
                Status:{" "}
                <span className={
                  doc.status === "Verified"
                    ? "text-green-600"
                    : doc.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }>
                  {doc.status}
                </span>
              </p>

              <a
                href={`http://localhost:4000/uploads/${doc.file_name}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm"
              >
                View Document
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}