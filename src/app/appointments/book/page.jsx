
import { getDoctors } from '@/features/doctors';
import { Suspense } from 'react';
import { BookAppointmentClient } from './client';
import { AppointmentForm } from '@/features/appointments/components/AppointmentForm';
import { Calendar, Sparkles, Clock, CheckCircle2, Stethoscope, Shield, Zap } from 'lucide-react';

export default async function BookAppointmentPage() {
    const doctors = await getDoctors();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
            {/* Enhanced Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated gradient orbs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Floating particles */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute top-3/4 left-1/4 w-3 h-3 bg-indigo-400 rounded-full opacity-20 animate-ping" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-ping" style={{ animationDelay: '1.2s' }}></div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 pb-16">
                {/* Modern Page Header with Enhanced Design */}
                <div className="mb-10 lg:mb-14 max-w-7xl mx-auto">
                    <div className="text-center space-y-6">
                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            <span className="text-sm font-semibold tracking-wide">Easy Online Booking System</span>
                        </div>

                        {/* Main Heading with Animation */}
                        <div className="space-y-3">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight">
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Book Your
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                                    Appointment
                                </span>
                            </h1>
                            <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                                Schedule your next medical appointment in just a few clicks. Fast, secure, and completely hassle-free.
                            </p>
                        </div>

                        {/* Enhanced Feature Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 max-w-5xl mx-auto">
                            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 hover:-translate-y-1">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Instant Confirmation</p>
                                        <p className="text-xs text-gray-600">Get notified immediately</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300 hover:-translate-y-1">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Flexible Scheduling</p>
                                        <p className="text-xs text-gray-600">Choose your preferred time</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-300 hover:-translate-y-1">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Stethoscope className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Expert Doctors</p>
                                        <p className="text-xs text-gray-600">Top medical professionals</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-300 hover:-translate-y-1">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="text-sm font-bold text-gray-900 mb-0.5">Secure & Private</p>
                                        <p className="text-xs text-gray-600">Your data is protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Content with Premium Container */}
                <div className="max-w-5xl mx-auto">
                    <Suspense fallback={
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-blue-100/50 relative overflow-hidden">
                            {/* Loading animation background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
                            
                            <div className="relative z-10 flex flex-col items-center gap-6">
                                <div className="relative">
                                    {/* Outer ring */}
                                    <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100"></div>
                                    {/* Inner spinning ring */}
                                    <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-blue-600 border-r-indigo-600 absolute top-0 left-0"></div>
                                    {/* Center icon */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <Calendar className="w-8 h-8 text-blue-600 animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-900 font-bold text-xl">Loading Appointment Form</p>
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

                {/* Enhanced Help & Trust Section */}
                <div className="max-w-5xl mx-auto mt-12 space-y-6">
                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-6 items-center">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">HIPAA Compliant</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Fast Booking</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium">100% Secure</span>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                        <p className="text-gray-700 text-sm">
                            Need help or have questions?{' '}
                            <a 
                                href="mailto:support@doclink.com" 
                                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200"
                            >
                                Contact our support team
                            </a>
                            {' '}or call{' '}
                            <a 
                                href="tel:+1234567890" 
                                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200"
                            >
                                (123) 456-7890
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
