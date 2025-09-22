import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FeedbackList({ onBack }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [replyTexts, setReplyTexts] = useState({});
    const [editing, setEditing] = useState({});
    const [replyEditing, setReplyEditing] = useState({}); // track reply edits

    const myEmail = (() => {
        try { return localStorage.getItem("feedbackEmail") || ""; } catch { return ""; }
    })();

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axios.get("http://localhost:5000/feedback");
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Failed to load feedback");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const submitReply = async (feedbackId) => {
        const content = replyTexts[feedbackId]?.trim();
        if (!content) return;
        try {
            await axios.post(`http://localhost:5000/feedback/${feedbackId}/reply`, {
                sender: "user",
                senderEmail: myEmail,
                message: content,
            });
            setReplyTexts((r) => ({ ...r, [feedbackId]: "" }));
            fetchData();
        } catch (e) {
            alert(e?.response?.data?.message || e.message || "Failed to submit reply");
        }
    };

    const startEditReply = (replyId, reply) => {
        setReplyEditing((r) => ({ ...r, [replyId]: { message: reply.message } }));
    };

    const cancelEditReply = (replyId) => {
        setReplyEditing((r) => {
            const copy = { ...r };
            delete copy[replyId];
            return copy;
        });
    };

    const saveEditReply = async (feedbackId, replyId) => {
        const data = replyEditing[replyId];
        if (!data || !data.message?.trim()) return;
        try {
            await axios.put(`http://localhost:5000/feedback/${feedbackId}/reply/${replyId}`, {
                message: data.message,
            });
            cancelEditReply(replyId);
            fetchData();
        } catch (e) {
            alert(e?.response?.data?.message || e.message || "Failed to update reply");
        }
    };

    const deleteReply = async (feedbackId, replyId) => {
        if (!confirm("Delete this reply?")) return;
        try {
            await axios.delete(`http://localhost:5000/feedback/${feedbackId}/reply/${replyId}`);
            fetchData();
        } catch (e) {
            alert(e?.response?.data?.message || e.message || "Failed to delete reply");
        }
    };

    const startEdit = (fb) => {
        const fid = fb._id || fb.id;
        setEditing((e) => ({ ...e, [fid]: { message: fb.message, rating: fb.rating || 0 } }));
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
            const payload = { message: data.message };
            if (data.rating && data.rating >= 1 && data.rating <= 5) payload.rating = data.rating;
            await axios.put(`http://localhost:5000/feedback/${id}`, payload);
            cancelEdit(id);
            fetchData();
        } catch (e) {
            alert(e?.response?.data?.error || e.message || "Failed to update feedback");
        }
    };

    const deleteFeedback = async (id) => {
        if (!confirm("Delete this feedback?")) return;
        try {
            await axios.delete(`http://localhost:5000/feedback/${id}`);
            fetchData();
        } catch (e) {
            alert(e?.response?.data?.error || e.message || "Failed to delete feedback");
        }
    };

    if (loading) return <div className="p-6 text-gray-600">Loading…</div>;
    if (error) return <div className="p-6 text-red-700 bg-red-50 border border-red-200 rounded">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Feedback Management</h1>
            <div className="space-y-4">
                {items.length === 0 && (
                    <div className="bg-white border rounded p-4 text-gray-600">No feedback found.</div>
                )}
                {items.map((fb) => {
                    const fid = fb._id || fb.id;
                    return (
                        <div key={fid} className="bg-white border rounded-xl p-5 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-semibold">{fb.username || "Anonymous"}</div>
                                    <div className="text-gray-500 text-sm">{fb.email}</div>
                                </div>
                                {typeof fb.rating === "number" && (
                                    <div className="text-yellow-500">
                                        {Array.from({ length: fb.rating || 0 }).map((_, i) => (
                                            <span key={i}>⭐</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Feedback edit */}
                            {!editing[fid] && <p className="mt-3 text-gray-800 whitespace-pre-wrap">{fb.message}</p>}
                            {editing[fid] && (
                                <div className="mt-3 space-y-2">
                                    <textarea
                                        className="w-full border rounded-lg p-2"
                                        rows={3}
                                        value={editing[fid].message}
                                        onChange={(e) => setEditing((s) => ({ ...s, [fid]: { ...s[fid], message: e.target.value } }))}
                                    />
                                    <div className="flex gap-2">
                                        <button className="px-3 py-2 bg-blue-600 text-white rounded-lg" onClick={() => saveEdit(fid)}>Save</button>
                                        <button className="px-3 py-2 border rounded-lg" onClick={() => cancelEdit(fid)}>Cancel</button>
                                    </div>
                                </div>
                            )}

                            {/* Feedback edit/delete buttons */}
                            {!editing[fid] && fb.email === myEmail && (
                                <div className="mt-2 flex gap-3 text-sm">
                                    <button className="text-blue-600 hover:underline" onClick={() => startEdit(fb)}>Edit</button>
                                    <button className="text-red-600 hover:underline" onClick={() => deleteFeedback(fid)}>Delete</button>
                                </div>
                            )}

                            {/* Replies */}
                            {fb.replies?.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {fb.replies.map((r) => (
                                        <div key={r._id} className="bg-gray-50 border rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="text-sm text-gray-600">
                                                    {r.sender === "admin"
                                                        ? <span className="font-medium text-blue-700">Admin</span>
                                                        : <span className="font-medium">User</span>}
                                                </div>
                                                {/* User reply edit/delete buttons */}
                                                {r.senderEmail === myEmail && !replyEditing[r._id] && (
                                                    <div className="flex gap-2 text-xs">
                                                        <button className="text-blue-600 hover:underline" onClick={() => startEditReply(r._id, r)}>Edit</button>
                                                        <button className="text-red-600 hover:underline" onClick={() => deleteReply(fid, r._id)}>Delete</button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Reply edit */}
                                            {replyEditing[r._id] ? (
                                                <div className="space-y-2">
                                                    <textarea
                                                        className="w-full border rounded-lg p-2"
                                                        rows={2}
                                                        value={replyEditing[r._id].message}
                                                        onChange={(e) => setReplyEditing((s) => ({ ...s, [r._id]: { ...s[r._id], message: e.target.value } }))}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded" onClick={() => saveEditReply(fid, r._id)}>Save</button>
                                                        <button className="px-3 py-1.5 border rounded" onClick={() => cancelEditReply(r._id)}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-800 whitespace-pre-wrap">{r.message}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add reply input */}
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    value={replyTexts[fid] || ""}
                                    onChange={(e) => setReplyTexts((r) => ({ ...r, [fid]: e.target.value }))}
                                    placeholder="Write a reply…"
                                    className="flex-1 border rounded-lg px-3 py-2"
                                />
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => submitReply(fid)}>Reply</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
