"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { universities, type University } from "@/lib/university-data";
import {
  MapPin,
  GraduationCap,
  Calendar,
  Star,
  Clock,
  Building2,
  Globe,
  Award,
  BookOpen,
  Download,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const infoRows = [
  { label: "University Type", field: "type" as const, icon: Building2 },
  { label: "Intake", field: "intake" as const, icon: Calendar },
  { label: "Grade", field: "grade" as const, icon: Star },
  { label: "Duration", field: "duration" as const, icon: Clock },
  { label: "Established", field: "established" as const, icon: Award },
  { label: "Fee", field: "fee" as const, icon: GraduationCap },
  { label: "World Rank", field: "worldRank" as const, icon: Globe },
  { label: "Medium", field: "medium" as const, icon: BookOpen },
  { label: "ECFMG", field: "ecfmg" as const, icon: Award },
  { label: "Specialization", field: "specialization" as const, icon: BookOpen },
];

function InfoIcon({ icon: Icon }: { icon: React.ElementType }) {
  return <Icon className="size-3.5 text-[#8B7FAD]" />;
}

export function UniversityCards() {
  const router = useRouter();

  const handleApply = (uni: University) => {
    if (!useAuthStore.getState().token) {
      router.push("/login?redirect=%2F");
      return;
    }
    router.push(`/applications?university=${encodeURIComponent(uni.name)}`);
  };

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
          {universities.map((uni) => (
            <Card
              key={uni.name}
              className="group border p-0 border-[#E0D8F0] hover:border-[#F0A030]/50 transition-all hover:shadow-xl overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-44 h-40 sm:h-auto shrink-0 bg-white flex items-center justify-center">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={uni.image}
                      alt={uni.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute top-3 right-3 sm:hidden rounded-full bg-[#F0A030] px-2.5 py-0.5 text-xs font-semibold text-[#2D2154] shadow-sm">
                    {uni.grade}
                  </span>
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
                    <span className="hidden sm:block shrink-0 rounded-full bg-[#F0A030] px-2.5 py-0.5 text-xs font-semibold text-[#2D2154]">
                      {uni.grade}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6B6B6B] mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#8B7FAD]" />
                      {uni.country}
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="size-3.5 text-[#8B7FAD]" />
                      {uni.degree} in {uni.course}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    {infoRows.map((row) => (
                      <div key={row.label} className="flex items-center gap-2">
                        <InfoIcon icon={row.icon} />
                        <div className="min-w-0">
                          <span className="text-[#6B6B6B] text-xs">
                            {row.label}:{" "}
                          </span>
                          <span className="text-[#2D2154] font-medium text-xs">
                            {uni[row.field]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-xs h-9 bg-transparent"
                      onClick={() =>
                        window.open(
                          uni.brochureUrl,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    >
                      <Download className="size-3.5" />
                      Brochure
                    </Button>
                    <Button
                      size="sm"
                      nativeButton={false}
                      className="flex-1 gap-1.5 text-xs h-9"
                      // onClick={() => handleApply(uni)}
                      render={
                        <Link href={`/university/${uni.slug}?apply=true`} />
                      }
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      className="gap-1 h-9 px-3 text-[#4B2D8E] hover:text-[#2D2154] hover:bg-[#4B2D8E]/5"
                      render={<Link href={`/university/${uni.slug}`} />}
                    >
                      Details
                      <ExternalLink className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            className="gap-2 text-[#4B2D8E] hover:text-[#2D2154] hover:bg-[#4B2D8E]/5"
            onClick={() =>
              window.open(
                "https://wciecorganization.com/explore_university",
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            View All Universities
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
