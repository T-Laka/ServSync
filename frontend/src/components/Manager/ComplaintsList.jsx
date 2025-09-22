import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const http = axios.create({
  // baseURL: "http://localhost:5000", // uncomment if API runs separately
  withCredentials: false,
});

// Dummy fallback data
const dummyComplaints = [
  {
    _id: "1",
    referenceId: "C-1001",
    customer: { name: "Nimal Perera" },
    category: "Queue Delay",
    status: "pending",
    createdAt: "2025-09-20T09:30:00Z",
  },
  {
    _id: "2",
    referenceId: "C-1002",
    customer: { name: "Anusha Silva" },
    category: "Appointment Issue",
    status: "in-progress",
    createdAt: "2025-09-21T11:00:00Z",
  },
  {
    _id: "3",
    referenceId: "C-1003",
    customer: { name: "Tharindu Jayasena" },
    category: "Service Quality",
    status: "resolved",
    createdAt: "2025-09-19T14:15:00Z",
  },
  {
    _id: "4",
    referenceId: "C-1004",
    customer: { name: "Sanduni Dissanayake" },
    category: "Branch Facility",
    status: "escalated",
    createdAt: "2025-09-18T10:45:00Z",
  },
];

function normalizeToArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await http.get("/api/complaints");
      const list = normalizeToArray(res?.data);
      if (list.length) {
        setComplaints(list);
      } else {
        setComplaints(dummyComplaints); // fallback
      }
    } catch (e) {
      // If API fails, use localStorage or dummy
      const raw = localStorage.getItem("complaints");
      const parsed = raw ? JSON.parse(raw) : [];
      const list = normalizeToArray(parsed);
      setComplaints(list.length ? list : dummyComplaints);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const base = Array.isArray(complaints) ? complaints : [];
  const filteredComplaints = statusFilter
    ? base.filter((c) => (c?.status || "").toLowerCase() === statusFilter)
    : base;

  const handleDelete = (id) => {
    const ok = window.confirm("Are you sure you want to delete this complaint?");
    if (!ok) return;
    setComplaints((prev) => prev.filter((c) => c._id !== id));
  };

  if (loading) return <div className="p-6 text-center">Loading complaints…</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complaints</h1>

      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium" htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          className="border rounded p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Reference ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Submitted</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="p-3 text-blue-600 font-medium">
                    <Link to={`/admin/complaints/${c._id}`}>
                      {c.referenceId || "-"}
                    </Link>
                  </td>
                  <td className="p-3">{c.customer?.name || c.name || "-"}</td>
                  <td className="p-3">{c.category || "-"}</td>
                  <td className="p-3 capitalize">{c.status || "-"}</td>
                  <td className="p-3">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="p-3">
                    <button
                      className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
