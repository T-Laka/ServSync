// src/components/SessionManagement/SessionManager.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Search, Filter, Plus, RotateCcw, Edit } from "lucide-react";
import SessionEditModal from './SessionEditModal';

/* helpers */
const pad2 = (n) => String(n).padStart(2, "0");
const toYMD = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const prettyDate = (ymd) => {
  const [y,m,d] = ymd.split("-").map(Number);
  const dt = new Date(y, m-1, d);
  return dt.toLocaleDateString(undefined, { weekday:"long", year:"numeric", month:"long", day:"numeric" });
};
const nextDays = (startYMD, n=14) => {
  const [y,m,d] = startYMD.split("-").map(Number);
  const base = new Date(y, m-1, d);
  return Array.from({length:n},(_,i)=>{ const dd=new Date(base); dd.setDate(base.getDate()+i); return toYMD(dd); });
};
const fmtHMLocal = (iso) => { try { return new Date(iso).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});} catch { return iso; } };
const calcTotals = (sessions=[]) => {
  let slots=0, cap=0, booked=0;
  sessions.forEach(s => (s.slots||[]).forEach(sl => { slots++; cap+=+sl.capacity||0; booked+=+sl.booked||0; }));
  return { sessions:sessions.length, slots, cap, booked, pct: cap ? Math.min(100, Math.round((booked/cap)*100)) : 0 };
};
const mergeSlots = (sessions=[]) => {
  const map=new Map();
  sessions.forEach(s => (s.slots||[]).forEach(sl => {
    const k=new Date(sl.startTime).toISOString();
    const prev=map.get(k)||{startTime:sl.startTime,endTime:sl.endTime,capacity:0,booked:0};
    prev.capacity+=+sl.capacity||0; prev.booked+=+sl.booked||0; map.set(k,prev);
  }));
  return [...map.values()].sort((a,b)=> new Date(a.startTime)-new Date(b.startTime));
};
const groupByInsurance = (sessions=[]) => {
  const g=new Map();
  sessions.forEach(s => {
    const k=String(s.insuranceType?._id || s.insuranceType || "");
    if(!g.has(k)) g.set(k, []); g.get(k).push(s);
  });
  return g;
};

