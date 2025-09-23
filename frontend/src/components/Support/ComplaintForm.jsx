import React, { useState } from "react";

const BRANCHES = ["Colombo", "Kandy", "Galle"];
const CATEGORIES = ["Policy Issue", "Claims Delay", "Service Quality", "Other"];

export default function ComplaintForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    category: "",
    description: "",
    file: null,
  });
  const [errors, setErrors] = useState({});

  const setVal = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.branch) e.branch = "Select a branch";
    if (!form.category) e.category = "Select a category";
    if (!form.description.trim()) e.description = "Describe your issue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    submitComplaint();
  };

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const submitComplaint = async () => {
    setServerError(null);
    setSubmitting(true);
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      branch: form.branch,
      category: form.category,
      description: form.description,
      file: form.file ? form.file.name : null
    };

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      // Controller returns { success: true, complaint }
      const saved = data.complaint || data;
        onSubmit?.(saved);
    } catch (err) {
        // No local fallback: surface server error to the user
        setServerError(err.message || 'Failed to submit complaint to server');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ helper classes: white inputs always
  const labelCls = "block text-sm mb-1 text-slate-700";
  const fieldCls =
    "w-full rounded-lg bg-white text-slate-900 placeholder-slate-400 " +
    "border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className={labelCls}>Full Name</label>
        <input
          className={fieldCls}
          value={form.name}
          onChange={(e) => setVal("name", e.target.value)}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label className={labelCls}>Email</label>
        <input
          type="email"
          className={fieldCls}
          value={form.email}
          onChange={(e) => setVal("email", e.target.value)}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label className={labelCls}>Phone</label>
        <input
          className={fieldCls}
          value={form.phone}
          onChange={(e) => setVal("phone", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Branch</label>
        <select
          className={fieldCls}
          value={form.branch}
          onChange={(e) => setVal("branch", e.target.value)}
        >
          <option value="">Select branch</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b.toLowerCase()}>
              {b}
            </option>
          ))}
        </select>
        {errors.branch && <p className="mt-1 text-xs text-red-600">{errors.branch}</p>}
      </div>

      <div>
        <label className={labelCls}>Category</label>
        <select
          className={fieldCls}
          value={form.category}
          onChange={(e) => setVal("category", e.target.value)}
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c.toLowerCase()}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
      </div>

      <div className="md:col-span-2">
        <label className={labelCls}>Description</label>
        <textarea
          rows="4"
          className={fieldCls}
          value={form.description}
          onChange={(e) => setVal("description", e.target.value)}
        />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      <div className="md:col-span-2">
        <label className={labelCls}>Attachment (optional)</label>
        <input
          type="file"
          onChange={(e) => setVal("file", e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
        {form.file && <p className="mt-1 text-xs text-slate-600">Selected: {form.file.name}</p>}
      </div>

      <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </div>
    </form>
  );
}
