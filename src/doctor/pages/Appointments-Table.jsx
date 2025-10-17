'use client';

/* eslint-disable react/prop-types */

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getAppointmentsByDoctor, approveAppointment as approveAppointmentService, rejectAppointment as rejectAppointmentService } from '@/features/appointments/services/appointmentService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Search, X, Check, AlertCircle, Eye, Trash2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/theme';
import { format, isToday, isTomorrow, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

// Helper function to get status color
const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-green-100 text-green-800 border-green-300',
    completed: 'bg-blue-100 text-blue-800 border-blue-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[status] || colors.pending;
};

// Helper function to get date category
const getDateCategory = (dateString) => {
  const date = new Date(dateString);
  if (isToday(date)) return 'today';
  if (isTomorrow(date)) return 'tomorrow';
  return 'all';
};

// Table Loading Skeleton
const TableLoadingSkeleton = ({ isDark }) => (
  <div className={cn(
    "min-h-screen p-4 sm:p-6",
    isDark ? "bg-slate-900" : "bg-gray-50"
  )}>
    <div className="max-w-7xl mx-auto space-y-4">
      <Skeleton className="h-10 w-64 rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

// Table Row Component
const AppointmentRow = memo(({ 
  appointment, 
  isDark, 
  onViewDetails,
  onMarkComplete,
  onDelete,
  isLoading
}) => (
  <tr className={cn(
    "border-b transition-colors hover:bg-opacity-50",
    isDark 
      ? "border-slate-700 hover:bg-slate-800" 
      : "border-gray-200 hover:bg-gray-50"
  )}>
    {/* Patient Info */}
    <td className="px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={appointment.patientAvatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
            {appointment.patientName?.charAt(0) || 'P'}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className={cn("font-medium truncate", isDark ? "text-white" : "text-gray-900")}>
            {appointment.patientName}
          </p>
          <p className={cn("text-xs truncate", isDark ? "text-gray-400" : "text-gray-500")}>
            {appointment.patientEmail}
          </p>
        </div>
      </div>
    </td>

    {/* Date */}
    <td className={cn("px-4 py-4 sm:px-6 whitespace-nowrap", isDark ? "text-gray-300" : "text-gray-900")}>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 flex-shrink-0" style={isDark ? {color: '#60a5fa'} : {color: '#2563eb'}} />
        <span className="text-sm font-medium">
          {format(new Date(appointment.appointmentDate), 'MMM d, yyyy')}
        </span>
      </div>
    </td>

    {/* Time */}
    <td className={cn("px-4 py-4 sm:px-6 whitespace-nowrap", isDark ? "text-gray-300" : "text-gray-900")}>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 flex-shrink-0" style={isDark ? {color: '#a78bfa'} : {color: '#7c3aed'}} />
        <span className="text-sm font-medium">{appointment.timeSlot}</span>
      </div>
    </td>

    {/* Reason */}
    <td className={cn("px-4 py-4 sm:px-6", isDark ? "text-gray-300" : "text-gray-700")}>
      <p className="text-sm line-clamp-2">
        {appointment.reason || 'No reason specified'}
      </p>
    </td>

    {/* Status */}
    <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
      <Badge className={cn("inline-flex items-center gap-1", getStatusColor(appointment.status))} variant="outline">
        {appointment.status === 'pending' && <Clock className="w-3 h-3" />}
        {appointment.status === 'confirmed' && <Check className="w-3 h-3" />}
        {appointment.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
        <span className="text-xs capitalize">{appointment.status}</span>
      </Badge>
    </td>

    {/* Actions */}
    <td className="px-4 py-4 sm:px-6">
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0 transition-colors",
            isDark 
              ? "hover:bg-blue-900/30 text-blue-400 hover:text-blue-300" 
              : "hover:bg-blue-100 text-blue-600 hover:text-blue-700"
          )}
          onClick={() => onViewDetails(appointment)}
          disabled={isLoading}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </Button>

        {appointment.status !== 'completed' && (
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0 transition-colors",
              isDark 
                ? "hover:bg-green-900/30 text-green-400 hover:text-green-300" 
                : "hover:bg-green-100 text-green-600 hover:text-green-700"
            )}
            onClick={() => onMarkComplete(appointment)}
            disabled={isLoading}
            title="Mark as Completed"
          >
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0 transition-colors",
            isDark 
              ? "hover:bg-red-900/30 text-red-400 hover:text-red-300" 
              : "hover:bg-red-100 text-red-600 hover:text-red-700"
          )}
          onClick={() => onDelete(appointment)}
          disabled={isLoading}
          title="Delete Appointment"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </td>
  </tr>
));

