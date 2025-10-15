'use client';

import { useState, useEffect, useMemo } from 'react';
import { getUniquePatients, createOrUpdatePatient, updatePatient, deletePatient } from '@/features/patients/services/patientService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, Plus, Mail, Phone, Users, User, Edit, Trash2, 
  Eye, RefreshCw, Activity, Calendar, MapPin, UserCheck
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

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Render table content based on state
  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-400 mb-3" />
          <p className="text-sm text-slate-300">Loading patients...</p>
        </div>
      );
    }

    if (filteredPatients.length > 0) {
      return (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                <TableHead className="text-left py-3 px-2 sm:px-4 font-semibold text-white">Patient</TableHead>
                <TableHead className="text-center py-3 px-2 sm:px-4 font-semibold text-white hidden md:table-cell">Hospital ID</TableHead>
                <TableHead className="text-center py-3 px-2 sm:px-4 font-semibold text-white hidden lg:table-cell">Contact</TableHead>
                <TableHead className="text-center py-3 px-2 sm:px-4 font-semibold text-white hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-center py-3 px-2 sm:px-4 font-semibold text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
  const [formData, setFormData] = useState({
    hospitalId: '',
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    photoURL: '',
    isActive: true
  });

  // Fetch patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getUniquePatients();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients
  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name?.toLowerCase().includes(query) ||
        patient.email?.toLowerCase().includes(query) ||
        patient.phone?.includes(query) ||
        patient.hospitalId?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(patient => {
        if (filterStatus === 'active') return patient.isActive !== false;
        if (filterStatus === 'inactive') return patient.isActive === false;
        return true;
      });
    }

    return filtered;
  }, [patients, searchQuery, filterStatus]);

  // Reset form
  const resetForm = () => {
    setFormData({
      hospitalId: '',
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      bloodGroup: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
      photoURL: '',
      isActive: true
    });
  };

  // Generate hospital ID
  const generateHospitalId = () => {
    const prefix = 'PT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Handle add patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hospitalId = generateHospitalId();
      const patientData = {
        hospitalId,
        patientName: formData.name,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
        photoURL: formData.photoURL,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
      };

      await createOrUpdatePatient(patientData);
      
      // Add to local state
      setPatients(prev => [{
        hospitalId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
        photoURL: formData.photoURL,
        isActive: formData.isActive,
      }, ...prev]);
      
      toast({
        title: "Success",
        description: "Patient added successfully!",
      });
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit patient
  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      hospitalId: patient.hospitalId || '',
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      age: patient.age || '',
      gender: patient.gender || '',
      bloodGroup: patient.bloodGroup || '',
      address: patient.address || '',
      emergencyContact: patient.emergencyContact || '',
      medicalHistory: patient.medicalHistory || '',
      photoURL: patient.photoURL || '',
      isActive: patient.isActive !== false
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setIsSubmitting(true);

    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
        photoURL: formData.photoURL,
        isActive: formData.isActive,
      };

      await updatePatient(selectedPatient.hospitalId, updatedData);
      
      setPatients(prev => prev.map(p => 
        p.hospitalId === selectedPatient.hospitalId ? { ...p, ...updatedData } : p
      ));
      
      toast({
        title: "Success",
        description: "Patient updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: "Failed to update patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view patient
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  // Handle delete patient
  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;

    setIsDeleting(true);
    try {
      await deletePatient(patientToDelete.hospitalId);
      setPatients(prev => prev.filter(p => p.hospitalId !== patientToDelete.hospitalId));
      
      toast({
        title: "Success",
        description: "Patient deleted successfully.",
      });
      
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: patients.length,
    active: patients.filter(p => p.isActive !== false).length,
    inactive: patients.filter(p => p.isActive === false).length,
  }), [patients]);

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
            key="refresh"
            variant="outline"
            size="sm"
            onClick={fetchPatients}
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add New Patient</span>
            <span className="sm:hidden">Add</span>
          </Button>
        ]}
        stats={[
          {
            label: "Total",
            value: stats.total,
            icon: Users,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
          },
          {
            label: "Active",
            value: stats.active,
            icon: Activity,
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
                  placeholder="Search by name, email, phone, hospital ID..."
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

      {/* Patients Table */}
      <Card className="shadow-sm border-0 bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          {renderTableContent()}
        </CardContent>
                <TableBody>
                  {filteredPatients.map((patient, index) => (
                    <TableRow key={patient.hospitalId || patient.id || `patient-${index}`} className="hover:bg-slate-700/50 transition-colors border-slate-700">
                      {/* Patient Info */}
                      <TableCell className="py-2 px-2 sm:py-3 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                            <AvatarImage src={patient.photoURL} alt={patient.name} />
                            <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                              {patient.name?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left min-w-0">
                            <p className="font-semibold text-white text-xs sm:text-sm truncate">
                              {patient.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                              {patient.email}
                            </p>
                            {/* Mobile: Show hospital ID */}
                            <p className="text-[10px] text-blue-400 font-medium md:hidden mt-0.5">
                              {patient.hospitalId}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Hospital ID - Hidden on mobile */}
                      <TableCell className="py-2 px-2 sm:py-3 sm:px-4 text-center hidden md:table-cell">
                        <span className="text-xs sm:text-sm font-medium text-blue-400">
                          {patient.hospitalId}
                        </span>
                      </TableCell>

                      {/* Contact - Hidden on tablet and mobile */}
                      <TableCell className="py-2 px-2 sm:py-3 sm:px-4 text-center hidden lg:table-cell">
                        <div className="space-y-1 text-xs text-slate-300">
                          {patient.phone && (
                            <div className="flex items-center justify-center gap-1.5">
                              <Phone className="h-3 w-3 text-slate-400" />
                              <span>{patient.phone}</span>
                            </div>
                          )}
                          {patient.age && (
                            <div className="flex items-center justify-center gap-1.5">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              <span>{patient.age} years</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Status - Hidden on mobile */}
                      <TableCell className="py-2 px-2 sm:py-3 sm:px-4 text-center hidden sm:table-cell">
                        <div className="flex justify-center">
                          <Badge 
                            variant={patient.isActive !== false ? 'default' : 'secondary'}
                            className={`text-[10px] sm:text-xs ${
                              patient.isActive !== false ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          >
                            {patient.isActive !== false ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-2 px-2 sm:py-3 sm:px-4">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPatient(patient)}
                            className="h-7 px-2 sm:h-8 sm:px-3 text-xs hover:bg-blue-600 hover:border-blue-500 hover:text-white border-slate-600 text-slate-300"
                          >
                            <Eye className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(patient)}
                            className="h-7 px-2 sm:h-8 sm:px-3 text-xs hover:bg-indigo-600 hover:border-indigo-500 hover:text-white border-slate-600 text-slate-300"
                          >
                            <Edit className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(patient)}
                            className="h-7 px-2 sm:h-8 sm:px-2 text-xs hover:bg-red-600 hover:border-red-500 hover:text-white border-slate-600 text-slate-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
                            </TableBody>
              </Table>
            </div>
          );
    }

    // Empty state
    return (
      <div className="p-12 text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center">
          <Users className="h-10 w-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {searchQuery || filterStatus !== 'all' ? 'No patients found' : 'No Patients Yet'}
        </h3>
        <p className="text-slate-400 max-w-md mx-auto text-sm">
          {searchQuery || filterStatus !== 'all' 
            ? 'Try adjusting your search or filters'
            : 'Get started by adding your first patient to the system.'}
        </p>
        {!searchQuery && filterStatus === 'all' && (
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Patient
          </Button>
        )}
      </div>
    );
  };

  // Form state for add/edit
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
          setSelectedPatient(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isEditDialogOpen ? 'Edit Patient' : 'Add New Patient'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {isEditDialogOpen ? 'Update patient information below' : 'Fill in the details to add a new patient'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={isEditDialogOpen ? handleUpdatePatient : handleAddPatient} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="John Doe"
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
                  placeholder="john@example.com"
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

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="25"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({...formData, bloodGroup: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  placeholder="+1 (555) 987-6543"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select 
                  value={formData.isActive ? 'active' : 'inactive'} 
                  onValueChange={(value) => setFormData({...formData, isActive: value === 'active'})}
                >
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

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123 Main Street, City, State"
              />
            </div>

            {/* Photo URL */}
            <div className="space-y-2">
              <Label htmlFor="photoURL">Profile Photo URL</Label>
              <Input
                id="photoURL"
                type="url"
                value={formData.photoURL}
                onChange={(e) => setFormData({...formData, photoURL: e.target.value})}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {/* Medical History */}
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={formData.medicalHistory}
                onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                placeholder="Any relevant medical history, allergies, etc."
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
                  setSelectedPatient(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {isEditDialogOpen ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {isEditDialogOpen ? 'Update Patient' : 'Add Patient'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Patient Details</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Complete information about the patient
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-6 mt-4">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b">
                <Avatar className="h-24 w-24 border-4 border-blue-200">
                  <AvatarImage src={selectedPatient.photoURL} alt={selectedPatient.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-3xl">
                    {selectedPatient.name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">ID: {selectedPatient.hospitalId}</p>
                  <Badge 
                    variant={selectedPatient.isActive !== false ? 'default' : 'secondary'}
                    className={`mt-2 ${selectedPatient.isActive !== false ? 'bg-green-500' : 'bg-gray-400'}`}
                  >
                    {selectedPatient.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  <div>
                    <span className="text-xs text-muted-foreground">Email</span>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedPatient.email}
                    </p>
                  </div>
                  {selectedPatient.phone && (
                    <div>
                      <span className="text-xs text-muted-foreground">Phone</span>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedPatient.phone}
                      </p>
                    </div>
                  )}
                  {selectedPatient.emergencyContact && (
                    <div>
                      <span className="text-xs text-muted-foreground">Emergency Contact</span>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedPatient.emergencyContact}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  Personal Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  {selectedPatient.age && (
                    <div>
                      <span className="text-xs text-muted-foreground">Age</span>
                      <p className="text-sm font-medium text-gray-900">{selectedPatient.age} years</p>
                    </div>
                  )}
                  {selectedPatient.gender && (
                    <div>
                      <span className="text-xs text-muted-foreground">Gender</span>
                      <p className="text-sm font-medium text-gray-900 capitalize">{selectedPatient.gender}</p>
                    </div>
                  )}
                  {selectedPatient.bloodGroup && (
                    <div>
                      <span className="text-xs text-muted-foreground">Blood Group</span>
                      <p className="text-sm font-medium text-red-600">{selectedPatient.bloodGroup}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {selectedPatient.address && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Address
                  </h4>
                  <p className="text-sm text-gray-700 pl-7">{selectedPatient.address}</p>
                </div>
              )}

              {/* Medical History */}
              {selectedPatient.medicalHistory && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Medical History</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedPatient.medicalHistory}</p>
                </div>
              )}
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
                handleEditClick(selectedPatient);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Patient
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
              Delete Patient
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this patient? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {patientToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 my-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={patientToDelete.photoURL} alt={patientToDelete.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {patientToDelete.name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{patientToDelete.name}</p>
                  <p className="text-sm text-gray-600">ID: {patientToDelete.hospitalId}</p>
                  <p className="text-xs text-gray-500">{patientToDelete.email}</p>
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