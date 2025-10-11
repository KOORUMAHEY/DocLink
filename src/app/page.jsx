
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Heart, Sparkles, UserCheck, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconManageBooking } from '@/components/icons/icon-manage-booking';
import { useI18n } from '@/context/i18n';



export default function Home() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:py-20 md:py-32" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay'}}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="mx-auto max-w-2xl text-center lg:text-left lg:mx-0">
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium tracking-wide uppercase">
                <Sparkles className="mr-2 h-4 w-4" />
                DocLink Healthcare
              </Badge>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] px-2">
                {t('home.hero.title')}
              </h1>
              <p className="mx-auto mb-4 max-w-3xl text-lg text-gray-700 sm:text-xl md:text-2xl leading-relaxed font-light px-2 lg:mx-0">
                {t('home.hero.subtitle')}
              </p>
              <p className="mx-auto mb-8 max-w-3xl text-base text-gray-600 sm:text-lg leading-relaxed px-2 lg:mx-0">
                Connect to healthcare. Book and manage appointments online.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start sm:gap-4 px-4 lg:px-0">
                <Button asChild size="lg" className="w-full px-6 py-4 text-base sm:w-auto sm:px-8 sm:py-6 sm:text-lg min-h-[48px] touch-manipulation hover:scale-105 transition-transform">
                  <Link href="/appointments/book">
                    {t('home.actions.book.button')}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full px-6 py-4 text-base sm:w-auto sm:px-8 sm:py-6 sm:text-lg min-h-[48px] touch-manipulation hover:scale-105 transition-transform">
                  <Link href="/appointments">
                    {t('home.actions.manage.button')}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <Heart className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-blue-600 mx-auto mb-4" />
                    <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">Healthcare</p>
                    <p className="text-xs sm:text-sm text-gray-600">Made Easy</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-6">
            <Card className="border border-gray-100/50 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 sm:h-12 sm:w-12">
                    <Calendar className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{t('home.hero.appointments.title')}</h3>
                    <p className="text-xs text-gray-600 sm:text-sm leading-relaxed">{t('home.hero.appointments.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-100/50 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 sm:h-12 sm:w-12">
                    <Clock className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{t('home.hero.timing.title')}</h3>
                    <p className="text-xs text-gray-600 sm:text-sm leading-relaxed">{t('home.hero.timing.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-100/50 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 sm:h-12 sm:w-12">
                    <Heart className="h-5 w-5 text-pink-600 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{t('home.hero.care.title')}</h3>
                    <p className="text-xs text-gray-600 sm:text-sm leading-relaxed">{t('home.hero.care.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Action Cards Section */}
      <section className="bg-white py-12 px-4 sm:py-20 md:py-32">
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
                  <IconBookAppointment className="h-8 w-8 text-blue-600 sm:h-10 sm:w-10" />
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
                  <Link href="/appointments/book" className="flex items-center justify-center space-x-2">
                    <span>{t('home.actions.book.button')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-gray-200/60 bg-gradient-to-br from-green-50 to-green-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors sm:h-20 sm:w-20">
                  <IconManageBooking className="h-8 w-8 text-green-600 sm:h-10 sm:w-10" />
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
                <Button asChild variant="outline" className="w-full py-3 px-6 text-sm sm:py-3 sm:text-base min-h-[48px] touch-manipulation border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-500 hover:text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white hover:border-emerald-500">
                  <Link href="/appointments" className="flex items-center justify-center">
                    <span>{t('home.actions.manage.button')}</span>
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-gray-200/60 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] flex flex-col">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-500/10 group-hover:bg-slate-500/20 transition-colors sm:h-20 sm:w-20">
                  <UserCheck className="h-8 w-8 text-slate-600 sm:h-10 sm:w-10" />
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
