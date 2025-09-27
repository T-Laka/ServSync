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

  function updateSlot(idx, field, value) {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  function addSlot() {
    setSlots(prev => ([...prev, { startTime: session.serviceDate, endTime: session.serviceDate, capacity: 1, booked: 0 }]));
  }

  function removeSlot(idx) {
    setSlots(prev => prev.filter((_, i) => i !== idx));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl bg-white rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Session — {session._id}</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 rounded-lg bg-gray-100"><X className="w-4 h-4"/></button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm">Mark as holiday</label>
            <input type="checkbox" checked={holidaysFlag} onChange={e => setHolidaysFlag(e.target.checked)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Slots</div>
              <div>
                <button onClick={addSlot} className="px-2 py-1 text-sm rounded-lg bg-white border">Add slot</button>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-auto">
              {slots.map((s, idx) => (
                <div key={idx} className="p-2 border rounded-lg flex items-center gap-2">
                  <input className="w-36 p-1 border rounded" value={new Date(s.startTime).toISOString().slice(11,16)} onChange={e => {
                    // keep date part same as session.serviceDate but update time portion
                    const day = session.serviceDate.slice(0,10);
                    const newIso = `${day}T${e.target.value}:00.000Z`;
                    updateSlot(idx, 'startTime', newIso);
                  }} />
                  <input className="w-36 p-1 border rounded" value={new Date(s.endTime).toISOString().slice(11,16)} onChange={e => {
                    const day = session.serviceDate.slice(0,10);
                    const newIso = `${day}T${e.target.value}:00.000Z`;
                    updateSlot(idx, 'endTime', newIso);
                  }} />
                  <input type="number" className="w-20 p-1 border rounded" value={s.capacity} onChange={e => updateSlot(idx, 'capacity', Number(e.target.value))} />
                  <button onClick={() => removeSlot(idx)} className="p-2 rounded bg-red-50 text-red-600">Remove</button>
                </div>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-3 py-2 rounded bg-white border">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-green-600 text-white flex items-center gap-2">{saving ? 'Saving...' : 'Save'} <Save className="w-4 h-4"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
