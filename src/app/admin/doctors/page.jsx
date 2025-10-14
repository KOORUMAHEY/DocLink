import { getDoctors } from '@/features/doctors';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Mail, Phone, Stethoscope, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ROUTES } from '@/config/routes';

export default async function AdminDoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Doctors
            </h1>
            <p className="text-gray-600 mt-1">
              {doctors.length} healthcare professionals available
            </p>
          </div>
          
          <Button 
            asChild 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full md:w-auto"
          >
            <Link href={ROUTES.ADMIN.DOCTORS_NEW}>
              <Plus className="mr-2 h-5 w-5" />
              Add New Doctor
            </Link>
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search doctors by name, specialization, or email..."
                className="pl-10 h-12 text-base"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card 
              key={doctor.id}
              className="hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border-2 hover:border-blue-400"
            >
              <Link href={`/admin/doctors/${doctor.id}`}>
                <CardContent className="p-0">
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
                      <AvatarFallback className="bg-blue-600 text-white text-3xl font-bold">
                        {doctor.name?.charAt(0) || 'D'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="absolute top-4 right-4">
                      <Badge 
                        variant={doctor.status === 'active' ? 'default' : 'secondary'}
                        className={doctor.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}
                      >
                        {doctor.status === 'active' ? 'Available' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {doctor.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium text-blue-600">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{doctor.email}</span>
                      </div>
                      {doctor.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{doctor.phone}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full mt-4 group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-700"
                    >
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {doctors.length === 0 && (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No Doctors Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Get started by adding your first healthcare professional to the system.
              </p>
              <Button 
                asChild 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 mt-4"
              >
                <Link href={ROUTES.ADMIN.DOCTORS_NEW}>
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Doctor
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
