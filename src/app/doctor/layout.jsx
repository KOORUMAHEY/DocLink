'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import DoctorLayout from '@/doctor/layout/DoctorLayout';
import { getDoctorById } from '@/features/doctors';
import { Skeleton } from '@/components/ui/skeleton';

function DoctorLayoutContent({ children }) {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      const fetchDoctor = async () => {
        try {
          const doctorData = await getDoctorById(doctorId);
          setDoctor(doctorData);
        } catch (error) {
          console.error('Failed to fetch doctor:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDoctor();
    } else {
      setLoading(false);
    }
  }, [doctorId]);

  if (!doctorId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-4 inline-block">
            <Stethoscope className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor ID Required</h2>
          <p className="text-muted-foreground mb-4">Please log in again to access your dashboard.</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-700 underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex overflow-hidden bg-gray-50">
        <div className="w-[280px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 p-4 flex-shrink-0">
          <Skeleton className="h-16 w-full mb-4 bg-white/10" />
          <Skeleton className="h-20 w-full mb-4 bg-white/10" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full bg-white/10" />
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DoctorLayout doctor={doctor}>
      <Suspense fallback={
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      }>
        {children}
      </Suspense>
    </DoctorLayout>
  );
}

export default function DoctorLayoutWrapper({ children }) {
  return (
    <Suspense fallback={
      <div className="h-screen flex overflow-hidden bg-gray-50">
        <div className="w-[280px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 p-4 flex-shrink-0">
          <Skeleton className="h-16 w-full mb-4 bg-white/10" />
          <Skeleton className="h-20 w-full mb-4 bg-white/10" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full bg-white/10" />
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <DoctorLayoutContent>{children}</DoctorLayoutContent>
    </Suspense>
  );
}
