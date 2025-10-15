'use client';

import { useState, useEffect } from 'react';
import { getAppointmentsByDoctor } from '@/features/appointments/services/appointmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Debug component to test appointment loading
export default function AppointmentsDebug() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctorId, setDoctorId] = useState('doc1');

  const testLoad = async (testDoctorId) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Testing with doctor ID:', testDoctorId);
      
      const data = await getAppointmentsByDoctor(testDoctorId);
      console.log('Result:', data);
      setAppointments(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testLoad(doctorId);
  }, [doctorId]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appointments API Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => testLoad('doc1')} variant={doctorId === 'doc1' ? 'default' : 'outline'}>
              Test doc1
            </Button>
            <Button onClick={() => testLoad('doc2')} variant={doctorId === 'doc2' ? 'default' : 'outline'}>
              Test doc2
            </Button>
            <Button onClick={() => testLoad('doc3')} variant={doctorId === 'doc3' ? 'default' : 'outline'}>
              Test doc3
            </Button>
          </div>
          
          <div>
            <p><strong>Doctor ID:</strong> {doctorId}</p>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>Appointments Count:</strong> {appointments.length}</p>
          </div>
          
          {appointments.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Appointments:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(appointments, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}