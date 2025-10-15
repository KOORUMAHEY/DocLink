'use client';

import AppointmentsDebug from '@/components/appointments-debug';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Appointments API Debug</h1>
        <AppointmentsDebug />
      </div>
    </div>
  );
}