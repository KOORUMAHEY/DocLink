
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
import AdminPageHeader from '@/components/admin/AdminPageHeader';

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Patients"
        description="Manage patient records and information"
        icon={Users}
        gradient="from-blue-500 to-indigo-500"
        actions={[
          <Button 
            key="filter"
            variant="outline" 
            size="sm"
            className="border-2 hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>,
          <Button 
            key="new"
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Patient</span>
            <span className="sm:hidden">Add</span>
          </Button>
        ]}
        stats={[
          {
            label: "Total",
            value: patients.length,
            icon: Users,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
          },
          {
            label: "Active",
            value: patients.filter(p => p.isActive !== false).length,
            icon: Activity,
            iconBg: "bg-green-50",
            iconColor: "text-green-600"
          },
          {
            label: "New",
            value: "12",
            icon: TrendingUp,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600"
          }
        ]}
      />

      {/* Search and Filter */}
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="search"
              placeholder="Search patients by name, email, phone..."
              className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card className="shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Patient Records</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            View and manage all registered patients
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<PatientsTableSkeleton />}>
            {patients.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold">Patient</TableHead>
                      <TableHead className="font-semibold hidden md:table-cell">Contact</TableHead>
                      <TableHead className="font-semibold hidden sm:table-cell">Last Visit</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow 
                        key={patient.id}
                        className="hover:bg-blue-50/50 transition-colors group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarImage src={patient.photoURL} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs sm:text-sm">
                                {patient.name?.charAt(0) || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900 text-sm sm:text-base">
                                {patient.name}
                              </p>
                              <p className="text-xs text-gray-500 sm:hidden">{patient.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-[200px]">{patient.email}</span>
                            </div>
                            {patient.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{patient.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{patient.lastVisit || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={patient.isActive !== false ? "default" : "secondary"}
                            className={patient.isActive !== false ? "bg-green-500" : "bg-gray-400"}
                          >
                            {patient.isActive !== false ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="group-hover:bg-blue-50 group-hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="ml-2 hidden lg:inline">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">No Patients Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Get started by adding your first patient to the system.
                </p>
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Patient
                </Button>
              </div>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
