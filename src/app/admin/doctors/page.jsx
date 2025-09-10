
import { getDoctors } from '@/services/doctorService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { MoreHorizontal, Search, Plus, Eye, Edit, Trash2, Mail, Phone, MapPin, TrendingUp, Activity, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Suspense } from 'react';

function DoctorsTableSkeleton() {
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

export default async function AdminDoctorsPage() {
  const doctors = await getDoctors();

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
                  Doctors
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1">Manage your team of healthcare professionals</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" className="border-2 hover:bg-gray-50 transition-all duration-200 shadow-sm w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
              <Link href="/admin/doctors/new">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Doctor</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Total Doctors</p>
                  <p className="text-4xl font-bold text-purple-900">{doctors.length}</p>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+15% from last month</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{doctors.length}</span>
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Active Doctors</p>
                  <p className="text-4xl font-bold text-green-900">
                    {doctors.filter(d => d.isActive !== false).length}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Activity className="h-4 w-4" />
                    <span>92% availability</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {doctors.filter(d => d.isActive !== false).length}
                  </span>
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">Specializations</p>
                  <p className="text-4xl font-bold text-indigo-900">
                    {new Set(doctors.map(d => d.specialization)).size}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-indigo-600">
                    <MapPin className="h-4 w-4" />
                    <span>Diverse expertise</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {new Set(doctors.map(d => d.specialization)).size}
                  </span>
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200/20 rounded-full -mr-10 -mt-10"></div>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="relative max-w-full sm:max-w-md">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Search doctors by name, specialization, or email..."
                className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-lg border-2 border-gray-200 focus:border-purple-500 transition-colors rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

      {/* Doctors Table */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">All Doctors</CardTitle>
              <CardDescription className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-1 sm:mt-2">
                Complete list of registered healthcare professionals
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold">{doctors.length} total</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<DoctorsTableSkeleton />}>
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <TableRow className="hover:bg-gray-100/50 border-b border-gray-200">
                    <TableHead className="font-bold text-gray-900 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8">Doctor</TableHead>
                    <TableHead className="hidden sm:table-cell font-bold text-gray-900 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8 text-center">Contact</TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-gray-900 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8 text-center">Specialization</TableHead>
                    <TableHead className="hidden lg:table-cell font-bold text-gray-900 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8 text-center">Status</TableHead>
                    <TableHead className="text-right font-bold text-gray-900 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 lg:px-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16">
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative">
                            <div className="h-24 w-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                              <Users className="h-12 w-12 text-purple-600" />
                            </div>
                            <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Plus className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">No doctors found</h3>
                            <p className="text-lg text-muted-foreground max-w-md">
                              Doctor records will appear here once healthcare professionals are added. Start by adding your first doctor.
                            </p>
                          </div>
                          <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg">
                            <Link href="/admin/doctors/new">
                              <Plus className="mr-2 h-5 w-5" />
                              Add First Doctor
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    doctors.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 border-b border-gray-100 group">
                        <TableCell className="py-6 px-8">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 ring-2 ring-gray-200 group-hover:ring-purple-300 transition-all duration-200">
                              <AvatarImage src={doc.imageUrl} alt={doc.name} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold">
                                {doc.name ? doc.name.charAt(0) : 'D'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <Link
                                href={`/doctors/${doc.id}`}
                                className="font-bold text-gray-900 text-lg group-hover:text-purple-700 transition-colors"
                              >
                                {doc.name}
                              </Link>
                              <span className="text-sm text-muted-foreground">
                                {doc.specialization}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-center py-6 px-8">
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2 text-sm hover:bg-gray-50 rounded-lg p-2 transition-colors">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-gray-900 font-medium">{doc.email}</span>
                            </div>
                            {doc.phone && (
                              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-gray-50 rounded-lg p-2 transition-colors">
                                <Phone className="h-4 w-4" />
                                <span className="font-medium">{doc.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center py-6 px-8">
                          <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 hover:from-blue-200 hover:to-blue-300 transition-all duration-200 px-3 py-1">
                            {doc.specialization}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-center py-6 px-8">
                          <Badge
                            variant={doc.isActive !== false ? "default" : "secondary"}
                            className={`text-sm px-4 py-2 font-semibold ${
                              doc.isActive !== false
                                ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 hover:from-green-200 hover:to-green-300"
                                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300"
                            }`}
                          >
                            {doc.isActive !== false ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-6 px-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 rounded-lg">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/doctors/${doc.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
