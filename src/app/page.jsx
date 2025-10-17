'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Heart, 
  UserCheck, 
  ArrowRight, 
  Shield, 
  Zap, 
  Users, 
  Star,
  CheckCircle2,
  Stethoscope,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconManageBooking } from '@/components/icons/icon-manage-booking';
import { useI18n } from '@/context/i18n';
import { ROUTES } from '@/config/routes';



export default function Home() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium text-blue-700 border-blue-200 bg-blue-50/80">
                <Stethoscope className="mr-2 h-4 w-4" />
                Professional Healthcare Platform
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Modern Healthcare
              <span className="block text-blue-600 mt-2">Made Simple</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              Connect with healthcare professionals seamlessly. Book appointments, manage your health records, and access quality care from anywhere.
            </p>

            {/* Primary CTA */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <Link href={ROUTES.APPOINTMENTS.BOOK} className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300">
                <Link href={ROUTES.APPOINTMENTS.ROOT} className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Manage Bookings
                </Link>
              </Button>
            </div>

            {/* Quick Info Stats */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Appointments</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Weekly consultation sessions</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">9:00 AM - 2:00 PM</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Available consultation hours</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Quality Care</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Professional healthcare service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for healthcare management
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Our platform provides comprehensive tools to streamline your healthcare experience
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {/* Book Appointment Card */}
            <Card className="group relative bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="p-8 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <IconBookAppointment className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="mt-6 text-xl font-semibold text-gray-900">
                  Schedule Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-base text-gray-600 leading-7">
                  Book your medical appointments online with ease. Choose your preferred time slot and receive instant confirmation.
                </CardDescription>
                <div className="mt-6">
                  <Button asChild variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors">
                    <Link href={ROUTES.APPOINTMENTS.BOOK}>
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Manage Bookings Card */}
            <Card className="group relative bg-white border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="p-8 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 group-hover:bg-green-200 transition-colors">
                  <IconManageBooking className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="mt-6 text-xl font-semibold text-gray-900">
                  Manage Your Health
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-base text-gray-600 leading-7">
                  View, modify, or cancel your appointments. Access your medical history and stay organized with your healthcare.
                </CardDescription>
                <div className="mt-6">
                  <Button asChild variant="outline" className="w-full group-hover:bg-green-50 group-hover:border-green-300 transition-colors">
                    <Link href={ROUTES.APPOINTMENTS.ROOT}>
                      Manage Bookings
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Access Card */}
            <Card className="group relative bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="p-8 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="mt-6 text-xl font-semibold text-gray-900">
                  Healthcare Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-base text-gray-600 leading-7">
                  Access your professional dashboard to manage patient appointments, schedules, and medical records securely.
                </CardDescription>
                <div className="mt-6">
                  <Button asChild variant="outline" className="w-full group-hover:bg-purple-50 group-hover:border-purple-300 transition-colors">
                    <Link href="/login">
                      Professional Access
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by thousands of patients
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Your health data is secure with enterprise-grade protection
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4 lg:gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">HIPAA Compliant</h3>
              <p className="mt-2 text-sm text-gray-600">Enterprise-grade security for your medical data</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fast & Reliable</h3>
              <p className="mt-2 text-sm text-gray-600">Quick appointment booking in under 2 minutes</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">10,000+ Patients</h3>
              <p className="mt-2 text-sm text-gray-600">Trusted by patients across the region</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">5-Star Rating</h3>
              <p className="mt-2 text-sm text-gray-600">Excellent patient satisfaction scores</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to take control of your health?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Join thousands of patients who trust DocLink for their healthcare needs. Get started today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 rounded-xl shadow-lg">
                <Link href={ROUTES.APPOINTMENTS.BOOK} className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Your First Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
