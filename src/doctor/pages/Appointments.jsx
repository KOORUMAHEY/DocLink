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
import { format } from 'date-fns';
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

// Helper function to get date filter message
const getNoResultsMessage = (dateFilter) => {
  if (dateFilter === 'today') return "No appointments scheduled for today";
  if (dateFilter === 'tomorrow') return "No appointments scheduled for tomorrow";
  return "No appointments to display";
};

// Helper function to get filter button class
const getFilterButtonClass = (isSelected, isDark) => {
  if (isSelected) return "bg-blue-600 hover:bg-blue-700 text-white";
  return isDark
    ? "border-slate-600 text-gray-300 hover:bg-slate-800"
    : "border-gray-300";
};

// Detail Field Component
const DetailField = memo(({ label, value, isDark, isMonospace = false }) => (
  <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/30" : "bg-gray-50")}>
    <p className={cn("text-xs font-semibold mb-1", isDark ? "text-gray-400" : "text-gray-600")}>
      {label}
    </p>
    <p className={cn("text-sm font-medium", isDark ? "text-gray-200" : "text-gray-900", isMonospace && "font-mono")}>
      {value || 'N/A'}
    </p>
  </div>
));

DetailField.displayName = 'DetailField';

// Personal Information Section Component
const PersonalInfoSection = memo(({ appointment, isDark }) => (
  <div>
    <h3 className={cn("text-lg font-semibold mb-4", isDark ? "text-gray-100" : "text-gray-900")}>
      Personal Information
    </h3>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DetailField label="Full Name" value={appointment.patientName} isDark={isDark} />
      <DetailField label="Email" value={appointment.patientEmail} isDark={isDark} />
      <DetailField label="Phone" value={appointment.patientPhone} isDark={isDark} />
      <DetailField label="Patient ID" value={appointment.patientId || appointment.hospitalId} isDark={isDark} isMonospace />
      <DetailField label="Age" value={appointment.age || appointment.patientAge || 'N/A'} isDark={isDark} />
      <DetailField label="Gender" value={appointment.gender || appointment.patientGender || 'N/A'} isDark={isDark} />
      {appointment.patientAddress && (
        <div className={cn("p-3 rounded-lg sm:col-span-2 lg:col-span-3", isDark ? "bg-slate-700/30" : "bg-gray-50")}>
          <p className={cn("text-xs font-semibold mb-1", isDark ? "text-gray-400" : "text-gray-600")}>
            Address
          </p>
          <p className={cn("text-sm font-medium", isDark ? "text-gray-200" : "text-gray-900")}>
            {appointment.patientAddress}
          </p>
        </div>
      )}
      {appointment.patientCity && <DetailField label="City" value={appointment.patientCity} isDark={isDark} />}
      {appointment.patientZip && <DetailField label="Zip Code" value={appointment.patientZip} isDark={isDark} />}
    </div>
  </div>
));

PersonalInfoSection.displayName = 'PersonalInfoSection';

// Appointment Details Section Component
// Appointment Status Badge Component
const StatusBadgeField = memo(({ status, isDark }) => (
  <div className={cn("p-3 rounded-lg", isDark ? "bg-slate-700/30" : "bg-gray-50")}>
    <p className={cn("text-xs font-semibold mb-1", isDark ? "text-gray-400" : "text-gray-600")}>
      Status
    </p>
    <Badge className={cn("text-xs", getStatusColor(status))}>
      {status?.toUpperCase() || 'PENDING'}
    </Badge>
  </div>
));

StatusBadgeField.displayName = 'StatusBadgeField';

// Appointment Information Section Component
const AppointmentInfoSection = memo(({ appointment, isDark }) => {
  const dateTimeString = `${format(new Date(appointment.appointmentDate), 'MMMM d, yyyy')} at ${appointment.timeSlot}`;
  
  return (
    <div>
      <h3 className={cn("text-lg font-semibold mb-4", isDark ? "text-gray-100" : "text-gray-900")}>
        Appointment Details
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={cn("p-3 rounded-lg sm:col-span-2", isDark ? "bg-slate-700/30" : "bg-gray-50")}>
          <p className={cn("text-xs font-semibold mb-1", isDark ? "text-gray-400" : "text-gray-600")}>
            Date & Time
          </p>
          <p className={cn("text-sm font-medium", isDark ? "text-gray-200" : "text-gray-900")}>
            {dateTimeString}
          </p>
        </div>
        <StatusBadgeField status={appointment.status} isDark={isDark} />
        <DetailField label="Duration" value={appointment.appointmentDuration || '30 min'} isDark={isDark} />
        {appointment.departmentOrSpecialization && <DetailField label="Department" value={appointment.departmentOrSpecialization} isDark={isDark} />}
        {appointment.visitNumber && <DetailField label="Visit Number" value={appointment.visitNumber} isDark={isDark} />}
      </div>
    </div>
  );
});

