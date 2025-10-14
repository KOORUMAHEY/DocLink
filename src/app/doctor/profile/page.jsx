'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getDoctorById, updateDoctor as updateDoctorAction } from '@/features/doctors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Stethoscope, 
  Edit, 
  Save, 
  X, 
  Lock,
  Calendar,
  Activity,
  Award,
  Building2,
  Clock,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

export default function DoctorProfilePage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');
  const { toast } = useToast();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Password change dialog state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    phone: '',
    bio: '',
    imageUrl: '',
    experience: '',
    education: '',
    department: '',
    consultationFee: ''
  });

  useEffect(() => {
    if (doctorId) {
      fetchDoctorData();
    }
  }, [doctorId]);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const data = await getDoctorById(doctorId);
      if (data) {
        setDoctor(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          specialization: data.specialization || '',
          phone: data.phone || '',
          bio: data.bio || '',
          imageUrl: data.imageUrl || '',
          experience: data.experience || '',
          education: data.education || '',
          department: data.department || '',
          consultationFee: data.consultationFee || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch doctor:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateDoctorAction(doctorId, formData);
      
      if (result.success) {
        setDoctor({ ...doctor, ...formData });
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully!",
          variant: "default"
        });
        // Refresh data
        await fetchDoctorData();
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      specialization: doctor.specialization || '',
      phone: doctor.phone || '',
      bio: doctor.bio || '',
      imageUrl: doctor.imageUrl || '',
      experience: doctor.experience || '',
      education: doctor.education || '',
      department: doctor.department || '',
      consultationFee: doctor.consultationFee || ''
    });
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    // Validate passwords
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive"
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      // Verify current password matches
      if (doctor.password !== passwordForm.currentPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const result = await updateDoctorAction(doctorId, {
        ...doctor,
        password: passwordForm.newPassword,
        lastPasswordChange: new Date().toISOString()
      });

      if (result.success) {
        setIsPasswordDialogOpen(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        toast({
          title: "Success",
          description: "Password changed successfully!",
          variant: "default"
        });
        await fetchDoctorData();
      } else {
        throw new Error(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!doctorId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96 text-center p-8">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Doctor ID Required</h2>
          <p className="text-gray-600">Please log in again to access your profile.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96 text-center p-8">
          <User className="h-12 w-12 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600">Unable to load profile information.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Card */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700"></div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-12">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                  <AvatarImage src={formData.imageUrl} alt={formData.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-4xl font-bold">
                    {formData.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                <Badge 
                  className="absolute bottom-0 right-0 bg-green-500 border-2 border-white"
                >
                  Active
                </Badge>
              </div>
              
              <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  {doctor.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  <p className="text-lg font-medium text-blue-600">
                    {doctor.specialization}
                  </p>
                </div>
                {doctor.department && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      {doctor.department}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      disabled={isSaving}
                      variant="outline"
                      size="lg"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal Information Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="mt-1 text-base text-gray-900">{doctor.name}</p>
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <p className="mt-1 text-base text-gray-900">{doctor.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <Separator />

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="mt-1"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="mt-1 text-base text-gray-900">{doctor.phone || 'Not provided'}</p>
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
                  Profile Image URL
                </Label>
                {isEditing ? (
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-600 truncate">{doctor.imageUrl || 'Using default avatar'}</p>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Professional Information Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Award className="h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div>
                <Label htmlFor="specialization" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Specialization
                </Label>
                {isEditing ? (
                  <Input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="e.g., Cardiology, Neurology"
                    className="mt-1"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="mt-1 text-base text-gray-900">{doctor.specialization}</p>
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="department" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Department
                </Label>
                {isEditing ? (
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Internal Medicine"
                    className="mt-1"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="mt-1 text-base text-gray-900">{doctor.department || 'Not provided'}</p>
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="experience" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Years of Experience
                </Label>
                {isEditing ? (
                  <Input
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 10 years"
                    className="mt-1"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="mt-1 text-base text-gray-900">{doctor.experience || 'Not provided'}</p>
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="education" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Education
                </Label>
                {isEditing ? (
                  <Input
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder="e.g., MBBS, MD"
                    className="mt-1"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="mt-1 text-base text-gray-900">{doctor.education || 'Not provided'}</p>
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="consultationFee" className="text-sm font-medium text-gray-700">
                  Consultation Fee (₹)
                </Label>
                {isEditing ? (
                  <Input
                    id="consultationFee"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    placeholder="e.g., 500"
                    type="number"
                    className="mt-1"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="mt-1 text-base text-gray-900">
                    {doctor.consultationFee ? `₹${doctor.consultationFee}` : 'Not provided'}
                  </p>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Biography Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Activity className="h-5 w-5" />
              Professional Biography
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div>
              <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                About Me
              </Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Share your professional background, expertise, and approach to patient care..."
                  className="mt-2 min-h-[150px]"
                  disabled={isSaving}
                />
              ) : (
                <p className="mt-2 text-gray-700 leading-relaxed whitespace-pre-line">
                  {doctor.bio || 'No biography provided yet.'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Lock className="h-5 w-5" />
              Security & Account
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-600">
                    Last changed: {doctor.lastPasswordChange 
                      ? new Date(doctor.lastPasswordChange).toLocaleDateString()
                      : 'Never'}
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setIsPasswordDialogOpen(true)}
                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Account Status</p>
                  <p className="text-sm text-gray-600">Your account is active and verified</p>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Account Created</p>
                  <p className="text-sm text-gray-600">
                    {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Lock className="h-5 w-5 text-blue-600" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Update your account password. Make sure your new password is strong and secure.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-blue-900">
                Password must be at least 6 characters long.
              </AlertDescription>
            </Alert>

            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password *
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="pr-10"
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password *
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  className="pr-10"
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  className="pr-10"
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {passwordForm.newPassword && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Password Strength:</p>
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded ${passwordForm.newPassword.length >= 6 ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                  <div className={`h-1 flex-1 rounded ${passwordForm.newPassword.length >= 8 ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                  <div className={`h-1 flex-1 rounded ${passwordForm.newPassword.length >= 10 && /[0-9]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className={`h-1 flex-1 rounded ${passwordForm.newPassword.length >= 12 && /[0-9]/.test(passwordForm.newPassword) && /[A-Z]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
                </div>
                <p className="text-xs text-gray-600">
                  {passwordForm.newPassword.length < 6 && 'Too short'}
                  {passwordForm.newPassword.length >= 6 && passwordForm.newPassword.length < 8 && 'Weak'}
                  {passwordForm.newPassword.length >= 8 && passwordForm.newPassword.length < 10 && 'Fair'}
                  {passwordForm.newPassword.length >= 10 && /[0-9]/.test(passwordForm.newPassword) && 'Good'}
                  {passwordForm.newPassword.length >= 12 && /[0-9]/.test(passwordForm.newPassword) && /[A-Z]/.test(passwordForm.newPassword) && 'Strong'}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsPasswordDialogOpen(false);
                setPasswordForm({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
              }}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isChangingPassword ? (
                <>
                  <span className="mr-2">Changing...</span>
                  <span className="animate-spin">⟳</span>
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
