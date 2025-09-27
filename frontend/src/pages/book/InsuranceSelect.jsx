import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';

export default function InsuranceSelect() {
  const [types, setTypes] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('/api/insurance-types')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setTypes)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = types.filter(t => (t.name || '').toLowerCase().includes(q.toLowerCase()));

  function choose(t) {
    // persist selection
    try { localStorage.setItem('book.selectedType', JSON.stringify(t)); } catch (err) { console.warn('localStorage write failed', err); }
    navigate(`/book/${t._id}`);
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-2">Select your insurance type</h1>
      <p className="text-sm text-zinc-500 mb-4">Choose the service you need</p>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search types..." className="pl-10 pr-3 py-2 rounded-xl border border-zinc-200 w-full" />
        </div>
      </div>

      {loading && <div className="text-sm text-zinc-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <button key={t._id} onClick={() => choose(t)} className="text-left p-4 rounded-xl bg-white ring-1 ring-zinc-900/5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-zinc-500 mt-1">{t.description || ''}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-xs text-zinc-400 mt-3">From Rs. 0</div>
          </button>
        ))}
      </div>
    </div>
  );
}
