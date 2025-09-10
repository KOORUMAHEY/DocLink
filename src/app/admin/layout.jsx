
"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Stethoscope, Home, Calendar, Users, Plus, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { href: '/admin/patients', label: 'Patients', icon: Users },
];

function AdminNav() {
    const pathname = usePathname();
    return (
        <nav className="hidden md:flex items-center gap-2">
            {adminNavItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                            isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

function MobileAdminNav() {
    const pathname = usePathname();
    return (
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto">
            {adminNavItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                            isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default function AdminLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-900">DocLink Admin</h1>
                <span className="text-xs text-gray-500 hidden sm:block">Healthcare Management</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <AdminNav />

            {/* Mobile Navigation */}
            <MobileAdminNav />

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-blue-50">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatars/admin.png" alt="Admin" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">A</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">admin@doclink.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Exit Admin</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
       </header>

       <main className="container mx-auto px-4 py-8">
         <div className="space-y-8">
           {children}
         </div>
       </main>
    </div>
  );
}