export default function SessionManager() {
  const todayYMD = toYMD(new Date());
  const [date, setDate] = useState(todayYMD);
  const [branches, setBranches] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [open, setOpen] = useState({});
  const [cache, setCache] = useState({});
  const [editingSession, setEditingSession] = useState(null);
  const [branchQuery, setBranchQuery] = useState("");
  const [insFilter, setInsFilter] = useState("");

  useEffect(() => {
    fetch("/api/branches").then(r=>r.ok?r.json():Promise.reject(r.status)).then(setBranches).catch(console.error);
    fetch("/api/insurance-types").then(r=>r.ok?r.json():Promise.reject(r.status)).then(setInsuranceTypes).catch(console.error);
  }, []);
  useEffect(() => { setCache({}); }, [date]);

  const insById = useMemo(() => {
    const m={}; insuranceTypes.forEach(t => m[String(t._id)]=t.name); return m;
  }, [insuranceTypes]);

  const filteredBranches = useMemo(() => {
    if(!branchQuery.trim()) return branches;
    const q=branchQuery.toLowerCase();
    return branches.filter(b =>
      (b.name||b.code||b.branchName||"").toLowerCase().includes(q) ||
      (b.address||"").toLowerCase().includes(q)
    );
  }, [branches, branchQuery]);

  async function toggleBranch(branchId) {
    setOpen(prev => ({ ...prev, [branchId]: !prev[branchId] }));
    const hit=cache[branchId];
    if(!hit || hit.date!==date){
      setCache(prev=>({ ...prev, [branchId]: { date, loading:true, error:null, sessions:[] }}));
      try{
        const res=await fetch(`/api/sessions?branchId=${encodeURIComponent(branchId)}&date=${encodeURIComponent(date)}`);
        if(!res.ok) throw new Error(`Failed to load sessions (${res.status})`);
        const data=await res.json();
        setCache(prev=>({ ...prev, [branchId]: { date, loading:false, error:null, sessions:data }}));
      }catch(e){
        setCache(prev=>({ ...prev, [branchId]: { date, loading:false, error:e.message||String(e), sessions:[] }}));
      }
    }
  }

  const dayPills = nextDays(todayYMD, 14);

  return (
    <div className="space-y-5 bg-zinc-50 min-h-screen">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-white to-zinc-50/70 backdrop-blur ring-1 ring-zinc-900/5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg md:text-xl font-semibold">Sessions</h1>
            <span className="hidden md:inline text-sm text-zinc-500">— {prettyDate(date)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-zinc-400" />
              <input
                value={branchQuery}
                onChange={e=>setBranchQuery(e.target.value)}
                placeholder="Search branch..."
                className="pl-8 pr-3 py-2 rounded-xl border border-zinc-200/70 bg-white text-sm shadow-inner ring-1 ring-inset ring-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 absolute left-2 top-2.5 text-zinc-400" />
              <select
                value={insFilter}
                onChange={e=>setInsFilter(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl border border-zinc-200/70 bg-white text-sm ring-1 ring-inset ring-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All insurance types</option>
                {insuranceTypes.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>

            <input
              type="date"
              value={date}
              onChange={e=>setDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-zinc-200/70 bg-white text-sm ring-1 ring-inset ring-zinc-900/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={()=>setDate(todayYMD)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200/70 bg-white text-sm ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-50 transition"
              title="Jump to today"
            >
              <RotateCcw className="w-4 h-4" /> Today
            </button>

            <Link
              to="/admin/sessions/create"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm shadow-sm hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4" /> Create Session
            </Link>
          </div>
        </div>

        {/* date pills */}
        <div className="max-w-6xl mx-auto px-4 pb-3 overflow-x-auto">
          <div className="flex gap-2">
            {dayPills.map(dy => (
              <button
                key={dy}
                onClick={()=>setDate(dy)}
                className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition-shadow ${
                  dy===date
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm"
                    : "bg-white border-zinc-200/70 ring-1 ring-zinc-900/5 hover:shadow-sm"
                }`}
                title={prettyDate(dy)}
              >
                {new Date(dy).toLocaleDateString(undefined, { month:"short", day:"numeric" })}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* header */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-1 text-sm text-zinc-500">Showing sessions for</div>
        <div className="text-xl font-semibold">{prettyDate(date)}</div>
      </div>

      {/* Branch accordion list */}
      <div className="max-w-6xl mx-auto px-4 space-y-3">
        {filteredBranches.length === 0 ? (
          <div className="p-6 rounded-2xl border border-zinc-200/70 bg-white/90 ring-1 ring-zinc-900/5 text-zinc-600 shadow-sm">
            No branches found.
          </div>
        ) : filteredBranches.map(b => {
          const bId = b._id;
          const hit = cache[bId] || {};
          const sessions = (hit.sessions || []).filter(s => !insFilter || String(s.insuranceType?._id || s.insuranceType) === insFilter);
          const totals = calcTotals(sessions);

          return (
            <div
              key={bId}
              className="rounded-2xl border border-transparent bg-white/90 ring-1 ring-zinc-900/5 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* header */}
              <button
                onClick={()=>toggleBranch(bId)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-50/60"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ring-1 ring-zinc-900/5 bg-white/80 text-zinc-600 transition-transform ${open[bId] ? "rotate-90" : ""}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-zinc-900">{b.name || b.branchName || b.code}</div>
                    <div className="text-xs text-zinc-500">{b.address || ""}</div>
                  </div>
                </div>

                <div className="min-w-[260px] flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-zinc-500">Sessions</div>
                    <div className="font-semibold">{totals.sessions}</div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-xs text-zinc-500">Slots</div>
                    <div className="font-semibold">{totals.slots}</div>
                  </div>
                  <div className="w-44">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>Occupancy</span><span>{totals.pct}%</span>
                    </div>
                    <div className="h-2 mt-1 bg-zinc-100 rounded-full overflow-hidden ring-1 ring-inset ring-zinc-900/5">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${totals.pct}%` }} />
                    </div>
                  </div>
                </div>
              </button>

              {/* body */}
              {open[bId] && (
                <div className="border-t border-zinc-200/70 bg-white/70">
                  <div className="p-4">
                    {hit.loading && (
                      <div className="animate-pulse">
                        <div className="h-4 w-1/3 bg-zinc-200 rounded mb-3"></div>
                        <div className="flex gap-2">
                          <div className="h-20 w-36 bg-zinc-100 rounded"></div>
                          <div className="h-20 w-36 bg-zinc-100 rounded"></div>
                          <div className="h-20 w-36 bg-zinc-100 rounded"></div>
                        </div>
                      </div>
                    )}

                    {!hit.loading && hit.error && (
                      <div className="text-sm text-red-600">{hit.error}</div>
                    )}

                    {!hit.loading && !hit.error && sessions.length === 0 && (
                      <div className="text-sm text-zinc-500">No sessions for this date.</div>
                    )}

                    {!hit.loading && !hit.error && sessions.length > 0 && (
                      <div className="space-y-4">
                        {Array.from(groupByInsurance(sessions).entries()).map(([insId, list]) => {
                          const insName = insById[insId] || insId || "Unknown";
                          const merged = mergeSlots(list);
                          return (
                            <div key={insId} className="rounded-xl ring-1 ring-zinc-900/5 bg-white/70 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-zinc-900">{insName}</div>
                                <div className="text-xs text-zinc-500">{list.length} session(s)</div>
                              </div>

                              {/* show per-session rows with edit buttons */}
                              <div className="space-y-2">
                                {list.map(sess => (
                                  <div key={sess._id} className="p-2 rounded-md border flex items-center justify-between">
                                    <div>
                                      <div className="font-medium">Counter: {sess.counterId}</div>
                                      <div className="text-xs text-zinc-500">Slots: {(sess.slots||[]).length} • Status: {sess.status} • Holiday: {sess.holidaysFlag ? 'Yes' : 'No'}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button onClick={()=>setEditingSession(sess)} className="px-2 py-1 rounded bg-white border inline-flex items-center gap-2 text-sm"><Edit className="w-4 h-4"/> Edit</button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* also show merged slots as overview */}
                              {merged.length === 0 ? (
                                <div className="text-sm text-zinc-500 mt-2">No slots.</div>
                              ) : (
                                <div className="overflow-x-auto mt-2">
                                  <div className="flex gap-3 py-1">
                                    {merged.map((sl, idx) => (
                                      <div key={idx} className="min-w-[160px] p-3 rounded-lg bg-white/80 ring-1 ring-zinc-900/5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="text-sm font-medium text-zinc-900">{fmtHMLocal(sl.startTime)} – {fmtHMLocal(sl.endTime)}</div>
                                        <div className="text-[11px] uppercase tracking-wide text-zinc-500">Booked / Capacity</div>
                                        <div className="mt-1 font-semibold">{sl.booked} / {sl.capacity}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Edit modal */}
      {editingSession && (
        <SessionEditModal
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSaved={(updated) => {
            // update cache where this session lives
            setCache(prev => {
              const copy = { ...prev };
              for (const bid of Object.keys(copy)) {
                const cs = copy[bid].sessions || [];
                const idx = cs.findIndex(s => String(s._id) === String(updated._id));
                if (idx !== -1) {
                  cs[idx] = updated;
                  copy[bid] = { ...copy[bid], sessions: cs };
                }
              }
              return copy;
            });
          }}
        />
      )}
    </div>
  );
}

// place modal render at bottom of file (outside main return is fine but inside module)
