
"use client"
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Menu, X, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DoctorSidebar } from '@/components/doctor-sidebar';
import { DoctorHeader } from '@/components/doctor-header';
import { DoctorFooter } from '@/components/doctor-footer';
import { getDoctorById } from '@/services/doctorService';
import { Skeleton } from '@/components/ui/skeleton';

function DoctorLayoutContent({ children }) {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <Skeleton className="h-16 w-full mb-4" />
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <DoctorSidebar doctor={doctor} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-4 md:px-6 bg-white border-b border-gray-200 shadow-sm">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Desktop header content */}
          <div className="hidden md:block">
            <DoctorHeader doctor={doctor} />
          </div>

          {/* Mobile header - simplified */}
          <div className="md:hidden flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                DocLink
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
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
        </main>

        {/* Footer */}
        <DoctorFooter />
      </div>
    </div>
  );
}

export default function DoctorLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <Skeleton className="h-16 w-full mb-4" />
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
