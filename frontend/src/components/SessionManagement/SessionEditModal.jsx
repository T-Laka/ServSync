import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';

// Modal for editing a session: adjust slots, capacity, and mark holiday
export default function SessionEditModal({ session, onClose, onSaved }) {
  const [slots, setSlots] = useState([]);
  const [holidaysFlag, setHolidaysFlag] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      // copy slots so we can edit safely
      setSlots((session.slots || []).map(s => ({ ...s })));
      setHolidaysFlag(!!session.holidaysFlag);
      setError(null);
    }
  }, [session]);

  if (!session) return null;

  const branch = session._branch || null; // passed by manager for lookup
  const counterName = branch ? (branch.counters || []).find(c => String(c._id) === String(session.counterId))?.name : session.counterId;

  function updateSlot(idx, field, value) {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  function addSlot() {
    // default to serviceDate day with 09:00 - 09:30
    const day = session.serviceDate.slice(0,10);
    const startIso = `${day}T09:00:00.000Z`;
    const endIso = `${day}T09:30:00.000Z`;
    setSlots(prev => ([...prev, { startTime: startIso, endTime: endIso, capacity: 1, booked: 0 }]));
  }

  function removeSlot(idx) {
    setSlots(prev => prev.filter((_, i) => i !== idx));
  }

  function hhmmFromIso(iso) {
    try { return new Date(iso).toISOString().slice(11,16); } catch { return '00:00'; }
  }

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      const payload = { slots: slots.map(s => ({ startTime: s.startTime, endTime: s.endTime, capacity: Number(s.capacity || 1), booked: Number(s.booked || 0), overbook: Number(s.overbook || 0) })), holidaysFlag };
      const res = await fetch(`/api/sessions/${session._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message || body || `Server ${res.status}`);
      onSaved && onSaved(body);
      onClose && onClose();
    } catch (err) {
      console.error('Save session failed', err);
      setError(err.message || String(err));
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Edit Session</h3>
            <div className="text-sm text-zinc-500">{branch ? `${branch.name} • Counter: ${counterName}` : `Counter: ${counterName}`}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"><X className="w-4 h-4"/></button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">Mark as holiday</div>
              {/* iOS-style toggle */}
              <button
                onClick={() => setHolidaysFlag(v => !v)}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${holidaysFlag ? 'bg-green-500' : 'bg-zinc-300'}`}
                aria-pressed={holidaysFlag}
              >
                <span className={`absolute left-1 top-0.5 h-5 w-5 bg-white rounded-full shadow transform transition-transform ${holidaysFlag ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="text-sm text-zinc-500">Current: {session.status || 'N/A'}</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Slots</div>
              <div>
                <button onClick={addSlot} className="px-3 py-1 text-sm rounded-lg bg-white border hover:bg-zinc-50">Add slot</button>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-auto">
              {slots.map((s, idx) => (
                <div key={idx} className="p-3 border rounded-lg flex items-center gap-3">
                  <div className="flex flex-col">
                    <label className="text-xs text-zinc-500">Start</label>
                    <input className="w-28 p-2 border rounded text-sm" value={hhmmFromIso(s.startTime)} onChange={e => {
                      const day = session.serviceDate.slice(0,10);
                      const newIso = `${day}T${e.target.value}:00.000Z`;
                      updateSlot(idx, 'startTime', newIso);
                    }} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-zinc-500">End</label>
                    <input className="w-28 p-2 border rounded text-sm" value={hhmmFromIso(s.endTime)} onChange={e => {
                      const day = session.serviceDate.slice(0,10);
                      const newIso = `${day}T${e.target.value}:00.000Z`;
                      updateSlot(idx, 'endTime', newIso);
                    }} />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-zinc-500">Capacity</label>
                    <input type="number" className="w-20 p-2 border rounded text-sm" value={s.capacity} onChange={e => updateSlot(idx, 'capacity', Number(e.target.value))} />
                  </div>
                  <div className="flex-1 text-right">
                    <button onClick={() => removeSlot(idx)} className="px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded bg-white border hover:bg-zinc-50">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'} <Save className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
