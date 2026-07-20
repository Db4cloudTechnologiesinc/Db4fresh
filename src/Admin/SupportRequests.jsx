import React, { useEffect, useMemo, useState } from "react";

export default function SupportRequests() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("http://localhost:4000/api/support/admin")
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.error(err));
  }, []);

  const updateStatus = async (id) => {
    const confirmResolve = window.confirm(
      "Are you sure you want to mark this support request as RESOLVED?"
    );

    if (!confirmResolve) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/support/admin/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "RESOLVED",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.id === id
              ? { ...ticket, status: "RESOLVED" }
              : ticket
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const resolved = tickets.filter(
    (t) => t.status === "RESOLVED"
  ).length;

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase()) ||
        t.subject?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" ? true : t.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tickets, search, filter]);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Support Requests
      </h1>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-blue-100 rounded-lg p-5 shadow">
          <h2 className="text-gray-600 text-sm">
            Total Tickets
          </h2>
          <p className="text-3xl font-bold text-blue-700">
            {total}
          </p>
        </div>

        <div className="bg-orange-100 rounded-lg p-5 shadow">
          <h2 className="text-gray-600 text-sm">
            Open Tickets
          </h2>
          <p className="text-3xl font-bold text-orange-600">
            {open}
          </p>
        </div>

        <div className="bg-green-100 rounded-lg p-5 shadow">
          <h2 className="text-gray-600 text-sm">
            Resolved Tickets
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {resolved}
          </p>
        </div>

      </div>

      {/* Search + Filter */}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

        <input
          type="text"
          placeholder="Search by name, email or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-96"
        />

        <div className="flex gap-2">

          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded ${
              filter === "ALL"
                ? "bg-red-600 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("OPEN")}
            className={`px-4 py-2 rounded ${
              filter === "OPEN"
                ? "bg-orange-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Open
          </button>

          <button
            onClick={() => setFilter("RESOLVED")}
            className={`px-4 py-2 rounded ${
              filter === "RESOLVED"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Resolved
          </button>

        </div>

      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">

        <table className="w-full">

          <thead className="bg-red-600 text-white">

            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Date</th>
            </tr>

          </thead>

          <tbody>

            {filteredTickets.length > 0 ? (

              filteredTickets.map((t) => (

                <tr key={t.id} className="border-b hover:bg-gray-50">

                  <td className="p-3">{t.name}</td>

                  <td className="p-3">{t.email}</td>

                  <td className="p-3">{t.category}</td>

                  <td className="p-3">{t.subject}</td>

                  <td className="p-3">{t.message}</td>

                  <td className="p-3">

                    <span
                      className={
                        t.status === "RESOLVED"
                          ? "text-green-600 font-semibold"
                          : "text-orange-600 font-semibold"
                      }
                    >
                      {t.status}
                    </span>

                  </td>

                  <td className="p-3">

                    {t.status !== "RESOLVED" ? (

                      <button
                        onClick={() => updateStatus(t.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Resolve
                      </button>

                    ) : (

                      <span className="text-green-600 font-semibold">
                        ✓ Resolved
                      </span>

                    )}

                  </td>

                  <td className="p-3">
                    {new Date(
                      t.created_at
                    ).toLocaleDateString()}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="8"
                  className="text-center p-6"
                >
                  No support requests found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}