'use client';

import { useEffect, useRef } from 'react';
import AppointmentsDisplay from '@/app/appointments/appointments-display';

export function AppointmentsPageClient({ appointments, hasSearchQuery }) {
  const resultsRef = useRef(null);

  useEffect(() => {
    if (hasSearchQuery && resultsRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest' 
        });
      }, 100);
    }
  }, [hasSearchQuery, appointments]);

  return (
    <div ref={resultsRef}>
      {hasSearchQuery && <AppointmentsDisplay appointments={appointments} />}
    </div>
  );
}
