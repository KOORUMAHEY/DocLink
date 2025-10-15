'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAppointments, getAppointmentById } from '@/features/appointments/services/appointmentService';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Eye, Clock, CheckCircle, XCircle, AlertCircle, Plus, Trash2, RefreshCw, User, Phone, Mail, Stethoscope, FileText } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

function AppointmentsTableSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => `skeleton-item-${Date.now()}-${i}`);
  
  return (
    <div className="space-y-3 p-6">
      {skeletonItems.map((id) => (
        <div key={id} className="flex items-center space-x-4 p-6 border border-slate-700 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 animate-pulse">
          <div className="h-12 w-12 bg-gradient-to-br from-slate-600 to-slate-500 rounded-full"></div>
          <div className="space-y-3 flex-1">
            <div className="h-5 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-48"></div>
            <div className="h-4 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-20"></div>
            <div className="h-6 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case 'scheduled':
      return <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 hover:from-blue-200 hover:to-blue-300 transition-all duration-200 px-2 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1 text-[10px] sm:text-xs"><Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />Scheduled</Badge>;
    case 'completed':
      return <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 hover:from-green-200 hover:to-green-300 transition-all duration-200 px-2 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1 text-[10px] sm:text-xs"><CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />Completed</Badge>;
    case 'cancelled':
      return <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300 hover:from-red-200 hover:to-red-300 transition-all duration-200 px-2 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1 text-[10px] sm:text-xs"><XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />Cancelled</Badge>;
    default:
      return <Badge variant="secondary" className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 px-2 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1 text-[10px] sm:text-xs"><AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{status}</Badge>;
  }
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      // Serialize Firestore Timestamps
      const serialized = data.map(appt => ({
        ...appt,
        appointmentDate: appt.appointmentDate?.toDate?.() || new Date(appt.appointmentDate),
        createdAt: appt.createdAt?.toDate?.() || new Date(appt.createdAt),
        lastUpdated: appt.lastUpdated?.toDate?.() || new Date(appt.lastUpdated),
      }));
      setAppointments(serialized);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter and sort appointments
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(appt => 
        appt.patientName?.toLowerCase().includes(query) ||
        appt.doctorName?.toLowerCase().includes(query) ||
        appt.hospitalId?.toLowerCase().includes(query) ||
        appt.patientPhone?.includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appt => appt.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.appointmentDate) - new Date(a.appointmentDate);
        case 'patient':
          return (a.patientName || '').localeCompare(b.patientName || '');
        case 'doctor':
          return (a.doctorName || '').localeCompare(b.doctorName || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [appointments, searchQuery, statusFilter, sortBy]);

  // View appointment details
  const handleViewDetails = async (appointmentId) => {
    try {
      const details = await getAppointmentById(appointmentId);
      if (details) {
        // Serialize dates
        const serialized = {
          ...details,
          appointmentDate: details.appointmentDate?.toDate?.() || new Date(details.appointmentDate),
          createdAt: details.createdAt?.toDate?.() || new Date(details.createdAt),
          lastUpdated: details.lastUpdated?.toDate?.() || new Date(details.lastUpdated),
        };
        setSelectedAppointment(serialized);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      toast({
        title: "Error",
        description: "Failed to load appointment details.",
        variant: "destructive",
      });
    }
  };

  // Delete appointment
  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'appointments', appointmentToDelete.id));
      
      // Update local state
      setAppointments(prev => prev.filter(appt => appt.id !== appointmentToDelete.id));
      
      toast({
        title: "Success",
        description: "Appointment deleted successfully.",
      });
      
      setIsDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to delete appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats calculations
  const stats = useMemo(() => ({
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }), [appointments]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Appointments"
        description="Manage and monitor all scheduled appointments"
        icon={Calendar}
        gradient="from-green-500 to-emerald-500"
        actions={[
          <Button 
            key="refresh"
            variant="outline" 
            size="sm"
            onClick={fetchAppointments}
            disabled={loading}
            className="border-2 border-slate-600 hover:bg-slate-700 text-slate-300 transition-all duration-200 shadow-sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>,
          <Button 
            key="new"
            size="sm"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Appointment</span>
            <span className="sm:hidden">New</span>
          </Button>
        ]}
        stats={[
          {
            label: "Total",
            value: stats.total,
            icon: Calendar,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
          },
          {
            label: "Scheduled",
            value: stats.scheduled,
            icon: Clock,
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-600"
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            iconBg: "bg-green-50",
            iconColor: "text-green-600"
          },
          {
            label: "Cancelled",
            value: stats.cancelled,
            icon: XCircle,
            iconBg: "bg-red-50",
            iconColor: "text-red-600"
          }
        ]}
      />

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm bg-slate-800 border-slate-700">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search by patient, doctor, phone, or hospital ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 sm:h-10 text-sm bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36 h-9 sm:h-10 text-sm bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="!bg-slate-700 !border-slate-600 !text-white" style={{backgroundColor: 'rgb(51 65 85)', color: 'white'}}>
                <SelectItem value="all" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">All Status</SelectItem>
                <SelectItem value="scheduled" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">Scheduled</SelectItem>
                <SelectItem value="completed" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">Completed</SelectItem>
                <SelectItem value="cancelled" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32 h-9 sm:h-10 text-sm bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="!bg-slate-700 !border-slate-600 !text-white" style={{backgroundColor: 'rgb(51 65 85)', color: 'white'}}>
                <SelectItem value="date" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">Date</SelectItem>
                <SelectItem value="patient" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">Patient</SelectItem>
                <SelectItem value="doctor" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">Doctor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="border-0 shadow-xl bg-slate-800 border-slate-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700/50 border-b border-slate-600 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-white">
                {statusFilter === 'all' ? 'All Appointments' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Appointments`}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-slate-300 mt-1">
                {filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'} found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-semibold">{filteredAppointments.length} results</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <AppointmentsTableSkeleton />
          ) : (
            <div className="relative w-full overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-700">
                  <TableRow className="hover:bg-slate-700 border-b border-slate-600">
                    <TableHead className="font-bold text-white text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Patient</TableHead>
                    <TableHead className="hidden lg:table-cell font-bold text-white text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Doctor</TableHead>
                    <TableHead className="font-bold text-white text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Date & Time</TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-white text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="font-bold text-white text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center gap-4 sm:gap-6">
                          <div className="relative">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center">
                              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
                            </div>
                          </div>
                          <div className="space-y-1 sm:space-y-2 px-4">
                            <h3 className="text-lg sm:text-xl font-bold text-white">No appointments found</h3>
                            <p className="text-sm text-slate-400 max-w-md">
                              {searchQuery || statusFilter !== 'all' 
                                ? 'Try adjusting your search or filters'
                                : 'Appointment records will appear here once scheduled.'}
                            </p>
                          </div>
                          {!searchQuery && statusFilter === 'all' && (
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                              <Plus className="mr-2 h-4 w-4" />
                              Book First Appointment
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAppointments.map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-700 group">
                        <TableCell className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-blue-400 transition-colors truncate max-w-[120px] sm:max-w-none">
                              {appt.patientName}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[120px] sm:max-w-none">
                              {appt.hospitalId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-xs sm:text-sm text-slate-300 truncate max-w-[120px] sm:max-w-none">
                              {appt.doctorName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-xs sm:text-sm text-white whitespace-nowrap">
                              {format(new Date(appt.appointmentDate), 'MMM dd')}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">
                              {format(new Date(appt.appointmentDate), 'h:mm a')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell py-2 sm:py-3 px-2 sm:px-4 text-center">
                          <div className="flex justify-center">
                            {getStatusBadge(appt.status)}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewDetails(appt.id)}
                              className="hover:bg-blue-600 hover:text-white text-slate-300 transition-all duration-200 rounded-lg h-7 w-7 sm:h-8 sm:w-8 p-0"
                              title="View Details"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteClick(appt)}
                              className="hover:bg-red-600 hover:text-white text-slate-300 transition-all duration-200 rounded-lg h-7 w-7 sm:h-8 sm:w-8 p-0"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Appointment Details</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Complete information about the appointment
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6 mt-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-sm font-medium text-gray-700">Status</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>

              {/* Patient Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  <div>
                    <span className="text-xs text-muted-foreground">Name</span>
                    <p className="text-sm font-medium text-gray-900">{selectedAppointment.patientName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Hospital ID</span>
                    <p className="text-sm font-medium text-gray-900">{selectedAppointment.hospitalId}</p>
                  </div>
                  {selectedAppointment.patientPhone && (
                    <div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Phone
                      </span>
                      <p className="text-sm font-medium text-gray-900">{selectedAppointment.patientPhone}</p>
                    </div>
                  )}
                  {selectedAppointment.patientEmail && (
                    <div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                      </span>
                      <p className="text-sm font-medium text-gray-900">{selectedAppointment.patientEmail}</p>
                    </div>
                  )}
                  {selectedAppointment.age && (
                    <div>
                      <span className="text-xs text-muted-foreground">Age</span>
                      <p className="text-sm font-medium text-gray-900">{selectedAppointment.age} years</p>
                    </div>
                  )}
                  {selectedAppointment.gender && (
                    <div>
                      <span className="text-xs text-muted-foreground">Gender</span>
                      <p className="text-sm font-medium text-gray-900 capitalize">{selectedAppointment.gender}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Doctor Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  <div>
                    <span className="text-xs text-muted-foreground">Name</span>
                    <p className="text-sm font-medium text-gray-900">{selectedAppointment.doctorName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Specialization</span>
                    <p className="text-sm font-medium text-gray-900">{selectedAppointment.specialization || selectedAppointment.specialty}</p>
                  </div>
                  {selectedAppointment.doctorEmail && (
                    <div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Email
                      </span>
                      <p className="text-sm font-medium text-gray-900">{selectedAppointment.doctorEmail}</p>
                    </div>
                  )}
                  {selectedAppointment.doctorPhone && (
                    <div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Phone
                      </span>
                      <p className="text-sm font-medium text-gray-900">{selectedAppointment.doctorPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  <div>
                    <span className="text-xs text-muted-foreground">Date</span>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(selectedAppointment.appointmentDate), 'EEEE, MMMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Time</span>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(selectedAppointment.appointmentDate), 'h:mm a')}
                    </p>
                  </div>
                  {selectedAppointment.reason && (
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Reason
                      </span>
                      <p className="text-sm font-medium text-gray-900">{selectedAppointment.reason}</p>
                    </div>
                  )}
                  {selectedAppointment.notes && (
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground">Notes</span>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Created</span>
                  <span>{selectedAppointment.createdAt && format(new Date(selectedAppointment.createdAt), 'MMM dd, yyyy h:mm a')}</span>
                </div>
                {selectedAppointment.lastUpdated && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Last Updated</span>
                    <span>{format(new Date(selectedAppointment.lastUpdated), 'MMM dd, yyyy h:mm a')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDetailsOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Appointment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {appointmentToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 my-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Patient:</span>
                <span className="font-medium">{appointmentToDelete.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Doctor:</span>
                <span className="font-medium">{appointmentToDelete.doctorName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {format(new Date(appointmentToDelete.appointmentDate), 'MMM dd, yyyy h:mm a')}
                </span>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
