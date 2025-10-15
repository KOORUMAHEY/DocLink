'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Profile from '@/doctor/pages/Profile';

function DoctorProfileContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  if (!doctorId) {
    return (
      <div className="p-6">
        <p className="text-red-600">Doctor ID is required</p>
      </div>
    );
  }

  return <Profile doctorId={doctorId} />;
}

export default function DoctorProfilePage() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    }>
      <DoctorProfileContent />
    </Suspense>
  );
}
