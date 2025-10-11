
'use client';
import { getSavedPatientsForDoctor } from '@/services/patientService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Phone, Mail, Calendar, TrendingUp, Activity } from 'lucide-react';

function DoctorPatientsContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      const fetchPatients = async () => {
        setLoading(true);
        try {
            const savedPatients = await getSavedPatientsForDoctor(doctorId);
            setPatients(savedPatients);
        } catch(e) {
            console.error(e);
            setPatients([]);
        }
        setLoading(false);
      };
      fetchPatients();
    }
  }, [doctorId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-6 border border-gray-100 rounded-xl bg-gradient-to-r from-gray-50 to-white animate-pulse">
            <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
            <div className="space-y-3 flex-1">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  My Patients
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1">Manage your saved patients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Total Patients</p>
                  <p className="text-4xl font-bold text-purple-900">{patients.length}</p>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Saved patients</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Active Patients</p>
                  <p className="text-4xl font-bold text-green-900">
                    {patients.filter(p => p.isActive !== false).length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Activity className="h-4 w-4" />
                    <span>Regular visits</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Recent Activity</p>
                  <p className="text-4xl font-bold text-blue-900">
                    {patients.filter(p => {
                      const lastVisit = new Date(p.lastVisit || p.createdAt || Date.now());
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return lastVisit > weekAgo;
                    }).length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Calendar className="h-4 w-4" />
                    <span>Last 7 days</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>
        </div>

        {/* Patients Table */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Saved Patients</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  A list of your saved patients for quick access.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-5 w-5" />
                <span className="font-semibold">{patients.length} saved</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {patients.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">No saved patients</h3>
                    <p className="text-lg text-muted-foreground max-w-md">
                      You haven&apos;t saved any patients yet. Save patients from appointment details to access them quickly here.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <TableRow className="hover:bg-gray-100/50 border-b border-gray-200">
                      <TableHead className="font-bold text-gray-900 py-6 px-8">Patient</TableHead>
                      <TableHead className="hidden sm:table-cell font-bold text-gray-900 py-6 px-8 text-center">Hospital ID</TableHead>
                      <TableHead className="hidden md:table-cell font-bold text-gray-900 py-6 px-8 text-center">Contact</TableHead>
                      <TableHead className="hidden md:table-cell font-bold text-gray-900 py-6 px-8 text-center">Gender</TableHead>
                      <TableHead className="hidden lg:table-cell font-bold text-gray-900 py-6 px-8 text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient, index) => (
                      <TableRow key={`${patient.hospitalId}-${index}`} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 border-b border-gray-100 group">
                        <TableCell className="py-6 px-8">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200">
                              <AvatarImage src={patient.imageUrl} alt={patient.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {patient.name ? patient.name.charAt(0) : 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                                {patient.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Age: {patient.age || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-center py-6 px-8">
                          <Badge variant="outline" className="font-mono text-sm px-3 py-1 border-2 border-gray-300 hover:border-blue-400 transition-colors">
                            {patient.hospitalId}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center py-6 px-8">
                          <div className="space-y-3">
                            {patient.phone && (
                              <div className="flex items-center justify-center gap-2 text-sm hover:bg-gray-50 rounded-lg p-2 transition-colors">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-gray-900 font-medium">{patient.phone}</span>
                              </div>
                            )}
                            {patient.email && (
                              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-gray-50 rounded-lg p-2 transition-colors">
                                <Mail className="h-4 w-4" />
                                <span className="font-medium">{patient.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center py-6 px-8">
                          <Badge
                            variant="secondary"
                            className={`capitalize text-sm px-4 py-2 font-semibold ${
                              patient.gender === 'male' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' :
                              patient.gender === 'female' ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border border-pink-300' :
                              'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
                            }`}
                          >
                            {patient.gender || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-center py-6 px-8">
                          <Badge
                            variant={patient.isActive !== false ? "default" : "secondary"}
                            className={`text-sm px-4 py-2 font-semibold ${
                              patient.isActive !== false
                                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 hover:from-green-200 hover:to-green-300"
                                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300"
                            }`}
                          >
                            {patient.isActive !== false ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function DoctorPatientsPage() {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-6 lg:p-8">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div>
                <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse mt-2"></div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-xl shadow-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      }>
        <DoctorPatientsContent />
      </Suspense>
    );
}
