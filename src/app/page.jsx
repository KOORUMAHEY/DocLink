
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Heart, Sparkles, UserCheck, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconManageBooking } from '@/components/icons/icon-manage-booking';
import { IconDoctorAccess } from '@/components/icons/icon-doctor-access';
import { useI18n } from '@/context/i18n';


export default function Home() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm">
              <Sparkles className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              DocLink Healthcare
            </Badge>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl leading-tight px-2">
              {t('home.hero.title')}
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-base text-gray-600 sm:text-lg md:text-xl leading-relaxed px-2">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 px-4">
              <Button asChild size="lg" className="w-full px-6 py-4 text-base sm:w-auto sm:px-8 sm:py-6 sm:text-lg min-h-[48px] touch-manipulation">
                <Link href="/appointments/book">
                  {t('home.actions.book.button')}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full px-6 py-4 text-base sm:w-auto sm:px-8 sm:py-6 sm:text-lg min-h-[48px] touch-manipulation">
                <Link href="/appointments">
                  {t('home.actions.manage.button')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-6">
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg transition-all hover:shadow-xl hover:scale-105">
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
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg transition-all hover:shadow-xl hover:scale-105">
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
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg transition-all hover:shadow-xl hover:scale-105">
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
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors sm:h-20 sm:w-20">
                  <IconBookAppointment className="h-8 w-8 text-blue-600 sm:h-10 sm:w-10" />
                </div>
                <CardTitle className="text-center text-lg text-gray-900 sm:text-xl">
                  {t('home.actions.book.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4 sm:px-6">
                <CardDescription className="mb-4 text-gray-600 text-sm sm:mb-6 sm:text-base">
                  {t('home.actions.book.description')}
                </CardDescription>
                <Button asChild className="w-full py-3 text-sm sm:py-2 sm:text-base min-h-[44px] touch-manipulation">
                  <Link href="/appointments/book">
                    {t('home.actions.book.button')}
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors sm:h-20 sm:w-20">
                  <IconManageBooking className="h-8 w-8 text-green-600 sm:h-10 sm:w-10" />
                </div>
                <CardTitle className="text-center text-lg text-gray-900 sm:text-xl">
                  {t('home.actions.manage.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4 sm:px-6">
                <CardDescription className="mb-4 text-gray-600 text-sm sm:mb-6 sm:text-base">
                  {t('home.actions.manage.description')}
                </CardDescription>
                <Button asChild variant="outline" className="w-full py-3 text-sm sm:py-2 sm:text-base min-h-[44px] touch-manipulation">
                  <Link href="/appointments">
                    {t('home.actions.manage.button')}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors sm:h-20 sm:w-20">
                  <IconDoctorAccess className="h-8 w-8 text-purple-600 sm:h-10 sm:w-10" />
                </div>
                <CardTitle className="text-center text-lg text-gray-900 sm:text-xl">
                  {t('home.actions.doctor.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center px-4 sm:px-6">
                <CardDescription className="mb-4 text-gray-600 text-sm sm:mb-6 sm:text-base">
                  {t('home.actions.doctor.description')}
                </CardDescription>
                <Button asChild variant="outline" className="w-full py-3 text-sm sm:py-2 sm:text-base min-h-[44px] touch-manipulation">
                  <Link href="/login">
                    {t('home.actions.doctor.button')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Important Information Section */}
      <section className="bg-gray-50 py-12 px-4 sm:py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl">
              {t('home.info.title')}
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              Everything you need to know about our appointment system
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-3 sm:gap-8">
            <Card className="border-0 bg-white shadow-lg transition-all hover:shadow-xl">
              <CardContent className="p-6 text-center sm:p-8">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 sm:mb-4 sm:h-16 sm:w-16">
                  <Calendar className="h-6 w-6 text-blue-600 sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                  {t('home.info.fridays.title')}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{t('home.info.fridays.description')}</p>
                <div className="mt-3 flex items-center justify-center space-x-2 sm:mt-4">
                  <CheckCircle className="h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
                  <span className="text-xs font-medium text-green-600 sm:text-sm">Available</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-lg transition-all hover:shadow-xl">
              <CardContent className="p-6 text-center sm:p-8">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 sm:mb-4 sm:h-16 sm:w-16">
                  <Clock className="h-6 w-6 text-green-600 sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                  {t('home.info.timing.title')}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{t('home.info.timing.description')}</p>
                <div className="mt-3 flex items-center justify-center space-x-2 sm:mt-4">
                  <CheckCircle className="h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
                  <span className="text-xs font-medium text-green-600 sm:text-sm">On Time</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-lg transition-all hover:shadow-xl">
              <CardContent className="p-6 text-center sm:p-8">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 sm:mb-4 sm:h-16 sm:w-16">
                  <UserCheck className="h-6 w-6 text-purple-600 sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                  {t('home.info.priority.title')}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{t('home.info.priority.description')}</p>
                <div className="mt-3 flex items-center justify-center space-x-2 sm:mt-4">
                  <CheckCircle className="h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
                  <span className="text-xs font-medium text-green-600 sm:text-sm">Priority Care</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
