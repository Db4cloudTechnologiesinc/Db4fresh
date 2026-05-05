import { useState } from "react";
import axios from "axios";

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState([]);

  /* ================= FILE SELECT ================= */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage("");

    if (selectedFile) {
      previewFile(selectedFile);
    }
  };

  /* ================= PREVIEW EXCEL ================= */
  const previewFile = async (file) => {
    const data = await file.arrayBuffer();
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    setPreview(json.slice(0, 5)); // show first 5 rows
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        "http://localhost:4000/api/products/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Products uploaded successfully");
      setFile(null);
      setPreview([]);

    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📦 Bulk Product Upload</h2>

      {/* FILE INPUT */}
      <input type="file" accept=".xlsx,.csv" onChange={handleFileChange} />

      {/* PREVIEW */}
      {preview.length > 0 && (
        <div style={styles.preview}>
          <h4>Preview (First 5 rows)</h4>
          <table>
            <thead>
              <tr>
                {Object.keys(preview[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BUTTON */}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Products"}
      </button>

      {/* MESSAGE */}
      {message && <p>{message}</p>}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    maxWidth: "600px",
  },
  preview: {
    marginTop: "20px",
    overflowX: "auto",
  },
};