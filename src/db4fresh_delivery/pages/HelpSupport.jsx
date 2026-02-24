import { useEffect, useState } from "react";
import axios from "axios";

export default function HelpSupport() {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/delivery/support",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTickets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("issue_type", issueType);
      formData.append("description", description);
      if (file) formData.append("screenshot", file);

      await axios.post(
        "http://localhost:4000/api/delivery/support",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Ticket submitted successfully");
      setIssueType("");
      setDescription("");
      setFile(null);
      fetchTickets();
    } catch (error) {
      alert("Failed to submit ticket");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

      {/* Raise Ticket Form */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 space-y-4">
        <select
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Issue Type</option>
          <option value="Payment Issue">Payment Issue</option>
          <option value="Order Issue">Order Issue</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Account Issue">Account Issue</option>
        </select>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue"
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Ticket
        </button>
      </div>

      {/* Ticket History */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="font-semibold mb-4">Your Tickets</h2>

        {tickets.length === 0 ? (
          <p>No tickets raised yet.</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="border-b py-3">
              <p className="font-semibold">{ticket.issue_type}</p>
              <p className="text-sm text-gray-600">
                {ticket.description}
              </p>
              <p className="text-xs mt-1">
                Status:{" "}
                <span
                  className={
                    ticket.status === "Resolved"
                      ? "text-green-600"
                      : "text-orange-600"
                  }
                >
                  {ticket.status}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}