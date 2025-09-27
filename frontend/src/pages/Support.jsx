import React, { useState } from "react";
import Modal from "../components/Shared/Modal.jsx";
import ComplaintForm from "../components/Support/ComplaintForm.jsx";

export default function Support() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  const handleSubmitted = (payload) => {
    setOpen(false);
    setToast("✅ Complaint submitted (stored locally). We’ll get back to you!");
    // auto-hide
    setTimeout(() => setToast(""), 3500);
    console.log("Complaint saved:", payload);
  };

  return (
    <section className="space-y-6">
      {toast && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {toast}
        </div>
      )}

      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Support Center</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Browse FAQs or submit a complaint.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm">
          <h3 className="font-medium text-slate-800 dark:text-slate-100">Frequently Asked Questions</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <li>How to book an appointment?</li>
            <li>What documents are required?</li>
            <li>How to reschedule?</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-sm">
          <h3 className="font-medium text-slate-800 dark:text-slate-100">Need more help?</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Click below and submit your complaint. Our team will contact you.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-3 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2"
          >
            Open Form
          </button>
        </div>
      </div>

      {/* Complaint modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Submit a Complaint">
        <ComplaintForm
          onSubmit={handleSubmitted}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </section>
  );
}
