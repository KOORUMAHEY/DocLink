'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DoctorSidebar } from '@/features/doctors';
import { Menu, X } from 'lucide-react';
import PropTypes from 'prop-types';

export default function DoctorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-semibold text-gray-900">Doctor Portal</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <DoctorSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setSidebarOpen(false);
            }
          }}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-[280px]">
        <main className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

DoctorLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
