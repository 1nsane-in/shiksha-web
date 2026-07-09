"use client";

import React from "react";
import { Card, CardContent } from "@repo/ui";
import { SectionHeading, InfoRow, BadgeList, AmenityCheck, InfraStat } from "@/components/admin/universities/ui";
import { Stethoscope, School, FlaskConical, Bed, MapPin, Library, Building2, Dumbbell, Coffee, Wifi, Bus } from "lucide-react";

export function InfrastructureTab({
  infra,
  router,
  uniId,
}: {
  infra: any;
  router: any;
  uniId: string;
}) {
  return (
    <div className="space-y-5">
      {infra ? (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
            <InfraStat icon={Stethoscope} label="Hospital Beds" value={infra.hospitalBeds} />
            <InfraStat icon={School} label="Departments" value={infra.departments} />
            <InfraStat icon={FlaskConical} label="Laboratories" value={infra.laboratories} />
            <InfraStat icon={Bed} label="Hostel (Boys)" value={infra.hostelBoys} />
            <InfraStat icon={Bed} label="Hostel (Girls)" value={infra.hostelGirls} />
            <InfraStat icon={MapPin} label="Campus (acres)" value={infra.campusArea} />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {infra.librarySize && (
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading icon={Library} title="Library" />
                  <InfoRow icon={Library} label="Library Size" value={infra.librarySize} />
                </CardContent>
              </Card>
            )}
            {infra.departments?.length > 0 && (
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading icon={School} title="Departments" />
                  <BadgeList items={infra.departments} />
                </CardContent>
              </Card>
            )}
            {infra.laboratories?.length > 0 && (
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading icon={FlaskConical} title="Laboratories" />
                  <BadgeList items={infra.laboratories} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Amenities Grid */}
          <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
            <CardContent className="p-5">
              <SectionHeading
                icon={Building2}
                title="In-Campus Amenities & Amenities checklist"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <AmenityCheck icon={Library} label="Central Medical Library" checked={infra.facilities?.includes("Library")} />
                <AmenityCheck icon={FlaskConical} label="Hi-Tech Computer Lab" checked={infra.facilities?.includes("Computer Lab")} />
                <AmenityCheck icon={Dumbbell} label="Multi-Sports Complex" checked={infra.facilities?.includes("Sports Complex")} />
                <AmenityCheck icon={Coffee} label="Canteen & Cafeteria" checked={infra.facilities?.includes("Cafeteria") || infra.cafeteria} />
                <AmenityCheck icon={Bed} label="Hostel Accommodation" checked={infra.facilities?.includes("Hostel")} />
                <AmenityCheck icon={Stethoscope} label="Affiliated Hospital" checked={infra.facilities?.includes("Hospital")} />
                <AmenityCheck icon={Wifi} label="High-Speed WiFi" checked={infra.wifiCampus} />
                <AmenityCheck icon={Bus} label="Transport System" checked={infra.transportation} />
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
          No infrastructure metrics documented.
        </div>
      )}
    </div>
  );
}
