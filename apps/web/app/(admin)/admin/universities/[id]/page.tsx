"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  useAdminUniversity,
  useUpdateUniversityStatus,
  useDeleteUniversity,
  useUpdateUniversity,
  useUploadUniversityDocument,
  useDeleteUniversityDocument,
} from "@/domains/universities";
import { uploadFile } from "@/domains/documents/documents.api";
import { Button } from "@repo/ui";
import { Card, CardContent, Skeleton } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Users,
  FileText,
  BookOpen,
  Calendar,
  CheckCircle2,
  Medal,
  Globe,
  School,
  Wifi,
  Bus,
  Coffee,
  Download,
  Heart,
  Briefcase,
  Languages,
  TrendingUp,
  Clock,
  Stethoscope,
  FlaskConical,
  Library,
  Dumbbell,
  Bed,
  MessageSquare,
  ClipboardList,
  ScrollText,
  Banknote,
  Trash2,
  Upload,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

type IconComponent = React.ComponentType<{ className?: string }>;

const theme = {
  canvas: "#FAF9F6",
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  hairline: "rgba(26, 21, 58, 0.08)",
  white: "#FFFFFF",
};

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  DRAFT: {
    label: "Draft",
    className: "bg-gray-50 text-gray-600 border-gray-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: IconComponent;
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3"
      style={{ borderColor: theme.hairline }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: theme.goldLight, color: theme.gold }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{label}</p>
        <p className="truncate text-sm font-bold text-[#111] mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: IconComponent;
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#9CA3AF]" />}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</p>
        <div className="text-sm font-semibold text-[#111] mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: IconComponent;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#111]">{title}</h3>
    </div>
  );
}

