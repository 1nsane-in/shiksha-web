"use client";

import React from "react";
import { Card, CardContent } from "@repo/ui";
import {
  SectionHeading,
  InfoRow,
  BadgeList,
  AmenityCheck,
  InfraStat,
} from "@/components/admin/universities/ui";
import {
  Stethoscope,
  School,
  FlaskConical,
  Bed,
  MapPin,
  Library,
  Building2,
  Dumbbell,
  Coffee,
  Wifi,
  Bus,
} from "lucide-react";

export function InfrastructureTab({
  infra,
  router,
  uniId,
}: {
  infra: any;
  router: any;
  uniId: string;
}) {
  const hasData = !!infra;
  const i = infra || {};
  const deptCount = Array.isArray(i.departments)
    ? i.departments.length
    : i.departments ?? "—";
  const labCount = Array.isArray(i.laboratories)
    ? i.laboratories.length
    : i.laboratories ?? "—";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        <InfraStat
          icon={Stethoscope}
          label="Hospital Beds"
          value={hasData ? i.hospitalBeds ?? "—" : "—"}
        />
        <InfraStat
          icon={School}
          label="Departments"
          value={deptCount}
        />
        <InfraStat
          icon={FlaskConical}
          label="Laboratories"
          value={labCount}
        />
        <InfraStat
          icon={Bed}
          label="Hostel (Boys)"
          value={hasData ? i.hostelBoys ?? "—" : "—"}
        />
        <InfraStat
          icon={Bed}
          label="Hostel (Girls)"
          value={hasData ? i.hostelGirls ?? "—" : "—"}
        />
        <InfraStat
          icon={MapPin}
          label="Campus (acres)"
          value={hasData ? i.campusArea ?? "—" : "—"}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card size="sm" className="border-[#ECEAE6]">
          <CardContent className="space-y-3 p-4 sm:p-5">
            <SectionHeading
              icon={Library}
              title="Library"
              onEdit={() =>
                router.push(`/admin/universities/${uniId}/edit`)
              }
            />
            <InfoRow
              icon={Library}
              label="Library Size"
              value={hasData && i.librarySize ? i.librarySize : "—"}
            />
          </CardContent>
        </Card>
        <Card size="sm" className="border-[#ECEAE6]">
          <CardContent className="space-y-3 p-4 sm:p-5">
            <SectionHeading
              icon={School}
              title="Departments"
              onEdit={() =>
                router.push(`/admin/universities/${uniId}/edit`)
              }
            />
            <BadgeList
              items={
                hasData && Array.isArray(i.departments) ? i.departments : []
              }
            />
          </CardContent>
        </Card>
        <Card size="sm" className="border-[#ECEAE6]">
          <CardContent className="space-y-3 p-4 sm:p-5">
            <SectionHeading
              icon={FlaskConical}
              title="Laboratories"
              onEdit={() =>
                router.push(`/admin/universities/${uniId}/edit`)
              }
            />
            <BadgeList
              items={
                hasData && Array.isArray(i.laboratories) ? i.laboratories : []
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
        <CardContent className="p-5">
          <SectionHeading
            icon={Building2}
            title="In-Campus Amenities & Amenities checklist"
            onEdit={() => router.push(`/admin/universities/${uniId}/edit`)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AmenityCheck
              icon={Library}
              label="Central Medical Library"
              checked={hasData && i.facilities?.includes("Library")}
            />
            <AmenityCheck
              icon={FlaskConical}
              label="Hi-Tech Computer Lab"
              checked={hasData && i.facilities?.includes("Computer Lab")}
            />
            <AmenityCheck
              icon={Dumbbell}
              label="Multi-Sports Complex"
              checked={hasData && i.facilities?.includes("Sports Complex")}
            />
            <AmenityCheck
              icon={Coffee}
              label="Canteen & Cafeteria"
              checked={
                hasData &&
                (i.facilities?.includes("Cafeteria") || i.cafeteria)
              }
            />
            <AmenityCheck
              icon={Bed}
              label="Hostel Accommodation"
              checked={hasData && i.facilities?.includes("Hostel")}
            />
            <AmenityCheck
              icon={Stethoscope}
              label="Affiliated Hospital"
              checked={hasData && i.facilities?.includes("Hospital")}
            />
            <AmenityCheck
              icon={Wifi}
              label="High-Speed WiFi"
              checked={hasData && i.wifiCampus}
            />
            <AmenityCheck
              icon={Bus}
              label="Transport System"
              checked={hasData && i.transportation}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
