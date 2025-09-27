import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Confirm(){
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const slotId = searchParams.get('slotId');
  const [selection, setSelection] = useState(null);

  useEffect(()=>{
    try{ const v = JSON.parse(localStorage.getItem('book.selection') || 'null'); setSelection(v); } catch { setSelection(null); }
  },[]);

  function submitPlaceholder(e){ e.preventDefault(); alert('Booking flow placeholder - implement POST /api/appointments'); }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-2">Confirm booking</h2>
      <div className="mb-4 text-sm text-zinc-500">Summary</div>

      <div className="p-4 rounded-xl bg-white ring-1 ring-zinc-900/5 mb-4">
        <div className="text-sm">Insurance Type: {selection?.insuranceType || '—'}</div>
        <div className="text-sm">Branch: {selection?.branchId || '—'}</div>
        <div className="text-sm">Session: {sessionId}</div>
        <div className="text-sm">Slot: {slotId}</div>
      </div>

      <form onSubmit={submitPlaceholder} className="space-y-3">
        <div>
          <label className="text-sm block mb-1">Full name</label>
          <input required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm block mb-1">Phone</label>
          <input required className="w-full p-2 border rounded" />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Confirm booking</button>
        </div>
      </form>
    </div>
  );
}
