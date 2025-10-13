
import { getUniquePatients } from '@/features/patients';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, User, Phone, Mail, Calendar, Filter, Eye, Plus, TrendingUp, Activity } from 'lucide-react';
import { Suspense } from 'react';

function PatientsTableSkeleton() {
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

export default async function AdminPatientsPage() {
  const patients = await getUniquePatients();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Patients
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1">Manage patient records and information</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" className="border-2 hover:bg-gray-50 transition-all duration-200 shadow-sm w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Patient</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Patients</p>
                  <p className="text-4xl font-bold text-blue-900">{patients.length}</p>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Active Patients</p>
                  <p className="text-4xl font-bold text-green-900">
                    {patients.filter(p => p.isActive !== false).length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Activity className="h-4 w-4" />
                    <span>98% active rate</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">New This Month</p>
                  <p className="text-4xl font-bold text-purple-900">
                    {patients.filter(p => {
                      const createdDate = new Date(p.createdAt || Date.now());
                      const now = new Date();
                      return createdDate.getMonth() === now.getMonth() &&
                             createdDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <Calendar className="h-4 w-4" />
                    <span>This month</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search patients by name, hospital ID, or contact information..."
                className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">All Patients</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Complete list of registered patients in the system
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-5 w-5" />
                <span className="font-semibold">{patients.length} total</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense fallback={<PatientsTableSkeleton />}>
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <TableRow className="hover:bg-gray-100/50 border-b border-gray-200">
                      <TableHead className="font-bold text-gray-900 py-6 px-8">Patient</TableHead>
                      <TableHead className="hidden sm:table-cell font-bold text-gray-900 py-6 px-8 text-center">Hospital ID</TableHead>
                      <TableHead className="hidden md:table-cell font-bold text-gray-900 py-6 px-8 text-center">Contact</TableHead>
                      <TableHead className="hidden md:table-cell font-bold text-gray-900 py-6 px-8 text-center">Gender</TableHead>
                      <TableHead className="hidden lg:table-cell font-bold text-gray-900 py-6 px-8 text-center">Status</TableHead>
                      <TableHead className="text-right font-bold text-gray-900 py-6 px-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {patients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative">
                            <div className="h-24 w-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              <Users className="h-12 w-12 text-blue-600" />
                            </div>
                            <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Plus className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">No patients found</h3>
                            <p className="text-lg text-muted-foreground max-w-md">
                              Patient records will appear here once appointments are booked. Start by adding your first patient.
                            </p>
                          </div>
                          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg">
                            <Plus className="mr-2 h-5 w-5" />
                            Add First Patient
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((patient) => (
                      <TableRow key={patient.hospitalId} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 border-b border-gray-100 group">
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
                        <TableCell className="text-right py-6 px-8">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg">
                            <Eye className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Suspense>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
