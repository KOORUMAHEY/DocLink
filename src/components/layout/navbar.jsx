'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Languages, 
  Calendar, 
  Stethoscope, 
  Heart, 
  Clock, 
  Shield, 
  ChevronDown,
  Phone,
  Activity,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/i18n';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const navLinks = [
	{ 
		href: '/', 
		label: 'home', 
		icon: Heart, 
		color: 'text-red-500'
	},
	{ 
		href: '/appointments', 
		label: 'appointments', 
		icon: Calendar,
		color: 'text-blue-500'
	},
];

export function Navbar() {
	const pathname = usePathname();
	const { t, setLocale, locale } = useI18n();

	return (
		<header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 border-b border-gray-100">
			{/* Top notification bar */}
			<div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 px-4">
				<div className="flex items-center justify-center space-x-2 text-sm">
					<Clock className="h-4 w-4" />
					<span className="font-medium">Available: Friday 9:00 AM - 2:00 PM</span>
					<Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/20 text-xs">
						<Phone className="h-3 w-3 mr-1" />
						Emergency 24/7
					</Badge>
				</div>
			</div>
			
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo and Brand */}
					<div className="flex items-center space-x-4">
						<Link href="/" className="flex items-center space-x-3 group">
							<div className="relative">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
									<Stethoscope className="h-6 w-6 text-white" />
								</div>
								<div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
									<div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
								</div>
							</div>
							<div className="flex flex-col">
								<div className="flex items-center space-x-2">
									<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
										DocLink
									</span>
									<Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
										Healthcare
									</Badge>
								</div>
								<span className="text-xs text-gray-500 hidden sm:block font-medium">
									{t('navbar.tagline')} • Trusted by 10,000+ patients
								</span>
							</div>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center space-x-2">
						{navLinks.map((link) => {
							const Icon = link.icon;
							const isActive = pathname === link.href;
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										'group relative flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-50',
										isActive
											? 'bg-blue-50/80 text-blue-700'
											: 'text-gray-600 hover:text-gray-900'
									)}
								>
									<Icon className={cn(
										'h-5 w-5 transition-all duration-300',
										isActive ? link.color : 'text-gray-500 group-hover:text-gray-700'
									)} />
									<span className="font-semibold">{t(`navbar.${link.label}`)}</span>
									{isActive && (
										<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
									)}
								</Link>
							);
						})}
					</nav>

					{/* Desktop Actions */}
					<div className="hidden lg:flex items-center space-x-3">
						{/* Language Selector */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100 rounded-xl px-3 py-2">
									<Languages className="h-4 w-4 text-gray-600" />
									<span className="text-sm font-medium text-gray-700">{locale.toUpperCase()}</span>
									<ChevronDown className="h-3 w-3 text-gray-500" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-44 p-2 rounded-xl shadow-lg border border-gray-200">
								<DropdownMenuItem 
									onSelect={() => setLocale('en')} 
									className={cn(
										'rounded-lg cursor-pointer transition-colors',
										locale === 'en' && 'bg-blue-50 text-blue-700'
									)}
								>
									<span className="mr-3">🇺🇸</span>
									<span className="font-medium">English</span>
								</DropdownMenuItem>
								<DropdownMenuItem 
									onSelect={() => setLocale('hi')} 
									className={cn(
										'rounded-lg cursor-pointer transition-colors',
										locale === 'hi' && 'bg-blue-50 text-blue-700'
									)}
								>
									<span className="mr-3">🇮🇳</span>
									<span className="font-medium">हिंदी</span>
								</DropdownMenuItem>
								<DropdownMenuItem 
									onSelect={() => setLocale('ta')} 
									className={cn(
										'rounded-lg cursor-pointer transition-colors',
										locale === 'ta' && 'bg-blue-50 text-blue-700'
									)}
								>
									<span className="mr-3">🇮🇳</span>
									<span className="font-medium">தமிழ்</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* My Health Button */}
						<Button asChild variant="outline" size="sm" className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl px-4 py-2 transition-all duration-300">
							<Link href="/appointments" className="flex items-center space-x-2">
								<Activity className="h-4 w-4 text-blue-600" />
								<span className="font-medium text-gray-700">My Health</span>
							</Link>
						</Button>

						{/* Book Appointment Button */}
						<Button asChild size="sm" className="relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 overflow-hidden group">
							<Link href="/appointments/book" className="flex items-center space-x-2 relative z-10">
								<Calendar className="h-4 w-4" />
								<span>Book Now</span>
								<div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
							</Link>
						</Button>

						{/* Doctor/Admin Profile Login */}
						<Button asChild variant="ghost" size="sm" className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-blue-100 transition-all duration-300 group">
							<Link href="/login" className="flex items-center justify-center" title="Doctor/Admin Login">
								<div className="relative flex items-center justify-center w-6 h-6">
									<div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity blur-sm"></div>
									<Shield className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors drop-shadow-sm" />
								</div>
								<span className="sr-only">Doctor/Admin Login</span>
							</Link>
						</Button>
					</div>

				{/* Mobile Menu */}
				<div className="lg:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-xl p-2">
								<Menu className="h-6 w-6 text-gray-700" />
								<span className="sr-only">Toggle Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 bg-gradient-to-b from-white to-gray-50">
							<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
							<div className="flex flex-col h-full">
								{/* Mobile Header */}
								<div className="px-6 py-4 border-b border-gray-100 bg-white">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
												<Heart className="h-5 w-5 text-white" />
											</div>
											<div>
												<div className="font-bold text-gray-900 text-lg">DocLink</div>
												<div className="text-xs text-gray-500">Your Health Partner</div>
											</div>
										</div>
										<Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1">
											<div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
											Available
										</Badge>
									</div>
								</div>

								{/* Quick Actions */}
								<div className="px-6 py-4 bg-white border-b border-gray-100">
									<div className="space-y-3">
										<Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300">
											<Link href="/appointments/book" className="flex items-center justify-center space-x-2">
												<Calendar className="h-5 w-5" />
												<span className="font-semibold">Book Appointment</span>
											</Link>
										</Button>

										<Button asChild variant="outline" className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl py-3 transition-all duration-300">
											<Link href="/appointments" className="flex items-center justify-center space-x-2">
												<Activity className="h-5 w-5 text-blue-600" />
												<span className="font-medium text-gray-700">My Health Portal</span>
											</Link>
										</Button>

										<Button asChild variant="outline" className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl py-3 transition-all duration-300">
											<Link href="/login" className="flex items-center justify-center space-x-3">
												<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
													<Shield className="h-4 w-4 text-white" />
												</div>
												<span className="font-medium text-gray-700">Doctor/Admin Login</span>
											</Link>
										</Button>
									</div>
								</div>

								{/* Mobile Navigation */}
								<nav className="flex-1 px-6 py-4">
									<div className="mb-4">
										<p className="text-sm font-semibold text-gray-900 mb-3">Navigation</p>
										<div className="space-y-2">
											{navLinks.map((link) => {
												const Icon = link.icon;
												const isActive = pathname === link.href;
												return (
													<Link
														key={link.href}
														href={link.href}
														className={cn(
															'flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
															isActive
																? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
																: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
														)}
													>
														<div className={cn(
															'h-10 w-10 rounded-lg flex items-center justify-center',
															isActive ? 'bg-blue-200' : link.color
														)}>
															<Icon className={cn('h-5 w-5', isActive ? 'text-blue-700' : '')} />
														</div>
														<span className="font-medium">{t(`navbar.${link.label}`)}</span>
													</Link>
												);
											})}
										</div>
									</div>

									{/* Emergency Contact */}
									<div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
										<div className="flex items-center space-x-2 mb-2">
											<Shield className="h-5 w-5 text-red-600" />
											<span className="font-semibold text-red-800">Emergency</span>
										</div>
										<p className="text-sm text-red-700 mb-3">24/7 Medical Emergency Hotline</p>
										<Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 shadow-md hover:shadow-lg transition-all duration-200">
											<Phone className="h-4 w-4 mr-2" />
											Call Now: 108
										</Button>
									</div>
								</nav>

								{/* Mobile Footer */}
								<div className="px-6 py-4 border-t border-gray-100 bg-white">
									<div className="space-y-3">
										<div>
											<p className="text-sm font-medium text-gray-900 mb-2">Language</p>
											<div className="flex space-x-2">
												<Button
													variant={locale === 'en' ? 'default' : 'outline'}
													size="sm"
													onClick={() => setLocale('en')}
													className={cn(
														'flex-1 text-xs rounded-lg',
														locale === 'en' && 'bg-blue-600 text-white'
													)}
												>
													🇺🇸 EN
												</Button>
												<Button
													variant={locale === 'hi' ? 'default' : 'outline'}
													size="sm"
													onClick={() => setLocale('hi')}
													className={cn(
														'flex-1 text-xs rounded-lg',
														locale === 'hi' && 'bg-blue-600 text-white'
													)}
												>
													🇮🇳 हिं
												</Button>
												<Button
													variant={locale === 'ta' ? 'default' : 'outline'}
													size="sm"
													onClick={() => setLocale('ta')}
													className={cn(
														'flex-1 text-xs rounded-lg',
														locale === 'ta' && 'bg-blue-600 text-white'
													)}
												>
													🇮🇳 தமி
												</Button>
											</div>
										</div>

										{/* Contact Info */}
										<div className="text-center text-xs text-gray-500">
											<p>Need help? Contact us 24/7</p>
											<p className="font-medium text-blue-600">support@doclink.com</p>
										</div>
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
