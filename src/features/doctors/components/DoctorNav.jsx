
'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, Calendar, Users } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function DoctorNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  const doctorNavItems = [
      { href: `/doctor?id=${doctorId}`, label: 'Dashboard', icon: Home },
      { href: `/doctor/appointments?id=${doctorId}`, label: 'Appointments', icon: Calendar },
      { href: `/doctor/patients?id=${doctorId}`, label: 'My Patients', icon: Users },
  ];

  if (!doctorId) return null;

  return (
     <SidebarMenu>
        {doctorNavItems.map(item => (
             <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                    <SidebarMenuButton
                        isActive={pathname === item.href.split('?')[0]}
                        className={cn(pathname === item.href.split('?')[0] && "font-semibold")}
                        asChild
                    >
                        <span>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </span>
                    </SidebarMenuButton>
                </Link>
             </SidebarMenuItem>
        ))}
      </SidebarMenu>
  )
}
