
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar, Clock, User, Stethoscope, Hash, Mail, Phone, FileText, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { savePatientForDoctor } from '@/services/patientService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AppointmentDetailsClient({ appointment: initialAppointment, role = 'user' }) {
  const [appointment, setAppointment] = useState(initialAppointment);
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    setAppointment(initialAppointment);
  }, [initialAppointment]);

  useEffect(() => {
    if (appointment?.appointmentDate) {
      const date = new Date(appointment.appointmentDate);
      if(!isNaN(date)) {
        setFormattedDate(format(date, 'PPP'));
        setFormattedTime(format(date, 'p'));
      }
    }
  }, [appointment?.appointmentDate]);

  const handleSavePatient = async () => {
    setIsSaving(true);
    const result = await savePatientForDoctor(appointment.doctorId, appointment.doctorName, appointment.hospitalId);
    if(result.success) {
      toast({
        title: "Patient Saved",
        description: `${appointment.patientName} has been added to your 'My Patients' list.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsSaving(false);
  }

  const details = [
    { icon: User, label: 'Patient Name', value: appointment.patientName },
    { icon: Mail, label: 'Patient Email', value: appointment.patientEmail },
    { icon: Phone, label: 'Patient Phone', value: appointment.patientPhone },
    { icon: Hash, label: 'Hospital ID', value: appointment.hospitalId },
    { icon: Stethoscope, label: 'Doctor', value: appointment.doctorName },
    { icon: Calendar, label: 'Appointment Date', value: isClient ? formattedDate : '...' },
    { icon: Clock, label: 'Appointment Time', value: isClient ? formattedTime : '...' },
  ];
  
  const medicalInfo = [
    { icon: FileText, label: 'Description', value: appointment.description},
  ]

  return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Details</CardTitle>
              <CardDescription>
                ID: {appointment.id}
              </CardDescription>
            </div>
            {role === 'doctor' && (
                <Button
                variant="outline"
                size="sm"
                onClick={handleSavePatient}
                disabled={isSaving}
                >
                {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <UserCheck className="mr-2 h-4 w-4" />
                )}
                Save Patient
                </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 text-sm">
          <div className="grid gap-y-4">
            {details.map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium break-words">{item.value || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-lg border p-4">
             <h3 className="font-semibold text-base">Medical Information</h3>
             {medicalInfo.map(item => (
                <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-medium break-words">{item.value || 'N/A'}</p>
                    </div>
                </div>
             ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
            {role === 'doctor' && (
                <>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm">Approve</Button>
                        <Button size="sm" variant="outline">Reschedule</Button>
                        <Button size="sm" variant="destructive">Reject</Button>
                    </div>
                    <p className="text-xs text-muted-foreground pt-4">This information is confidential and intended for use by healthcare professionals only.</p>
                </>
            )}
            {role === 'user' && (
                 <p className="text-xs text-muted-foreground pt-4">If you need to reschedule or cancel your appointment, please contact the clinic directly.</p>
            )}
        </CardFooter>
      </Card>
  );
}
