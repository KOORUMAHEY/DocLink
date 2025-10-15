'use client';

import { useState, useEffect } from 'react';
import { getAppointmentsByDoctor } from '@/features/appointments/services/appointmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, Phone, Mail, Search, Filter, Eye, CheckCircle, XCircle, User2, Stethoscope, FileText, CalendarDays, RotateCcw, Heart, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { 
  rescheduleAppointment as rescheduleAppointmentService, 
  approveAppointment as approveAppointmentService, 
  rejectAppointment as rejectAppointmentService 
} from '@/features/appointments/services/appointmentService';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Appointments({ doctorId }) {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.patientEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
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
            {loading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Appointments Found</h3>
                <p className="text-muted-foreground text-center text-sm">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No appointments scheduled yet'}
                </p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <Card 
                  key={appointment.id} 
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedAppointment?.id === appointment.id 
                      ? "ring-2 ring-blue-500 shadow-md" 
                      : "hover:shadow-sm"
                  )}
                  onClick={() => handleSelectAppointment(appointment)}
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
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Patient Details */}
        <div className="w-1/2 bg-gray-50 overflow-hidden flex flex-col">
          {selectedAppointment ? (
            <>
              {/* Patient Details Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Patient Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User2 className="w-5 h-5" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={selectedAppointment.patientAvatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                            {selectedAppointment.patientName?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">{selectedAppointment.patientName || 'N/A'}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            {selectedAppointment.age && (
                              <span>{selectedAppointment.age} years old</span>
                            )}
                            {selectedAppointment.gender && (
                              <Badge variant="outline">{selectedAppointment.gender}</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedAppointment.patientPhone || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedAppointment.patientEmail || 'Not provided'}</span>
                        </div>
                        {selectedAppointment.hospitalId && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>ID: {selectedAppointment.hospitalId}</span>
                          </div>
                        )}
                        {selectedAppointment.bloodType && (
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            <span>Blood Type: {selectedAppointment.bloodType}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Information */}
                  {(selectedAppointment.healthPriority || selectedAppointment.allergies || selectedAppointment.medications) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Stethoscope className="w-5 h-5" />
                          Health Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedAppointment.healthPriority && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Priority:</span>
                            <Badge className={getPriorityColor(selectedAppointment.healthPriority)}>
                              {selectedAppointment.healthPriority.charAt(0).toUpperCase() + selectedAppointment.healthPriority.slice(1)}
                            </Badge>
                          </div>
                        )}
                        {selectedAppointment.allergies && (
                          <div>
                            <span className="font-medium">Allergies:</span>
                            <p className="text-sm text-muted-foreground mt-1">{selectedAppointment.allergies}</p>
                          </div>
                        )}
                        {selectedAppointment.medications && (
                          <div>
                            <span className="font-medium">Current Medications:</span>
                            <p className="text-sm text-muted-foreground mt-1">{selectedAppointment.medications}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Appointment Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5" />
                        Appointment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedAppointment.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <Badge className={getStatusColor(selectedAppointment.status)}>
                            {selectedAppointment.status?.charAt(0).toUpperCase() + selectedAppointment.status?.slice(1)}
                          </Badge>
                        </div>
                        {selectedAppointment.createdAt && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Booked:</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(selectedAppointment.createdAt.toDate?.() || selectedAppointment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reason for Visit */}
                  {selectedAppointment.reason && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Reason for Visit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedAppointment.reason}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reschedule Form */}
                  {rescheduleMode && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <RotateCcw className="w-5 h-5" />
                          Reschedule Appointment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="reschedule-date">Select New Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <Label htmlFor="reschedule-time">Select New Time</Label>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time slot" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTimeSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Rejection Form */}
                  {showRejectionForm && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <XCircle className="w-5 h-5" />
                          Reject Appointment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="rejection-reason">Reason for Rejection (Optional)</Label>
                          <Textarea
                            id="rejection-reason"
                            placeholder="Provide a reason for rejecting this appointment..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Fixed Action Buttons at Bottom */}
              {selectedAppointment.status === 'pending' && (
                <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
                  <div className="flex flex-col gap-3">
                    {!rescheduleMode && !showRejectionForm && (
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleApprove} 
                          disabled={actionLoading} 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {actionLoading ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setRescheduleMode(true)}
                          className="flex-1"
                        >
                          Reschedule
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => setShowRejectionForm(true)}
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    {rescheduleMode && (
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleReschedule} 
                          disabled={actionLoading || !selectedDate || !selectedTime}
                          className="flex-1"
                        >
                          {actionLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setRescheduleMode(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {showRejectionForm && (
                      <div className="flex gap-3">
                        <Button 
                          variant="destructive" 
                          onClick={handleReject} 
                          disabled={actionLoading}
                          className="flex-1"
                        >
                          {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowRejectionForm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Select an Appointment</h3>
                <p className="text-muted-foreground">
                  Choose an appointment from the list to view patient details and manage the appointment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
