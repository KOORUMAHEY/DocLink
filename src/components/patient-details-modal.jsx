'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon, 
  Clock, 
  Heart, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Info,
  User2,
  Stethoscope,
  FileText,
  CalendarDays,
  Loader2
} from 'lucide-react';
import { 
  rescheduleAppointment as rescheduleAppointmentService, 
  approveAppointment as approveAppointmentService, 
  rejectAppointment as rejectAppointmentService 
} from '@/features/appointments/services/appointmentService';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';

const PatientDetailsModal = ({ 
  isOpen, 
  onClose, 
  appointment, 
  onStatusUpdate,
  availableTimeSlots = [] 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setRescheduleMode(false);
      setSelectedDate(null);
      setSelectedTime('');
      setRejectionReason('');
      setShowRejectionForm(false);
    }
  }, [isOpen]);

  if (!appointment) return null;

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

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveAppointmentService(appointment.id);
      
      toast({
        title: "Appointment Approved",
        description: "The appointment has been confirmed successfully.",
      });

      onStatusUpdate?.(appointment.id, 'confirmed');
      onClose();
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast({
        title: "Error",
        description: "Failed to approve appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await rejectAppointmentService(appointment.id, rejectionReason);
      
      toast({
        title: "Appointment Rejected",
        description: "The appointment has been rejected.",
      });

      onStatusUpdate?.(appointment.id, 'rejected');
      onClose();
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to reject appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Invalid Selection",
        description: "Please select both date and time for rescheduling.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await rescheduleAppointmentService(appointment.id, selectedDate.toISOString(), selectedTime);
      
      toast({
        title: "Appointment Rescheduled",
        description: `Appointment rescheduled to ${format(selectedDate, 'PPP')} at ${selectedTime}`,
      });

      onStatusUpdate?.(appointment.id, 'confirmed', {
        appointmentDate: selectedDate.toISOString(),
        timeSlot: selectedTime
      });
      onClose();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPatientInfo = () => (
    <div className="space-y-6">
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
              <AvatarImage src={appointment.patientAvatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                {appointment.patientName?.charAt(0) || 'P'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{appointment.patientName || 'N/A'}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                {appointment.age && (
                  <span>{appointment.age} years old</span>
                )}
                {appointment.gender && (
                  <Badge variant="outline">{appointment.gender}</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{appointment.patientPhone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{appointment.patientEmail || 'Not provided'}</span>
            </div>
            {appointment.hospitalId && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>ID: {appointment.hospitalId}</span>
              </div>
            )}
            {appointment.bloodType && (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span>Blood Type: {appointment.bloodType}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      {(appointment.healthPriority || appointment.allergies || appointment.medications) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Health Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointment.healthPriority && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Priority:</span>
                <Badge className={getPriorityColor(appointment.healthPriority)}>
                  {appointment.healthPriority.charAt(0).toUpperCase() + appointment.healthPriority.slice(1)}
                </Badge>
              </div>
            )}
            {appointment.allergies && (
              <div>
                <span className="font-medium">Allergies:</span>
                <p className="text-sm text-muted-foreground mt-1">{appointment.allergies}</p>
              </div>
            )}
            {appointment.medications && (
              <div>
                <span className="font-medium">Current Medications:</span>
                <p className="text-sm text-muted-foreground mt-1">{appointment.medications}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {appointment.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Reason for Visit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{appointment.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAppointmentInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Appointment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{appointment.timeSlot}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
            </Badge>
          </div>
          {appointment.createdAt && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Booked:</span>
              <span className="text-sm text-muted-foreground">
                {new Date(appointment.createdAt.toDate?.() || appointment.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderRescheduleForm = () => (
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
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
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
        <div className="flex gap-2">
          <Button onClick={handleReschedule} disabled={loading || !selectedDate || !selectedTime}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RotateCcw className="w-4 h-4 mr-2" />}
            Reschedule
          </Button>
          <Button variant="outline" onClick={() => setRescheduleMode(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderRejectionForm = () => (
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
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleReject} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
            Reject Appointment
          </Button>
          <Button variant="outline" onClick={() => setShowRejectionForm(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient Details & Appointment Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patient">Patient Info</TabsTrigger>
              <TabsTrigger value="appointment">Appointment</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="patient" className="space-y-4">
              {renderPatientInfo()}
            </TabsContent>

            <TabsContent value="appointment" className="space-y-4">
              {renderAppointmentInfo()}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              {appointment.status === 'pending' && (
                <>
                  {!rescheduleMode && !showRejectionForm && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button onClick={handleApprove} disabled={loading} className="bg-green-600 hover:bg-green-700">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                        Approve
                      </Button>
                      <Button variant="outline" onClick={() => setRescheduleMode(true)}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reschedule
                      </Button>
                      <Button variant="destructive" onClick={() => setShowRejectionForm(true)}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {rescheduleMode && renderRescheduleForm()}
                  {showRejectionForm && renderRejectionForm()}
                </>
              )}

              {appointment.status !== 'pending' && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This appointment has already been {appointment.status}. No actions are available.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

PatientDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointment: PropTypes.object,
  onStatusUpdate: PropTypes.func,
  availableTimeSlots: PropTypes.arrayOf(PropTypes.string),
};

export default PatientDetailsModal;