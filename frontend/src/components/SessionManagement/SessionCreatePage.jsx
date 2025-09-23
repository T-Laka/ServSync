import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, Plus, Trash2, Settings2, ChevronRight, Check, AlertTriangle } from "lucide-react";

/**
 * SessionCreatePage — Frontend-only (React + Tailwind)
 * ----------------------------------------------------
 * - Dummy data for Branches (with Counters) & Insurance Types
 * - Step 1: Basics (branch, counter, insuranceType, serviceDate — future only)
 * - Step 2: Slot Template (45m slot + 15m break, lunch 12–13) with Generate button
 * - Step 3: Grid (checkbox include, editable start/end, capacity, add custom)
 * - Validations: future date, within day, start<end, non-overlap, capacity>=1
 * - Submit: logs payload shaped for the provided Session.model.js
 *
 * Usage:
 *   import SessionCreatePage from "./SessionCreatePage";
 *   <Route path="/admin/sessions/create" element={<SessionCreatePage />} />
 */

// ------- Dummy Data (replace with API later) -------
const INSURANCE_TYPES = [
  { _id: "it-1", name: "Life" },
  { _id: "it-2", name: "Motor" },
  { _id: "it-3", name: "Health" },
];

const BRANCHES = [
  {
    _id: "br-1",
    branchName: "Colombo HQ",
    counters: [
      { _id: "c-1", label: "Counter 1 (Motor)", insuranceType: "it-2" },
      { _id: "c-2", label: "Counter 2 (Health)", insuranceType: "it-3" },
    ],
  },
  {
    _id: "br-2",
    branchName: "Kandy",
    counters: [
      { _id: "c-3", label: "Counter A (Life)", insuranceType: "it-1" },
      { _id: "c-4", label: "Counter B (Motor)", insuranceType: "it-2" },
    ],
  },
  {
    _id: "br-3",
    branchName: "Galle",
    counters: [
      { _id: "c-5", label: "Counter X (Life)", insuranceType: "it-1" },
    ],
  },
];

// ------- Helpers -------
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

// Combine a local date (YYYY-MM-DD) and local time (HH:mm) into an ISO UTC string
function localDateTimeToUTC(dateStr, timeStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const local = new Date(y, m - 1, d, hh, mm, 0, 0); // local time
  return new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString();
}

