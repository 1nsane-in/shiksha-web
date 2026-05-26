"use client";

import { Suspense, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUniversityBySlug } from "@/lib/university-data";
import { useSubmitApplication } from "@/domains/student/student.queries";
import { getApiErrorMessage } from "@/lib/api-error";
import type { SubmitApplicationFormData } from "@/domains/student/student.types";
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
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UniversityDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6FC]" />}>
      <UniversityContent />
    </Suspense>
  );
}

function UniversityContent() {
  console.log("=== UniversityContent rendering ===");
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const isApplying = searchParams.get("apply") === "true";
  const uni = getUniversityBySlug(params.slug);
  
  console.log("Params:", params);
  console.log("University found:", uni?.name);
  console.log("Is applying:", isApplying);

  if (!uni) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6FC]">
        <p className="text-lg text-[#6B6B6B]">University not found</p>
      </div>
    );
  }

  const details = [
    { label: "University Type", value: uni.type, icon: Building2 },
    { label: "Intake", value: uni.intake, icon: Calendar },
    { label: "Grade", value: uni.grade, icon: Star },
    { label: "Duration", value: uni.duration, icon: Clock },
    { label: "Established", value: uni.established, icon: Award },
    { label: "Fee", value: uni.fee, icon: GraduationCap },
    { label: "World Rank", value: uni.worldRank, icon: Globe },
    { label: "Medium of Instruction", value: uni.medium, icon: BookOpen },
    { label: "ECFMG Status", value: uni.ecfmg, icon: CheckCircle2 },
    { label: "Specialization", value: uni.specialization, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6FC]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-[#2D2154] mb-10">
          <div className="absolute inset-0">
            <Image
              src={uni.image}
              alt={uni.name}
              fill
              className="object-contain p-8 opacity-30"
            />
          </div>
          <div className="relative z-10 px-8 py-12 md:py-16 md:px-12">
            <span className="inline-block rounded-full bg-[#F0A030] px-3 py-1 text-xs font-semibold text-[#2D2154] mb-4">
              {uni.grade}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {uni.name}
            </h1>
            <p className="text-[#E0D8F0] text-lg mb-6">{uni.shortName}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#C8BDE8]">
              <div className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {uni.country}
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="size-4" />
                {uni.degree} in {uni.course}
              </div>
            </div>
          </div>
        </div>

        {isApplying ? (
          <ApplicationForm uni={uni} onBack={() => router.push(`/student/university/${params.slug}`)} />
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Details */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#2D2154] mb-6">
              University Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="flex items-start gap-3 bg-white rounded-xl border border-[#E0D8F0] p-4"
                >
                  <div className="size-10 rounded-lg bg-[#F0A030]/10 flex items-center justify-center shrink-0">
                    <d.icon className="size-5 text-[#F0A030]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B6B6B]">{d.label}</p>
                    <p className="text-sm font-semibold text-[#2D2154]">
                      {d.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* About Section */}
            <div className="mt-8 bg-white rounded-xl border border-[#E0D8F0] p-6">
              <h3 className="text-lg font-bold text-[#2D2154] mb-3">
                About {uni.name}
              </h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {uni.name} is a prestigious {uni.type.toLowerCase()} university
                located in {uni.country}. Established in {uni.established}, it
                offers a {uni.duration} program in {uni.specialization} with
                instruction in {uni.medium}. The university holds a world rank
                of #{uni.worldRank} and is{" "}
                {uni.ecfmg === "Approved" ? "ECFMG approved" : "recognized"} for
                its quality medical education. With affordable fee structure of{" "}
                {uni.fee}, it provides excellent opportunities for international
                students seeking medical degrees abroad.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-[#E0D8F0] p-6 sticky top-6">
              <h3 className="font-bold text-[#2D2154] mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <Button
                  className="w-full gap-2"
                  onClick={() =>
                    window.open(uni.brochureUrl, "_blank", "noopener,noreferrer")
                  }
                >
                  <Download className="size-4" />
                  Download Brochure
                </Button>
                <Button
                  variant="purple"
                  className="w-full gap-2"
                  onClick={() => router.push(`?apply=true`)}
                >
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() =>
                    window.open(uni.detailUrl, "_blank", "noopener,noreferrer")
                  }
                >
                  <ExternalLink className="size-4" />
                  Visit Official Site
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-[#E0D8F0]">
                <p className="text-xs text-[#6B6B6B] mb-2">Share this page</p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-[#4B2D8E]"
                    onClick={() => {
                      const url = window.location.href;
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(uni.name)}`,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }}
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-[#4B2D8E]"
                    onClick={() => {
                      const url = window.location.href;
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }}
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </main>
    </div>
  );
}

type ApplyFormProps = {
  uni: NonNullable<ReturnType<typeof getUniversityBySlug>>;
  onBack: () => void;
};

const languageLevels = ['low', 'moderate', 'high'] as const;

function ApplicationForm({ uni, onBack }: ApplyFormProps) {
  const router = useRouter();
  const submitMutation = useSubmitApplication();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    birthCity: '',
    birthState: '',
    birthCountry: '',
    citizenship: '',
    maritalStatus: '' as '' | 'single' | 'married',
    gender: '' as '' | 'male' | 'female' | 'other',
    permanentAddress: '',
    permanentCity: '',
    permanentState: '',
    permanentZip: '',
    permanentCountry: '',
    email: '',
    embassyLocation: '',
    lang1Name: '',
    lang1Speaking: 'moderate' as 'high' | 'moderate' | 'low',
    lang1Reading: 'moderate' as 'high' | 'moderate' | 'low',
    lang1Writing: 'moderate' as 'high' | 'moderate' | 'low',
    selectedProgram: '' as '' | 'pre-medical' | 'general-medicine' | 'dentistry' | 'post-graduate',
    postGraduateDetail: '',
    signature: '',
    signatureDate: new Date().toISOString().split('T')[0],
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError(null);
    if (!form.firstName || !form.lastName || !form.dateOfBirth || !form.citizenship ||
        !form.maritalStatus || !form.gender || !form.permanentAddress || !form.permanentCity ||
        !form.permanentState || !form.permanentZip || !form.permanentCountry ||
        !form.email || !form.embassyLocation || !form.selectedProgram ||
        !form.signature || !form.birthCity || !form.birthState || !form.birthCountry) {
      setError('Please fill all required fields');
      return;
    }

    const data: SubmitApplicationFormData = {
      universityId: uni.id,
      firstName: form.firstName,
      lastName: form.lastName,
      middleName: form.middleName || undefined,
      dateOfBirth: form.dateOfBirth,
      placeOfBirth: {
        city: form.birthCity,
        state: form.birthState,
        country: form.birthCountry,
      },
      citizenship: form.citizenship,
      maritalStatus: form.maritalStatus as 'single' | 'married',
      gender: form.gender as 'male' | 'female' | 'other',
      permanentAddress: form.permanentAddress,
      permanentCity: form.permanentCity,
      permanentState: form.permanentState,
      permanentZip: form.permanentZip,
      permanentCountry: form.permanentCountry,
      email: form.email,
      embassyLocation: form.embassyLocation,
      language1: {
        name: form.lang1Name || 'English',
        speaking: form.lang1Speaking,
        reading: form.lang1Reading,
        writing: form.lang1Writing,
      },
      selectedProgram: form.selectedProgram as SubmitApplicationFormData['selectedProgram'],
      postGraduateDetail: form.postGraduateDetail || undefined,
      signature: form.signature,
      signatureDate: form.signatureDate,
    };

    if (form.selectedProgram === 'post-graduate' && !form.postGraduateDetail) {
      setError('Please specify your post-graduate program details');
      return;
    }

    submitMutation.mutate(data, {
      onSuccess: (res) => {
        router.push(`/student/applications/${res.applicationId}`);
      },
      onError: (err) => {
        setError(getApiErrorMessage(err, 'Failed to submit application'));
      },
    });
  };

  const inputCls = "w-full rounded-lg border border-[#E0D8F0] bg-[#f0ecf6] px-3 py-2.5 text-sm text-[#2D2154] outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A]/20";

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-sm text-[#4B2D8E] hover:text-[#2D2154] font-medium"
      >
        <ArrowLeft className="size-4" />
        Back to Details
      </button>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2D2154]">Apply to {uni.name}</h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">Fill in your details to start the application</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input placeholder="Enter first name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input placeholder="Enter last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Middle Name</Label>
                <Input placeholder="Enter middle name" value={form.middleName} onChange={(e) => update('middleName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>City of Birth *</Label>
                <Input placeholder="Enter city" value={form.birthCity} onChange={(e) => update('birthCity', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>State of Birth *</Label>
                <Input placeholder="Enter state" value={form.birthState} onChange={(e) => update('birthState', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Country of Birth *</Label>
                <Input placeholder="Enter country" value={form.birthCountry} onChange={(e) => update('birthCountry', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Citizenship *</Label>
                <Input placeholder="Enter citizenship" value={form.citizenship} onChange={(e) => update('citizenship', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Marital Status *</Label>
                <select className={inputCls} value={form.maritalStatus} onChange={(e) => update('maritalStatus', e.target.value)}>
                  <option value="">Select status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <select className={inputCls} value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permanent Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Street Address *</Label>
                <Input placeholder="Enter street address" value={form.permanentAddress} onChange={(e) => update('permanentAddress', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input placeholder="Enter city" value={form.permanentCity} onChange={(e) => update('permanentCity', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input placeholder="Enter state" value={form.permanentState} onChange={(e) => update('permanentState', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Zip / Postal Code *</Label>
                <Input placeholder="Enter zip code" value={form.permanentZip} onChange={(e) => update('permanentZip', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Input placeholder="Enter country" value={form.permanentCountry} onChange={(e) => update('permanentCountry', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Language</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" placeholder="Enter email" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Embassy Location *</Label>
                <Input placeholder="Enter embassy location" value={form.embassyLocation} onChange={(e) => update('embassyLocation', e.target.value)} />
              </div>
            </div>
            <h4 className="text-sm font-semibold text-[#2D2154] mb-3">Primary Language</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label>Language</Label>
                <Input placeholder="e.g. English" value={form.lang1Name} onChange={(e) => update('lang1Name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Speaking</Label>
                <select className={inputCls} value={form.lang1Speaking} onChange={(e) => update('lang1Speaking', e.target.value)}>
                  {languageLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Reading</Label>
                <select className={inputCls} value={form.lang1Reading} onChange={(e) => update('lang1Reading', e.target.value)}>
                  {languageLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Writing</Label>
                <select className={inputCls} value={form.lang1Writing} onChange={(e) => update('lang1Writing', e.target.value)}>
                  {languageLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Selected Program *</Label>
              <select className={inputCls} value={form.selectedProgram} onChange={(e) => update('selectedProgram', e.target.value)}>
                <option value="">Select program</option>
                <option value="pre-medical">Pre-Medical</option>
                <option value="general-medicine">General Medicine (MBBS)</option>
                <option value="dentistry">Dentistry</option>
                <option value="post-graduate">Post Graduate</option>
              </select>
            </div>
            {form.selectedProgram === 'post-graduate' && (
              <div className="mt-4 space-y-2">
                <Label>Post Graduate Details *</Label>
                <Input placeholder="Specify your post-graduate program" value={form.postGraduateDetail} onChange={(e) => update('postGraduateDetail', e.target.value)} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Signature & Declaration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name (as signature) *</Label>
                <Input placeholder="Type your full name" value={form.signature} onChange={(e) => update('signature', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" value={form.signatureDate} onChange={(e) => update('signatureDate', e.target.value)} />
              </div>
            </div>
            <p className="mt-3 text-xs text-[#6B6B6B]">
              By submitting this application, you confirm that all information provided is accurate and complete.
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onBack} disabled={submitMutation.isPending}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? (
              <><Loader2 className="size-4 animate-spin mr-1" /> Submitting...</>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
