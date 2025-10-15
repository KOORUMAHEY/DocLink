'use client';

import { useState, useEffect } from 'react';
import { getDoctorById, updateDoctor as updateDoctorAction } from '@/features/doctors';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useToast } from '@/hooks/use-toast';

export default function Profile({ doctorId }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    bio: '',
    hospital: '',
    availability: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const loadDoctor = async () => {
      if (doctorId) {
        try {
          setLoading(true);
          const data = await getDoctorById(doctorId);
          setDoctor(data);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            specialty: data.specialty || '',
            qualification: data.qualification || '',
            experience: data.experience || '',
            consultationFee: data.consultationFee || '',
            bio: data.bio || '',
            hospital: data.hospital || '',
            availability: data.availability || '',
          });
        } catch (error) {
          console.error('Failed to load doctor:', error);
          toast({
            title: 'Error',
            description: 'Failed to load profile data',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadDoctor();
  }, [doctorId, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateDoctorAction(doctorId, formData);
      setDoctor({ ...doctor, ...formData });
      setEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      // Implement password change logic here
      // await changePassword(doctorId, passwordData.currentPassword, passwordData.newPassword);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setChangingPassword(false);
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast({
        title: 'Error',
        description: 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: doctor.name || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      specialty: doctor.specialty || '',
      qualification: doctor.qualification || '',
      experience: doctor.experience || '',
      consultationFee: doctor.consultationFee || '',
      bio: doctor.bio || '',
      hospital: doctor.hospital || '',
      availability: doctor.availability || '',
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile information and settings
          </p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={doctor?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl">
                {doctor?.name?.charAt(0) || 'D'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-xl">{doctor?.name}</h3>
              <p className="text-muted-foreground">{doctor?.specialty}</p>
            </div>
            <Separator />
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span>{new Date(doctor?.createdAt).getFullYear()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  {editing ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{doctor?.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  {editing ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {doctor?.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  {editing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {doctor?.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hospital</label>
                  {editing ? (
                    <Input
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {doctor?.hospital || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Specialty</label>
                  {editing ? (
                    <Input
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{doctor?.specialty}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Qualification</label>
                  {editing ? (
                    <Input
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      {doctor?.qualification}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Experience</label>
                  {editing ? (
                    <Input
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {doctor?.experience} years
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Consultation Fee</label>
                  {editing ? (
                    <Input
                      name="consultationFee"
                      type="number"
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      ${doctor?.consultationFee}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                {editing ? (
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{doctor?.bio || 'No bio provided'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {editing && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}

          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!changingPassword ? (
                <Button variant="outline" onClick={() => setChangingPassword(true)}>
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative mt-1">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative mt-1">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative mt-1">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handlePasswordSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Update Password'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
