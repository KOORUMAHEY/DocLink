'use client';

import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconManageBooking } from '@/components/icons/icon-manage-booking';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Plus } from 'lucide-react';


export default function AppointmentsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
