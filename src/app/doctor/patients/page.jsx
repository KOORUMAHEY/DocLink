'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Patients from '@/doctor/pages/Patients';

function DoctorPatientsContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  if (!doctorId) {
    return (
      <div className="p-6">
        <p className="text-red-600">Doctor ID is required</p>
      </div>
    );
  }

  return <Patients doctorId={doctorId} />;
}

export default function DoctorPatientsPage() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    }>
      <DoctorPatientsContent />
    </Suspense>
  );
}
