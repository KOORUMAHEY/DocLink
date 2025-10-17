'use client';

import { useI18n } from '@/context/i18n';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle2, Stethoscope, Shield, Plus } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';

export default function BookAppointmentPageWrapper() {
  const { t } = useI18n();

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">{t('book.breadcrumb_home')}</Link>
        <span>/</span>
        <Link href="/appointments" className="hover:text-blue-600 transition-colors">{t('book.breadcrumb_appointments')}</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold">{t('book.breadcrumb_book')}</span>
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
                {t('book.hero_badge')}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight">
              {t('book.hero_title')}
              <span className="block text-blue-100">{t('book.hero_title_secondary')}</span>
            </h1>
            
            <p className="text-xs sm:text-sm lg:text-base text-blue-100 leading-relaxed max-w-md">
              {t('book.hero_description')}
            </p>

            {/* Stats Line */}
            <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-white/80 text-xs">{t('book.hero_stat_setup')}</p>
                  <p className="text-white font-bold text-xs sm:text-sm">{t('book.hero_stat_setup_time')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-white/80 text-xs">{t('book.hero_stat_confirmation')}</p>
                  <p className="text-white font-bold text-xs sm:text-sm">{t('book.hero_stat_confirmation_status')}</p>
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
                    <p className="text-white/80 text-xs">{t('book.hero_feature1_title')}</p>
                    <p className="text-white font-bold text-xs sm:text-sm truncate">{t('book.hero_feature1_desc')}</p>
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
                    <p className="text-white/80 text-xs">{t('book.hero_feature2_title')}</p>
                    <p className="text-white font-bold text-xs sm:text-sm truncate">{t('book.hero_feature2_desc')}</p>
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
                    <p className="text-white/80 text-xs">{t('book.hero_feature3_title')}</p>
                    <p className="text-white font-bold text-xs sm:text-sm truncate">{t('book.hero_feature3_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
