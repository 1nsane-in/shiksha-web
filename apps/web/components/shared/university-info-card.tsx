import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
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
          <Building2 className="size-4 text-[#F0A030]" />
          University
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="text-[#6B6B6B]">Name</p>
          <p className="font-medium text-[#2D2154]">{university?.name}</p>
        </div>
        {university?.location && (
          <div className="flex items-start gap-2">
            <MapPin className="size-3.5 text-[#6B6B6B] mt-0.5" />
            <p className="font-medium text-[#2D2154]">
              {[university.location.city, university.location.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}
        {university?.contact?.email && (
          <div className="flex items-start gap-2">
            <Mail className="size-3.5 text-[#6B6B6B] mt-0.5" />
            <p className="text-[#2D2154]">{university.contact.email}</p>
          </div>
        )}
        {university?.contact?.phone && (
          <div className="flex items-start gap-2">
            <Phone className="size-3.5 text-[#6B6B6B] mt-0.5" />
            <p className="text-[#2D2154]">{university.contact.phone}</p>
          </div>
        )}
        {university?.slug && (
          <Link
            href={`/student/university/${university.slug}`}
            className="inline-flex items-center gap-1 text-[#4B2D8E] hover:underline text-sm mt-2"
          >
            <Globe className="size-3.5" />
            View University Page
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
