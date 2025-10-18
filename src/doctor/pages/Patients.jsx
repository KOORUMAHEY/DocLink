'use client';

/* eslint-disable react/prop-types */

import { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { getSavedPatientsForDoctor } from '@/features/patients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Phone, Mail, Calendar, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme';

// Memoized Patient Card Component - Mobile Optimized
const PatientCard = memo(({ 
  patient, 
  isExpanded, 
  onToggleExpand,
  isDark
}) => (
  <Card 
    className={cn(
      "cursor-pointer transition-all duration-200 border-l-4 border-l-blue-500",
      isDark 
        ? "bg-slate-800 hover:bg-slate-800/90" 
        : "bg-white hover:bg-slate-50",
      isExpanded 
        ? isDark 
          ? "ring-2 ring-blue-400 shadow-md" 
          : "ring-2 ring-blue-500 shadow-md" 
        : "hover:shadow-sm"
    )}
    onClick={() => onToggleExpand(patient.id)}
  >
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <AvatarImage src={patient.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs font-bold">
              {patient.name?.charAt(0) || 'P'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h3 className={cn("font-semibold text-sm sm:text-base truncate", isDark ? "text-white" : "text-gray-900")}>
                  {patient.name}
                </h3>
                <p className={cn("text-xs sm:text-sm", isDark ? "text-slate-400" : "text-gray-500")}>
                  {patient.age} years • {patient.gender || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 mt-1 sm:gap-2">
              {patient.bloodType && (
                <Badge variant="secondary" className={cn("text-xs", isDark ? "bg-slate-700 text-slate-200" : "")}>
                  {patient.bloodType}
                </Badge>
              )}
              {patient.lastVisit && (
                <Badge className={cn("text-xs", isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-100 text-blue-800 border-blue-300")}>
                  {patient.totalVisits || 0} visits
                </Badge>
              )}
            </div>
          </div>
        </div>

        <ChevronRight 
          className={cn(
            "w-5 h-5 flex-shrink-0 transition-transform duration-200",
            isDark ? "text-slate-500" : "text-gray-400",
            isExpanded && "rotate-90"
          )}
        />
      </div>

      {/* Expanded Details - Mobile Responsive */}
      {isExpanded && (
        <div className={cn(
          "mt-4 pt-4 border-t space-y-2 sm:space-y-3",
          isDark ? "border-slate-700" : "border-gray-100"
        )}>
          <div className="grid gap-2 sm:gap-3">
            <div className="flex items-start gap-2">
              <Phone className={cn("w-4 h-4 flex-shrink-0 mt-0.5", isDark ? "text-slate-500" : "text-gray-400")} />
              <div>
                <p className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>Phone</p>
                <p className={cn("text-sm font-medium break-all", isDark ? "text-slate-200" : "text-gray-900")}>
                  {patient.phone || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className={cn("w-4 h-4 flex-shrink-0 mt-0.5", isDark ? "text-slate-500" : "text-gray-400")} />
              <div>
                <p className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>Email</p>
                <p className={cn("text-sm font-medium break-all", isDark ? "text-slate-200" : "text-gray-900")}>
                  {patient.email || 'Not provided'}
                </p>
              </div>
            </div>

            {patient.lastVisit && (
              <div className="flex items-start gap-2">
                <Calendar className={cn("w-4 h-4 flex-shrink-0 mt-0.5", isDark ? "text-slate-500" : "text-gray-400")} />
                <div>
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>Last Visit</p>
                  <p className={cn("text-sm font-medium", isDark ? "text-slate-200" : "text-gray-900")}>
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 text-xs sm:text-sm"
            >
              View Records
            </Button>
            <Button 
              size="sm" 
              variant="default"
              className="flex-1 text-xs sm:text-sm"
            >
              New Appointment
            </Button>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
));

PatientCard.displayName = 'PatientCard';

PatientCard.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    age: PropTypes.number,
    gender: PropTypes.string,
    avatar: PropTypes.string,
    bloodType: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    lastVisit: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    totalVisits: PropTypes.number,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

// Loading Skeleton - Mobile Optimized
const PatientsLoadingSkeleton = ({ isDark }) => (
  <div className="space-y-3 sm:space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} className={cn("h-20 sm:h-24 w-full rounded-lg", isDark ? "bg-slate-700" : "")} />
    ))}
  </div>
);

// Stat Card Component
const StatCard = memo(({ label, value, description, icon: Icon, isDark }) => (
  <Card className={cn("border-0 shadow-sm hover:shadow-md transition-shadow", isDark ? "bg-slate-800" : "")}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className={cn("text-xs sm:text-sm font-medium", isDark ? "text-slate-300" : "")}>{label}</CardTitle>
      <Icon className={cn("h-4 w-4", isDark ? "text-slate-500" : "text-gray-400")} />
    </CardHeader>
    <CardContent>
      <div className={cn("text-xl sm:text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>{value}</div>
      <p className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>{description}</p>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default function Patients({ doctorId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const loadPatients = async () => {
      if (doctorId) {
        setLoading(true);
        try {
          const data = await getSavedPatientsForDoctor(doctorId);
          setPatients(data);
        } catch (err) {
          console.error('Error loading patients:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPatients();
  }, [doctorId]);

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone?.includes(searchQuery)
  );

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.lastVisit).length,
    newThisMonth: patients.filter(p => {
      const createdAt = p.createdAt?.toDate?.() || new Date(p.createdAt);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return createdAt > monthAgo;
    }).length,
  };

  if (loading) {
    return (
      <div className={cn("min-h-screen p-3 sm:p-6 lg:p-8", isDark ? "bg-slate-900" : "bg-gray-50")}>
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <PatientsLoadingSkeleton isDark={isDark} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen p-3 sm:p-6 lg:p-8", isDark ? "bg-slate-900" : "bg-gray-50")}>
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className={cn("text-2xl sm:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
            My Patients
          </h1>
          <p className={cn("text-sm sm:text-base", isDark ? "text-slate-400" : "text-gray-600")}>
            View and manage your saved patients
          </p>
        </div>

        {/* Search */}
        <Card className={cn("border-0 shadow-sm", isDark ? "bg-slate-800" : "")}>
          <CardContent className="p-3 sm:p-4">
            <div className="relative">
              <Search className={cn("absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4", isDark ? "text-slate-500" : "text-gray-400")} />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn("pl-10 h-9 sm:h-10 text-sm", isDark ? "bg-slate-700 border-slate-600 text-white" : "")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid - Responsive */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <StatCard
            label="Total Patients"
            value={stats.total}
            description="All time"
            icon={Users}
            isDark={isDark}
          />
          <StatCard
            label="Active"
            value={stats.active}
            description="With appointments"
            icon={Calendar}
            isDark={isDark}
          />
          <StatCard
            label="New This Month"
            value={stats.newThisMonth}
            description="Last 30 days"
            icon={Users}
            isDark={isDark}
          />
        </div>

        {/* Patients List - Card Grid */}
        <div>
          <div className="mb-4">
            <h2 className={cn("text-lg sm:text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>
              Patient List
            </h2>
            <p className={cn("text-xs sm:text-sm mt-1", isDark ? "text-slate-400" : "text-gray-600")}>
              {filteredPatients.length} patient{filteredPatients.length === 1 ? '' : 's'}
            </p>
          </div>

          {filteredPatients.length === 0 ? (
            <Card className={cn("border-0 shadow-sm", isDark ? "bg-slate-800" : "")}>
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <Users className={cn("w-12 h-12 mb-4", isDark ? "text-slate-600" : "text-gray-300")} />
                <h3 className={cn("text-base sm:text-lg font-semibold mb-2", isDark ? "text-slate-300" : "text-gray-700")}>
                  No Patients Found
                </h3>
                <p className={cn("text-xs sm:text-sm text-center max-w-xs", isDark ? "text-slate-400" : "text-gray-600")}>
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'No patients saved yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  isExpanded={expandedPatientId === patient.id}
                  onToggleExpand={(id) => 
                    setExpandedPatientId(expandedPatientId === id ? null : id)
                  }
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Patients.propTypes = {
  doctorId: PropTypes.string,
};
