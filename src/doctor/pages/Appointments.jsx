'use client';

import { useState, useEffect } from 'react';
import { getAppointmentsByDoctor } from '@/features/appointments/services/appointmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, Phone, Mail, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Appointments({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const loadAppointments = async () => {
      if (doctorId) {
        try {
          setLoading(true);
          const data = await getAppointmentsByDoctor(doctorId);
          setAppointments(data);
        } catch (error) {
          console.error('Failed to load appointments:', error);
        } finally {
          setLoading(false);
        }
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
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all your appointments
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Calendar className="w-4 h-4 mr-2" />
          {filteredAppointments.length} Total
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="grid gap-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Appointments Found</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No appointments scheduled yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={appointment.patientAvatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {appointment.patientName?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.timeSlot}
                        </div>
                      </div>
                      {appointment.reason && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Reason: {appointment.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      {appointment.patientPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {appointment.patientPhone}
                        </div>
                      )}
                      {appointment.patientEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {appointment.patientEmail}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
