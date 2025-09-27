import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertCircle, MapPin } from 'lucide-react';
import SlotCarousel from '../../components/Book/SlotCarousel';

const pad2 = (n)=>String(n).padStart(2,'0');
const toYMD = (d)=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const nextDays = (startYMD, n=7) => { const [y,m,d] = startYMD.split('-').map(Number); const base = new Date(y,m-1,d); return Array.from({length:n},(_,i)=>{ const dd=new Date(base); dd.setDate(base.getDate()+i); return toYMD(dd); }); };


export default function Schedule(){
  const { insuranceType, branchId } = useParams();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date') || toYMD(new Date());
  const [startDate, setStartDate] = useState(dateParam);
  const [sessionsByDate, setSessionsByDate] = useState({});
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const weekDays = useMemo(()=> nextDays(startDate, 7), [startDate]);

  // Load branch details and other locations
  useEffect(() => {
    fetch('/api/branches')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        setBranches(data);
        const branch = data.find(b => b._id === branchId);
        setCurrentBranch(branch);
      })
      .catch(console.error);
  }, [branchId]);

  // Load sessions for all visible days
  const loadSessionsForWeek = useCallback(async () => {
    setLoading(true); setError(null);
    try{
      const promises = weekDays.map(async (dy) => {
        const res = await fetch(`/api/sessions?branchId=${encodeURIComponent(branchId)}&date=${encodeURIComponent(dy)}`);
        if(!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        return [dy, data];
      });
      const results = await Promise.all(promises);
      const newSessions = Object.fromEntries(results);
      setSessionsByDate(newSessions);
    }catch(e){ setError(String(e)); }
    finally{ setLoading(false); }
  }, [branchId, weekDays]);

  useEffect(() => { loadSessionsForWeek(); }, [loadSessionsForWeek]);

  function onSelectSlot(session, slot){
    try{ localStorage.setItem('book.selection', JSON.stringify({ insuranceType, branchId, sessionId: session._id, slotStart: slot.startTime })); }catch(e){ console.warn(e); }
    navigate(`/book/${insuranceType}/${branchId}/confirm?slotId=${encodeURIComponent(slot.startTime)}&sessionId=${session._id}`);
  }

  function navigateWeek(direction) {
    const [y,m,d] = startDate.split('-').map(Number);
    const base = new Date(y,m-1,d);
    base.setDate(base.getDate() + (direction * 7));
    setStartDate(toYMD(base));
  }

  function SlotCard({ slot, onClick }) {
    const { startTime, capacity = 0, booked = 0 } = slot || {};
    const available = capacity - booked;
    const isFull = available <= 0;
    const timeStr = new Date(startTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});

    
    return (
      <button 
        onClick={onClick} 
        disabled={isFull}
        className={`min-w-[160px] p-4 rounded-lg border-2 text-left transition-all ${
          isFull 
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
            : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-lg'
        }`}
      >
        <div className="relative">
          {/* Status indicator bar at top */}
          <div className={`absolute -top-4 left-0 right-0 h-1 rounded-t-lg ${
            isFull ? 'bg-red-400' : 'bg-green-400'
          }`} />
          
          <div className="mb-3">
            <div className="font-semibold text-blue-600 text-lg">{timeStr}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Time</div>
          </div>
          
          <div className="mb-3">
            <div className="text-lg font-semibold">{available > 0 ? available : 0}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Available slots</div>
          </div>
          
          <div className="mb-3">
            <div className="text-lg font-semibold">{booked}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Booked</div>
          </div>
          
          <div className={`mt-4 px-3 py-2 rounded-full text-center text-sm font-medium ${
            isFull 
              ? 'bg-gray-500 text-white' 
              : 'bg-blue-600 text-white'
          }`}>
            {isFull ? 'Full' : 'Available'}
          </div>
        </div>
      </button>
    );
  }

  const otherBranches = branches.filter(b => b._id !== branchId).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 -m-6 lg:-m-8">
      {/* Mobile: Show main content only, hide sidebar on small screens */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">{currentBranch?.name || 'Branch Schedule'}</h2>
                <p className="text-xs text-gray-600">{currentBranch?.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => navigateWeek(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => navigateWeek(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile Month Display */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-700">
              {new Date(startDate).toLocaleDateString(undefined, {month:'long', year:'numeric'})}
            </h3>
          </div>
        </div>

        {/* Mobile Day Rows */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading && <div className="text-center py-8 text-gray-500">Loading sessions...</div>}
          {error && <div className="text-center py-8 text-red-600">{error}</div>}
          
          <div className="space-y-4 max-w-sm mx-auto">
            {weekDays.map(dayDate => {
              const sessions = sessionsByDate[dayDate] || [];
              const allSlots = sessions.flatMap(s => s.slots || []);
              
              return (
                <div key={dayDate} className="bg-white rounded-2xl border border-gray-200 shadow-lg">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {new Date(dayDate).toLocaleDateString(undefined, {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'short'
                        })}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <SlotCarousel 
                      allSlots={allSlots}
                      sessions={sessions}
                      onSelectSlot={onSelectSlot}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop: Sidebar + Main Content */}
      <div className="hidden lg:flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[420px] xl:w-[520px] bg-white border-r border-gray-200 flex flex-col shadow-lg">
        {/* Branch Info - stacked so name/address use one line */}
        <div className="p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-sm">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="font-bold text-gray-900 text-lg leading-tight truncate whitespace-nowrap">
              {currentBranch?.name || currentBranch?.branchName || 'ServSync Branch'}
            </h1>
            <p className="text-gray-600 text-sm mt-1 truncate whitespace-nowrap">{currentBranch?.address || 'Loading...'}</p>
          </div>
          <div className="mt-4">
            <button className="text-blue-600 text-sm hover:underline font-semibold transition-colors hover:text-blue-700">
              Terms and Conditions
            </button>
          </div>
        </div>

        {/* Special Note - icon on top, wider text area */}
        <div className="mb-8 px-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-none min-h-[170px] flex flex-col items-center text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
            <h3 className="font-bold text-red-800 mb-2 text-lg">Special note</h3>
            <p className="text-red-700 text-sm leading-relaxed max-w-[260px]">
              Please arrive 15 minutes before your appointment time. Bring valid identification and any required documents. Appointments can be rescheduled up to 2 hours before the scheduled time.
            </p>
          </div>
        </div>

        {/* Also Available */}
        <div className="flex-1 px-8 pb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-blue-800 mb-4 text-lg">Also available at</h3>
            <div className="space-y-3">
              {otherBranches.map(branch => (
                <div key={branch._id} className="flex items-center gap-3 text-sm text-blue-700 hover:text-blue-800 transition-colors cursor-pointer p-2 rounded-lg hover:bg-blue-100">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{branch.name || branch.branchName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header with Date Navigation */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateWeek(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">
                {new Date(startDate).toLocaleDateString(undefined, {month:'long', year:'numeric'})}
              </h2>
              <button 
                onClick={() => navigateWeek(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Day Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weekDays.map(dy => {
              const sessions = sessionsByDate[dy] || [];
              const totalSessions = sessions.length;
              return (
                <div key={dy} className="min-w-max">
                  <div className="text-center p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(dy).toLocaleDateString(undefined, {weekday:'short'})}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(dy).toLocaleDateString(undefined, {day:'2-digit', month:'short'})}
                    </div>
                    <div className="mt-1 text-xs text-blue-600 font-medium">
                      {totalSessions} sessions
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Rows */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading && <div className="text-center py-8 text-gray-500">Loading sessions...</div>}
          {error && <div className="text-center py-8 text-red-600">{error}</div>}

          <div className="max-w-6xl mx-auto space-y-4">
            {weekDays.map(dayDate => {
              const sessions = sessionsByDate[dayDate] || [];
              const allSlots = sessions.flatMap(s => s.slots || []);

              return (
                <div key={dayDate} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {new Date(dayDate).toLocaleDateString(undefined, {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4">
                    <SlotCarousel 
                      allSlots={allSlots}
                      sessions={sessions}
                      onSelectSlot={onSelectSlot}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
