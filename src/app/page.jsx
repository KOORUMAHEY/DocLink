
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Heart, Sparkles, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { IconBookAppointment } from '@/components/icons/icon-book-appointment';
import { IconManageBooking } from '@/components/icons/icon-manage-booking';
import { IconDoctorAccess } from '@/components/icons/icon-doctor-access';
import { useI18n } from '@/context/i18n';


export default function Home() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col bg-[#F9FAFF]">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-pink-100 via-purple-100 to-purple-200 py-12 md:py-20">
        <div className="container mx-auto text-center px-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              JIPMER
            </h1>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold md:text-4xl text-gray-800">{t('home.hero.title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-md sm:text-lg text-gray-600">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Calendar className="w-7 h-7 mb-2 text-primary" />
                    <h3 className="font-semibold text-gray-800">{t('home.hero.appointments.title')}</h3>
                    <p className="text-sm text-gray-600">{t('home.hero.appointments.description')}</p>
                </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                 <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Clock className="w-7 h-7 mb-2 text-primary" />
                    <h3 className="font-semibold text-gray-800">{t('home.hero.timing.title')}</h3>
                    <p className="text-sm text-gray-600">{t('home.hero.timing.description')}</p>
                </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                 <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Heart className="w-7 h-7 mb-2 text-primary" />
                    <h3 className="font-semibold text-gray-800">{t('home.hero.care.title')}</h3>
                    <p className="text-sm text-gray-600">{t('home.hero.care.description')}</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Action Cards Section */}
      <section className="container mx-auto py-12 md:py-16 px-4 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                    <IconBookAppointment className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="mt-4 text-xl">{t('home.actions.book.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('home.actions.book.description')}</p>
              <Button asChild className="mt-6">
                <Link href="/appointments/book">{t('home.actions.book.button')}</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <IconManageBooking className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="mt-4 text-xl">{t('home.actions.manage.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('home.actions.manage.description')}</p>
               <Button asChild variant="outline" className="mt-6">
                <Link href="/appointments">{t('home.actions.manage.button')}</Link>
              </Button>
            </CardContent>
          </Card>
           <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <IconDoctorAccess className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="mt-4 text-xl">{t('home.actions.doctor.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('home.actions.doctor.description')}</p>
               <Button asChild variant="outline" className="mt-6">
                <Link href="/login">{t('home.actions.doctor.button')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Important Information Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto text-center px-4">
           <h2 className="text-2xl font-bold font-headline mb-8">{t('home.info.title')}</h2>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <Calendar className="w-8 h-8 mb-3 text-blue-600" />
                  <h4 className="font-semibold">{t('home.info.fridays.title')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{t('home.info.fridays.description')}</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <Clock className="w-8 h-8 mb-3 text-blue-600" />
                  <h4 className="font-semibold">{t('home.info.timing.title')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{t('home.info.timing.description')}</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <UserCheck className="w-8 h-8 mb-3 text-blue-600" />
                  <h4 className="font-semibold">{t('home.info.priority.title')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{t('home.info.priority.description')}</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
