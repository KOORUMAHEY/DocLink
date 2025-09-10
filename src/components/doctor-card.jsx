
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function DoctorCard({ doctor }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={doctor.imageUrl}
            alt={`Photo of ${doctor.name}`}
            data-ai-hint="doctor portrait"
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <CardTitle className="text-xl">{doctor.name}</CardTitle>
        <p className="mt-1 text-primary">{doctor.specialization}</p>
        <p className="mt-4 text-sm text-muted-foreground line-clamp-3">{doctor.bio}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/doctors/${doctor.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
