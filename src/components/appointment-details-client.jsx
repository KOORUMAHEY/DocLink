
'use client';

import { format } from 'date-fns';
import { Calendar, Clock, User, Stethoscope, Hash, Mail, Phone, FileText, UserCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { savePatientForDoctor } from '@/services/patientService';
import { useToast } from '@/hooks/use-toast';

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
    { icon: User, label: 'PATIENT NAME', value: appointment.patientName, section: 'patient' },
    { icon: Mail, label: 'PATIENT EMAIL', value: appointment.patientEmail, section: 'patient', clickable: true, href: `mailto:${appointment.patientEmail}` },
    { icon: Phone, label: 'PATIENT PHONE', value: appointment.patientPhone, section: 'patient', clickable: true, href: `tel:${appointment.patientPhone}` },
    { icon: Hash, label: 'HOSPITAL ID', value: appointment.hospitalId, section: 'patient' },
    { icon: Calendar, label: 'APPOINTMENT DATE', value: isClient ? formattedDate : '...', section: 'schedule' },
    { icon: Clock, label: 'APPOINTMENT TIME', value: isClient ? formattedTime : '...', section: 'schedule' },
  ];
  
  const medicalInfo = [
    { icon: FileText, label: 'DESCRIPTION', value: appointment.description, section: 'medical' },
  ]

  return (
      <div className="bg-white border-0">
        {role === 'doctor' && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  Medical Dashboard
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  ID: {appointment.id}
                </p>
              </div>
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
            </div>
          </div>
        )}
        <div className="p-6 space-y-6">
          {/* Patient Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-t-xl border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                Patient Information
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {details.filter(item => item.section === 'patient').map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <item.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">{item.label.replace('PATIENT ', '')}</span>
                  </div>
                  <div className="text-right">
                    {item.clickable ? (
                      <a href={item.href} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        {item.value || 'N/A'}
                      </a>
                    ) : (
                      <span className="font-bold text-gray-900">{item.value || 'N/A'}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-t-xl border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Stethoscope className="h-5 w-5 text-green-600 mr-2" />
                Healthcare Provider
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Stethoscope className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">DOCTOR</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{appointment.doctorName || 'N/A'}</div>
                  {appointment.specialty && (
                    <div className="text-xs text-gray-600 mt-1">{appointment.specialty}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-t-xl border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                Schedule Details
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {details.filter(item => item.section === 'schedule').map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <item.icon className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">{item.label.replace('APPOINTMENT ', '')}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{item.value || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-t-xl border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 text-orange-600 mr-2" />
                Medical Information
              </h3>
            </div>
            <div className="p-4">
              {medicalInfo.map(item => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <item.icon className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{item.value || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note for Users */}
          {role === 'user' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Important Notice</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    If you need to reschedule or cancel your appointment, please contact the clinic directly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Actions */}
          {role === 'doctor' && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  Reschedule
                </Button>
                <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  Reject
                </Button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed italic text-center">
                This information is confidential and intended for use by healthcare professionals only.
              </p>
            </div>
          )}
        </div>
      </div>
  );
}
