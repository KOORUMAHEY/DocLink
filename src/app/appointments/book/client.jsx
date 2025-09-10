
'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

export function BookAppointmentClient({ children }) {
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');

  // Clone the child element and pass the preselectedDoctorId as a prop
  const childWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { preselectedDoctorId });
    }
    return child;
  });

  return <>{childWithProps}</>;
}
