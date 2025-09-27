import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Star,
  Send,
  Pencil,
  Trash2,
  Loader2,
  Mail,
  User,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";

/**
 * Modern, clean FeedbackList
 * - Drop-in replacement for your current component (same props & endpoints)
 * - Pretty cards, skeleton loaders, inline editing, reply threads
 * - Dark-mode friendly (Tailwind classes only)
 *
 * Endpoints used (same as your code):
 *  GET    /api/feedback
 *  POST   /api/feedback/:id/reply           { sender, message, email }
 *  PUT    /api/feedback/:id/reply/:replyId  { message, requesterEmail }
 *  DELETE /api/feedback/:id/reply/:replyId  { requesterEmail } (in axios.delete data)
 *  PUT    /api/feedback/:id                 { message, rating? }
 *  DELETE /api/feedback/:id
 */
export default function FeedbackList({ onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [editing, setEditing] = useState({}); // { [feedbackId]: { message, rating } }
  const [replyEditing, setReplyEditing] = useState({}); // { [replyId]: { feedbackId, message } }
  const [refreshKey, setRefreshKey] = useState(0);

  // Logged-in email (used to allow user to edit/delete their own entries)
  const myEmail = useMemo(() => {
    try {
      return localStorage.getItem("feedbackEmail") || "";
    } catch {
      return "";
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/api/feedback");
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setItems(list);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const kickRefresh = () => setRefreshKey((k) => k + 1);

  // ----- Actions: replies -----
  const submitReply = async (feedbackId) => {
    const content = replyTexts[feedbackId]?.trim();
    if (!content) return;
    try {
      await axios.post(`/api/feedback/${feedbackId}/reply`, {
        sender: "user",
        message: content,
        email: myEmail || undefined,
      });
      setReplyTexts((r) => ({ ...r, [feedbackId]: "" }));
      kickRefresh();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to submit reply");
    }
  };

  const startEditReply = (feedbackId, reply) => {
    const rid = reply._id || reply.id;
    setReplyEditing((s) => ({ ...s, [rid]: { feedbackId, message: reply.message || "" } }));
  };

  const cancelEditReply = (replyId) => {
    setReplyEditing((s) => {
      const copy = { ...s };
      delete copy[replyId];
      return copy;
    });
  };

  const saveEditReply = async (replyId) => {
    const edit = replyEditing[replyId];
    if (!edit) return;
    const msg = (edit.message || "").trim();
    if (!msg) return alert("Reply message cannot be empty");
    try {
      await axios.put(`/api/feedback/${edit.feedbackId}/reply/${replyId}`, {
        message: msg,
        requesterEmail: myEmail || undefined,
      });
      cancelEditReply(replyId);
      kickRefresh();
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to save reply");
    }
  };

  const deleteReply = async (feedbackId, replyId) => {
    if (!confirm("Delete this reply?")) return;
    try {
      await axios.delete(`/api/feedback/${feedbackId}/reply/${replyId}`, {
        data: { requesterEmail: myEmail || undefined },
      });
      kickRefresh();
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to delete reply");
    }
  };

  // ----- Actions: feedback -----
  const startEdit = (fb) => {
    const fid = fb._id || fb.id;
    setEditing((e) => ({ ...e, [fid]: { message: fb.message || "", rating: fb.rating || 0 } }));
  };

  const cancelEdit = (id) => {
    setEditing((e) => {
      const copy = { ...e };
      delete copy[id];
      return copy;
    });
  };

  const saveEdit = async (id) => {
    const data = editing[id];
    if (!data || !data.message?.trim()) return;
    try {
      const payload = { message: data.message.trim() };
      if (data.rating && data.rating >= 1 && data.rating <= 5) payload.rating = data.rating;
      await axios.put(`/api/feedback/${id}`, payload);
      cancelEdit(id);
      kickRefresh();
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to update feedback");
    }
  };

  const deleteFeedback = async (id) => {
    if (!confirm("Delete this feedback?")) return;
    try {
      await axios.delete(`/api/feedback/${id}`);
      kickRefresh();
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to delete feedback");
    }
  };

  // ----- UI helpers -----
  const Stars = ({ value = 0 }) => (
    <div className="flex items-center gap-0.5 text-yellow-500" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < value ? "" : "opacity-20"}`} fill={i < value ? "currentColor" : "none"} />
      ))}
    </div>
  );

  const Skeleton = () => (
    <div className="animate-pulse bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="mt-3 h-3 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="mt-6 h-10 w-full bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
  );

  // ----- Rendering -----
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-6 flex items-center justify-center">
        <div className="w-full max-w-3xl space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-red-50 text-red-700 p-5">
          <div className="font-semibold mb-1">Couldn’t load feedback</div>
          <div className="text-sm opacity-90">{error}</div>
          <button
            onClick={fetchData}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-red-700 hover:bg-red-100"
          >
            <Loader2 className="h-4 w-4 animate-spin" /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Feedback & Replies</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">See what others said and join the discussion.</p>
            </div>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline"
            >
              <ChevronLeft className="h-4 w-4" /> Submit new
            </button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/60 p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-slate-400" />
            </div>
            <div className="font-medium text-slate-700 dark:text-slate-200">No feedback yet</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Be the first to share your thoughts.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((fb) => {
              const fid = fb._id || fb.id;
              const isOwner = myEmail && fb.email === myEmail;
              const editData = editing[fid];
              const createdAt = fb.createdAt ? new Date(fb.createdAt).toLocaleString() : "";

              return (
                <div
                  key={fid}
                  className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/60 p-5 shadow-sm"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-100">
                          {fb.username || fb.fullName || "Anonymous"}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Mail className="h-3.5 w-3.5" /> {fb.email || "—"}
                          {createdAt && <span>• {createdAt}</span>}
                        </div>
                      </div>
                    </div>
                    {typeof fb.rating === "number" && <Stars value={fb.rating || 0} />}
                  </div>

                  {/* Body */}
                  {editData ? (
                    <div className="mt-3 space-y-3">
                      <textarea
                        className="w-full rounded-xl border border-slate-300/80 dark:border-slate-700/60 bg-white dark:bg-slate-950/60 px-3 py-2"
                        rows={3}
                        value={editData.message}
                        onChange={(e) =>
                          setEditing((s) => ({ ...s, [fid]: { ...s[fid], message: e.target.value } }))
                        }
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-300">Rating:</span>
                        <select
                          className="rounded-lg border border-slate-300/80 dark:border-slate-700/60 px-2 py-1"
                          value={editData.rating}
                          onChange={(e) =>
                            setEditing((s) => ({ ...s, [fid]: { ...s[fid], rating: Number(e.target.value) } }))
                          }
                        >
                          <option value={0}>Keep</option>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => saveEdit(fid)}
                        >
                          <Pencil className="h-4 w-4" /> Save
                        </button>
                        <button
                          className="px-3 py-2 rounded-xl border"
                          onClick={() => cancelEdit(fid)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-slate-800 dark:text-slate-100">{fb.message}</p>
                  )}

                  {/* Owner controls */}
                  {isOwner && !editData && (
                    <div className="mt-2 flex gap-3 text-sm">
                      <button className="inline-flex items-center gap-1.5 text-blue-700 dark:text-blue-300 hover:underline" onClick={() => startEdit(fb)}>
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button className="inline-flex items-center gap-1.5 text-red-600 hover:underline" onClick={() => deleteFeedback(fid)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {(fb.replies && fb.replies.length > 0) && (
                    <div className="mt-4 space-y-2">
                      {fb.replies.map((r) => {
                        const rid = r._id || r.id;
                        const canEdit = r.sender === "user" && myEmail && r.email === myEmail;
                        return (
                          <div key={rid} className="rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40 p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-sm text-slate-600 dark:text-slate-300">
                                {r.sender === "admin" ? (
                                  <span className="font-medium text-blue-700 dark:text-blue-300">Admin</span>
                                ) : (
                                  <span className="font-medium">User</span>
                                )}
                                {r.email ? <span className="ml-2 text-xs opacity-70">{r.email}</span> : null}
                              </div>
                              {canEdit && !replyEditing[rid] && (
                                <div className="text-xs flex gap-3">
                                  <button className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300 hover:underline" onClick={() => startEditReply(fid, r)}>
                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                  </button>
                                  <button className="inline-flex items-center gap-1 text-red-600 hover:underline" onClick={() => deleteReply(fid, rid)}>
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>

                            {replyEditing[rid] ? (
                              <div className="space-y-2">
                                <textarea
                                  className="w-full rounded-lg border border-slate-300/80 dark:border-slate-700/60 bg-white dark:bg-slate-950/60 px-3 py-2"
                                  rows={2}
                                  value={replyEditing[rid].message}
                                  onChange={(e) =>
                                    setReplyEditing((s) => ({ ...s, [rid]: { ...s[rid], message: e.target.value } }))
                                  }
                                />
                                <div className="flex gap-2">
                                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700" onClick={() => saveEditReply(rid)}>
                                    <Pencil className="h-4 w-4" /> Save
                                  </button>
                                  <button className="px-3 py-1.5 rounded-lg border" onClick={() => cancelEditReply(rid)}>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-800 dark:text-slate-100">{r.message}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add reply */}
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyTexts[fid] || ""}
                        onChange={(e) => setReplyTexts((r) => ({ ...r, [fid]: e.target.value }))}
                        placeholder="Write a reply…"
                        className="flex-1 rounded-xl border border-slate-300/80 dark:border-slate-700/60 bg-white dark:bg-slate-950/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                      <button
                        onClick={() => submitReply(fid)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Send className="h-4 w-4" /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
