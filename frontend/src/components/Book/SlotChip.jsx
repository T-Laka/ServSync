import React from 'react';

export default function SlotChip({ slot, onClick }){
  const { startTime, capacity=0, booked=0 } = slot || {};
  const availableSlots = Math.max(0, capacity - booked);
  const isFullyBooked = availableSlots === 0;
  
  // Determine status bar color
  const getStatusColor = () => {
    if (isFullyBooked) return 'bg-red-500';
    if (availableSlots <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
  <div data-slot className="flex-shrink-0 w-32 sm:w-36 lg:w-40 bg-white border border-gray-200 rounded-md p-2 transition-all duration-150">
      {/* Status bar */}
      <div className={`w-full h-1 ${getStatusColor()} rounded-full mb-2`}></div>
      
      {/* Time */}
      <div className="text-blue-600 text-xs sm:text-sm font-semibold mb-0.5">
        {new Date(startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12: true})}
      </div>
      <div className="text-[10px] text-gray-400 mb-1">Time</div>
      
      {/* Available slots */}
      <div className="text-sm font-semibold text-gray-900 mb-0.5">
        {availableSlots}
      </div>
      <div className="text-[10px] text-gray-400 mb-1">Available</div>
      
      {/* Booked count */}
      <div className="text-sm font-semibold text-gray-900 mb-1">
        {booked}
      </div>
      <div className="text-[10px] text-gray-400 mb-2">Booked</div>
      
      {/* Available button */}
      <button 
        onClick={onClick}
        disabled={isFullyBooked}
        className={`w-full py-1 px-2 rounded-md text-[12px] font-medium transition-colors duration-150 ${
          isFullyBooked 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        aria-pressed={isFullyBooked ? 'false' : 'true'}
      >
        {isFullyBooked ? 'Full' : 'Book'}
      </button>
    </div>
  );
}
