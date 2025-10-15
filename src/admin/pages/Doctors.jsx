'use client';

import { useState, useEffect, useMemo } from 'react';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '@/features/doctors/services/doctorService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, Plus, Mail, Phone, Stethoscope, User, Edit, Trash2, 
  Eye, RefreshCw, UserCheck, MapPin, Award
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    let filtered = [...doctors];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doctor => 
        doctor.name?.toLowerCase().includes(query) ||
        doctor.email?.toLowerCase().includes(query) ||
        doctor.specialization?.toLowerCase().includes(query) ||
        doctor.phone?.includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(doctor => doctor.status === filterStatus);
    }

    return filtered;
  }, [doctors, searchQuery, filterStatus]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      bio: '',
      imageUrl: '',
      status: 'active',
      licenseNumber: '',
      experience: '',
      education: '',
      address: ''
    });
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle add doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newDoctor = await createDoctor(formData);
      setDoctors(prev => [newDoctor, ...prev]);
      
      toast({
        title: "Success",
        description: "Doctor added successfully!",
      });
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast({
        title: "Error",
        description: "Failed to add doctor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit doctor
  const handleEditClick = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      specialization: doctor.specialization || '',
      bio: doctor.bio || '',
      imageUrl: doctor.imageUrl || '',
      status: doctor.status || 'active',
      licenseNumber: doctor.licenseNumber || '',
      experience: doctor.experience || '',
      education: doctor.education || '',
      address: doctor.address || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setIsSubmitting(true);

    try {
      const updatedDoctor = await updateDoctor(selectedDoctor.id, formData);
      setDoctors(prev => prev.map(doc => 
        doc.id === selectedDoctor.id ? { ...doc, ...updatedDoctor } : doc
      ));
      
      toast({
        title: "Success",
        description: "Doctor updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedDoctor(null);
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast({
        title: "Error",
        description: "Failed to update doctor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view doctor
  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewDialogOpen(true);
  };

  // Handle delete doctor
  const handleDeleteClick = (doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDoctor(doctorToDelete.id);
      setDoctors(prev => prev.filter(doc => doc.id !== doctorToDelete.id));
      
      toast({
        title: "Success",
        description: "Doctor deleted successfully.",
      });
      
      setIsDeleteDialogOpen(false);
      setDoctorToDelete(null);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      toast({
        title: "Error",
        description: "Failed to delete doctor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: doctors.length,
    active: doctors.filter(d => d.status === 'active').length,
    inactive: doctors.filter(d => d.status === 'inactive').length,
  }), [doctors]);

  // Render table content based on state
  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-purple-400 mb-3" />
          <p className="text-sm text-slate-300">Loading doctors...</p>
        </div>
      );
    }

    if (filteredDoctors.length > 0) {
      return (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                <TableHead className="text-left py-3 px-2 sm:px-4 font-semibold text-white">Doctor</TableHead>
                <TableHead className="text-center py-3 px-2 sm:px-4 font-semibold text-white hidden md:table-cell">Specialization</TableHead>
                <TableHead className="text-center py-3 px-2 sm:px-4 font-semibold text-white hidden lg:table-cell">Contact</TableHead>
                <TableHead className="text-center py-3 px-2 sm:px-4 font-semibold text-white hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-center py-3 px-2 sm:px-4 font-semibold text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id} className="hover:bg-slate-700/50 transition-colors border-slate-700">
                  <TableCell className="py-2 px-2 sm:py-3 sm:px-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
                        <AvatarFallback className="bg-purple-600 text-white text-sm font-bold">
                          {doctor.name?.charAt(0) || 'D'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left min-w-0">
                        <p className="font-semibold text-white text-xs sm:text-sm truncate">
                          {doctor.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                          {doctor.email}
                        </p>
                        {/* Mobile: Show specialization */}
                        <p className="text-[10px] text-purple-400 font-medium md:hidden mt-0.5">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-2 sm:py-3 sm:px-4 text-center hidden md:table-cell">
                    <span className="text-xs sm:text-sm font-medium text-purple-400">
                      {doctor.specialization}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 px-2 sm:py-3 sm:px-4 text-center hidden lg:table-cell">
                    <div className="space-y-1 text-xs text-slate-300">
                      <p>{doctor.phone}</p>
                      <p className="text-slate-500">{doctor.experience}y exp</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-2 sm:py-3 sm:px-4 text-center hidden sm:table-cell">
                    <Badge variant={doctor.status === 'active' ? "default" : "secondary"} className={doctor.status === 'active' ? "bg-green-600 hover:bg-green-700" : "bg-gray-600"}>
                      {doctor.status === 'active' ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 px-2 sm:py-3 sm:px-4 text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDoctor(doctor)}
                        className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700 text-slate-300"
                        title="View Details"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(doctor)}
                        className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700 text-slate-300"
                        title="Edit Doctor"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(doctor)}
                        className="h-8 w-8 p-0 border-slate-600 hover:bg-red-900/20 text-red-400 hover:text-red-300"
                        title="Delete Doctor"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
      <div className="p-8 text-center">
        <Stethoscope className="h-12 w-12 mx-auto text-slate-500 mb-3" />
        <p className="text-sm text-slate-400">No doctors found</p>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <AdminPageHeader  
        title="Doctors"
        description="Manage healthcare professionals and medical staff"
        icon={Stethoscope}
        gradient="from-purple-500 to-pink-500"
        actions={[
          <Button 
            key="refresh"
            variant="outline"
            size="sm"
            onClick={fetchDoctors}
            disabled={loading}
            className="border-2 border-slate-600 hover:bg-slate-700 text-slate-300"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>,
          <Button 
            key="add"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add New Doctor</span>
            <span className="sm:hidden">Add</span>
          </Button>
        ]}
        stats={[
          {
            label: "Total",
            value: stats.total,
            icon: Stethoscope,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600"
          },
          {
            label: "Active",
            value: stats.active,
            icon: UserCheck,
            iconBg: "bg-green-50",
            iconColor: "text-green-600"
          },
          {
            label: "Inactive",
            value: stats.inactive,
            icon: User,
            iconBg: "bg-gray-50",
            iconColor: "text-gray-600"
          }
        ]}
      />

      {/* Search and Filters */}
      <Card className="shadow-sm border-0 bg-slate-800 border-slate-700">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search by name, email, specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 sm:h-10 text-sm bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-36 h-9 sm:h-10 text-sm bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="!bg-slate-700 !border-slate-600 !text-white" style={{backgroundColor: 'rgb(51 65 85)', color: 'white'}}>
                <SelectItem value="all" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">All Status</SelectItem>
                <SelectItem value="active" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">Active</SelectItem>
                <SelectItem value="inactive" className="!text-white !bg-slate-700 hover:!bg-slate-600 focus:!bg-slate-600 focus:!text-white cursor-pointer">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table */}
      <Card className="shadow-sm border-0 bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          {renderTableContent()}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
          setSelectedDoctor(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isEditDialogOpen ? 'Edit Doctor' : 'Add New Doctor'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {isEditDialogOpen ? 'Update doctor information below' : 'Fill in the details to add a new doctor'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={isEditDialogOpen ? handleUpdateDoctor : handleAddDoctor} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Dr. John Doe"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="doctor@hospital.com"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  required
                  placeholder="Cardiology"
                />
              </div>

              {/* License Number */}
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  placeholder="MD-12345"
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="10"
                />
              </div>

              {/* Status */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({...formData, education: e.target.value})}
                placeholder="MD from Harvard Medical School"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123 Medical Center Drive"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Profile Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / Description</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Brief description about the doctor..."
                rows={3}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsEditDialogOpen(false);
                  resetForm();
                  setSelectedDoctor(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {isEditDialogOpen ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {isEditDialogOpen ? 'Update Doctor' : 'Add Doctor'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Doctor Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Doctor Details</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Complete information about the doctor
            </DialogDescription>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="space-y-6 mt-4">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b">
                <Avatar className="h-24 w-24 border-4 border-purple-200">
                  <AvatarImage src={selectedDoctor.imageUrl} alt={selectedDoctor.name} />
                  <AvatarFallback className="bg-purple-600 text-white text-3xl">
                    {selectedDoctor.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                  <p className="text-sm text-purple-600 font-medium">{selectedDoctor.specialization}</p>
                  <Badge 
                    variant={selectedDoctor.status === 'active' ? 'default' : 'secondary'}
                    className={`mt-2 ${selectedDoctor.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}
                  >
                    {selectedDoctor.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  <div>
                    <span className="text-xs text-muted-foreground">Email</span>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedDoctor.email}
                    </p>
                  </div>
                  {selectedDoctor.phone && (
                    <div>
                      <span className="text-xs text-muted-foreground">Phone</span>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedDoctor.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Professional Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  {selectedDoctor.licenseNumber && (
                    <div>
                      <span className="text-xs text-muted-foreground">License Number</span>
                      <p className="text-sm font-medium text-gray-900">{selectedDoctor.licenseNumber}</p>
                    </div>
                  )}
                  {selectedDoctor.experience && (
                    <div>
                      <span className="text-xs text-muted-foreground">Experience</span>
                      <p className="text-sm font-medium text-gray-900">{selectedDoctor.experience} years</p>
                    </div>
                  )}
                  {selectedDoctor.education && (
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground">Education</span>
                      <p className="text-sm font-medium text-gray-900">{selectedDoctor.education}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {selectedDoctor.address && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    Address
                  </h4>
                  <p className="text-sm text-gray-700 pl-7">{selectedDoctor.address}</p>
                </div>
              )}

              {/* Bio */}
              {selectedDoctor.bio && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">About</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedDoctor.bio}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t space-y-2">
                {selectedDoctor.createdAt && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Joined</span>
                    <span>{new Date(selectedDoctor.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false);
                handleEditClick(selectedDoctor);
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Doctor
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this doctor? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {doctorToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 my-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={doctorToDelete.imageUrl} alt={doctorToDelete.name} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {doctorToDelete.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{doctorToDelete.name}</p>
                  <p className="text-sm text-gray-600">{doctorToDelete.specialization}</p>
                  <p className="text-xs text-gray-500">{doctorToDelete.email}</p>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
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