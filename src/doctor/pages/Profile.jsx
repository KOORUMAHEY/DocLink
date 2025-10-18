'use client';

import { useState, useEffect } from 'react';
import { getDoctorById, updateDoctor as updateDoctorAction } from '@/features/doctors';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  Mail, 
  Phone,
  Building2,
  Award,
  Briefcase,
  DollarSign,
  Edit, 
  Save, 
  X, 
  Lock,
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
    hospital: '',
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
            hospital: data.hospital || '',
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
      hospital: doctor.hospital || '',
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
        <Skeleton className="h-20 sm:h-24 w-full" />
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-64 sm:h-80 w-full" />
          <Skeleton className="h-64 sm:h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Doctor Profile</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Manage your professional information</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-10 w-full sm:w-auto">
            <Edit className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Edit Profile</span>
            <span className="sm:hidden">Edit</span>
          </Button>
        )}
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Avatar className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 flex-shrink-0 ring-2 ring-blue-200">
              <AvatarImage src={doctor?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-lg sm:text-xl md:text-2xl">
                {doctor?.name?.charAt(0) || 'D'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">{doctor?.name}</h2>
              <p className="text-sm sm:text-base md:text-lg text-blue-600 font-semibold mt-1">{doctor?.specialty}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm">Active</Badge>
                <span className="text-xs sm:text-sm text-gray-500">Member since {new Date(doctor?.createdAt).getFullYear()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 flex-shrink-0" />
            <span>Contact Information</span>
          </h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Email</p>
              {editing ? (
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-2 text-xs sm:text-sm h-8 sm:h-10" />
              ) : (
                <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900 break-all">{doctor?.email}</p>
              )}
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg border border-orange-100">
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wide flex items-center gap-1">
                <Phone className="w-3 h-3" />Phone
              </p>
              {editing ? (
                <Input name="phone" value={formData.phone} onChange={handleInputChange} className="mt-2 text-xs sm:text-sm h-8 sm:h-10" />
              ) : (
                <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900">{doctor?.phone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <User className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600 flex-shrink-0" />
            <span>Personal Information</span>
          </h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-600 font-bold uppercase tracking-wide">Full Name</p>
              {editing ? (
                <Input name="name" value={formData.name} onChange={handleInputChange} className="mt-2 text-xs sm:text-sm h-8 sm:h-10" />
              ) : (
                <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900">{doctor?.name}</p>
              )}
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 sm:p-4 rounded-lg border border-emerald-100">
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide flex items-center gap-1">
                <Building2 className="w-3 h-3" />Hospital
              </p>
              {editing ? (
                <Input name="hospital" value={formData.hospital} onChange={handleInputChange} className="mt-2 text-xs sm:text-sm h-8 sm:h-10" />
              ) : (
                <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900">{doctor?.hospital || 'Not specified'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <Award className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600 flex-shrink-0" />
            <span>Professional Information</span>
          </h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 sm:p-4 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-600 font-bold uppercase tracking-wide">Specialty</p>
              {editing ? (
                <Input name="specialty" value={formData.specialty} onChange={handleInputChange} className="mt-2 text-xs sm:text-sm h-8 sm:h-10" />
              ) : (
                <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900">{doctor?.specialty}</p>
              )}
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-3 sm:p-4 rounded-lg border border-rose-100">
              <p className="text-xs text-rose-600 font-bold uppercase tracking-wide">Qualification</p>
              {editing ? (
                <Input name="qualification" value={formData.qualification} onChange={handleInputChange} className="mt-2 text-xs sm:text-sm h-8 sm:h-10" />
              ) : (
                <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900">{doctor?.qualification}</p>
              )}
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-3 sm:p-4 rounded-lg border border-cyan-100">
              <p className="text-xs text-cyan-600 font-bold uppercase tracking-wide flex items-center gap-1">
                <Briefcase className="w-3 h-3" />Experience
              </p>
              {editing ? (
                <Input name="experience" type="number" value={formData.experience} onChange={handleInputChange} className="mt-2 text-xs sm:text-sm h-8 sm:h-10" />
              ) : (
                <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900">{doctor?.experience} years</p>
              )}
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg border border-green-100">
              <p className="text-xs text-green-600 font-bold uppercase tracking-wide flex items-center gap-1">
                <DollarSign className="w-3 h-3" />Consultation Fee
              </p>
              {editing ? (
                <Input name="consultationFee" type="number" value={formData.consultationFee} onChange={handleInputChange} className="mt-2 text-xs sm:text-sm h-8 sm:h-10" />
              ) : (
                <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900">${doctor?.consultationFee}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {editing && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <Button variant="outline" onClick={handleCancel} className="text-xs sm:text-sm h-8 sm:h-10">
                <X className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-10">
                <Save className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
            <Lock className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 flex-shrink-0" />
            <span>Security</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Manage your account security settings</p>
          
          {changingPassword ? (
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="currentPassword" className="text-xs sm:text-sm font-semibold text-gray-700">Current Password</label>
                <div className="relative mt-1.5 sm:mt-2">
                  <Input id="currentPassword" type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="text-xs sm:text-sm h-8 sm:h-10" />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
                    {showCurrentPassword ? (
                      <EyeOff className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="text-xs sm:text-sm font-semibold text-gray-700">New Password</label>
                <div className="relative mt-1.5 sm:mt-2">
                  <Input id="newPassword" type={showNewPassword ? 'text' : 'password'} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="text-xs sm:text-sm h-8 sm:h-10" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
                    {showNewPassword ? (
                      <EyeOff className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-xs sm:text-sm font-semibold text-gray-700">Confirm New Password</label>
                <div className="relative mt-1.5 sm:mt-2">
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="text-xs sm:text-sm h-8 sm:h-10" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
                    {showConfirmPassword ? (
                      <EyeOff className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
                <Button variant="outline" onClick={() => { setChangingPassword(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }} className="text-xs sm:text-sm h-8 sm:h-10">Cancel</Button>
                <Button onClick={handlePasswordSave} disabled={saving} className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm h-8 sm:h-10">
                  {saving ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setChangingPassword(true)} className="text-xs sm:text-sm h-8 sm:h-10">
              <Key className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />Change Password
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
