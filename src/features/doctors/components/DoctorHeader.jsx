'use client';

import { useState } from 'react';
import { Bell, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function DoctorHeader({ doctor }) { // eslint-disable-line react/prop-types // eslint-disable-line react/prop-types
  const [notifications] = useState([
    { id: 1, title: 'New appointment request', time: '5 min ago', urgent: true },
    { id: 2, title: 'Patient follow-up reminder', time: '1 hour ago', urgent: false },
    { id: 3, title: 'Schedule updated', time: '2 hours ago', urgent: false },
  ]);

  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  const urgentCount = notifications.filter(n => n.urgent).length;

  return (
    <header className="flex h-16 items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Left side - Quick Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 hover:border-blue-300" asChild>
            <Link href={`/doctor/appointments/form?id=${doctorId}`}>
              Book Appointment
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50 hover:border-green-300" asChild>
            <Link href={`/doctor/patients?id=${doctorId}`}>
              View Patients
            </Link>
          </Button>
        </div>
      </div>

      {/* Right side - Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              {urgentCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {urgentCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {urgentCount > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {urgentCount} urgent
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    {notification.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 h-9 px-3 rounded-full hover:bg-gray-100">
              <Avatar className="h-7 w-7">
                <AvatarImage src={doctor?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                  {doctor?.name?.charAt(0)?.toUpperCase() || 'D'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">
                  Dr. {doctor?.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {doctor?.specialization}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/doctor/profile?id=${doctorId}`} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/doctor/settings?id=${doctorId}`} className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 hover:text-red-700 focus:text-red-700"
              onClick={() => {
                // Handle logout
                window.location.href = '/login';
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}