AppointmentRow.displayName = 'AppointmentRow';
AppointmentRow.propTypes = {
  appointment: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onMarkComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

// Appointments Table Component
const AppointmentsTable = memo(({ 
  appointments, 
  isDark,
  isLoading,
  onViewDetails,
  onMarkComplete,
  onDelete,
  dateFilter
}) => {
  const filtered = useMemo(() => {
    if (dateFilter === 'all') return appointments;
    return appointments.filter(apt => getDateCategory(apt.appointmentDate) === dateFilter);
  }, [appointments, dateFilter]);

  if (filtered.length === 0) {
    return (
      <Card className={cn("border-0", isDark ? "bg-slate-800" : "bg-white")}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <AlertCircle className={cn("w-12 h-12 mb-4", isDark ? "text-gray-500" : "text-gray-400")} />
          <h3 className={cn("text-lg font-semibold mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
            No appointments found
          </h3>
          <p className={cn("text-sm text-center", isDark ? "text-gray-400" : "text-gray-600")}>
            {dateFilter === 'today' 
              ? "No appointments scheduled for today"
              : dateFilter === 'tomorrow'
              ? "No appointments scheduled for tomorrow"
              : "No appointments to display"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden",
      isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn(
              "border-b",
              isDark ? "bg-slate-900 border-slate-700" : "bg-gray-50 border-gray-200"
            )}>
              <th className={cn(
                "px-4 py-3 sm:px-6 text-left text-xs font-semibold",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Patient
              </th>
              <th className={cn(
                "px-4 py-3 sm:px-6 text-left text-xs font-semibold whitespace-nowrap",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Date
              </th>
              <th className={cn(
                "px-4 py-3 sm:px-6 text-left text-xs font-semibold whitespace-nowrap",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Time
              </th>
              <th className={cn(
                "px-4 py-3 sm:px-6 text-left text-xs font-semibold",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Reason
              </th>
              <th className={cn(
                "px-4 py-3 sm:px-6 text-left text-xs font-semibold whitespace-nowrap",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Status
              </th>
              <th className={cn(
                "px-4 py-3 sm:px-6 text-left text-xs font-semibold whitespace-nowrap",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                isDark={isDark}
                onViewDetails={onViewDetails}
                onMarkComplete={onMarkComplete}
                onDelete={onDelete}
                isLoading={isLoading}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

AppointmentsTable.displayName = 'AppointmentsTable';
AppointmentsTable.propTypes = {
  appointments: PropTypes.array.isRequired,
  isDark: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onMarkComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  dateFilter: PropTypes.string.isRequired,
};

// Detail Modal Component
const AppointmentDetailsModal = memo(({ 
  appointment, 
  isOpen, 
  onClose,
  isDark
}) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <Card className={cn(
        "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border-0",
        isDark ? "bg-slate-800" : "bg-white"
      )}>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className={cn("w-16 h-16 ring-2", isDark ? "ring-slate-700" : "ring-gray-200")}>
                <AvatarImage src={appointment.patientAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                  {appointment.patientName?.charAt(0) || 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {appointment.patientName}
                </h2>
                <Badge className={cn("mt-2", getStatusColor(appointment.status))}>
                  {appointment.status}
                </Badge>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Divider */}
          <div className={cn("h-px", isDark ? "bg-slate-700" : "bg-gray-200")} />

          {/* Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className={cn("text-xs font-semibold mb-1", isDark ? "text-gray-400" : "text-gray-600")}>
                Date
              </p>
              <p className={cn("text-sm font-medium", isDark ? "text-gray-200" : "text-gray-900")}>
                {format(new Date(appointment.appointmentDate), 'MMMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className={cn("text-xs font-semibold mb-1", isDark ? "text-gray-400" : "text-gray-600")}>
                Time
              </p>
              <p className={cn("text-sm font-medium", isDark ? "text-gray-200" : "text-gray-900")}>
                {appointment.timeSlot}
              </p>
            </div>
            <div>
              <p className={cn("text-xs font-semibold mb-1", isDark ? "text-gray-400" : "text-gray-600")}>
                Email
              </p>
              <p className={cn("text-sm font-medium", isDark ? "text-gray-200" : "text-gray-900")}>
                {appointment.patientEmail}
              </p>
            </div>
            <div>
              <p className={cn("text-xs font-semibold mb-1", isDark ? "text-gray-400" : "text-gray-600")}>
                Phone
              </p>
              <p className={cn("text-sm font-medium", isDark ? "text-gray-200" : "text-gray-900")}>
                {appointment.patientPhone}
              </p>
            </div>
          </div>

          {appointment.reason && (
            <div>
              <p className={cn("text-xs font-semibold mb-2", isDark ? "text-gray-400" : "text-gray-600")}>
                Reason for Appointment
              </p>
              <div className={cn(
                "p-3 rounded-lg",
                isDark ? "bg-slate-700/50" : "bg-gray-50"
              )}>
                <p className={cn("text-sm", isDark ? "text-gray-200" : "text-gray-800")}>
                  {appointment.reason}
                </p>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className={cn("h-px", isDark ? "bg-slate-700" : "bg-gray-200")} />
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

AppointmentDetailsModal.displayName = 'AppointmentDetailsModal';
AppointmentDetailsModal.propTypes = {
  appointment: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

// Main Component
export default function Appointments({ doctorId }) {
  const { toast } = useToast();
  const { isDark } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Load appointments
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const targetDoctorId = doctorId || 'doc1';
        const data = await getAppointmentsByDoctor(targetDoctorId);
        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [doctorId, toast]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = !searchQuery || 
        apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientPhone?.includes(searchQuery);
      
      return matchesSearch;
    });
  }, [appointments, searchQuery]);

  // Mark as completed
  const handleMarkComplete = useCallback(async (appointment) => {
    try {
      setActionLoading(true);
      await approveAppointmentService(appointment.id);
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointment.id ? { ...apt, status: 'completed' } : apt
        )
      );
      toast({ 
        title: "Success", 
        description: "Appointment marked as completed" 
      });
    } catch (err) {
      console.error('Error:', err);
      toast({ 
        title: "Error", 
        description: "Failed to update appointment", 
        variant: "destructive" 
      });
    } finally {
      setActionLoading(false);
    }
  }, [toast]);

  // Delete appointment
  const handleDelete = useCallback(async (appointment) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      // Call reject service (using it as delete)
      await rejectAppointmentService(appointment.id);
      setAppointments(prev => 
        prev.filter(apt => apt.id !== appointment.id)
      );
      toast({ 
        title: "Success", 
        description: "Appointment deleted" 
      });
    } catch (err) {
      console.error('Delete error:', err);
      toast({ 
        title: "Error", 
        description: "Failed to delete appointment", 
        variant: "destructive" 
      });
    } finally {
      setActionLoading(false);
    }
  }, [toast]);

  // View details
  const handleViewDetails = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setDetailsModalOpen(true);
  }, []);

  if (loading) {
    return <TableLoadingSkeleton isDark={isDark} />;
  }

  return (
    <div className={cn(
      "min-h-screen p-4 sm:p-6 lg:p-8",
      isDark ? "bg-slate-900" : "bg-gray-50"
    )}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className={cn(
              "text-3xl sm:text-4xl font-bold mb-2",
              isDark ? "text-white" : "text-gray-900"
            )}>
              Appointments
            </h1>
            <p className={cn(
              "text-base",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              Manage all your patient appointments
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
              isDark ? "text-gray-500" : "text-gray-400"
            )} />
            <Input 
              placeholder="Search by patient name, email, or phone..." 
              className={cn(
                "pl-10 h-10 rounded-lg",
                isDark 
                  ? "bg-slate-800 border-slate-700 text-white" 
                  : "bg-white border-gray-300"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Date Filter Tabs */}
          <div className="flex gap-3">
            {['all', 'today', 'tomorrow'].map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={dateFilter === filter ? "default" : "outline"}
                className={cn(
                  "transition-all",
                  dateFilter === filter
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : isDark
                    ? "border-slate-600 text-gray-300 hover:bg-slate-800"
                    : "border-gray-300"
                )}
                onClick={() => setDateFilter(filter)}
              >
                {filter === 'all' ? 'All Appointments' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className={cn(
          "flex items-center justify-between p-4 rounded-lg",
          isDark ? "bg-slate-800" : "bg-white"
        )}>
          <p className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
            Showing <span className="font-semibold">{filteredAppointments.length}</span> appointments
          </p>
        </div>

        {/* Table */}
        <AppointmentsTable
          appointments={filteredAppointments}
          isDark={isDark}
          isLoading={actionLoading}
          onViewDetails={handleViewDetails}
          onMarkComplete={handleMarkComplete}
          onDelete={handleDelete}
          dateFilter={dateFilter}
        />
      </div>

      {/* Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedAppointment(null);
        }}
        isDark={isDark}
      />
    </div>
  );
}

Appointments.propTypes = {
  doctorId: PropTypes.string,
};
