'use client';

import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconManageBooking } from '@/components/icons/icon-manage-booking';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Plus } from 'lucide-react';

function NavigationSkeleton() {
  return (
    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
      <Skeleton className="h-10 w-32 rounded-lg" />
      <Skeleton className="h-10 w-28 rounded-lg" />
    </div>
  );
}

function AppointmentNavigation() {
  const navItems = [
    {
      href: '/appointments',
      label: 'All Appointments',
      icon: IconManageBooking,
      color: 'text-blue-600',
    },
    {
      href: '/appointments/book',
      label: 'Book New',
      icon: IconBookAppointment,
      color: 'text-green-600',
    },
  ];

  return (
    <nav className="flex flex-wrap gap-3 justify-center lg:justify-start">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            asChild
            variant="outline"
            size="default"
            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200 min-w-[140px] h-10 shadow-sm"
          >
            <Link href={item.href} className="flex items-center justify-center font-medium">
              <Icon className={`mr-2 h-4 w-4 ${item.color}`} />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

function StatsCards() {
  const stats = [
    {
      icon: Calendar,
      label: 'Total Appointments',
      value: '24',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Clock,
      label: 'Upcoming',
      value: '8',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Users,
      label: 'Doctors',
      value: '12',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function AppointmentsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
        <div className="container mx-auto max-w-7xl flex-grow py-8">

        {/* Content Card */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
