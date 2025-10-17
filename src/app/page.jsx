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
  MapPin,
  Search,
  BookOpen,
  Award
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="mb-8 flex">
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium text-blue-700 border-blue-200 bg-blue-50/80 animate-pulse">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  🏥 Trusted Healthcare Platform
                </Badge>
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Your Health,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">Our Priority</span>
              </h1>
              
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
                Connect with top healthcare professionals instantly. Book appointments, manage health records, and receive quality care from the comfort of your home.
              </p>

              {/* Primary CTA */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:scale-105 group">
                  <Link href={ROUTES.APPOINTMENTS.BOOK} className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Book Appointment
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300">
                  <Link href={ROUTES.APPOINTMENTS.ROOT} className="flex items-center">
                    <UserCheck className="mr-2 h-5 w-5" />
                    View Bookings
                  </Link>
                </Button>
              </div>

              {/* Stats Row */}
              <div className="mt-12 flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 font-medium">1000+ Appointments Monthly</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 font-medium">98% Satisfaction Rate</span>
                </div>
              </div>
            </div>

            {/* Hero Image - Healthcare Professional */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Background gradient circles */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 rounded-3xl blur-2xl"></div>
                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-indigo-300/20 rounded-full blur-2xl"></div>

                {/* Main illustration card */}
                <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-2xl border border-blue-100 overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full -ml-20 -mb-20"></div>

                  {/* Content */}
                  <div className="relative space-y-8 h-full flex flex-col justify-center">
                    {/* Doctor Icon */}
                    <div className="flex justify-center">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-xl mx-auto">
                          <Stethoscope className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">Expert Care</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Our team of verified healthcare professionals is ready to provide you with quality medical guidance whenever you need it.
                      </p>
                    </div>

                    {/* Feature indicators */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700 font-medium">Available 24/7</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700 font-medium">Instant Response</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                        <span className="text-sm text-gray-700 font-medium">Secure & Private</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How DocLink Works
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Three simple steps to get quality healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6 mx-auto">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Find a Doctor</h3>
                  <p className="text-gray-600">Browse through our network of verified healthcare professionals. Filter by specialty, experience, and availability.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-indigo-300 transition-all">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6 mx-auto">
                  <Calendar className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Book an Appointment</h3>
                  <p className="text-gray-600">Select your preferred date and time. Get instant confirmation and appointment reminders via SMS and email.</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-300 transition-all">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-6 mx-auto">
                  <Stethoscope className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-purple-600 text-white font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Quality Care</h3>
                  <p className="text-gray-600">Connect with your healthcare provider. Access your health records and prescription history anytime, anywhere.</p>
                </div>
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

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Patients Say
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Join thousands of satisfied patients who have transformed their healthcare experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "DocLink made it so easy to book my appointment. The entire process took less than 5 minutes, and I received a confirmation immediately. Highly recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
                    RP
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Rajesh Patel</p>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "I love how I can manage all my health records in one place. The doctors are professional and the support team is incredibly helpful."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center text-white font-bold">
                    AM
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Anjali Mishra</p>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "The platform is secure, reliable, and user-friendly. I've recommended DocLink to all my friends and family. Great service!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold">
                    SK
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Suresh Kumar</p>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
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

      {/* Footer */}
     
    </div>
  );
}
