"use client";

import Image from "next/image";
import { Button } from "@repo/ui";
import { Card } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useUniversities } from "@/domains/universities/universities.queries";
import {
  MapPin,
  GraduationCap,
  Building2,
  Award,
  BookOpen,
  ExternalLink,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";

const infoRows = [
  { label: "Type", field: "type" as const, icon: Building2 },
  { label: "Established", field: "established" as const, icon: Award },
  { label: "Medium", field: "medium" as const, icon: BookOpen },
  { label: "City", field: "city" as const, icon: MapPin },
];

export function UniversityCards() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useUniversities({ limit: 10 });

  if (isLoading) {
    return (
      <section className="py-20 bg-[#F8F6FC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !data?.length) {
    return (
      <section className="py-20 bg-[#F8F6FC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <AlertCircle className="size-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              {error ? "Failed to load universities" : "No universities available"}
            </p>
            {error && (
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#F8F6FC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block rounded-full bg-[#F0A030]/10 px-4 py-1 text-sm font-medium text-[#F0A030] border border-[#F0A030]/20 mb-4">
            Top Universities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D2154] mb-4">
            Best Medicine Universities in Kyrgyzstan
          </h2>
          <p className="text-gray-600 leading-relaxed">
            NMC approved medical universities with quality education affiliated
            with Kyrgyzstan Ministry of Education
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data?.map((uni) => (
            <Card
              key={uni.id}
              className="group border p-0 border-[#E0D8F0] hover:border-[#F0A030]/50 transition-all hover:shadow-xl overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-44 h-40 sm:h-auto shrink-0 bg-white flex items-center justify-center">
                  <div className="relative w-full h-full overflow-hidden">
                    {uni.logo ? (
                      <Image
                        src={uni.logo}
                        alt={uni.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Building2 className="size-10 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-4 flex flex-col min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#2D2154] text-base leading-tight truncate">
                        {uni.name}
                      </h3>
                      <p className="text-[#6B6B6B] text-sm mt-0.5">
                        {uni.shortName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6B6B6B] mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#8B7FAD]" />
                      {[uni.location?.city, uni.location?.country].filter(Boolean).join(', ') || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="size-3.5 text-[#8B7FAD]" />
                      {uni.academic?.medium || 'N/A'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    {infoRows.map((row) => {
                      const Icon = row.icon;
                      let value: string;
                      if (row.field === 'type') value = uni.type;
                      else if (row.field === 'established') value = String(uni.establishedYear);
                      else if (row.field === 'medium') value = uni.academic?.medium || '—';
                      else if (row.field === 'city') value = uni.location?.city || '—';
                      else value = '—';
                      return (
                        <div key={row.label} className="flex items-center gap-2">
                          <Icon className="size-3.5 text-[#8B7FAD]" />
                          <div className="min-w-0">
                            <span className="text-[#6B6B6B] text-xs">
                              {row.label}:{" "}
                            </span>
                            <span className="text-[#2D2154] font-medium text-xs">
                              {value}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B6B6B] mb-4">
                    {uni.contact?.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="size-3 text-[#8B7FAD]" />
                        <span className="truncate max-w-[150px]">{uni.contact.email}</span>
                      </div>
                    )}
                    {uni.contact?.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="size-3 text-[#8B7FAD]" />
                        <span>{uni.contact.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto" style={{position: 'relative', zIndex: 10}}>
                    <button
                      className="flex-1 gap-1.5 text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md inline-flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/student/university/${uni.slug}?apply=true`);
                      }}
                    >
                      Apply Now
                    </button>
                    <button
                      className="flex-1 gap-1 h-9 px-3 text-[#4B2D8E] hover:text-[#2D2154] hover:bg-[#4B2D8E]/5 rounded-md inline-flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/student/university/${uni.slug}`);
                      }}
                    >
                      View Details
                      <ExternalLink className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

