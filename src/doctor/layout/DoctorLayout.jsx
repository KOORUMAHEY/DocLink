'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { DoctorSidebar } from '@/features/doctors';
import { Menu, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useTheme } from '@/context/theme';
import { cn } from '@/lib/utils';
import { getDoctorById } from '@/features/doctors';

export default function DoctorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  
  // Cache for doctor data to prevent unnecessary refetches
  const doctorCache = useRef(new Map());
  
  const doctorId = searchParams.get('id');

  // Fetch doctor data with caching
  useEffect(() => {
    const fetchDoctor = async () => {
      if (doctorId) {
        // Check cache first
        if (doctorCache.current.has(doctorId)) {
          setDoctor(doctorCache.current.get(doctorId));
          setLoadingDoctor(false);
          return;
        }

        try {
          setLoadingDoctor(true);
          const doctorData = await getDoctorById(doctorId);
          const doctorInfo = doctorData || {};
          
          // Cache the result
          doctorCache.current.set(doctorId, doctorInfo);
          setDoctor(doctorInfo);
        } catch (error) {
          console.error('Failed to fetch doctor data:', error);
          const fallbackData = {};
          doctorCache.current.set(doctorId, fallbackData);
          setDoctor(fallbackData);
        } finally {
          setLoadingDoctor(false);
        }
      } else {
        setLoadingDoctor(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={cn(
      "min-h-screen",
      isDark 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20"
    )}>
      {/* Mobile Header */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 right-0 z-40 border-b px-4 py-3 flex items-center justify-between shadow-sm",
        isDark 
          ? "bg-slate-900 border-white/10" 
          : "bg-white border-gray-200"
      )}>
        <h1 className={cn(
          "text-lg font-semibold",
          isDark ? "text-white" : "text-gray-900"
        )}>Doctor Portal</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isDark 
              ? "hover:bg-white/10" 
              : "hover:bg-gray-100"
          )}
        >
          {sidebarOpen ? (
            <X className={cn(
              "w-5 h-5",
              isDark ? "text-slate-300" : "text-gray-600"
            )} />
          ) : (
            <Menu className={cn(
              "w-5 h-5",
              isDark ? "text-slate-300" : "text-gray-600"
            )} />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <DoctorSidebar 
        doctor={doctor}
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
