
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, User, Languages, Calendar } from 'lucide-react';
import { HiHeart } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/i18n';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'home', icon: HiHeart },
  { href: '/appointments', label: 'appointments', icon: Calendar },
];

export function Navbar() {
  const pathname = usePathname();
  const { t, setLocale, locale } = useI18n();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-shadow">
                <HiHeart className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-tight">DocLink</span>
                <span className="text-xs text-gray-500 hidden sm:block">Healthcare</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-blue-600' : 'text-gray-500')} />
                  <span>{t(`navbar.${link.label}`)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Languages className="h-4 w-4" />
                  <span className="hidden lg:inline">{locale.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => setLocale('en')} className={cn(locale === 'en' && 'bg-blue-50')}>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocale('hi')} className={cn(locale === 'hi' && 'bg-blue-50')}>
                  🇮🇳 हिंदी
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocale('ta')} className={cn(locale === 'ta' && 'bg-blue-50')}>
                  🇮🇳 தமிழ்
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Primary CTA */}
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-blue-600">
              <Link href="/appointments/book" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{t('navbar.book_appointment')}</span>
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">{t('navbar.account')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{t('navbar.doctor_login')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/appointments" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{t('navbar.my_appointments')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-gradient-to-b from-white to-blue-50">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <HiHeart className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">DocLink</span>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              'flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all',
                              isActive
                                ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            )}
                          >
                            <Icon className={cn('h-5 w-5', isActive ? 'text-blue-600' : 'text-gray-500')} />
                            <span>{t(`navbar.${link.label}`)}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Mobile Quick Actions */}
                    <div className="mt-8 space-y-3">
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-blue-600">
                        <Link href="/appointments/book" className="flex items-center justify-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{t('navbar.book_appointment')}</span>
                        </Link>
                      </Button>

                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login" className="flex items-center justify-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{t('navbar.doctor_login')}</span>
                        </Link>
                      </Button>
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Languages className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setLocale('en')}>🇺🇸 English</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setLocale('hi')}>🇮🇳 हिंदी</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setLocale('ta')}>🇮🇳 தமிழ்</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
