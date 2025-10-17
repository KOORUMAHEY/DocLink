'use client';

import { useState, useEffect, lazy, Suspense, useMemo, memo, useCallback } from 'react';
import { getAppointmentsByDoctor, rescheduleAppointment as rescheduleAppointmentService, approveAppointment as approveAppointmentService, rejectAppointment as rejectAppointmentService } from '@/features/appointments/services/appointmentService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Search, X, Check, Filter, ChevronDown, AlertCircle, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/theme';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Lazy load heavy components
const LazyAppointmentDetailsPanel = lazy(() => import('@/doctor/components/AppointmentDetailsPanel'));

// Memoized Appointment Card Component
const AppointmentCard = memo(({ 
  appointment, 
  isSelected, 
  onSelect, 
  getStatusColor, 
  onApprove,
  onReject,
  isCompact = false
}) => (
  <Card 
    className={cn(
      "cursor-pointer transition-all duration-200 hover:shadow-md border-l-4",
      isSelected ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow-sm",
      appointment.status === 'pending' ? "border-l-yellow-500" : "border-l-blue-500"
    )}
    onClick={() => onSelect(appointment)}
  >
    <CardContent className={cn("p-3 sm:p-4", isCompact && "p-2")}>
      <div className={cn("flex items-start gap-2 sm:gap-3", isCompact && "gap-2")}>
        <Avatar className={cn("w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0", isCompact && "w-8 h-8")}>
          <AvatarImage src={appointment.patientAvatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-bold">
            {appointment.patientName?.charAt(0) || 'P'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
              {appointment.patientName}
            </h3>
            <Badge className={getStatusColor(appointment.status)} size="sm" variant="outline">
              {appointment.status}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{format(new Date(appointment.appointmentDate), 'MMM d')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{appointment.timeSlot}</span>
            </div>
          </div>

          {appointment.reason && (
            <p className="text-xs text-gray-500 mt-1 truncate line-clamp-1">
              {appointment.reason}
            </p>
          )}
        </div>

        {/* Quick Actions for Mobile */}
        {appointment.status === 'pending' && (
          <div className="flex gap-1 flex-shrink-0">
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
              onClick={(e) => {
                e.stopPropagation();
                onApprove(appointment);
              }}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onReject(appointment);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
));

AppointmentCard.displayName = 'AppointmentCard';

// Loading Skeleton
const AppointmentsLoadingSkeleton = () => (
  <div className="space-y-3 sm:space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} className="h-20 sm:h-24 w-full rounded-lg" />
    ))}
  </div>
);

// Filter Bar Component
const FilterBar = memo(({ 
  searchQuery, 
  onSearchChange, 
  selectedStatus, 
  onStatusChange, 
  isDark 
}) => (
  <div className={cn(
    "rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3",
    isDark ? "bg-slate-800" : "bg-white border border-gray-200"
  )}>
    <div className="relative flex-1 min-w-0">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input 
        placeholder="Search patients..." 
        className="pl-8 text-sm h-9 sm:h-10"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    
    <div className="flex gap-2">
      {['all', 'pending', 'confirmed', 'completed'].map((status) => (
        <Button
          key={status}
          size="sm"
          variant={selectedStatus === status ? "default" : "outline"}
          className="text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-3"
          onClick={() => onStatusChange(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Button>
      ))}
    </div>
  </div>
));

FilterBar.displayName = 'FilterBar';

// Main Component
export default function AppointmentsPage() {
  const { toast } = useToast();
  const { isDark } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load appointments
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        // Get doctorId from URL
        const params = new URLSearchParams(window.location.search);
        const doctorId = params.get('id');
        
        if (doctorId) {
          const data = await getAppointmentsByDoctor(doctorId);
          setAppointments(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [toast]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = !searchQuery || 
        apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientPhone?.includes(searchQuery);
      
      const matchesStatus = selectedStatus === 'all' || apt.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchQuery, selectedStatus]);

  // Status colors
  const getStatusColor = useCallback((status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || colors.pending;
  }, []);

  const handleApprove = useCallback(async (appointment) => {
    try {
      setActionLoading(true);
      await approveAppointmentService(appointment.id);
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointment.id ? { ...apt, status: 'confirmed' } : apt
        )
      );
      toast({ title: "Success", description: "Appointment approved" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  }, [toast]);

  const handleReject = useCallback(async (appointment) => {
    try {
      setActionLoading(true);
      await rejectAppointmentService(appointment.id);
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointment.id ? { ...apt, status: 'rejected' } : apt
        )
      );
      toast({ title: "Success", description: "Appointment rejected" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className={cn(
        "min-h-screen p-3 sm:p-6",
        isDark ? "bg-slate-900" : "bg-gray-50"
      )}>
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <AppointmentsLoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen p-3 sm:p-6 lg:p-8",
      isDark ? "bg-slate-900" : "bg-gray-50"
    )}>
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className={cn("text-2xl sm:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            Appointments
          </h1>
          <p className={cn("text-sm sm:text-base", isDark ? "text-gray-400" : "text-gray-600")}>
            {filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'}
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          isDark={isDark}
        />

        {/* Main Content */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Appointments List */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {filteredAppointments.length === 0 ? (
              <Card className={cn(
                "border-0",
                isDark ? "bg-slate-800" : "bg-white"
              )}>
                <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <AlertCircle className={cn("w-12 h-12 mb-4", isDark ? "text-gray-500" : "text-gray-400")} />
                  <h3 className={cn("text-lg font-semibold mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                    No appointments found
                  </h3>
                  <p className={cn("text-sm text-center", isDark ? "text-gray-500" : "text-gray-500")}>
                    {searchQuery ? "Try adjusting your search" : "No appointments to display"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isSelected={selectedAppointment?.id === appointment.id}
                  onSelect={setSelectedAppointment}
                  getStatusColor={getStatusColor}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            )}
          </div>

          {/* Details Panel - Hidden on Mobile */}
          <div className="hidden lg:block">
            {selectedAppointment ? (
              <Suspense fallback={<Skeleton className="h-96 rounded-lg" />}>
                <LazyAppointmentDetailsPanel appointment={selectedAppointment} />
              </Suspense>
            ) : (
              <Card className={cn(
                "border-0",
                isDark ? "bg-slate-800" : "bg-white"
              )}>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Calendar className={cn("w-12 h-12 mb-4", isDark ? "text-gray-500" : "text-gray-400")} />
                  <p className={cn("text-sm text-center", isDark ? "text-gray-400" : "text-gray-600")}>
                    Select an appointment to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
