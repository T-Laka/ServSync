import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";

// Optional: switch fetch to axios if you prefer, but fetch keeps this file self-contained.

export default function ComplaintDetails() {
  // Route is defined as /manager/complaints/:id
  const { id } = useParams();
  const { state } = useLocation(); // may contain { complaint }
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(state?.complaint || null);
  const [response, setResponse] = useState(state?.complaint?.responseNotes || "");
  const [status, setStatus] = useState(state?.complaint?.status || "pending");
  const [loading, setLoading] = useState(!state?.complaint);
  const [error, setError] = useState("");

  useEffect(() => {
    if (state?.complaint) return; // already have it from Link state

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // 1) Try API
        const res = await fetch(`/api/complaints/${id}`);
        if (res.ok) {
          const data = await res.json();
          setComplaint(data);
          setResponse(data.responseNotes || "");
          setStatus(data.status || "pending");
          setLoading(false);
          return;
        }

        // If API returns not-ok we don't fallback to localStorage; show not found
        setError("Complaint not found on server");
      } catch (e) {
        setError(e?.message || "Failed to load complaint");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, state?.complaint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint) return;

    try {
      // Try API update
      const idToUse = complaint._id || complaint.id;
      const res = await fetch(`/api/complaints/${idToUse}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseNotes: response, status }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Server responded with ${res.status}`);
      }

      alert("Response submitted!");
      navigate("/manager/complaints");
    } catch (e) {
      alert(e?.message || "Failed to submit response");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!complaint) return <div className="p-6 text-center text-red-600">Complaint not found.</div>;

  const createdAt = complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : "-";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Complaint Details</h2>
        <div className="flex gap-2">
          <button className="px-3 py-2 border rounded" onClick={() => navigate(-1)}>
            Back
          </button>
          <Link to="/manager/complaints" className="px-3 py-2 border rounded hidden sm:inline">
            All Complaints
          </Link>
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <p><span className="font-semibold">Reference ID:</span> {complaint.referenceId}</p>
        <p><span className="font-semibold">Name:</span> {complaint.customer?.name || complaint.name || "-"}</p>
        <p><span className="font-semibold">Email:</span> {complaint.customer?.email || complaint.email || "-"}</p>
        <p><span className="font-semibold">Category:</span> {complaint.category}</p>
        <p><span className="font-semibold">Description:</span> {complaint.description || "—"}</p>
        <p><span className="font-semibold">Submitted:</span> {createdAt}</p>
        <p><span className="font-semibold">Current Status:</span> {complaint.status}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Update Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Admin Response</label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your response here..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Response
          </button>
        </div>
      </form>
    </div>
  );
}
