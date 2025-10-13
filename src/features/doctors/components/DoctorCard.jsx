/**
 * Doctor Card Component
 * @module features/doctors/components/DoctorCard
 */

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { formatDoctorName, getDoctorAvatar, truncateBio, getDoctorStatusColor } from '@/features/doctors/utils/doctorHelpers';
import { DOCTOR_STATUS_LABELS } from '@/features/doctors/constants/doctorConstants';

export function DoctorCard({ doctor, showStatus = false, linkTo = null }) {
  const doctorLink = linkTo || `/doctors/${doctor.id}`;
  const avatarUrl = getDoctorAvatar(doctor);

  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={avatarUrl}
            alt={`Photo of ${doctor.name}`}
            data-ai-hint="doctor portrait"
            fill
            className="object-cover"
          />
          {showStatus && doctor.status && (
            <div className="absolute top-2 right-2">
              <Badge className={getDoctorStatusColor(doctor.status)}>
                {DOCTOR_STATUS_LABELS[doctor.status] || doctor.status}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <CardTitle className="text-xl">{formatDoctorName(doctor)}</CardTitle>
        <p className="mt-1 text-primary font-medium">{doctor.specialization}</p>
        {doctor.bio && (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
            {truncateBio(doctor.bio, 120)}
          </p>
        )}
        {doctor.yearsOfExperience && (
          <p className="mt-2 text-xs text-muted-foreground">
            {doctor.yearsOfExperience} years of experience
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={doctorLink}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
