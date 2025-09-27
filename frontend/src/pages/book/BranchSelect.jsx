import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function BranchSelect() {
  const { insuranceType } = useParams();
  const [branches, setBranches] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // prefer filtered endpoint if available
    fetch(`/api/branches${insuranceType ? `?insuranceType=${encodeURIComponent(insuranceType)}` : ''}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setBranches)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [insuranceType]);

  const filtered = useMemo(() => branches.filter(b => (b.name||'').toLowerCase().includes(q.toLowerCase()) || (b.address||'').toLowerCase().includes(q.toLowerCase())), [branches, q]);

  function choose(branch) {
    try { localStorage.setItem('book.selectedBranch', JSON.stringify(branch)); } catch (err) { console.warn('localStorage write failed', err); }
    navigate(`/book/${insuranceType}/${branch._id}?date=${new Date().toISOString().slice(0,10)}`);
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4">
        <Link to="/book" className="text-sm text-zinc-500">Change type</Link>
        <h2 className="text-xl font-semibold mt-1">Choose a branch</h2>
      </div>

      <div className="mb-4 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search branches..." className="pl-10 pr-3 py-2 rounded-xl border border-zinc-200 w-full" />
        </div>
      </div>

      {loading && <div className="text-sm text-zinc-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(b => (
          <div key={b._id} className="p-4 rounded-xl bg-white ring-1 ring-zinc-900/5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="font-medium">{b.name || b.branchName || b.code}</div>
              <div className="text-sm text-zinc-500 mt-1">{b.address || ''}</div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="text-sm text-zinc-500">Next: —</div>
              <button onClick={()=>choose(b)} className="px-3 py-2 rounded-lg bg-blue-600 text-white">Book</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