AppointmentInfoSection.displayName = 'AppointmentInfoSection';

// Approval Actions Section Component
const ApprovalActionsSection = memo(({ appointment, isDark, onApprove, onReject, isLoading }) => {
  const isCompleted = appointment.status === 'completed';
  const isRejected = appointment.status === 'rejected' || appointment.status === 'cancelled';
  
  if (isCompleted || isRejected) return null;

  return (
    <div>
      <h3 className={cn("text-lg font-semibold mb-4", isDark ? "text-gray-100" : "text-gray-900")}>
        Appointment Actions
      </h3>
      <div className="flex gap-3 sm:gap-4">
        <Button
          onClick={onApprove}
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button
          onClick={onReject}
          disabled={isLoading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        >
          <X className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </div>
    </div>
  );
});

ApprovalActionsSection.displayName = 'ApprovalActionsSection';

// Medical Information Section Component
const MedicalInfoSection = memo(({ appointment, isDark }) => {
  const medicalFields = [
    { key: 'reason', label: 'Reason for Appointment' },
    { key: 'chiefComplaint', label: 'Chief Complaint' },
    { key: 'symptoms', label: 'Symptoms' },
    { key: 'medicalHistory', label: 'Medical History' },
    { key: 'currentMedications', label: 'Current Medications' },
  ];

  const allergyExists = appointment.allergies;
  const otherFieldsExist = medicalFields.some(field => appointment[field.key]);

  if (!allergyExists && !otherFieldsExist) return null;

  return (
    <div>
      <h3 className={cn("text-lg font-semibold mb-4", isDark ? "text-gray-100" : "text-gray-900")}>
        Medical Information
      </h3>
      <div className="grid gap-4">
        {medicalFields.map(field => 
          appointment[field.key] && (
            <div key={field.key} className={cn("p-4 rounded-lg", isDark ? "bg-slate-700/30" : "bg-gray-50")}>
              <p className={cn("text-xs font-semibold mb-2", isDark ? "text-gray-400" : "text-gray-600")}>
                {field.label}
              </p>
              <p className={cn("text-sm", isDark ? "text-gray-200" : "text-gray-800")}>
                {appointment[field.key]}
              </p>
            </div>
          )
        )}
        {allergyExists && (
          <div className={cn("p-4 rounded-lg border-2", isDark ? "border-red-900/50 bg-red-900/10" : "border-red-100 bg-red-50")}>
            <p className={cn("text-xs font-semibold mb-2", isDark ? "text-red-300" : "text-red-700")}>
              ⚠️ Allergies
            </p>
            <p className={cn("text-sm font-medium", isDark ? "text-red-200" : "text-red-800")}>
              {appointment.allergies}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

MedicalInfoSection.displayName = 'MedicalInfoSection';

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
  onApprove,
  onReject,
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
          <p className={cn("text-xs truncate flex items-center gap-2", isDark ? "text-gray-400" : "text-gray-500")}>
            <span className="font-mono text-xs">{appointment.patientId || appointment.hospitalId || 'N/A'}</span>
          </p>
        </div>
      </div>
    </td>

    {/* Date & Time */}
    <td className={cn("px-4 py-4 sm:px-6 whitespace-nowrap", isDark ? "text-gray-300" : "text-gray-900")}>
      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 flex-shrink-0" style={isDark ? {color: '#60a5fa'} : {color: '#2563eb'}} />
        <div>
          <div className="text-sm font-medium">{format(new Date(appointment.appointmentDate), 'MMM d, yyyy')}</div>
          <div className="text-xs text-gray-500">{appointment.timeSlot}</div>
        </div>
      </div>
    </td>

    {/* Hospital/Patient ID */}
    <td className={cn("px-4 py-4 sm:px-6", isDark ? "text-gray-300" : "text-gray-700")}>
      <p className="text-sm font-medium font-mono">
        {appointment.patientId || appointment.hospitalId || 'N/A'}
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

    {/* Approval Actions */}
    <td className="px-4 py-4 sm:px-6">
      {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
        <div className="flex items-center gap-2">
          {onApprove && (
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 w-8 p-0 transition-colors",
                isDark 
                  ? "hover:bg-green-900/30 text-green-400 hover:text-green-300" 
                  : "hover:bg-green-100 text-green-600 hover:text-green-700"
              )}
              onClick={() => onApprove(appointment)}
              disabled={isLoading}
              title="Approve Appointment"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          {onReject && (
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 w-8 p-0 transition-colors",
                isDark 
                  ? "hover:bg-red-900/30 text-red-400 hover:text-red-300" 
                  : "hover:bg-red-100 text-red-600 hover:text-red-700"
              )}
              onClick={() => onReject(appointment)}
              disabled={isLoading}
              title="Reject Appointment"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      {(appointment.status === 'completed' || appointment.status === 'rejected' || appointment.status === 'cancelled') && (
        <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
          —
        </span>
      )}
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
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
};

// Helper to check if date matches target date
const dateMatches = (aptDate, targetDate) => {
  return aptDate.getDate() === targetDate.getDate() &&
         aptDate.getMonth() === targetDate.getMonth() &&
         aptDate.getFullYear() === targetDate.getFullYear();
};

// Helper function to filter appointments by date
const filterAppointmentsByDate = (appointments, dateFilter) => {
  if (dateFilter === 'all') return appointments;
  
  const today = new Date();
  const targetDate = dateFilter === 'today' ? today : new Date(today.getTime() + 24 * 60 * 60 * 1000);
  
  return appointments.filter(apt => 
    dateMatches(new Date(apt.appointmentDate), targetDate)
  );
};

// Empty State Component
const AppointmentsEmptyState = memo(({ isDark, dateFilter }) => (
  <Card className={cn("border-0", isDark ? "bg-slate-800" : "bg-white")}>
    <CardContent className="flex flex-col items-center justify-center py-16">
      <AlertCircle className={cn("w-12 h-12 mb-4", isDark ? "text-gray-500" : "text-gray-400")} />
      <h3 className={cn("text-lg font-semibold mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
        No appointments found
      </h3>
      <p className={cn("text-sm text-center", isDark ? "text-gray-400" : "text-gray-600")}>
        {getNoResultsMessage(dateFilter)}
      </p>
    </CardContent>
  </Card>
));

AppointmentsEmptyState.displayName = 'AppointmentsEmptyState';

// Table Header Component
const AppointmentsTableHeader = memo(({ isDark }) => (
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
        Date & Time
      </th>
      <th className={cn(
        "px-4 py-3 sm:px-6 text-left text-xs font-semibold",
        isDark ? "text-gray-300" : "text-gray-700"
      )}>
        Patient ID
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
        Approval
      </th>
      <th className={cn(
        "px-4 py-3 sm:px-6 text-left text-xs font-semibold whitespace-nowrap",
        isDark ? "text-gray-300" : "text-gray-700"
      )}>
        Actions
      </th>
    </tr>
  </thead>
));

AppointmentsTableHeader.displayName = 'AppointmentsTableHeader';

// Appointments Table Component
const AppointmentsTable = memo(({ 
  appointments, 
  isDark,
  isLoading,
  onViewDetails,
  onMarkComplete,
  onDelete,
  onApprove,
  onReject,
  dateFilter
}) => {
  const filtered = useMemo(() => {
    return filterAppointmentsByDate(appointments, dateFilter);
  }, [appointments, dateFilter]);

  if (filtered.length === 0) {
    return <AppointmentsEmptyState isDark={isDark} dateFilter={dateFilter} />;
  }

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden",
      isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white"
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <AppointmentsTableHeader isDark={isDark} />
          <tbody>
            {filtered.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                isDark={isDark}
                onViewDetails={onViewDetails}
                onMarkComplete={onMarkComplete}
                onDelete={onDelete}
                onApprove={onApprove}
                onReject={onReject}
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
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  dateFilter: PropTypes.string.isRequired,
};

// Detail Modal Component - Comprehensive Patient Details
const AppointmentDetailsModal = memo(({ 
  appointment, 
  isOpen, 
  onClose,
  isDark,
  onApprove,
  onReject,
  isLoading
}) => {
  const handleApprove = useCallback(() => {
    if (onApprove && appointment) {
      onApprove(appointment);
    }
  }, [appointment, onApprove]);

  const handleReject = useCallback(() => {
    if (onReject && appointment) {
      onReject(appointment);
    }
  }, [appointment, onReject]);

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <Card className={cn(
        "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border-0",
        isDark ? "bg-slate-800" : "bg-white"
      )}>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <Avatar className={cn("w-20 h-20 ring-4 flex-shrink-0", isDark ? "ring-slate-700" : "ring-gray-200")}>
                <AvatarImage src={appointment.patientAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {appointment.patientName?.charAt(0) || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className={cn("text-3xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>
                  {appointment.patientName || 'Patient Name'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn("text-xs", getStatusColor(appointment.status))}>
                    {appointment.status?.toUpperCase() || 'PENDING'}
                  </Badge>
                  {appointment.appointmentType && (
                    <Badge variant="secondary" className={cn(
                      "text-xs",
                      isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"
                    )}>
                      {appointment.appointmentType}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Divider */}
          <div className={cn("h-px", isDark ? "bg-slate-700" : "bg-gray-200")} />

          {/* Personal Information Section */}
          <PersonalInfoSection appointment={appointment} isDark={isDark} />

          {/* Divider */}
          <div className={cn("h-px", isDark ? "bg-slate-700" : "bg-gray-200")} />

          {/* Appointment Information Section */}
          <AppointmentInfoSection appointment={appointment} isDark={isDark} />

          {/* Divider */}
          <div className={cn("h-px", isDark ? "bg-slate-700" : "bg-gray-200")} />

          {/* Approval Actions Section */}
          <ApprovalActionsSection 
            appointment={appointment} 
            isDark={isDark}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={isLoading}
          />

          {/* Divider */}
          <div className={cn("h-px", isDark ? "bg-slate-700" : "bg-gray-200")} />

          {/* Close Button */}
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
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  isLoading: PropTypes.bool,
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
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter(apt => {
      const name = (apt.patientName || '').toLowerCase();
      const phone = (apt.patientPhone || '').toLowerCase();
      const pid = ((apt.patientId || apt.hospitalId) || '').toLowerCase();
      const dateStr = apt.appointmentDate ? format(new Date(apt.appointmentDate), 'MMM d, yyyy').toLowerCase() : '';

      return (
        name.includes(q) ||
        phone.includes(q) ||
        pid.includes(q) ||
        dateStr.includes(q)
      );
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
    if (!globalThis.confirm('Are you sure you want to delete this appointment?')) {
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

  // Approve appointment
  const handleApproveAppointment = useCallback(async (appointment) => {
    try {
      setActionLoading(true);
      await approveAppointmentService(appointment.id);
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointment.id
            ? { ...apt, status: 'approved' }
            : apt
        )
      );
      setSelectedAppointment(prev =>
        prev && prev.id === appointment.id
          ? { ...prev, status: 'approved' }
          : prev
      );
      toast({
        title: "Success",
        description: "Appointment approved"
      });
    } catch (err) {
      console.error('Approve error:', err);
      toast({
        title: "Error",
        description: "Failed to approve appointment",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  }, [toast]);

  // Reject appointment
  const handleRejectAppointment = useCallback(async (appointment) => {
    if (!globalThis.confirm('Are you sure you want to reject this appointment?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      await rejectAppointmentService(appointment.id);
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointment.id
            ? { ...apt, status: 'rejected' }
            : apt
        )
      );
      setSelectedAppointment(prev =>
        prev && prev.id === appointment.id
          ? { ...prev, status: 'rejected' }
          : prev
      );
      toast({
        title: "Success",
        description: "Appointment rejected"
      });
    } catch (err) {
      console.error('Reject error:', err);
      toast({
        title: "Error",
        description: "Failed to reject appointment",
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
                  getFilterButtonClass(dateFilter === filter, isDark)
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
          onApprove={handleApproveAppointment}
          onReject={handleRejectAppointment}
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
        onApprove={handleApproveAppointment}
        onReject={handleRejectAppointment}
        isLoading={actionLoading}
      />
    </div>
  );
}

Appointments.propTypes = {
  doctorId: PropTypes.string,
};
