import React from 'react';

function pct(booked, cap){ if(!cap) return 0; return Math.round((booked/cap)*100); }

export default function SlotChip({ slot, onClick }){
  const { startTime, endTime, capacity=0, booked=0 } = slot || {};
  const ratio = pct(booked, capacity);
  let status = 'available';
  if(capacity === 0) status = 'full';
  else if(ratio >= 100) status = 'full';
  else if(ratio >= 70) status = 'few';

  const label = `${new Date(startTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} – ${new Date(endTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}, ${booked} of ${capacity} booked, ${status === 'available' ? 'Available' : status === 'few' ? 'Few left' : 'Full'}`;

  return (
    <button onClick={onClick} aria-label={label} className={`p-3 rounded-xl min-w-[160px] text-left shadow-sm ${status==='available' ? 'bg-white ring-1 ring-zinc-900/5' : status==='few' ? 'bg-yellow-50 ring-1 ring-amber-200' : 'bg-zinc-50 ring-1 ring-zinc-200 text-zinc-500'}`}>
      <div className="font-medium">{new Date(startTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} – {new Date(endTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
      <div className="text-xs text-zinc-500 mt-1">{booked} / {capacity}</div>
      <div className="text-xs mt-2">
        {status === 'available' && <span className="text-emerald-600">Available</span>}
        {status === 'few' && <span className="text-amber-600">Few left</span>}
        {status === 'full' && <span className="text-zinc-500">Full</span>}
      </div>
    </button>
  );
}
