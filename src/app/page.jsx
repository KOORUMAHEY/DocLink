'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Heart, Sparkles, UserCheck, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconManageBooking } from '@/components/icons/icon-manage-booking';
import { useI18n } from '@/context/i18n';
import { ROUTES } from '@/config/routes';



export default function Home() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 sm:py-28 md:py-36 lg:py-44" style={{backgroundImage: 'url(/image1.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        {/* Background image for accessibility */}
        <img src="/image1.png" alt="Healthcare professionals in a modern medical facility" className="absolute inset-0 w-full h-full object-cover opacity-0" />
        {/* Translucent overlay for text readability */}
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/20 via-blue-50/20 to-teal-50/20"></div>
        <div className="container relative mx-auto max-w-4xl text-center">
          <div className="space-y-12">
            {/* Main Headline */}
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl leading-[1.1] drop-shadow-lg animate-fade-in">
              DOCLINK HEALTHCARE
            </h1>
            {/* Subheading */}
            <h2 className="text-2xl font-bold text-white sm:text-4xl md:text-5xl leading-tight drop-shadow-md animate-fade-in" style={{animationDelay: '0.2s'}}>
              Doctor Appointment System
            </h2>
            {/* Tagline */}
            <p className="mx-auto max-w-2xl text-lg text-white/90 sm:text-xl md:text-2xl leading-relaxed font-light drop-shadow-sm animate-fade-in" style={{animationDelay: '0.4s'}}>
              Connect to healthcare. Book and manage appointments online.
            </p>
            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 max-w-5xl mx-auto pt-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <Card className="border border-white/20 bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 hover:scale-[1.05] active:scale-[1.02] hover:-translate-y-2 active:-translate-y-1 rounded-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-lg">
                      <Calendar className="h-8 w-8 text-blue-600" aria-label="Calendar icon for appointments" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-lg">Appointments on Fridays Only</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 hover:scale-[1.05] active:scale-[1.02] hover:-translate-y-2 active:-translate-y-1 rounded-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 shadow-lg">
                      <Clock className="h-8 w-8 text-teal-600" aria-label="Clock icon for timings" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-lg">9:00 AM – 2:00 PM</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl active:shadow-lg transition-all duration-300 hover:scale-[1.05] active:scale-[1.02] hover:-translate-y-2 active:-translate-y-1 rounded-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 shadow-lg">
                      <Heart className="h-8 w-8 text-slate-600" aria-label="Heart icon for quality care" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-lg">Quality Healthcare for Everyone</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-center sm:gap-8 pt-12 animate-fade-in" style={{animationDelay: '0.8s'}}>
              <Button asChild size="lg" className="w-full px-10 py-5 text-xl sm:w-auto sm:px-12 sm:py-6 sm:text-2xl min-h-[64px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl active:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-0">
                <Link href={ROUTES.APPOINTMENTS.BOOK}>
                  Book Appointment
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full px-10 py-5 text-xl sm:w-auto sm:px-12 sm:py-6 sm:text-2xl min-h-[64px] border-4 border-white text-white hover:bg-white hover:text-blue-600 active:bg-blue-50 active:text-blue-700 font-bold rounded-xl shadow-2xl hover:shadow-3xl active:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 bg-transparent">
                <Link href={ROUTES.APPOINTMENTS.ROOT}>
                  Manage Booking
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Action Cards Section */}
      <section className="bg-gray-50 py-12 px-6 sm:py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl">
              How Can We Help You?
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              Choose the service that best fits your needs
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-3 sm:gap-8">
            <Card className="group relative overflow-hidden border border-gray-200/60 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors sm:h-20 sm:w-20">
                  <IconBookAppointment className="h-8 w-8 text-blue-600 sm:h-10 sm:w-10" aria-label="Book appointment icon" />
                </div>
                <CardTitle className="text-center text-lg text-gray-900 sm:text-xl">
                  {t('home.actions.book.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4 sm:px-6 flex-grow">
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  {t('home.actions.book.description')}
                </CardDescription>
              </CardContent>
              <div className="p-4 sm:p-6 pt-0">
                <Button asChild className="w-full py-3 px-6 text-sm sm:py-3 sm:text-base min-h-[48px] touch-manipulation bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
                  <Link href={ROUTES.APPOINTMENTS.BOOK} className="flex items-center justify-center space-x-2">
                    <span>{t('home.actions.book.button')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-gray-200/60 bg-gradient-to-br from-teal-50 to-teal-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors sm:h-20 sm:w-20">
                  <IconManageBooking className="h-8 w-8 text-teal-600 sm:h-10 sm:w-10" aria-label="Manage booking icon" />
                </div>
                <CardTitle className="text-center text-lg text-gray-900 sm:text-xl">
                  {t('home.actions.manage.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4 sm:px-6 flex-grow">
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  {t('home.actions.manage.description')}
                </CardDescription>
              </CardContent>
              <div className="p-4 sm:p-6 pt-0">
                <Button asChild variant="outline" className="w-full py-3 px-6 text-sm sm:py-3 sm:text-base min-h-[48px] touch-manipulation border-2 border-teal-500 text-teal-700 hover:bg-teal-500 hover:text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white hover:border-teal-500">
                  <Link href={ROUTES.APPOINTMENTS.ROOT} className="flex items-center justify-center">
                    <span>{t('home.actions.manage.button')}</span>
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-gray-200/60 bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-500/10 group-hover:bg-slate-500/20 transition-colors sm:h-20 sm:w-20">
                  <UserCheck className="h-8 w-8 text-slate-600 sm:h-10 sm:w-10" aria-label="Doctor access icon" />
                </div>
                <CardTitle className="text-center text-lg text-gray-900 sm:text-xl">
                  {t('home.actions.doctor.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4 sm:px-6 flex-grow">
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  {t('home.actions.doctor.description')}
                </CardDescription>
              </CardContent>
              <div className="p-4 sm:p-6 pt-0">
                <Button asChild variant="outline" className="w-full py-3 px-6 text-sm sm:py-3 sm:text-base min-h-[48px] touch-manipulation border-2 border-slate-600 text-slate-700 hover:bg-slate-600 hover:text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white hover:border-slate-600">
                  <Link href="/login" className="flex items-center justify-center">
                    <span>{t('home.actions.doctor.button')}</span>
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
