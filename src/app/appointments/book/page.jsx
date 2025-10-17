
import { getDoctors } from '@/features/doctors';
import { Suspense } from 'react';
import { BookAppointmentClient } from './client';
import { AppointmentForm } from '@/features/appointments/components/AppointmentForm';
import { Calendar, Sparkles, Clock, CheckCircle2, Stethoscope, Shield, Zap } from 'lucide-react';

export default async function BookAppointmentPage() {
    const doctors = await getDoctors();
    
    return (
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                <span>/</span>
                <a href="/appointments" className="hover:text-blue-600 transition-colors">Appointments</a>
                <span>/</span>
                <span className="text-gray-900 font-semibold">Book Appointment</span>
            </div>

            {/* Compact Creative Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl">
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full -ml-24 sm:-ml-32 -mb-24 sm:-mb-32 blur-3xl"></div>
                
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
                    {/* Left Content */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="inline-block">
                            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30">
                                ✨ Quick Booking
                            </span>
                        </div>
                        
                        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight">
                            Schedule Your
                            <span className="block text-blue-100">Medical Appointment</span>
                        </h1>
                        
                        <p className="text-xs sm:text-sm lg:text-base text-blue-100 leading-relaxed max-w-md">
                            Book an appointment with our expert healthcare professionals in just a few clicks.
                        </p>

                        {/* Stats Line */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 pt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white/80 text-xs">Quick Setup</p>
                                    <p className="text-white font-bold text-xs sm:text-sm">5 Minutes</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white/80 text-xs">Instant Confirmation</p>
                                    <p className="text-white font-bold text-xs sm:text-sm">Guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual Element - Features */}
                    <div className="relative hidden sm:block">
                        <div className="space-y-2 sm:space-y-3">
                            {/* Feature Card 1 */}
                            <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 transform hover:scale-105 transition-transform hover:shadow-2xl group">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-green-400/20 rounded-lg group-hover:bg-green-400/40 transition-colors flex-shrink-0">
                                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white/80 text-xs">Verified Doctors</p>
                                        <p className="text-white font-bold text-xs sm:text-sm truncate">150+ Specialists</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Card 2 */}
                            <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 transform hover:scale-105 transition-transform hover:shadow-2xl group sm:ml-4 lg:ml-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-blue-400/20 rounded-lg group-hover:bg-blue-400/40 transition-colors flex-shrink-0">
                                        <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white/80 text-xs">Multiple Specialties</p>
                                        <p className="text-white font-bold text-xs sm:text-sm truncate">All Available</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Card 3 */}
                            <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 transform hover:scale-105 transition-transform hover:shadow-2xl group">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-purple-400/20 rounded-lg group-hover:bg-purple-400/40 transition-colors flex-shrink-0">
                                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-300" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white/80 text-xs">100% Secure</p>
                                        <p className="text-white font-bold text-xs sm:text-sm truncate">HIPAA Compliant</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Efficient Form Section */}
            <div className="max-w-4xl mx-auto">
                <Suspense fallback={
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-12 border border-blue-100/50 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100"></div>
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-r-indigo-600 absolute top-0 left-0"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <Calendar className="w-6 h-6 text-blue-600 animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-900 font-bold">Loading Appointment Form</p>
                                <p className="text-gray-600 text-sm">Preparing your booking experience...</p>
                            </div>
                        </div>
                    </div>
                }>
                    <BookAppointmentClient>
                        <AppointmentForm doctors={doctors} />
                    </BookAppointmentClient>
                </Suspense>
            </div>

            {/* Trust Indicators */}
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border-2 border-blue-200/50">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-semibold text-gray-900 text-sm">Instant Confirmation</p>
                            <p className="text-xs text-gray-600 mt-0.5">Get notified immediately</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-semibold text-gray-900 text-sm">100% Secure</p>
                            <p className="text-xs text-gray-600 mt-0.5">HIPAA Compliant</p>
                        </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1 flex flex-col items-center sm:items-start gap-2">
                        <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="font-semibold text-gray-900 text-sm">Fast Booking</p>
                            <p className="text-xs text-gray-600 mt-0.5">5 minutes max</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
