import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Star,
  StarHalf,
  Trash2,
  Send,
  Edit3,
  X,
  MessageCircle,
  Mail,
  UserRound,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react";

/**
 * Drop-in replacement for your current FeedbackList.
 * - Tailwind-only styling (no extra UI lib)
 * - Pretty header with search + filter
 * - Card UI with avatars, rating stars, chips, actions
 * - Chat-style replies with inline edit/delete for admin replies
 * - Smooth micro-interactions (focus/hover)
 */
export default function FeedbackList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [editing, setEditing] = useState({}); // { [replyId]: { message, feedbackId } }

  // UI state
  const [q, setQ] = useState("");
  const [minStars, setMinStars] = useState(0);
  const [showOnlyWithReplies, setShowOnlyWithReplies] = useState(false);

  // Load data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/api/feedback");
      // backend returns array of feedback
      setItems(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filters
  const filtered = useMemo(() => {
    const needle = (q || "").trim().toLowerCase();
    return items.filter((fb) => {
      // rating filter: coerce to number
      const rating = Number(fb.rating || 0);
      if (minStars && rating < Number(minStars)) return false;

      // replies filter: treat replies as array defensively
      const replies = Array.isArray(fb.replies) ? fb.replies : [];
      if (showOnlyWithReplies && replies.length === 0) return false;

      // search across username, email, message and reply messages
      const parts = [fb.username, fb.email, fb.message]
        .map((p) => (p == null ? "" : String(p)))
        .concat(replies.map((r) => (r && r.message) ? String(r.message) : ""));
      const hay = parts.join(" ").toLowerCase();
      return needle === "" ? true : hay.includes(needle);
    });
  }, [items, q, minStars, showOnlyWithReplies]);

  // --- helpers ---
  const avatarFromName = (name = "?") => name.trim().charAt(0).toUpperCase() || "?";

  const Rating = ({ value = 0 }) => {
    const full = Math.floor(value);
    const hasHalf = value - full >= 0.5;
    const total = 5;
    return (
      <div className="flex items-center gap-0.5" aria-label={`${value} star rating`}>
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`s${i}`} size={16} className="fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalf && (
          <StarHalf size={16} className="fill-yellow-400 text-yellow-400" />
        )}
        {Array.from({ length: total - full - (hasHalf ? 1 : 0) }).map((_, i) => (
          <Star key={`e${i}`} size={16} className="text-zinc-300" />
        ))}
      </div>
    );
  };

  // Actions
  const deleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await axios.delete(`/api/feedback/${id}`);
      fetchData();
    } catch (e) {
      alert(e?.response?.data?.error || e?.message || "Failed to delete feedback");
    }
  };

  const addAdminReply = async (feedbackId) => {
    const msg = (replyTexts[feedbackId] || "").trim();
    if (!msg) return;
    try {
      await axios.post(`/api/feedback/${feedbackId}/reply`, {
        sender: "admin",
        message: msg,
      });
      setReplyTexts((s) => ({ ...s, [feedbackId]: "" }));
      fetchData();
    } catch (e) {
      alert(e?.response?.data?.error || e?.message || "Failed to add reply");
    }
  };

  const startEditReply = (feedbackId, reply) => {
    const rid = String(reply._id || reply.id);
    setEditing((s) => ({ ...s, [rid]: { message: reply.message || "", feedbackId } }));
  };

  const cancelEditReply = (replyId) => {
    setEditing((s) => {
      const copy = { ...s };
      delete copy[replyId];
      return copy;
    });
  };

  const saveEditReply = async (replyId) => {
    const edit = editing[replyId];
    if (!edit) return;
    const newMsg = (edit.message || "").trim();
    if (!newMsg) {
      alert("Reply message cannot be empty");
      return;
    }
    try {
      // manager is acting as admin; include override
      await axios.put(`/api/feedback/${edit.feedbackId}/reply/${replyId}`, { message: newMsg, asAdmin: true });
      cancelEditReply(replyId);
      fetchData();
    } catch (e) {
      alert(e?.response?.data?.error || e?.message || "Failed to save reply");
    }
  };

  const deleteReply = async (feedbackId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      // axios.delete does not allow a body in some environments; pass as query param
      await axios.delete(`/api/feedback/${feedbackId}/reply/${replyId}?asAdmin=true`);
      fetchData();
    } catch (e) {
      alert(e?.response?.data?.error || e?.message || "Failed to delete reply");
    }
  };

  // UI bits
  const Toolbar = () => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feedback Management</h1>
        <p className="text-sm text-zinc-500">Review, reply, and keep the experience great ✨</p>
      </div>

      <div className="flex w-full sm:w-auto items-center gap-2">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur border rounded-xl px-3 py-2 shadow-sm w-full sm:w-72 focus-within:ring-2 focus-within:ring-blue-500">
          <Search size={16} className="text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search feedback, names, emails…"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-xl px-3 py-2 pr-8 text-sm shadow-sm hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={minStars}
              onChange={(e) => setMinStars(Number(e.target.value))}
              title="Minimum rating"
            >
              <option value={0}>All ratings</option>
              <option value={5}>5★ only</option>
              <option value={4}>4★+</option>
              <option value={3}>3★+</option>
              <option value={2}>2★+</option>
              <option value={1}>1★+</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>

          <button
            onClick={() => setShowOnlyWithReplies((s) => !s)}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm border shadow-sm transition ${
              showOnlyWithReplies
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:bg-zinc-50"
            }`}
          >
            <Filter size={16} /> Replies
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <Toolbar />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-200" />
                <div className="h-4 w-40 bg-zinc-200 rounded" />
              </div>
              <div className="mt-4 h-3 w-full bg-zinc-200 rounded" />
              <div className="mt-2 h-3 w-3/4 bg-zinc-200 rounded" />
              <div className="mt-2 h-3 w-2/3 bg-zinc-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Toolbar />
        <div className="mt-6 p-4 text-red-700 bg-red-50 border border-red-200 rounded-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-zinc-50 to-white min-h-[80vh]">
      <Toolbar />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 border rounded-2xl bg-white shadow-sm">
            <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <MessageCircle className="text-blue-600" />
            </div>
            <p className="mt-3 font-medium">No feedback matched your filters</p>
            <p className="text-sm text-zinc-500">Try clearing the search or lowering the rating filter.</p>
          </div>
        )}

        {filtered.map((fb) => (
          <div key={fb._id} className="group bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            {/* header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold shadow-sm">
                  {avatarFromName(fb.username || "Anonymous")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold leading-none">
                      {fb.username || "Anonymous"}
                    </span>
                    {fb.email ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border">
                        <Mail size={12} /> {fb.email}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border">
                        <UserRound size={12} /> No email
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                    <Rating value={fb.rating} />
                    <span>•</span>
                    <time>{new Date(fb.createdAt).toLocaleString()}</time>
                  </div>
                </div>
              </div>

              <button
                className="opacity-0 group-hover:opacity-100 transition text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-sm"
                onClick={() => deleteFeedback(fb._id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>

            <p className="mt-3 text-zinc-800 whitespace-pre-wrap">{fb.message}</p>

            {/* replies */}
            {fb.replies?.length > 0 && (
              <div className="mt-4 space-y-2">
                {fb.replies.map((r) => {
                  const rid = String(r._id || r.id);
                  return (
                    <div key={rid} className={`rounded-2xl p-3 border ${
                      r.sender === "admin" ? "bg-blue-50/60 border-blue-100" : "bg-zinc-50 border-zinc-200"
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-zinc-600 flex items-center gap-2">
                          <span className={`font-medium ${r.sender === "admin" ? "text-blue-700" : "text-zinc-700"}`}>
                            {r.sender === "admin" ? "Admin" : "User"}
                          </span>
                        </div>
                        {r.sender === "admin" && !editing[rid] && (
                          <div className="text-xs flex gap-3">
                            <button
                              className="text-blue-600 hover:underline inline-flex items-center gap-1"
                              onClick={() => startEditReply(fb._id, r)}
                            >
                              <Edit3 size={14} /> Edit
                            </button>
                            <button
                              className="text-red-600 hover:underline inline-flex items-center gap-1"
                              onClick={() => deleteReply(fb._id, rid)}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {editing[rid] ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full border rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            value={editing[rid].message}
                            onChange={(e) =>
                              setEditing((s) => ({
                                ...s,
                                [rid]: { ...s[rid], message: e.target.value },
                              }))
                            }
                          />
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                              onClick={() => saveEditReply(rid)}
                            >
                              Save
                            </button>
                            <button
                              className="px-3 py-1.5 border rounded-lg text-sm"
                              onClick={() => cancelEditReply(rid)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-zinc-800 text-sm whitespace-pre-wrap">{r.message}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* composer */}
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add an admin reply…"
                  value={replyTexts[fb._id] || ""}
                  onChange={(e) => setReplyTexts((s) => ({ ...s, [fb._id]: e.target.value }))}
                />
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl inline-flex items-center gap-2"
                  onClick={() => addAdminReply(fb._id)}
                >
                  <Send size={16} /> Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
