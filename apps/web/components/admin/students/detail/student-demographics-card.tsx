"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Mail, Phone, Calendar, MapPin, User } from "lucide-react";

interface Props {
  email: string;
  phone: string | null | undefined;
  dob?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  passportNumber?: string | null;
}

export function StudentDemographicsCard({ email, phone, dob, address, city, state, country, passportNumber }: Props) {
  const addr = address ? `${address}, ${city ?? ""}, ${state ?? ""}, ${country ?? ""}` : "N/A";

  return (
    <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#666]">Demographics & Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        <Row icon={<Mail className="h-4 w-4 text-gray-400 shrink-0" />} label="Email Address" value={email} />
        <Row icon={<Phone className="h-4 w-4 text-gray-400 shrink-0" />} label="Mobile No." value={phone || "N/A"} mono />
        <Row icon={<Calendar className="h-4 w-4 text-gray-400 shrink-0" />} label="Date of Birth" value={dob ? new Date(dob).toLocaleDateString() : "N/A"} />
        <Row icon={<MapPin className="h-4 w-4 text-gray-400 shrink-0" />} label="Address Details" value={addr} />
        {passportNumber && <Row icon={<User className="h-4 w-4 text-gray-400 shrink-0" />} label="Passport Number" value={passportNumber} mono />}
      </CardContent>
    </Card>
  );
}

function Row({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-3">
      {icon}
      <div>
        <p className="font-semibold text-gray-500">{label}</p>
        <p className={`text-sm text-[#111] mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
