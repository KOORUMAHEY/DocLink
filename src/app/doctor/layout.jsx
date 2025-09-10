
"use client"
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Bell, Stethoscope, Home, Calendar, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function DoctorNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  const doctorNavItems = [
      { href: `/doctor?id=${doctorId}`, label: 'Dashboard', icon: Home },
      { href: `/doctor/appointments?id=${doctorId}`, label: 'Appointments', icon: Calendar },
      { href: `/doctor/patients?id=${doctorId}`, label: 'My Patients', icon: Users },
  ];

  if (!doctorId) return null;

  return (
    <nav className="hidden md:flex gap-2">
        {doctorNavItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href.split('?')[0];
          return (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                )}
            >
                <Icon className="h-4 w-4" />
                {item.label}
            </Link>
          );
        })}
    </nav>
  );
}

export default function DoctorLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
       <header className="sticky top-0 flex h-20 items-center gap-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-md px-6 md:px-8 z-50 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              DocLink Doctor Portal
            </h1>
        </div>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial">
                 <Suspense fallback={
                   <div className="flex gap-2">
                     {[...Array(3)].map((_, i) => (
                       <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                     ))}
                   </div>
                 }>
                    <DoctorNavLinks />
                </Suspense>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
            </Button>
             <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-gray-100">
                Exit Portal
            </Link>
        </div>
       </header>
       <main className="flex flex-1 flex-col gap-0 p-0">
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 lg:p-8">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Activity className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-64 animate-pulse mt-2"></div>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white rounded-xl shadow-lg animate-pulse"></div>
                  ))}
                </div>
                <div className="h-96 bg-white rounded-xl shadow-lg animate-pulse"></div>
              </div>
            </div>
          }>
            {children}
          </Suspense>
        </main>
    </div>
  );
}
