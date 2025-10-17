
'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export function BookAppointmentClient({ children }) {
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a slight delay for smooth animation entrance
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Clone the child element and pass the preselectedDoctorId as a prop
  const childWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { preselectedDoctorId });
    }
    return child;
  });

  return (
    <div 
      className={`transition-all duration-700 ease-out transform ${
        isLoaded 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
    >
      {childWithProps}
    </div>
  );
}
