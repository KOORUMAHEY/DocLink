
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Stethoscope, Users, Activity } from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    title: "Total Appointments",
    value: "1,250",
    icon: Calendar,
    description: "+20.1% from last month",
    href: "/admin/appointments"
  },
  {
    title: "Active Doctors",
    value: "24",
    icon: Stethoscope,
    description: "Currently available specialists",
    href: "/admin/doctors"
  },
  {
    title: "New Patients",
    value: "89",
    icon: Users,
    description: "+15.2% this month",
    href: "/admin/patients"
  },
  {
    title: "Clinic Occupancy",
    value: "72%",
    icon: Activity,
    description: "Based on scheduled appointments",
    href: "#"
  }
]

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Link href={stat.href} className="text-sm font-medium text-primary hover:underline mt-2 inline-block">View all</Link>
              </CardContent>
            </Card>
        ))}
      </div>
      {/* TODO: Add more dashboard components like recent appointments table and charts */}
    </div>
  )
}
