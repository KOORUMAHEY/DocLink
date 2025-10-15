'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Dashboard from '@/doctor/pages/Dashboard';

function DoctorDashboardContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  if (!doctorId) {
    return (
      <div className="p-6">
        <p className="text-red-600">Doctor ID is required</p>
      </div>
    );
  }

  return <Dashboard doctorId={doctorId} />;
}

export default function DoctorDashboardPage() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    }>
      <DoctorDashboardContent />
    </Suspense>
  );
}
