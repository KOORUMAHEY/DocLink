'use client';

import { useState, useEffect, lazy, Suspense, useMemo, memo } from 'react';
import { getAppointmentsByDoctor, rescheduleAppointment as rescheduleAppointmentService, approveAppointment as approveAppointmentService, rejectAppointment as rejectAppointmentService } from '@/features/appointments/services/appointmentService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
// Removed duplicate import
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Lazy load heavy components
const LazyCalendar = lazy(() => import('@/components/ui/calendar'));
const LazyPopover = lazy(() => import('@/components/ui/popover'));
const LazyAppointmentDetailsPanel = lazy(() => import('@/doctor/components/AppointmentDetailsPanel'));

// Memoized Appointment Card Component
const AppointmentCard = memo(({ 
  appointment, 
  isSelected, 
  onSelect, 
  getStatusColor, 
  getPriorityColor 
}) => (
  <Card 
    className={cn(
      "cursor-pointer transition-all duration-200 hover:shadow-md",
      isSelected 
        ? "ring-2 ring-blue-500 shadow-md" 
        : "hover:shadow-sm"
    )}
    onClick={() => onSelect(appointment)}
  >
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={appointment.patientAvatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {appointment.patientName?.charAt(0) || 'P'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {appointment.patientName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(appointment.appointmentDate).toLocaleDateString()}
            <Clock className="w-3 h-3 ml-2" />
            {appointment.timeSlot}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={getStatusColor(appointment.status)} size="sm">
            {appointment.status}
          </Badge>
          {appointment.healthPriority && (
            <Badge className={getPriorityColor(appointment.healthPriority)} size="sm">
              {appointment.healthPriority}
            </Badge>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
));

AppointmentCard.displayName = 'AppointmentCard';
const AppointmentsLoadingSkeleton = () => (
  <div className="h-screen flex flex-col bg-gray-50">
    {/* Header Skeleton */}
    <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-48" />
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel Skeleton */}
      <div className="w-1/2 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <Skeleton className="w-20 h-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel Skeleton */}
      <div className="w-1/2 bg-gray-50 overflow-hidden flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Skeleton className="w-16 h-16 mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Appointments({ doctorId }) {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all'); // New: time filter state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  const availableTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        console.log('Loading appointments for doctor:', doctorId);
        
        // If no doctorId provided, use a default one for testing
        const targetDoctorId = doctorId || 'doc1';
        console.log('Using doctor ID:', targetDoctorId);
        
        const data = await getAppointmentsByDoctor(targetDoctorId);
        console.log('Received appointments:', data);
        setAppointments(data);
      } catch (error) {
        console.error('Failed to load appointments:', error);
        // Set some sample data for testing if API fails
        setAppointments([
          {
            id: "sample1",
            patientName: "John Doe",
            patientEmail: "john@example.com",
            patientPhone: "+1234567890",
            age: 35,
            gender: "male",
            hospitalId: "P001",
            appointmentDate: new Date(),
            timeSlot: "10:00 AM",
            status: "pending", // Set as pending for doctor approval
            reason: "Regular checkup",
            healthPriority: "normal",
            allergies: "None",
            medications: "Vitamin D",
            bloodType: "O+"
          },
          {
            id: "sample2",
            patientName: "Jane Smith",
            patientEmail: "jane@example.com",
            patientPhone: "+1234567891",
            age: 28,
            gender: "female",
            hospitalId: "P002",
            appointmentDate: new Date(Date.now() + 86400000), // Tomorrow
            timeSlot: "2:30 PM",
            status: "pending", // Set as pending for doctor approval
            reason: "Follow-up consultation",
            healthPriority: "urgent",
            allergies: "Penicillin",
            medications: "None",
            bloodType: "A+"
          },
          {
            id: "sample3",
            patientName: "Robert Johnson",
            patientEmail: "robert@example.com",
            patientPhone: "+1234567892",
            age: 42,
            gender: "male",
            hospitalId: "P003",
            appointmentDate: new Date(Date.now() + 172800000), // Day after tomorrow
            timeSlot: "9:15 AM",
            status: "confirmed", // Already approved
            reason: "Cardiac screening",
            healthPriority: "normal",
            allergies: "None known",
            medications: "Blood pressure medication",
            bloodType: "B+"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [doctorId]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      urgent: 'bg-orange-100 text-orange-800 border-orange-300',
      normal: 'bg-blue-100 text-blue-800 border-blue-300',
      routine: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleMode(false);
    setShowRejectionForm(false);
    setSelectedDate(null);
    setSelectedTime('');
    setRejectionReason('');
  };

  const handleApprove = async () => {
    if (!selectedAppointment) return;
    
    try {
      setActionLoading(true);
      await approveAppointmentService(selectedAppointment.id);
      
      toast({
        title: "Appointment Approved",
        description: "The appointment has been confirmed successfully.",
      });

      handleStatusUpdate(selectedAppointment.id, 'confirmed');
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast({
        title: "Error",
        description: "Failed to approve appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAppointment) return;
    
    try {
      setActionLoading(true);
      await rejectAppointmentService(selectedAppointment.id, rejectionReason);
      
      toast({
        title: "Appointment Rejected",
        description: "The appointment has been rejected.",
      });

      handleStatusUpdate(selectedAppointment.id, 'rejected');
      setShowRejectionForm(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to reject appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedAppointment || !selectedDate || !selectedTime) {
      toast({
        title: "Invalid Selection",
        description: "Please select both date and time for rescheduling.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(true);
      await rescheduleAppointmentService(selectedAppointment.id, selectedDate.toISOString(), selectedTime);
      
      toast({
        title: "Appointment Rescheduled",
        description: `Appointment rescheduled to ${format(selectedDate, 'PPP')} at ${selectedTime}`,
      });

      handleStatusUpdate(selectedAppointment.id, 'confirmed', {
        appointmentDate: selectedDate.toISOString(),
        timeSlot: selectedTime
      });
      
      setRescheduleMode(false);
      setSelectedDate(null);
      setSelectedTime('');
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = (appointmentId, newStatus, updatedData = {}) => {
    setAppointments(prev => 
      prev.map(appointment => {
        if (appointment.id === appointmentId) {
          const updated = { ...appointment, status: newStatus, ...updatedData };
          // Update selected appointment if it's the same one
          if (selectedAppointment?.id === appointmentId) {
            setSelectedAppointment(updated);
          }
          return updated;
        }
        return appointment;
      })
    );
  };  

  // New: time-based filter logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = 
        appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.patientEmail?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;

      // Time filter logic
      let matchesTime = true;
      if (timeFilter !== 'all') {
        const apptDate = new Date(appointment.appointmentDate);
        const now = new Date();
        if (timeFilter === 'today') {
          matchesTime =
            apptDate.getDate() === now.getDate() &&
            apptDate.getMonth() === now.getMonth() &&
            apptDate.getFullYear() === now.getFullYear();
        } else if (timeFilter === 'weekly') {
          // Get start/end of current week (Monday-Sunday)
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay() + 1);
          startOfWeek.setHours(0,0,0,0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23,59,59,999);
          matchesTime = apptDate >= startOfWeek && apptDate <= endOfWeek;
        } else if (timeFilter === 'monthly') {
          matchesTime =
            apptDate.getMonth() === now.getMonth() &&
            apptDate.getFullYear() === now.getFullYear();
        }
      }
      return matchesSearch && matchesFilter && matchesTime;
    });
  }, [appointments, searchQuery, filterStatus, timeFilter]);

  if (loading) {
    return <AppointmentsLoadingSkeleton />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all your appointments
            </p>
            {/* Debug info - remove in production */}
            <p className="text-xs text-gray-500 mt-1">
              Doctor ID: {doctorId || 'Using default (doc1)'}
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Calendar className="w-4 h-4 mr-2" />
            {filteredAppointments.length} Total
          </Badge>
        </div>

        {/* Filters */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by patient name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('confirmed')}
                size="sm"
              >
                Confirmed
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('completed')}
                size="sm"
              >
                Completed
              </Button>
              <Button
                variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('rejected')}
                size="sm"
              >
                Rejected
              </Button>
            </div>
          </div>

          {/* New: Time Filters */}
          <div className="mt-4">
            <div className="flex gap-2">
              <Button
                variant={timeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setTimeFilter('all')}
                size="sm"
              >
                All Time
              </Button>
              <Button
                variant={timeFilter === 'today' ? 'default' : 'outline'}
                onClick={() => setTimeFilter('today')}
                size="sm"
              >
                Today
              </Button>
              <Button
                variant={timeFilter === 'weekly' ? 'default' : 'outline'}
                onClick={() => setTimeFilter('weekly')}
                size="sm"
              >
                Weekly
              </Button>
              <Button
                variant={timeFilter === 'monthly' ? 'default' : 'outline'}
                onClick={() => setTimeFilter('monthly')}
                size="sm"
              >
                Monthly
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Appointments List */}
        <div className="w-1/2 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Appointments List</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && (
              <div className="space-y-3">
                {[...Array(8)].map((_, idx) => (
                  <Skeleton key={`skeleton-${idx}`} className="h-24 w-full" />
                ))}
              </div>
            )}
            {!loading && filteredAppointments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Appointments Found</h3>
                <p className="text-muted-foreground text-center text-sm">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No appointments scheduled yet'}
                </p>
              </div>
            )}
            {!loading && filteredAppointments.length > 0 && (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isSelected={selectedAppointment?.id === appointment.id}
                  onSelect={handleSelectAppointment}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Patient Details */}
        <div className="w-1/2 bg-gray-50 overflow-hidden flex flex-col">
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <Skeleton className="w-16 h-16 mx-auto mb-4" />
                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto" />
              </div>
            </div>
          }>
            <LazyAppointmentDetailsPanel
              selectedAppointment={selectedAppointment}
              rescheduleMode={rescheduleMode}
              setRescheduleMode={setRescheduleMode}
              showRejectionForm={showRejectionForm}
              setShowRejectionForm={setShowRejectionForm}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              rejectionReason={rejectionReason}
              setRejectionReason={setRejectionReason}
              actionLoading={actionLoading}
              handleApprove={handleApprove}
              handleReschedule={handleReschedule}
              handleReject={handleReject}
              availableTimeSlots={availableTimeSlots}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
              LazyPopover={LazyPopover}
              LazyCalendar={LazyCalendar}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
