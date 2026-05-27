"use client";

import { Suspense, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { useUniversity } from "@/domains/universities/universities.queries";
import { useSubmitApplication } from "@/domains/student/student.queries";
import { getApiErrorMessage } from "@/lib/api-error";
import type { SubmitApplicationFormData, UniversityDetail } from "@/domains/universities/universities.types";
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
  Mail,
  Phone,
  Users,
  Plane,
  Briefcase,
  BookMarked,
  Hospital,
  Wifi,
  Utensils,
  Bus,
  Library,
} from "lucide-react";
import Image from "next/image";

export default function UniversityDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6FC]" />}>
      <UniversityContent />
    </Suspense>
  );
}

function UniversityContent() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const isApplying = searchParams.get("apply") === "true";
  
  const { data: uni, isLoading, error } = useUniversity(params.slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6FC]">
        <Loader2 className="size-8 animate-spin text-[#F0A030]" />
      </div>
    );
  }

  if (error || !uni) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6FC]">
        <p className="text-lg text-[#6B6B6B]">University not found</p>
      </div>
    );
  }

  const mappedUni = {
    id: uni.id,
    name: uni.name,
    shortName: uni.shortName,
    slug: uni.slug,
    type: uni.type,
    established: uni.establishedYear,
    medium: uni.academic?.medium || 'English',
    country: uni.location?.country || '',
    city: uni.location?.city || '',
    image: uni.bannerImage || uni.logo || '',
    logo: uni.logo,
    grade: uni.status === 'ACTIVE' ? 'NMC Approved' : 'Under Review',
    intake: uni.academic?.intakeMonths?.join(', ') || 'September, January',
    duration: uni.academic?.duration || '6 Years',
    worldRank: uni.recognition?.worldRank?.toString() || 'N/A',
    ecfmg: uni.recognition?.ecfmgStatus || 'Pending',
    specialization: uni.academic?.specializations?.[0] || 'General Medicine',
    degree: 'MBBS',
    course: uni.academic?.programs?.[0] || 'Medicine',
    fee: uni.courses?.[0] ? `$${uni.courses[0].fees}/year` : '$5,000/year',
    brochureUrl: '#',
    detailUrl: uni.website || '#',
    email: uni.contact?.email || '',
    phone: uni.contact?.phone || '',
  };

  return (
    <div className="min-h-screen bg-[#F8F6FC]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-[#2D2154] mb-10">
          <div className="absolute inset-0">
            {uni.bannerImage && (
              <Image src={uni.bannerImage} alt={uni.name} fill className="object-cover opacity-50" />
            )}
          </div>
          <div className="relative z-10 px-8 py-12 md:py-16 md:px-12">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-4 ${uni.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-[#2D2154]'}`}>
              {uni.status === 'ACTIVE' ? 'NMC Approved' : uni.status}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{uni.name}</h1>
            <p className="text-[#E0D8F0] text-lg mb-6">{uni.shortName}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#C8BDE8]">
              <div className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {[uni.location?.city, uni.location?.country].filter(Boolean).join(', ')}
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="size-4" />
                {uni.type}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                Est. {uni.establishedYear}
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="size-4" />
                {uni.academic?.medium}
              </div>
            </div>
          </div>
        </div>

        {isApplying ? (
          <ApplicationForm uni={mappedUni} onBack={() => router.push(`/student/university/${params.slug}`)} />
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Academic Programs */}
            <section className="bg-white rounded-xl border border-[#E0D8F0] p-6">
              <h2 className="text-xl font-bold text-[#2D2154] mb-4 flex items-center gap-2">
                <GraduationCap className="size-5 text-[#F0A030]" />
                Academic Programs
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {uni.academic?.programs?.map((prog) => (
                  <div key={prog} className="bg-[#F8F6FC] rounded-lg p-3 text-sm font-medium text-[#2D2154]">
                    {prog}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><p className="text-[#6B6B6B]">Duration</p><p className="font-semibold text-[#2D2154]">{uni.academic?.duration}</p></div>
                <div><p className="text-[#6B6B6B]">Medium</p><p className="font-semibold text-[#2D2154]">{uni.academic?.medium}</p></div>
                <div><p className="text-[#6B6B6B]">Total Seats</p><p className="font-semibold text-[#2D2154]">{uni.academic?.totalSeats}</p></div>
                <div><p className="text-[#6B6B6B]">Intake</p><p className="font-semibold text-[#2D2154]">{uni.academic?.intakeMonths?.join(', ')}</p></div>
              </div>
              {uni.academic?.specializations && uni.academic.specializations.length > 0 && (
                <div className="mt-4">
                  <p className="text-[#6B6B6B] text-sm mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {uni.academic.specializations.map((spec) => (
                      <span key={spec} className="px-2 py-1 bg-[#F0A030]/10 text-[#F0A030] text-xs rounded-full">{spec}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Seat Distribution */}
            <section className="bg-white rounded-xl border border-[#E0D8F0] p-6">
              <h2 className="text-xl font-bold text-[#2D2154] mb-4 flex items-center gap-2">
                <Users className="size-5 text-[#F0A030]" />
                Seat Distribution
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-[#F8F6FC] rounded-lg p-4">
                  <p className="text-2xl font-bold text-[#2D2154]">{uni.academic?.governmentSeats}</p>
                  <p className="text-xs text-[#6B6B6B]">Government</p>
                </div>
                <div className="bg-[#F8F6FC] rounded-lg p-4">
                  <p className="text-2xl font-bold text-[#2D2154]">{uni.academic?.managementSeats}</p>
                  <p className="text-xs text-[#6B6B6B]">Management</p>
                </div>
                <div className="bg-[#F8F6FC] rounded-lg p-4">
                  <p className="text-2xl font-bold text-[#2D2154]">{uni.academic?.nriSeats}</p>
                  <p className="text-xs text-[#6B6B6B]">NRI</p>
                </div>
              </div>
            </section>

            {/* Infrastructure */}
            <section className="bg-white rounded-xl border border-[#E0D8F0] p-6">
              <h2 className="text-xl font-bold text-[#2D2154] mb-4 flex items-center gap-2">
                <Building2 className="size-5 text-[#F0A030]" />
                Infrastructure
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2"><Hospital className="size-4 text-[#F0A030]" /><span>{uni.infrastructure?.hospitalBeds} Beds</span></div>
                <div className="flex items-center gap-2"><Building2 className="size-4 text-[#F0A030]" /><span>{uni.infrastructure?.departments} Depts</span></div>
                <div className="flex items-center gap-2"><Library className="size-4 text-[#F0A030]" /><span>{uni.infrastructure?.laboratories} Labs</span></div>
                <div className="flex items-center gap-2"><BookMarked className="size-4 text-[#F0A030]" /><span>{uni.infrastructure?.campusArea} Acres</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#F8F6FC] rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-[#2D2154]">{uni.infrastructure?.hostelBoys}</p>
                  <p className="text-xs text-[#6B6B6B]">Boys Hostel</p>
                </div>
                <div className="bg-[#F8F6FC] rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-[#2D2154]">{uni.infrastructure?.hostelGirls}</p>
                  <p className="text-xs text-[#6B6B6B]">Girls Hostel</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {uni.infrastructure?.facilities?.map((fac) => (
                  <span key={fac} className="px-3 py-1 bg-[#2D2154]/5 text-[#2D2154] text-sm rounded-full">{fac}</span>
                ))}
                {uni.infrastructure?.wifiCampus && <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1"><Wifi className="size-3" /> WiFi</span>}
                {uni.infrastructure?.cafeteria && <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1"><Utensils className="size-3" /> Cafeteria</span>}
                {uni.infrastructure?.transportation && <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1"><Bus className="size-3" /> Transport</span>}
              </div>
            </section>

            {/* Admission */}
            <section className="bg-white rounded-xl border border-[#E0D8F0] p-6">
              <h2 className="text-xl font-bold text-[#2D2154] mb-4 flex items-center gap-2">
                <BookOpen className="size-5 text-[#F0A030]" />
                Admission Requirements
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div><p className="text-[#6B6B6B]">Entrance Exams</p><p className="font-medium text-[#2D2154]">{uni.admission?.entranceExams?.join(', ')}</p></div>
                <div><p className="text-[#6B6B6B]">Minimum Marks</p><p className="font-medium text-[#2D2154]">{uni.admission?.minimumMarks}</p></div>
                <div><p className="text-[#6B6B6B]">Age Criteria</p><p className="font-medium text-[#2D2154]">{uni.admission?.ageCriteria}</p></div>
                <div><p className="text-[#6B6B6B]">Application Fee</p><p className="font-medium text-[#2D2154]">${uni.admission?.applicationFee}</p></div>
              </div>
              <div className="mb-4">
                <p className="text-[#6B6B6B] text-sm mb-1">Eligibility</p>
                <p className="text-[#2D2154]">{uni.admission?.eligibility}</p>
              </div>
              <div className="mb-4">
                <p className="text-[#6B6B6B] text-sm mb-2">Required Documents</p>
                <div className="flex flex-wrap gap-2">
                  {uni.admission?.requiredDocuments?.map((doc) => (
                    <span key={doc} className="px-2 py-1 bg-[#F0A030]/10 text-[#F0A030] text-xs rounded">{doc}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[#6B6B6B] text-sm">Deadline</p>
                <p className="font-medium text-red-600">
                  {uni.admission?.applicationDeadline ? new Date(uni.admission.applicationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </section>

            {/* Support & Placement */}
            <section className="bg-white rounded-xl border border-[#E0D8F0] p-6">
              <h2 className="text-xl font-bold text-[#2D2154] mb-4 flex items-center gap-2">
                <Briefcase className="size-5 text-[#F0A030]" />
                Placement & Support
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="bg-[#F8F6FC] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{uni.support?.placementRate}%</p>
                  <p className="text-xs text-[#6B6B6B]">Placement Rate</p>
                </div>
                <div className="bg-[#F8F6FC] rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#2D2154]">₹{uni.support?.averagePackage?.toLocaleString()}</p>
                  <p className="text-xs text-[#6B6B6B]">Avg Package (INR)</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {uni.support?.visaAssistance && <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1"><Plane className="size-3" /> Visa</span>}
                {uni.support?.counselingServices && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Counseling</span>}
                {uni.support?.careerGuidance && <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">Career</span>}
              </div>
              {uni.support?.languageSupport && uni.support.languageSupport.length > 0 && (
                <div className="mt-4">
                  <p className="text-[#6B6B6B] text-sm mb-2">Language Support</p>
                  <div className="flex gap-2">
                    {uni.support.languageSupport.map((lang) => (
                      <span key={lang} className="px-2 py-1 bg-[#2D2154]/5 text-[#2D2154] text-xs rounded">{lang}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Gallery */}
            {uni.content?.gallery && uni.content.gallery.length > 0 && (
              <section className="bg-white rounded-xl border border-[#E0D8F0] p-6">
                <h2 className="text-xl font-bold text-[#2D2154] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {uni.content.gallery.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-[#F8F6FC]">
                      <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-[#E0D8F0] p-6 sticky top-6 space-y-6">
              <div>
                <h3 className="font-bold text-[#2D2154] mb-4">Contact</h3>
                <div className="space-y-3 text-sm">
                  {uni.contact?.email && (
                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                      <Mail className="size-4 text-[#F0A030]" />
                      <a href={`mailto:${uni.contact.email}`} className="hover:text-[#2D2154]">{uni.contact.email}</a>
                    </div>
                  )}
                  {uni.contact?.phone && (
                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                      <Phone className="size-4 text-[#F0A030]" />
                      <a href={`tel:${uni.contact.phone}`} className="hover:text-[#2D2154]">{uni.contact.phone}</a>
                    </div>
                  )}
                  {uni.contact?.admissionOfficeHours && (
                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                      <Clock className="size-4 text-[#F0A030]" />
                      <span>{uni.contact.admissionOfficeHours}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-[#E0D8F0]">
                <Button className="w-full gap-2" onClick={() => router.push(`?apply=true`)}>
                  <GraduationCap className="size-4" />
                  Apply Now
                </Button>
              </div>
              <div className="pt-4 border-t border-[#E0D8F0]">
                <h3 className="font-bold text-[#2D2154] mb-2">Location</h3>
                <div className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                  <MapPin className="size-4 text-[#F0A030] mt-0.5" />
                  <div>
                    <p>{uni.location?.address}</p>
                    <p>{uni.location?.city}, {uni.location?.state}</p>
                    <p>{uni.location?.country}</p>
                  </div>
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
  uni: {
    id: string;
    name: string;
    shortName: string;
    slug: string;
    type: string;
    established: number;
    medium: string;
    country: string;
    city: string;
    image: string;
    logo: string;
    grade: string;
    intake: string;
    duration: string;
    worldRank: string;
    ecfmg: string;
    specialization: string;
    degree: string;
    course: string;
    fee: string;
    brochureUrl: string;
    detailUrl: string;
    email: string;
    phone: string;
  };
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
      placeOfBirth: { city: form.birthCity, state: form.birthState, country: form.birthCountry },
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
      language1: { name: form.lang1Name || 'English', speaking: form.lang1Speaking, reading: form.lang1Reading, writing: form.lang1Writing },
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
      onSuccess: (res) => { router.push(`/student/applications/${res.applicationId}`); },
      onError: (err) => { setError(getApiErrorMessage(err, 'Failed to submit application')); },
    });
  };

  const inputCls = "w-full rounded-lg border border-[#E0D8F0] bg-[#f0ecf6] px-3 py-2.5 text-sm text-[#2D2154] outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A]/20";

  return (
    <div>
      <button onClick={onBack} className="mb-6 flex items-center gap-1.5 text-sm text-[#4B2D8E] hover:text-[#2D2154] font-medium">
        <ArrowLeft className="size-4" />
        Back to Details
      </button>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2D2154]">Apply to {uni.name}</h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">Fill in your details to start the application</p>
        </div>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>First Name *</Label><Input placeholder="Enter first name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} /></div>
              <div className="space-y-2"><Label>Last Name *</Label><Input placeholder="Enter last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} /></div>
              <div className="space-y-2"><Label>Middle Name</Label><Input placeholder="Enter middle name" value={form.middleName} onChange={(e) => update('middleName', e.target.value)} /></div>
              <div className="space-y-2"><Label>Date of Birth *</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} /></div>
              <div className="space-y-2"><Label>City of Birth *</Label><Input placeholder="Enter city" value={form.birthCity} onChange={(e) => update('birthCity', e.target.value)} /></div>
              <div className="space-y-2"><Label>State of Birth *</Label><Input placeholder="Enter state" value={form.birthState} onChange={(e) => update('birthState', e.target.value)} /></div>
              <div className="space-y-2"><Label>Country of Birth *</Label><Input placeholder="Enter country" value={form.birthCountry} onChange={(e) => update('birthCountry', e.target.value)} /></div>
              <div className="space-y-2"><Label>Citizenship *</Label><Input placeholder="Enter citizenship" value={form.citizenship} onChange={(e) => update('citizenship', e.target.value)} /></div>
              <div className="space-y-2"><Label>Marital Status *</Label><select className={inputCls} value={form.maritalStatus} onChange={(e) => update('maritalStatus', e.target.value)}><option value="">Select status</option><option value="single">Single</option><option value="married">Married</option></select></div>
              <div className="space-y-2"><Label>Gender *</Label><select className={inputCls} value={form.gender} onChange={(e) => update('gender', e.target.value)}><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Permanent Address</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2"><Label>Street Address *</Label><Input placeholder="Enter street address" value={form.permanentAddress} onChange={(e) => update('permanentAddress', e.target.value)} /></div>
              <div className="space-y-2"><Label>City *</Label><Input placeholder="Enter city" value={form.permanentCity} onChange={(e) => update('permanentCity', e.target.value)} /></div>
              <div className="space-y-2"><Label>State *</Label><Input placeholder="Enter state" value={form.permanentState} onChange={(e) => update('permanentState', e.target.value)} /></div>
              <div className="space-y-2"><Label>Zip / Postal Code *</Label><Input placeholder="Enter zip code" value={form.permanentZip} onChange={(e) => update('permanentZip', e.target.value)} /></div>
              <div className="space-y-2"><Label>Country *</Label><Input placeholder="Enter country" value={form.permanentCountry} onChange={(e) => update('permanentCountry', e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact & Language</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2"><Label>Email *</Label><Input type="email" placeholder="Enter email" value={form.email} onChange={(e) => update('email', e.target.value)} /></div>
              <div className="space-y-2"><Label>Embassy Location *</Label><Input placeholder="Enter embassy location" value={form.embassyLocation} onChange={(e) => update('embassyLocation', e.target.value)} /></div>
            </div>
            <h4 className="text-sm font-semibold text-[#2D2154] mb-3">Primary Language</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-2"><Label>Language</Label><Input placeholder="e.g. English" value={form.lang1Name} onChange={(e) => update('lang1Name', e.target.value)} /></div>
              <div className="space-y-2"><Label>Speaking</Label><select className={inputCls} value={form.lang1Speaking} onChange={(e) => update('lang1Speaking', e.target.value)}>{languageLevels.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
              <div className="space-y-2"><Label>Reading</Label><select className={inputCls} value={form.lang1Reading} onChange={(e) => update('lang1Reading', e.target.value)}>{languageLevels.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
              <div className="space-y-2"><Label>Writing</Label><select className={inputCls} value={form.lang1Writing} onChange={(e) => update('lang1Writing', e.target.value)}>{languageLevels.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Program Selection</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Signature & Declaration</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name (as signature) *</Label><Input placeholder="Type your full name" value={form.signature} onChange={(e) => update('signature', e.target.value)} /></div>
              <div className="space-y-2"><Label>Date *</Label><Input type="date" value={form.signatureDate} onChange={(e) => update('signatureDate', e.target.value)} /></div>
            </div>
            <p className="mt-3 text-xs text-[#6B6B6B]">By submitting this application, you confirm that all information provided is accurate and complete.</p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onBack} disabled={submitMutation.isPending}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? <><Loader2 className="size-4 animate-spin mr-1" /> Submitting...</> : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}