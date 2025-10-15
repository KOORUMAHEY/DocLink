'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Form from '@/doctor/pages/Form';

function DoctorFormContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  if (!doctorId) {
    return (
      <div className="p-6">
        <p className="text-red-600">Doctor ID is required</p>
      </div>
    );
  }

  return <Form doctorId={doctorId} />;
}

export default function DoctorFormPage() {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    }>
      <DoctorFormContent />
    </Suspense>
  );
}