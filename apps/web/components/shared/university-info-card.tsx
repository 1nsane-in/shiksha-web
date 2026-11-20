import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui";
import { Building2, Globe, Mail, MapPin, Phone } from "lucide-react";
import type { ApplicationDetail } from "@/domains/student/student.types";

interface UniversityInfoCardProps {
  university: ApplicationDetail["university"];
}

export function UniversityInfoCard({ university }: UniversityInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="size-4 text-royal-blue" />
          University
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-slate-500">Name</p>
          <p className="font-medium text-navy">{university?.name}</p>
        </div>
        {university?.location && (
          <div className="flex items-start gap-2">
            <MapPin className="size-3.5 text-slate-500 mt-0.5" />
            <p className="font-medium text-navy">
              {[university.location.city, university.location.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}
        {university?.contact?.email && (
          <div className="flex items-start gap-2">
            <Mail className="size-3.5 text-slate-500 mt-0.5" />
            <p className="text-navy">{university.contact.email}</p>
          </div>
        )}
        {university?.contact?.phone && (
          <div className="flex items-start gap-2">
            <Phone className="size-3.5 text-slate-500 mt-0.5" />
            <p className="text-navy">{university.contact.phone}</p>
          </div>
        )}
        {university?.slug && (
          <Link
            href={`/student/university/${university.slug}`}
            className="inline-flex items-center gap-1 text-royal-blue hover:underline text-sm mt-2"
          >
            <Globe className="size-3.5" />
            View University Page
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
