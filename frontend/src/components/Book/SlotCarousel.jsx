import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SlotCard from './SlotChip';

export default function SlotCarousel({ allSlots, sessions, onSelectSlot }) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef(null);
  const slotWrapperRef = useRef(null);
  const [slotsPerPage, setSlotsPerPage] = useState(5);
  const [slotPixelWidth, setSlotPixelWidth] = useState(160);

  const totalPages = Math.max(1, Math.ceil(allSlots.length / slotsPerPage));

  // Measure slot width dynamically to compute pages
  useEffect(() => {
    const measure = () => {
      const wrapper = slotWrapperRef.current;
      if (!wrapper) return;
      const slotEl = wrapper.querySelector('[data-slot]');
      const gap = 12; // tailwind gap-3 ~ 12px
      if (slotEl) {
        const rect = slotEl.getBoundingClientRect();
        const computedWidth = Math.round(rect.width + gap);
        setSlotPixelWidth(computedWidth);
        // compute how many fit in visible width
        const visible = Math.max(1, Math.floor((wrapper.clientWidth - 8) / computedWidth));
        setSlotsPerPage(visible);
        // adjust current page if needed
        setCurrentPage(prev => Math.min(prev, Math.ceil(allSlots.length / visible) - 1));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [allSlots.length]);

  const scrollToPage = useCallback((pageIndex) => {
    if (scrollRef.current) {
      const scrollLeft = pageIndex * slotPixelWidth * slotsPerPage;
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      setCurrentPage(pageIndex);
    }
  }, [slotPixelWidth, slotsPerPage]);

  const handlePrevious = () => { if (currentPage > 0) scrollToPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages - 1) scrollToPage(currentPage + 1); };

  const handleScroll = useCallback(() => {
    if (scrollRef.current && slotPixelWidth > 0) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const newPage = Math.round(scrollLeft / (slotPixelWidth * slotsPerPage));
      setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
    }
  }, [slotPixelWidth, slotsPerPage, totalPages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (allSlots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No slots available for this date
      </div>
    );
  }

  const totalSlots = allSlots.length;

  return (
    <div className="relative">
      {/* Header with slot count and navigation */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600 font-medium">
          Total slots ({totalSlots})
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={`p-1.5 rounded-md transition-colors duration-150 ${
                currentPage === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className={`p-1.5 rounded-md transition-colors duration-150 ${
                currentPage === totalPages - 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Slots container */}
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-1"
          style={{ scrollSnapType: 'x mandatory' }}
          aria-hidden={allSlots.length === 0}
        >
          <div ref={slotWrapperRef} className="flex items-start">
            {allSlots.map((slot, idx) => {
              const session = sessions.find(s => s.slots?.includes(slot));
              return (
                <div key={`${session?._id}-${idx}`} style={{ scrollSnapAlign: 'start' }}>
                  <SlotCard 
                    slot={slot} 
                    onClick={() => onSelectSlot(session, slot)} 
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Gradient fade effects */}
        <div className="absolute left-0 top-0 bottom-2 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
      </div>
      
      {/* Enhanced Dot Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentPage 
                  ? 'bg-blue-600 shadow-lg scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}