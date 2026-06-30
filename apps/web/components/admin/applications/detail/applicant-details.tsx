"use client";

import { User, MapPin, Globe } from "lucide-react";
import { KeyValueRow } from "@/components/admin/shared/detail-primitives";

interface Props {
  formData: Record<string, any> | null;
  firstName: string;
  lastName: string;
  email: string;
  selectedProgram: string | null;
}

function formatTitle(str: string) {
  return str
    ? str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";
}

export function ApplicantDetails({ formData: fd, firstName, lastName, email, selectedProgram }: Props) {
  const formattedProgram = formatTitle(selectedProgram);
  const formattedGender = formatTitle(fd?.gender);
  const formattedMarital = formatTitle(fd?.maritalStatus);

  return (
    <>
      {/* Demographics */}
      <div className="rounded-xl border border-[#d3cec6] bg-white p-6 md:p-8 transition-all">
        <div className="mb-6 flex items-center gap-3 border-b border-[#ebe7e1] pb-4">
          <div className="rounded-lg bg-zinc-100 p-2 text-[#111111]">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#111111] tracking-tight">Applicant Demographics</h2>
            <p className="text-[11px] text-[#626260] mt-0.5">Verified details and profile dossier</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <div className="divide-y divide-zinc-100">
            <KeyValueRow label="Full Name" value={`${firstName} ${lastName}`} />
            <KeyValueRow label="Email Address" value={email} />
            <KeyValueRow label="Selected Program" value={formattedProgram} />
            <KeyValueRow label="Date of Birth" value={fd?.dateOfBirth ? new Date(fd.dateOfBirth).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : null} />
          </div>
          <div className="divide-y divide-zinc-100">
            <KeyValueRow label="Gender" value={formattedGender} />
            <KeyValueRow label="Citizenship" value={fd?.citizenship} />
            <KeyValueRow label="Marital Status" value={formattedMarital} />
            <KeyValueRow label="Embassy Location" value={fd?.embassyLocation} />
          </div>
        </div>
      </div>

      {/* Birthplace */}
      {fd?.placeOfBirth && (
        <div className="rounded-xl border border-[#d3cec6] bg-white p-6 md:p-8 transition-all">
          <div className="mb-6 flex items-center border-b border-[#ebe7e1] pb-4">
            <div className="rounded-lg bg-zinc-100 p-2 text-[#111111] mr-3">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111111] tracking-tight">Birth Details</h2>
              <p className="text-[11px] text-[#626260] mt-0.5">Recorded place of birth</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="divide-y divide-zinc-100">
              <KeyValueRow label="City of Birth" value={fd.placeOfBirth.city} />
              <KeyValueRow label="State/Province" value={fd.placeOfBirth.state} />
            </div>
            <div className="divide-y divide-zinc-100">
              <KeyValueRow label="Country of Birth" value={fd.placeOfBirth.country} />
            </div>
          </div>
        </div>
      )}

      {/* Permanent Address */}
      {fd?.permanentAddress && (
        <div className="rounded-xl border border-[#d3cec6] bg-white p-6 md:p-8 transition-all">
          <div className="mb-6 flex items-center border-b border-[#ebe7e1] pb-4">
            <div className="rounded-lg bg-zinc-100 p-2 text-[#111111] mr-3">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111111] tracking-tight">Permanent Address</h2>
              <p className="text-[11px] text-[#626260] mt-0.5">Primary residential address</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="divide-y divide-zinc-100">
              <KeyValueRow label="Street Address" value={fd.permanentAddress} />
              <KeyValueRow label="City" value={fd.permanentCity} />
              <KeyValueRow label="State/Province" value={fd.permanentState} />
            </div>
            <div className="divide-y divide-zinc-100">
              <KeyValueRow label="Postal/ZIP Code" value={fd.permanentZip} />
              <KeyValueRow label="Country" value={fd.permanentCountry} />
            </div>
          </div>
        </div>
      )}

      {/* Language Proficiency */}
      {fd?.language1 && (
        <div className="rounded-xl border border-[#d3cec6] bg-white p-6 md:p-8 transition-all">
          <div className="mb-6 flex items-center border-b border-[#ebe7e1] pb-4">
            <div className="rounded-lg bg-zinc-100 p-2 text-[#111111] mr-3">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111111] tracking-tight">Language Proficiency</h2>
              <p className="text-[11px] text-[#626260] mt-0.5">Self-reported language skills</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="divide-y divide-zinc-100">
              <KeyValueRow label="Primary Language" value={fd.language1.name} />
              <KeyValueRow label="Reading Level" value={fd.language1.reading} />
            </div>
            <div className="divide-y divide-zinc-100">
              <KeyValueRow label="Speaking Level" value={fd.language1.speaking} />
              <KeyValueRow label="Writing Level" value={fd.language1.writing} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
