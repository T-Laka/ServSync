import React, { useEffect, useState } from "react";

export default function FeedbackList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [editing, setEditing] = useState({}); // { [replyId]: { message, feedbackId } }

  // Load dummy data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Dummy data for now
      const dummy = [
        {
          _id: "f1",
          username: "John Doe",
          email: "john@example.com",
          rating: 4,
          message: "The queue was too long, please improve waiting times.",
          replies: [
            {
              _id: "r1",
              sender: "admin",
              message: "Thanks for your feedback, we are working on this.",
            },
          ],
        },
        {
          _id: "f2",
          username: "Jane Smith",
          email: "jane@example.com",
          rating: 5,
          message: "Excellent service, the staff were very helpful!",
          replies: [],
        },
        {
          _id: "f3",
          username: "Anonymous",
          email: "",
          rating: 2,
          message: "I couldn’t book an appointment online.",
          replies: [
            {
              _id: "r2",
              sender: "admin",
              message: "We fixed the booking issue, please try again.",
            },
            {
              _id: "r3",
              sender: "user",
              message: "Okay, I will try again. Thanks.",
            },
          ],
        },
      ];

      setItems(dummy);
    } catch (e) {
      setError("Failed to load dummy feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mock delete feedback
  const deleteFeedback = (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    setItems((s) => s.filter((fb) => fb._id !== id));
  };

  // Mock add reply
  const addAdminReply = (feedbackId) => {
    const msg = (replyTexts[feedbackId] || "").trim();
    if (!msg) return;

    setItems((s) =>
      s.map((fb) =>
        fb._id === feedbackId
          ? {
              ...fb,
              replies: [
                ...fb.replies,
                {
                  _id: "r" + Date.now(),
                  sender: "admin",
                  message: msg,
                },
              ],
            }
          : fb
      )
    );
    setReplyTexts((s) => ({ ...s, [feedbackId]: "" }));
  };

  // Start editing
  const startEditReply = (feedbackId, reply) => {
    setEditing((s) => ({
      ...s,
      [reply._id]: { message: reply.message || "", feedbackId },
    }));
  };

  // Cancel editing
  const cancelEditReply = (replyId) => {
    setEditing((s) => {
      const copy = { ...s };
      delete copy[replyId];
      return copy;
    });
  };

  // Save edited reply
  const saveEditReply = (replyId) => {
    const edit = editing[replyId];
    if (!edit) return;
    const newMsg = (edit.message || "").trim();
    if (!newMsg) {
      alert("Reply message cannot be empty");
      return;
    }

    setItems((s) =>
      s.map((fb) =>
        fb._id === edit.feedbackId
          ? {
              ...fb,
              replies: fb.replies.map((r) =>
                r._id === replyId ? { ...r, message: newMsg } : r
              ),
            }
          : fb
      )
    );
    cancelEditReply(replyId);
  };

  // Delete a reply
  const deleteReply = (feedbackId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    setItems((s) =>
      s.map((fb) =>
        fb._id === feedbackId
          ? { ...fb, replies: fb.replies.filter((r) => r._id !== replyId) }
          : fb
      )
    );
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading…</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-700 bg-red-50 border border-red-200 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Feedback Management</h1>
      <div className="space-y-4">
        {items.length === 0 && (
          <div className="bg-white border rounded p-4 text-gray-600">
            No feedback found.
          </div>
        )}
        {items.map((fb) => (
          <div
            key={fb._id}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
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
            <p className="mt-3 text-gray-800 whitespace-pre-wrap">
              {fb.message}
            </p>

            <div className="mt-2 flex gap-3 text-sm">
              <button
                className="text-red-600 hover:underline"
                onClick={() => deleteFeedback(fb._id)}
              >
                Delete Feedback
              </button>
            </div>

            {fb.replies?.length > 0 && (
              <div className="mt-4 space-y-2">
                {fb.replies.map((r) => (
                  <div key={r._id} className="bg-gray-50 border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-600">
                        {r.sender === "admin" ? (
                          <span className="font-medium text-blue-700">
                            Admin
                          </span>
                        ) : (
                          <span className="font-medium">User</span>
                        )}
                      </div>
                      {r.sender === "admin" && !editing[r._id] && (
                        <div className="text-xs flex gap-3">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => startEditReply(fb._id, r)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => deleteReply(fb._id, r._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {editing[r._id] ? (
                      <div className="space-y-2">
                        <textarea
                          className="w-full border rounded p-2"
                          rows={2}
                          value={editing[r._id].message}
                          onChange={(e) =>
                            setEditing((s) => ({
                              ...s,
                              [r._id]: {
                                ...s[r._id],
                                message: e.target.value,
                              },
                            }))
                          }
                        />
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded"
                            onClick={() => saveEditReply(r._id)}
                          >
                            Save
                          </button>
                          <button
                            className="px-3 py-1.5 border rounded"
                            onClick={() => cancelEditReply(r._id)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-800 whitespace-pre-wrap">
                        {r.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="Add an admin reply…"
                  value={replyTexts[fb._id] || ""}
                  onChange={(e) =>
                    setReplyTexts((s) => ({
                      ...s,
                      [fb._id]: e.target.value,
                    }))
                  }
                />
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  onClick={() => addAdminReply(fb._id)}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