// Parse a time string like "09:15" into a Date anchored on given dateStr (local)
function localOn(dateStr, timeStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function fmtHM(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}


function overlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Generate slots for pattern: 45m work + 15m break, lunch 12:00-13:00, until 16:00
function generateTemplateSlots({ dateStr, start = "09:15", end = "16:00", slotLen = 45, breakLen = 15, lunchStart = "12:00", lunchEnd = "13:00", defaultCapacity = 1, }) {
  if (!dateStr) return [];
  const dayStart = localOn(dateStr, start);
  const dayEnd = localOn(dateStr, end);
  const lunchS = localOn(dateStr, lunchStart);
  const lunchE = localOn(dateStr, lunchEnd);

  const slots = [];
  let cursor = new Date(dayStart);

  while (addMinutes(cursor, slotLen) <= dayEnd) {
    const s = new Date(cursor);
    const e = addMinutes(s, slotLen);

    // If slot intersects lunch, skip it
    if (overlap(s, e, lunchS, lunchE)) {
      // jump cursor to lunch end
      cursor = new Date(lunchE);
      continue;
    }

    slots.push({
      _id: uid(),
      checked: true,
      startHM: fmtHM(s),
      endHM: fmtHM(e),
      capacity: defaultCapacity,
    });

    // move cursor by slot + break
    cursor = addMinutes(e, breakLen);
  }

  return slots;
}

export default function SessionCreatePage() {
  // Step 1 — Basics
  const [branchId, setBranchId] = useState("");
  const [counterId, setCounterId] = useState("");
  const [insuranceTypeId, setInsuranceTypeId] = useState("");

  // Service date should be future (min tomorrow)
  const tomorrow = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return toYMD(t);
  }, []);
  const [serviceDate, setServiceDate] = useState("");

  // Step 2 — Template controls
  const [slotLen, setSlotLen] = useState(45);
  const [breakLen, setBreakLen] = useState(15);
  const [startHM, setStartHM] = useState("09:15");
  const [endHM, setEndHM] = useState("16:00");
  const [lunchStart, setLunchStart] = useState("12:00");
  const [lunchEnd, setLunchEnd] = useState("13:00");
  const [defaultCapacity, setDefaultCapacity] = useState(1);

  // Step 3 — Grid of slots
  const [rows, setRows] = useState([]);

  // Errors
  const [errors, setErrors] = useState([]);

  const counters = useMemo(() => {
    const b = BRANCHES.find(b => b._id === branchId);
    return b ? b.counters : [];
  }, [branchId]);

  useEffect(() => {
    // Auto-bind insurance type if counter chosen
    const c = counters.find(c => c._id === counterId);
    if (c) setInsuranceTypeId(c.insuranceType);
  }, [counterId, counters]);

  const bulk = {
    selectAll: () => setRows(r => r.map(x => ({ ...x, checked: true }))),
    deselectAll: () => setRows(r => r.map(x => ({ ...x, checked: false }))),
    selectMorning: () => setRows(r => r.map(x => ({
      ...x,
      checked: x.startHM < lunchStart,
    })) ),
    selectAfternoon: () => setRows(r => r.map(x => ({
      ...x,
      checked: x.startHM >= lunchStart,
    })) ),
  };

  function addCustomRow() {
    setRows(r => ([
      ...r,
      { _id: uid(), checked: true, startHM: "10:00", endHM: "10:45", capacity: defaultCapacity }
    ]));
  }

  function removeRow(id) {
    setRows(r => r.filter(x => x._id !== id));
  }

  function handleRowChange(id, field, value) {
    setRows(r => r.map(x => x._id === id ? { ...x, [field]: value } : x));
  }

  function generate() {
    if (!serviceDate) {
      setErrors(["Pick a service date first."]);
      return;
    }
    setRows(generateTemplateSlots({
      dateStr: serviceDate,
      start: startHM,
      end: endHM,
      slotLen: Number(slotLen),
      breakLen: Number(breakLen),
      lunchStart,
      lunchEnd,
      defaultCapacity: Number(defaultCapacity),
    }));
    setErrors([]);
  }

  function validate() {
    const errs = [];

    if (!branchId) errs.push("Select a branch.");
    if (!counterId) errs.push("Select a counter.");
    if (!insuranceTypeId) errs.push("Select an insurance type.");
    if (!serviceDate) errs.push("Select a service date.");

    if (serviceDate && serviceDate < tomorrow) {
      errs.push("Service date must be in the future (min tomorrow).");
    }

    const picked = rows.filter(r => r.checked);
    if (!picked.length) errs.push("Choose at least one slot.");

    // Check each slot: start < end, capacity >=1
    for (const row of picked) {
      if (!/^\d{2}:\d{2}$/.test(row.startHM) || !/^\d{2}:\d{2}$/.test(row.endHM)) {
        errs.push("Time format must be HH:mm.");
        break;
      }
      const s = localOn(serviceDate, row.startHM);
      const e = localOn(serviceDate, row.endHM);
      if (!(s < e)) {
        errs.push(`Slot ${row.startHM}–${row.endHM}: start must be before end.`);
      }
      if (row.capacity < 1) {
        errs.push(`Slot ${row.startHM}–${row.endHM}: capacity must be ≥ 1.`);
      }
    }

    // Overlap check on picked
    const timeline = picked
      .map(r => ({ s: localOn(serviceDate, r.startHM), e: localOn(serviceDate, r.endHM), label: `${r.startHM}-${r.endHM}` }))
      .sort((a, b) => a.s - b.s);

    for (let i = 1; i < timeline.length; i++) {
      if (timeline[i].s < timeline[i - 1].e) {
        errs.push(`Overlap between ${timeline[i - 1].label} and ${timeline[i].label}.`);
      }
    }

    setErrors(errs);
    return errs.length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const picked = rows.filter(r => r.checked);
    const dayISO = localDateTimeToUTC(serviceDate, "00:00"); // start of day UTC

    const payload = {
      branch: branchId,
      counterId,
      insuranceType: insuranceTypeId,
      serviceDate: dayISO,
      slots: picked.map(r => ({
        startTime: localDateTimeToUTC(serviceDate, r.startHM),
        endTime: localDateTimeToUTC(serviceDate, r.endHM),
        capacity: Number(r.capacity) || 1,
        booked: 0,
        overbook: 0,
      })),
      status: "SCHEDULED",
      holidaysFlag: false,
    };

    // Demo: print to console. Replace with POST to your API
    console.log("SESSION CREATE PAYLOAD", payload);
    alert("Check console for payload. Ready to POST to /api/sessions");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Create Session</h1>
            <p className="text-sm text-neutral-400">Define a service day with selectable time slots.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Stepper */}
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: "Basics", icon: <Settings2 className="w-4 h-4" /> },
              { label: "Template", icon: <Clock className="w-4 h-4" /> },
              { label: "Slots", icon: <Check className="w-4 h-4" /> },
            ].map((s, i) => (
              <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="p-2 rounded-lg bg-neutral-800">{s.icon}</div>
                <span className="text-sm font-medium">{i + 1}. {s.label}</span>
              </li>
            ))}
          </ol>

          {/* Basics */}
          <section className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-4 h-4 text-neutral-400" />
              <h2 className="font-semibold">Step 1 — Basics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-neutral-400">Branch</label>
                <select value={branchId} onChange={e => { setBranchId(e.target.value); setCounterId(""); }} className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2">
                  <option value="">Select branch</option>
                  {BRANCHES.map(b => <option key={b._id} value={b._id}>{b.branchName}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-neutral-400">Counter</label>
                <select value={counterId} onChange={e => setCounterId(e.target.value)} disabled={!branchId} className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2 disabled:opacity-50">
                  <option value="">{branchId ? "Select counter" : "Pick branch first"}</option>
                  {counters.map(c => <option key={c._id} value={c._id}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-neutral-400">Insurance Type</label>
                <select value={insuranceTypeId} onChange={e => setInsuranceTypeId(e.target.value)} className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2">
                  <option value="">Select type</option>
                  {INSURANCE_TYPES.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-neutral-400">Service Date</label>
                <input type="date" min={tomorrow} value={serviceDate} onChange={e => setServiceDate(e.target.value)} className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2" />
              </div>
            </div>
          </section>

          {/* Template */}
          <section className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-neutral-400" />
              <h2 className="font-semibold">Step 2 — Slot Template</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <label className="text-sm text-neutral-400">Start (HH:mm)</label>
                <input value={startHM} onChange={e => setStartHM(e.target.value)} placeholder="09:15" className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2" />
              </div>
              <div>
                <label className="text-sm text-neutral-400">End (HH:mm)</label>
                <input value={endHM} onChange={e => setEndHM(e.target.value)} placeholder="16:00" className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2" />
              </div>
              <div>
                <label className="text-sm text-neutral-400">Slot length (min)</label>
                <input type="number" min={5} value={slotLen} onChange={e => setSlotLen(e.target.value)} className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2" />
              </div>
              <div>
                <label className="text-sm text-neutral-400">Break (min)</label>
                <input type="number" min={0} value={breakLen} onChange={e => setBreakLen(e.target.value)} className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2" />
              </div>
              <div>
                <label className="text-sm text-neutral-400">Lunch start</label>
                <input value={lunchStart} onChange={e => setLunchStart(e.target.value)} placeholder="12:00" className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2" />
              </div>
              <div>
                <label className="text-sm text-neutral-400">Lunch end</label>
                <input value={lunchEnd} onChange={e => setLunchEnd(e.target.value)} placeholder="13:00" className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
              <div>
                <label className="text-sm text-neutral-400">Default capacity</label>
                <input type="number" min={1} value={defaultCapacity} onChange={e => setDefaultCapacity(e.target.value)} className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 p-2" />
              </div>

              <div className="md:col-span-5 flex items-end justify-end gap-3">
                <button type="button" onClick={() => { bulk.selectMorning(); }} className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm">Select morning</button>
                <button type="button" onClick={() => { bulk.selectAfternoon(); }} className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm">Select afternoon</button>
                <button type="button" onClick={() => { bulk.selectAll(); }} className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm">Select all</button>
                <button type="button" onClick={() => { bulk.deselectAll(); }} className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm">Deselect all</button>
                <button type="button" onClick={generate} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-sm font-medium flex items-center gap-2">
                  <Settings2 className="w-4 h-4"/> Generate Slots
                </button>
              </div>
            </div>
          </section>

          {/* Slots grid */}
          <section className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-neutral-400" />
                <h2 className="font-semibold">Step 3 — Select & Edit Slots</h2>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={addCustomRow} className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4"/> Add custom slot
                </button>
              </div>
            </div>

            {rows.length === 0 ? (
              <p className="text-neutral-400 text-sm">No slots yet. Click <b>Generate Slots</b> or add a custom slot.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-400 border-b border-neutral-800">
                      <th className="py-2 pr-4"><input type="checkbox" onChange={(e)=> e.target.checked ? bulk.selectAll() : bulk.deselectAll()} /></th>
                      <th className="py-2 pr-4">Start</th>
                      <th className="py-2 pr-4">End</th>
                      <th className="py-2 pr-4">Capacity</th>
                      <th className="py-2 pr-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r._id} className="border-b border-neutral-800">
                        <td className="py-2 pr-4 align-middle">
                          <input type="checkbox" checked={r.checked} onChange={e => handleRowChange(r._id, "checked", e.target.checked)} />
                        </td>
                        <td className="py-2 pr-4">
                          <input value={r.startHM} onChange={e => handleRowChange(r._id, "startHM", e.target.value)} className="w-28 rounded-lg bg-neutral-800 border border-neutral-700 p-2" />
                        </td>
                        <td className="py-2 pr-4">
                          <input value={r.endHM} onChange={e => handleRowChange(r._id, "endHM", e.target.value)} className="w-28 rounded-lg bg-neutral-800 border border-neutral-700 p-2" />
                        </td>
                        <td className="py-2 pr-4">
                          <input type="number" min={1} value={r.capacity} onChange={e => handleRowChange(r._id, "capacity", Number(e.target.value))} className="w-24 rounded-lg bg-neutral-800 border border-neutral-700 p-2" />
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <button type="button" onClick={() => removeRow(r._id)} className="p-2 rounded-lg bg-red-600/10 border border-red-600/30 hover:bg-red-600/20">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-4 rounded-xl border border-amber-600/40 bg-amber-600/10 text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              <div>
                <div className="font-medium mb-1">Please fix the following:</div>
                <ul className="list-disc list-inside space-y-0.5 text-sm">
                  {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => { setRows([]); setErrors([]); }} className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700">Reset</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 font-medium flex items-center gap-2">
              Create Session <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
