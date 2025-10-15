import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CalendarDays, Clock, FileText, Heart, Mail, Phone, RotateCcw, Stethoscope, User2, Users, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const AppointmentDetailsPanel = ({
  selectedAppointment,
  rescheduleMode,
  setRescheduleMode,
  showRejectionForm,
  setShowRejectionForm,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  rejectionReason,
  setRejectionReason,
  actionLoading,
  handleApprove,
  handleReschedule,
  handleReject,
  availableTimeSlots,
  getPriorityColor,
  getStatusColor,
  LazyPopover,
  LazyCalendar
}) => {
  if (!selectedAppointment) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Select an Appointment</h3>
          <p className="text-muted-foreground">
            Choose an appointment from the list to view patient details and manage the appointment
          </p>
        </div>
      </div>
    );
  }

  return (
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
                    <Suspense fallback={<div className="h-10 bg-gray-100 animate-pulse rounded"></div>}>
                      <LazyPopover>
                        <LazyPopover.PopoverTrigger asChild>
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
                        </LazyPopover.PopoverTrigger>
                        <LazyPopover.PopoverContent className="w-auto p-0">
                          <LazyCalendar.Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </LazyPopover.PopoverContent>
                      </LazyPopover>
                    </Suspense>
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
  );
};

export default AppointmentDetailsPanel;