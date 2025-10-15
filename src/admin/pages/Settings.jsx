'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { 
  UserPlus, 
  Trash2, 
  Edit, 
  Shield, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllAdmins, 
  createAdmin, 
  updateAdmin, 
  deleteAdmin, 
  toggleAdminStatus,
  initializeSuperAdmin
} from '@/features/admin/services/adminService';

// Zod validation schema
const adminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters.'),
  phone: z.string().optional(),
  bio: z.string()
    .min(10, 'Bio must be at least 10 characters.')
    .optional()
    .or(z.literal('')),
});

const editAdminSchema = adminSchema.extend({
  password: z.string()
    .min(6, 'Password must be at least 6 characters.')
    .optional()
    .or(z.literal('')),
});

export default function AdminSettingsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogAdmin, setDeleteDialogAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
  });

  // Load admins
  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);

      // Initialize super admin if needed
      await initializeSuperAdmin();

      const adminsList = await getAllAdmins();
      setAdmins(adminsList);
    } catch (error) {
      console.error('Error loading admins:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admins',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleAddAdmin = async () => {
    try {
      // Clear previous errors
      setValidationErrors({});

      // Validate form data
      const validatedData = adminSchema.parse(formData);

      await createAdmin(validatedData);
      
      toast({
        title: 'Success',
        description: 'Admin added successfully',
      });

      setIsAddDialogOpen(false);
      setFormData({ name: '', email: '', password: '', phone: '', bio: '' });
      loadAdmins();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const errors = {};
        error.errors.forEach((err) => {
          const field = err.path[0];
          errors[field] = err.message;
        });
        setValidationErrors(errors);
        
        toast({
          title: 'Validation Error',
          description: 'Please fix the errors in the form',
          variant: 'destructive',
        });
      } else {
        console.error('Error adding admin:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to add admin',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEditAdmin = async () => {
    try {
      if (!selectedAdmin) return;

      // Clear previous errors
      setValidationErrors({});

      // Validate form data
      const validatedData = editAdminSchema.parse(formData);

      const updates = {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        bio: validatedData.bio,
      };

      // Only update password if provided
      if (validatedData.password) {
        updates.password = validatedData.password;
      }

      await updateAdmin(selectedAdmin.id, updates);
      
      toast({
        title: 'Success',
        description: 'Admin updated successfully',
      });

      setIsEditDialogOpen(false);
      setSelectedAdmin(null);
      setFormData({ name: '', email: '', password: '', phone: '', bio: '' });
      loadAdmins();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const errors = {};
        error.errors.forEach((err) => {
          const field = err.path[0];
          errors[field] = err.message;
        });
        setValidationErrors(errors);
        
        toast({
          title: 'Validation Error',
          description: 'Please fix the errors in the form',
          variant: 'destructive',
        });
      } else {
        console.error('Error updating admin:', error);
        toast({
          title: 'Error',
          description: 'Failed to update admin',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      if (!deleteDialogAdmin) return;

      // Prevent deleting super admin
      if (deleteDialogAdmin.isSuperAdmin) {
        toast({
          title: 'Error',
          description: 'Cannot delete super admin',
          variant: 'destructive',
        });
        return;
      }

      await deleteAdmin(deleteDialogAdmin.id);
      
      toast({
        title: 'Success',
        description: 'Admin deleted successfully',
      });

      setDeleteDialogAdmin(null);
      loadAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete admin',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      // Prevent deactivating super admin
      if (admin.isSuperAdmin && admin.status === 'active') {
        toast({
          title: 'Error',
          description: 'Cannot deactivate super admin',
          variant: 'destructive',
        });
        return;
      }

      const newStatus = admin.status === 'active' ? 'inactive' : 'active';
      await toggleAdminStatus(admin.id, newStatus);
      
      toast({
        title: 'Success',
        description: `Admin ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });

      loadAdmins();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      phone: admin.phone || '',
      bio: admin.bio || '',
    });
    setValidationErrors({});
    setIsEditDialogOpen(true);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddDialog = () => {
    setFormData({ name: '', email: '', password: '', phone: '', bio: '' });
    setValidationErrors({});
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setValidationErrors({});
    setFormData({ name: '', email: '', password: '', phone: '', bio: '' });
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setValidationErrors({});
    setSelectedAdmin(null);
    setFormData({ name: '', email: '', password: '', phone: '', bio: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2">
                Admin Settings
              </h1>
              <p className="text-gray-600">Manage admin users and system settings</p>
            </div>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              onClick={openAddDialog}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Add Admin
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{admins.length}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {admins.filter(a => a.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Inactive Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {admins.filter(a => a.status !== 'active').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin List */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Admin Users</CardTitle>
                <CardDescription>Manage all admin user accounts</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        No admins found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <TableRow key={admin.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {admin.name}
                            {admin.isSuperAdmin && (
                              <Shield className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {admin.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {admin.phone || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.isSuperAdmin ? 'default' : 'secondary'}>
                            {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={admin.status === 'active' ? 'success' : 'secondary'}
                            className="flex items-center gap-1 w-fit"
                          >
                            {admin.status === 'active' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(admin)}
                              disabled={admin.isSuperAdmin && admin.status === 'active'}
                            >
                              {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(admin)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialogAdmin(admin)}
                              disabled={admin.isSuperAdmin}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={closeAddDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Create a new admin user account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Admin Name"
                className={validationErrors.name ? 'border-red-500' : ''}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className={validationErrors.password ? 'border-red-500' : ''}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
                className={validationErrors.phone ? 'border-red-500' : ''}
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Admin bio (minimum 10 characters)"
                rows={3}
                className={validationErrors.bio ? 'border-red-500' : ''}
              />
              {validationErrors.bio && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.bio}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeAddDialog}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin}>
              Add Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Update admin user information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={validationErrors.name ? 'border-red-500' : ''}
              />
              {validationErrors.name && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-password">Password (leave empty to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 characters if changing"
                className={validationErrors.password ? 'border-red-500' : ''}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={validationErrors.phone ? 'border-red-500' : ''}
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Admin bio (minimum 10 characters)"
                rows={3}
                className={validationErrors.bio ? 'border-red-500' : ''}
              />
              {validationErrors.bio && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.bio}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleEditAdmin}>
              Update Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialogAdmin} onOpenChange={() => setDeleteDialogAdmin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the admin account for{' '}
              <strong>{deleteDialogAdmin?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAdmin} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
