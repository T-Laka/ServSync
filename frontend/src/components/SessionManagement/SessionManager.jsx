// src/components/SessionManagement/SessionManager.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function SessionManager() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sessions</h1>
        <Link
          to="/admin/sessions/create"
          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
        >
          + Create Session
        </Link>
      </div>

      {/* your list/table here */}
      <div className="p-4 rounded-xl bg-white border">No sessions yet.</div>
    </div>
  );
}
