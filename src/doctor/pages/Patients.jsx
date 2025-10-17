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

// Memoized Patient Card Component - Mobile Optimized
const PatientCard = memo(({ 
  patient, 
  isExpanded, 
  onToggleExpand 
}) => (
  <Card 
    className={cn(
      "cursor-pointer transition-all duration-200 border-l-4 border-l-blue-500",
      isExpanded ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow-sm"
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
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {patient.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {patient.age} years • {patient.gender || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 mt-1 sm:gap-2">
              {patient.bloodType && (
                <Badge variant="secondary" className="text-xs">
                  {patient.bloodType}
                </Badge>
              )}
              {patient.lastVisit && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                  {patient.totalVisits || 0} visits
                </Badge>
              )}
            </div>
          </div>
        </div>

        <ChevronRight 
          className={cn(
            "w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        />
      </div>

      {/* Expanded Details - Mobile Responsive */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 sm:space-y-3">
          <div className="grid gap-2 sm:gap-3">
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900 break-all">
                  {patient.phone || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900 break-all">
                  {patient.email || 'Not provided'}
                </p>
              </div>
            </div>

            {patient.lastVisit && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Last Visit</p>
                  <p className="text-sm font-medium text-gray-900">
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
};

// Loading Skeleton - Mobile Optimized
const PatientsLoadingSkeleton = () => (
  <div className="space-y-3 sm:space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} className="h-20 sm:h-24 w-full rounded-lg" />
    ))}
  </div>
);

// Stat Card Component
const StatCard = memo(({ label, value, description, icon: Icon }) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium">{label}</CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-xl sm:text-2xl font-bold text-gray-900">{value}</div>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

export default function Patients({ doctorId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPatientId, setExpandedPatientId] = useState(null);

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
      <div className="min-h-screen p-3 sm:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <PatientsLoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Patients
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage your saved patients
          </p>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 sm:h-10 text-sm"
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
          />
          <StatCard
            label="Active"
            value={stats.active}
            description="With appointments"
            icon={Calendar}
          />
          <StatCard
            label="New This Month"
            value={stats.newThisMonth}
            description="Last 30 days"
            icon={Users}
          />
        </div>

        {/* Patients List - Card Grid */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Patient List
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {filteredPatients.length} patient{filteredPatients.length === 1 ? '' : 's'}
            </p>
          </div>

          {filteredPatients.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <Users className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  No Patients Found
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center max-w-xs">
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