function BadgeList({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-xs text-[#9CA3AF]">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-lg border border-[#ECEAE6] bg-white px-2.5 py-0.5 text-xs font-semibold text-[#6B6B6B]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function GalleryGrid({ images }: { images: string[] }) {
  if (!images?.length) return <p className="text-xs text-gray-400 italic">No images in gallery yet.</p>;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((src, i) => (
        <div
          key={i}
          className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#ECEAE6] bg-white"
        >
          <Image
            src={src}
            alt={`Gallery ${i + 1}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-1 flex-col animate-pulse max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const uniId = params.id as string;

  const { data: university, isLoading, refetch } = useAdminUniversity(uniId);
  const updateStatus = useUpdateUniversityStatus();
  const deleteUniversity = useDeleteUniversity();

  const updateUniversityMut = useUpdateUniversity();
  const uploadDocMut = useUploadUniversityDocument();
  const deleteDocMut = useDeleteUniversityDocument();

  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [docForm, setDocForm] = useState({
    type: "BROCHURE",
    file: null as File | null,
  });
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  if (isLoading) return <LoadingSkeleton />;
  if (!university) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <School className="mx-auto mb-3 h-10 w-10 text-[#9CA3AF]" />
          <p className="text-sm font-medium text-[#6B6B6B]">
            University not found
          </p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => router.push("/admin/universities")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Universities
          </Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[university.status] ?? statusConfig.DRAFT;
  const a = university.academic;
  const loc = university.location;
  const contact = university.contact;
  const infra = university.infrastructure;
  const adm = university.admission;
  const supp = university.support;

  // Gallery Handlers
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingGallery(true);
    try {
      const file = e.target.files[0];
      const res = await uploadFile(file, "gallery");
      
      const currentGallery = university.content?.gallery || [];
      const updatedGallery = [...currentGallery, res.url];
      
      await updateUniversityMut.mutateAsync({
        id: uniId,
        data: {
          content: {
            ...university.content,
            gallery: updatedGallery,
          },
        },
      });
      toast.success("Image added to campus gallery");
      refetch();
    } catch (err) {
      toast.error("Failed to upload gallery image");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleGalleryDelete = async (indexToDelete: number) => {
    if (!confirm("Remove this image from gallery?")) return;
    try {
      const currentGallery = university.content?.gallery || [];
      const updatedGallery = currentGallery.filter((_, idx) => idx !== indexToDelete);
      
      await updateUniversityMut.mutateAsync({
        id: uniId,
        data: {
          content: {
            ...university.content,
            gallery: updatedGallery,
          },
        },
      });
      toast.success("Image removed from gallery");
      refetch();
    } catch (err) {
      toast.error("Failed to update gallery");
    }
  };

  // Document Handlers
  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.file) {
      toast.error("Please select a document file to upload");
      return;
    }
    setIsUploadingDoc(true);
    try {
      const res = await uploadFile(docForm.file, "documents");
      await uploadDocMut.mutateAsync({
        uniId,
        data: {
          type: docForm.type,
          fileUrl: res.url,
          fileName: docForm.file.name,
          fileSize: docForm.file.size,
        },
      });
      toast.success("Document uploaded successfully!");
      setDocForm({ type: "BROCHURE", file: null });
      refetch();
    } catch (err) {
      toast.error("Failed to upload document");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await deleteDocMut.mutateAsync(docId);
      toast.success("Document deleted!");
      refetch();
    } catch (err) {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 max-w-7xl mx-auto p-4 md:p-6" style={{ background: theme.canvas }}>
      
      {/* Editorial Hero Banner */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl border bg-white shadow-sm sm:h-56 md:h-64" style={{ borderColor: theme.hairline }}>
        {university.bannerImage ? (
          <>
            <Image
              src={university.bannerImage}
              alt=""
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#FAFAF8] to-[#ECEAE6]" />
        )}

        {/* Back and Action buttons inside Hero Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="cursor-pointer bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white text-gray-800 font-semibold"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/universities/${params.id}/edit`)}
              className="cursor-pointer bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white text-gray-800 font-semibold"
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>
            
            {university.status !== "ACTIVE" ? (
              <Button
                size="sm"
                onClick={() => updateStatus.mutate({ id: uniId, status: "ACTIVE" })}
                disabled={updateStatus.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold"
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Activate
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus.mutate({ id: uniId, status: "INACTIVE" })}
                disabled={updateStatus.isPending}
                className="text-amber-700 border-amber-300 hover:bg-amber-50 bg-white/90 backdrop-blur-sm font-semibold"
              >
                Deactivate
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer bg-white/90 backdrop-blur-sm font-semibold"
              disabled={deleteUniversity.isPending}
              onClick={async () => {
                if (!confirm("Are you sure you want to delete this university?")) return;
                await deleteUniversity.mutateAsync(uniId);
                router.push("/admin/universities");
              }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>

        {/* Brand identity floating at bottom of Hero */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3.5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-white shadow-md sm:h-16 sm:w-16">
            {university.logo ? (
              <Image
                src={university.logo}
                alt={university.name}
                fill
                className="object-contain p-1"
                sizes="(max-width: 640px) 56px, 64px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#9CA3AF]">
                <School className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="min-w-0 select-none pb-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl md:text-2xl drop-shadow-sm">
                {university.name}
              </h1>
              <Badge className={`border text-[9px] uppercase font-bold py-0.5 px-2.5 rounded-full ${status.className}`}>
                {status.label}
              </Badge>
            </div>
            <p className="text-xs text-gray-200 mt-0.5 font-medium drop-shadow-sm">
              {university.shortName} {loc?.country && ` · ${loc.city}, ${loc.country}`}
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats grid chips */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        <StatChip icon={Building2} label="Type" value={university.type?.replace("_", " ")} />
        <StatChip icon={Calendar} label="Est. Year" value={university.establishedYear ?? "—"} />
        <StatChip icon={Globe} label="Country" value={loc?.country ?? "—"} />
        <StatChip icon={GraduationCap} label="Programs" value={a?.programs?.length ?? 0} />
        <StatChip icon={Users} label="Total Seats" value={a?.totalSeats ?? "—"} />
      </div>

      {/* LINE Tabs Overhaul */}
      <Tabs defaultValue="overview" className="w-full min-w-0">
        <TabsList
          variant="line"
          className="h-10 w-full justify-start gap-1 overflow-x-auto border-b border-[#ECEAE6] mb-6"
        >
          <TabsTrigger value="overview" className="px-5 text-xs font-semibold tracking-wide uppercase">
            Overview
          </TabsTrigger>
          <TabsTrigger value="academic" className="px-5 text-xs font-semibold tracking-wide uppercase">
            Academic Profile
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="px-5 text-xs font-semibold tracking-wide uppercase">
            Infrastructure
          </TabsTrigger>
          <TabsTrigger value="admission" className="px-5 text-xs font-semibold tracking-wide uppercase">
            Admission & Fees
          </TabsTrigger>
          <TabsTrigger value="support" className="px-5 text-xs font-semibold tracking-wide uppercase">
            Support Services
          </TabsTrigger>
          <TabsTrigger value="management" className="px-5 text-xs font-bold tracking-wide uppercase text-[#3730A3]">
            🛠️ Resource Manager
          </TabsTrigger>
        </TabsList>

        {/* ===== Overview Tab ===== */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
            {/* Basic Info */}
            <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
              <CardContent className="space-y-4 p-5">
                <SectionHeading icon={Building2} title="Institutional Identity" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={School} label="Full Name" value={university.name} />
                  <InfoRow icon={BookOpen} label="Abbreviation" value={university.shortName} />
                  <InfoRow icon={Building2} label="Institution Type" value={university.type?.replace("_", " ")} />
                  <InfoRow icon={Calendar} label="Established" value={university.establishedYear} />
                </div>
                {university.brochureUrl && (
                  <div className="pt-3 border-t">
                    <InfoRow
                      icon={Download}
                      label="Brochure PDF"
                      value={
                        <a
                          href={university.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#3730A3] hover:underline font-semibold text-xs"
                        >
                          Download Official Brochure <Download className="h-3 w-3" />
                        </a>
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Contact */}
            <div className="space-y-6">
              {loc && (
                <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                  <CardContent className="space-y-4 p-5">
                    <SectionHeading icon={MapPin} title="Campus Address" />
                    <p className="text-sm font-medium text-[#111] leading-relaxed flex items-start gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                      <span>{loc.address}, {loc.city}, {loc.state}, {loc.country}</span>
                    </p>
                  </CardContent>
                </Card>
              )}

              {contact && (
                <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                  <CardContent className="space-y-4 p-5">
                    <SectionHeading icon={Phone} title="Admission Contact Desk" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoRow
                        icon={Mail}
                        label="Email Support"
                        value={
                          <a href={`mailto:${contact.email}`} className="text-[#3730A3] hover:underline">
                            {contact.email}
                          </a>
                        }
                      />
                      <InfoRow
                        icon={Phone}
                        label="Inquiry Hotlines"
                        value={
                          <a href={`tel:${contact.phone}`} className="text-[#3730A3] hover:underline font-mono">
                            {contact.phone}
                          </a>
                        }
                      />
                    </div>
                    {contact.admissionOfficeHours && (
                      <div className="pt-3 border-t flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5 text-[#3730A3]" /> Hours: {contact.admissionOfficeHours}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Gallery View */}
          {university.content?.gallery?.length > 0 && (
            <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
              <CardContent className="p-5">
                <SectionHeading icon={ImageIcon} title="Campus Highlights Gallery" />
                <GalleryGrid images={university.content.gallery} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== Academic Tab ===== */}
        <TabsContent value="academic" className="space-y-6">
          {a ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
              
              {/* Programs & Durations */}
              <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <SectionHeading icon={BookOpen} title="Syllabus & Medium" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoRow icon={GraduationCap} label="Offered Programs" value={<BadgeList items={a.programs} />} />
                    <InfoRow icon={Clock} label="Course Duration" value={a.duration} />
                    <InfoRow icon={Globe} label="Teaching Medium" value={a.medium} />
                    <InfoRow icon={Calendar} label="Academic Intakes" value={<BadgeList items={a.intakeMonths} />} />
                  </div>
                </CardContent>
              </Card>

              {/* Seat Distributions */}
              <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <SectionHeading icon={Users} title="Admissions Quota & Seats" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Approved Intake</span>
                      <span className="text-lg font-extrabold text-[#3730A3]">{a.totalSeats} seats</span>
                    </div>
                    
                    {/* Visual seats quota distribution bar */}
                    <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden flex">
                      {a.totalSeats > 0 && (
                        <>
                          <div
                            className="bg-green-500 h-full"
                            style={{ width: `${(a.governmentSeats / a.totalSeats) * 100}%` }}
                            title={`Government: ${a.governmentSeats}`}
                          />
                          <div
                            className="bg-blue-500 h-full"
                            style={{ width: `${(a.managementSeats / a.totalSeats) * 100}%` }}
                            title={`Management: ${a.managementSeats}`}
                          />
                          <div
                            className="bg-amber-500 h-full"
                            style={{ width: `${(a.nriSeats / a.totalSeats) * 100}%` }}
                            title={`NRI: ${a.nriSeats}`}
                          />
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                      <div className="p-2.5 rounded-lg bg-green-50/50 border border-green-100">
                        <p className="text-gray-400 font-medium">Government</p>
                        <p className="font-extrabold text-green-700 mt-1">{a.governmentSeats}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                        <p className="text-gray-400 font-medium">Management</p>
                        <p className="font-extrabold text-blue-700 mt-1">{a.managementSeats}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100">
                        <p className="text-gray-400 font-medium">NRI Quota</p>
                        <p className="font-extrabold text-amber-700 mt-1">{a.nriSeats}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specializations list */}
              {a.specializations?.length > 0 && (
                <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm md:col-span-2">
                  <CardContent className="p-5">
                    <SectionHeading icon={Medal} title="Recognized Departments & Specializations" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {a.specializations.map((spec) => (
                        <div
                          key={spec}
                          className="flex items-center gap-2.5 rounded-lg border border-[#ECEAE6] bg-[#FAFAF8] px-3.5 py-2.5"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-sm font-semibold text-[#111]">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
              No academic profile available.
            </div>
          )}
        </TabsContent>

        {/* ===== Infrastructure Tab ===== */}
        <TabsContent value="infrastructure" className="space-y-6">
          {infra ? (
            <div className="space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
                <InfraStat icon={Stethoscope} label="Hospital Beds" value={infra.hospitalBeds} />
                <InfraStat icon={School} label="Departments" value={infra.departments} />
                <InfraStat icon={FlaskConical} label="Laboratories" value={infra.laboratories} />
                <InfraStat icon={Bed} label="Hostel (Boys)" value={infra.hostelBoys} />
                <InfraStat icon={Bed} label="Hostel (Girls)" value={infra.hostelGirls} />
                <InfraStat icon={MapPin} label="Campus Size" value={infra.campusArea ? `${infra.campusArea} ac` : "—"} />
              </div>

              {/* Amenities Grid */}
              <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                <CardContent className="p-5">
                  <SectionHeading icon={Building2} title="In-Campus Amenities & Amenities checklist" />
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
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
              No infrastructure metrics documented.
            </div>
          )}
        </TabsContent>

        {/* ===== Admission Tab ===== */}
        <TabsContent value="admission" className="space-y-6">
          {adm ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
              
              {/* Requirements */}
              <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <SectionHeading icon={ClipboardList} title="Eligibility Requirements" />
                  <div className="grid grid-cols-1 gap-3">
                    <InfoRow icon={FileText} label="Entrance Examinations Required" value={<BadgeList items={adm.entranceExams} />} />
                    <InfoRow icon={Medal} label="Minimum Required Score" value={adm.minimumMarks} />
                    <InfoRow icon={Calendar} label="Candidate Age Criteria" value={adm.ageCriteria} />
                    <InfoRow icon={FileText} label="Detailed Eligibility" value={adm.eligibility} />
                  </div>
                </CardContent>
              </Card>

              {/* Deadline & Fees */}
              <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <SectionHeading icon={ScrollText} title="Application Process & Deadlines" />
                  <div className="grid grid-cols-1 gap-3">
                    <InfoRow icon={Banknote} label="Application Form Fee" value={`₹${adm.applicationFee?.toLocaleString() ?? "—"}`} />
                    <InfoRow
                      icon={Calendar}
                      label="Submission Deadline"
                      value={
                        adm.applicationDeadline
                          ? new Date(adm.applicationDeadline).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"
                      }
                    />
                    <InfoRow icon={ClipboardList} label="Admissions Selection Process" value={adm.selectionProcess} />
                  </div>
                </CardContent>
              </Card>

              {/* Required documents Checklist */}
              {adm.requiredDocuments?.length > 0 && (
                <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm md:col-span-2">
                  <CardContent className="p-5">
                    <SectionHeading icon={FileText} title="Required Documents Checklist" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {adm.requiredDocuments.map((doc) => (
                        <div
                          key={doc}
                          className="flex items-center gap-2.5 rounded-lg border border-[#ECEAE6] bg-[#FAFAF8] px-3.5 py-2.5"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-sm font-semibold text-[#111]">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
              No admission processes listed.
            </div>
          )}
        </TabsContent>

        {/* ===== Support Tab ===== */}
        <TabsContent value="support" className="space-y-6">
          {supp ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
              
              {/* Placements Card */}
              <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <SectionHeading icon={TrendingUp} title="Placement History & Statistics" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-[#ECEAE6] bg-[#FAFAF8] p-4 text-center">
                      <p className="text-2xl font-extrabold text-[#3730A3]">{supp.placementRate}%</p>
                      <p className="mt-1 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Placement Rate</p>
                    </div>
                    <div className="rounded-xl border border-[#ECEAE6] bg-[#FAFAF8] p-4 text-center">
                      <p className="text-2xl font-extrabold text-[#3730A3]">₹{supp.averagePackage?.toLocaleString() ?? "—"}</p>
                      <p className="mt-1 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Avg Annual Package</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student Support Services */}
              <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <SectionHeading icon={Heart} title="International Student Services" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AmenityCheck icon={Globe} label="Visa Processing Assistance" checked={supp.visaAssistance} />
                    <AmenityCheck icon={MessageSquare} label="Counseling Services" checked={supp.counselingServices} />
                    <AmenityCheck icon={Briefcase} label="Post-Graduation Guidance" checked={supp.careerGuidance} />
                  </div>
                </CardContent>
              </Card>

              {/* Language support list */}
              {supp.languageSupport?.length > 0 && (
                <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm md:col-span-2">
                  <CardContent className="p-5">
                    <SectionHeading icon={Languages} title="Language Support Programs" />
                    <div className="flex flex-wrap gap-2.5">
                      {supp.languageSupport.map((lang) => (
                        <div
                          key={lang}
                          className="flex items-center gap-2 rounded-lg border border-[#ECEAE6] bg-white px-3.5 py-2.5 shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-sm font-semibold text-[#111]">{lang}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
              No placement metrics available.
            </div>
          )}
        </TabsContent>

        {/* ===== 🛠️ Interactive Management Tab ===== */}
        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Column 1: Campus Gallery Manager */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <SectionHeading icon={ImageIcon} title="Campus Gallery Manager" />
                  <p className="text-xs text-[#666]">Upload campus environment, library, or anatomy lab images directly to R2 storage.</p>
                  
                  <div className="relative pt-2">
                    <label className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#ECEAE6] bg-white hover:bg-[#FAFAF8] text-xs font-semibold text-gray-700 cursor-pointer shadow-sm select-none transition-all active:scale-[0.98]">
                      {isUploadingGallery ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-[#3730A3]" /> Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-[#3730A3]" /> Select Image File
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        disabled={isUploadingGallery}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Current Gallery Grid with Delete */}
                  <div className="border-t pt-4 border-gray-100">
                    <h4 className="text-xs font-bold text-[#666] mb-3 uppercase tracking-wider">Current Images ({university.content?.gallery?.length || 0})</h4>
                    {university.content?.gallery && university.content.gallery.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {university.content.gallery.map((src, idx) => (
                          <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden border border-[#ECEAE6] bg-[#FAFAF8]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt="Campus" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleGalleryDelete(idx)}
                                className="h-7 w-7 rounded bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No gallery images uploaded yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Column 2: Official Document Manager */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-[#ECEAE6] bg-white rounded-xl shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <SectionHeading icon={FileText} title="Official Documents Manager" />
                  
                  <form onSubmit={handleDocUpload} className="space-y-3 bg-[#FAFAF8] p-4 border rounded-xl border-[#ECEAE6]">
                    <h4 className="text-xs font-bold text-[#111] uppercase tracking-wider">Upload New PDF File</h4>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Document Category</label>
                      <select
                        value={docForm.type}
                        onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                        className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#3730A3]"
                      >
                        <option value="BROCHURE">Official University Brochure</option>
                        <option value="PROSPECTUS">Prospectus Booklet</option>
                        <option value="FEE_STRUCTURE">Detailed Fee Structure</option>
                        <option value="ADMISSION_FORM">Admission Form Template</option>
                        <option value="HOSTEL_RULES">Hostel Rules & Regulations</option>
                        <option value="ANTI_RAGGING_POLICY">Anti-Ragging Compliance</option>
                        <option value="AGREEMENT">Legal Student Agreement</option>
                        <option value="DEGREE_SAMPLE">Degree Certificate Sample</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Select PDF / Image File</label>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setDocForm({ ...docForm, file: e.target.files?.[0] || null })}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isUploadingDoc}
                      className="w-full bg-[#3730A3] text-white text-xs h-9 font-semibold mt-2 cursor-pointer"
                    >
                      {isUploadingDoc ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin mr-1" /> Uploading...
                        </>
                      ) : (
                        "Upload Document"
                      )}
                    </Button>
                  </form>

                  {/* Document list */}
                  <div className="border-t pt-4 border-gray-100">
                    <h4 className="text-xs font-bold text-[#666] mb-3 uppercase tracking-wider">Uploaded Documents ({university.documents?.length || 0})</h4>
                    {university.documents && university.documents.length > 0 ? (
                      <div className="space-y-2.5">
                        {university.documents.map((doc: any) => (
                          <div key={doc.id} className="p-3 bg-white border border-[#ECEAE6] rounded-xl flex items-center justify-between">
                            <div className="min-w-0 flex-1 pr-2">
                              <h5 className="text-xs font-bold text-[#111] truncate">{doc.type.replace(/_/g, " ")}</h5>
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate" title={doc.fileName}>{doc.fileName}</p>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="h-8 w-8 rounded bg-gray-50 hover:bg-gray-100 border border-[#ECEAE6] flex items-center justify-center text-gray-700"
                                title="View document"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteDoc(doc.id)}
                                disabled={deleteDocMut.isPending}
                                className="h-8 w-8 text-white bg-red-600 hover:bg-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No university documents uploaded.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfraStat({
  icon: Icon,
  label,
  value,
}: {
  icon: IconComponent;
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 rounded-xl border bg-white py-4 text-center shadow-xs"
      style={{ borderColor: theme.hairline }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-base font-extrabold text-[#111]">{value}</p>
      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{label}</p>
    </div>
  );
}

function AmenityCheck({
  icon: Icon,
  label,
  checked,
}: {
  icon: IconComponent;
  label: string;
  checked: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 ${
        checked
          ? "border-emerald-200 bg-emerald-50/40"
          : "border-[#ECEAE6] bg-[#FAFAF8]"
      }`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          checked
            ? "bg-emerald-100 text-emerald-600"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {checked ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XIcon className="h-4 w-4" />
        )}
      </div>
      <span
        className={`text-sm ${
          checked ? "font-semibold text-emerald-800" : "text-[#6B6B6B]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Building2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function VisaIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2v20" />
      <path d="M8 12H6l4-8h4l4 8h-2" />
      <path d="M5 16h14" />
    </svg>
  );
}
