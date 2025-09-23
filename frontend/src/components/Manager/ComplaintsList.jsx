import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  Trash2,
  Eye,
  RefreshCcw,
  BadgeAlert,
  BadgeCheck,
  AlertTriangle,
  Clock4,
} from "lucide-react";

const http = axios.create({ withCredentials: false });

// No hardcoded dummy complaints — show backend data and merge with any local fallback entries

function normalizeToArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

// status chip helpers
const statusMeta = {
  pending: { text: "Pending", class: "bg-amber-50 text-amber-700 border-amber-200", Icon: Clock4 },
  "in-progress": { text: "In Progress", class: "bg-blue-50 text-blue-700 border-blue-200", Icon: RefreshCcw },
  resolved: { text: "Resolved", class: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: BadgeCheck },
  escalated: { text: "Escalated", class: "bg-rose-50 text-rose-700 border-rose-200", Icon: AlertTriangle },
};

function StatusPill({ value }) {
  const key = (value || "").toLowerCase();
  const meta = statusMeta[key] || { text: value || "-", class: "bg-zinc-50 text-zinc-700 border-zinc-200", Icon: BadgeAlert };
  const { text, class: cls, Icon } = meta;
  return (
    <span className={`inline-flex items-center gap-1.5 border text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>
      <Icon size={14} /> {text}
    </span>
  );
}

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await http.get("/api/complaints");
      const list = normalizeToArray(res?.data);
      // merge with any locally saved complaints (from the form fallback)
      const rawLocal = localStorage.getItem('complaints');
      const localList = rawLocal ? JSON.parse(rawLocal) : [];
      // avoid duplicates by referenceId or id
      const combined = [...list];
      for (const l of localList) {
        const exists = combined.some((c) => (c._id && c._id === l._id) || (c.referenceId && c.referenceId === l.referenceId) || (l.id && c._id === l.id));
        if (!exists) combined.push(l);
      }
      setComplaints(combined);
    } catch (e) {
      try {
        const raw = localStorage.getItem('complaints');
        const parsed = raw ? JSON.parse(raw) : [];
        setComplaints(parsed);
      } catch {
        setComplaints([]);
      }
      setError('Using local fallback data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const base = Array.isArray(complaints) ? complaints : [];

  const filtered = useMemo(() => {
    const f1 = statusFilter
      ? base.filter((c) => (c?.status || "").toLowerCase() === statusFilter)
      : base;
    const f2 = branchFilter
      ? f1.filter((c) => ((c?.branch || c?.customer?.branch || "") + "").toLowerCase() === branchFilter)
      : f1;
    if (!q.trim()) return f1;
    const s = q.trim().toLowerCase();
    return f1.filter((c) => {
      const hay = `${c.referenceId} ${c.customer?.name} ${c.customer?.email} ${c.category} ${c.status} ${c.branch || c.customer?.branch || ""} ${c.description}`.toLowerCase();
      return hay.includes(s);
    });
  }, [base, statusFilter, branchFilter, q]);

  const handleDelete = (identifier) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    setComplaints((prev) => prev.filter((c) => (c._id || c.id) !== identifier));
    // also remove from localStorage fallback if present
    try {
      const raw = localStorage.getItem('complaints');
      if (raw) {
        const parsed = JSON.parse(raw).filter((c) => (c.id || c._id) !== identifier);
        localStorage.setItem('complaints', JSON.stringify(parsed));
      }
    } catch {}
  };

  const Toolbar = () => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>
        <p className="text-sm text-zinc-500">Track, filter, and resolve customer complaints efficiently.</p>
      </div>

      <div className="flex w-full sm:w-auto items-center gap-2">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur border rounded-xl px-3 py-2 shadow-sm w-full sm:w-80 focus-within:ring-2 focus-within:ring-blue-500">
          <Search size={16} className="text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by ref, name, category…"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <div className="relative">
          <select
            id="status-filter"
            className="appearance-none bg-white border rounded-xl px-3 py-2 pr-8 text-sm shadow-sm hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>

        <div className="relative">
          <select
            id="branch-filter"
            className="appearance-none bg-white border rounded-xl px-3 py-2 pr-8 text-sm shadow-sm hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="">All Branches</option>
            <option value="colombo">Colombo</option>
            <option value="kandy">Kandy</option>
            <option value="galle">Galle</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>

        <button
          onClick={fetchComplaints}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm border shadow-sm bg-white hover:bg-zinc-50"
          title="Refresh"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-b from-zinc-50 to-white min-h-[80vh]">
        <Toolbar />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse">
              <div className="h-4 w-40 bg-zinc-200 rounded" />
              <div className="mt-4 h-3 w-full bg-zinc-200 rounded" />
              <div className="mt-2 h-3 w-3/4 bg-zinc-200 rounded" />
              <div className="mt-6 h-10 w-full bg-zinc-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-zinc-50 to-white min-h-[80vh]">
      <Toolbar />

      {error && (
        <div className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl inline-flex items-center gap-2">
          <BadgeAlert size={14} /> {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto border rounded-2xl bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-zinc-50/80">
            <tr className="text-left text-zinc-600">
              <th className="p-3 text-sm font-medium">Reference ID</th>
              <th className="p-3 text-sm font-medium">Customer</th>
              <th className="p-3 text-sm font-medium">Branch</th>
              <th className="p-3 text-sm font-medium">Category</th>
              <th className="p-3 text-sm font-medium">Status</th>
              <th className="p-3 text-sm font-medium">Submitted</th>
              <th className="p-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <tr key={(c._id || c.id)} className="hover:bg-zinc-50">
                  <td className="p-3 text-blue-600 font-medium">
                    <Link to={`/manager/complaints/${c._id || c.id}`} state={{ complaint: c }}>
                      {c.referenceId || (c.id ? `LOCAL-${c.id.slice(0,8)}` : "-")}
                    </Link>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{c.customer?.name || c.name || "-"}</span>
                      <span className="text-xs text-zinc-500">{c.customer?.email || ""}</span>
                    </div>
                  </td>
                  <td className="p-3">{(c.branch || c.customer?.branch || "-")}</td>
                  <td className="p-3">{c.category || "-"}</td>
                  <td className="p-3"><StatusPill value={c.status} /></td>
                  <td className="p-3">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/manager/complaints/${c._id || c.id}`}
                        state={{ complaint: c }}
                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border hover:bg-zinc-50"
                        title="View"
                      >
                        <Eye size={16} /> View
                      </Link>
                      <button
                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                        onClick={() => handleDelete(c._id || c.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive cards (optional): show below table for mobile-first UIs) */}
      {/*
      <div className="mt-6 grid gap-4 sm:hidden">
        {filtered.map((c) => (
          <div key={(c._id || c.id)} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Link to={`/manager/complaints/${c._id || c.id}`} state={{ complaint: c }} className="font-semibold text-blue-600">
                {c.referenceId}
              </Link>
              <StatusPill value={c.status} />
            </div>
            <div className="mt-2 text-sm text-zinc-700">
              <div className="font-medium">{c.customer?.name}</div>
              <div className="text-zinc-500">{c.customer?.email}</div>
            </div>
            <div className="mt-2 text-sm">{c.category}</div>
            <div className="mt-1 text-xs text-zinc-500">{new Date(c.createdAt).toLocaleString()}</div>
            <div className="mt-3 flex items-center gap-2">
              <Link to={`/manager/complaints/${c._id}`} state={{ complaint: c }} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border hover:bg-zinc-50">
                <Eye size={16} /> View
              </Link>
              <button className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700" onClick={() => handleDelete(c._id)}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      */}
    </div>
  );
}
