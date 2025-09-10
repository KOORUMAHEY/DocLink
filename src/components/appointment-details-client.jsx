
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
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Appointment Details
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                ID: {appointment.id}
              </CardDescription>
            </div>
            {role === 'doctor' && (
                <Button
                variant="outline"
                size="sm"
                onClick={handleSavePatient}
                disabled={isSaving}
                className="w-full sm:w-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
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
        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="space-y-5">
            {details.map(item => (
              <div key={item.label} className="flex items-start gap-3 sm:gap-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base break-words leading-relaxed">{item.value || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 sm:p-6">
             <h3 className="font-bold text-base sm:text-lg text-blue-900 mb-4 flex items-center gap-2">
               <FileText className="h-5 w-5" />
               Medical Information
             </h3>
             {medicalInfo.map(item => (
                <div key={item.label} className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-200 flex-shrink-0">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-blue-600 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                        <p className="font-semibold text-blue-900 text-sm sm:text-base break-words leading-relaxed">{item.value || 'N/A'}</p>
                    </div>
                </div>
             ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4 p-4 sm:p-6 bg-gray-50/30 border-t border-gray-200">
            {role === 'doctor' && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-medium">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">
                          Reject
                        </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">This information is confidential and intended for use by healthcare professionals only.</p>
                </>
            )}
            {role === 'user' && (
                 <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">If you need to reschedule or cancel your appointment, please contact the clinic directly.</p>
            )}
        </CardFooter>
      </Card>
  );
}
