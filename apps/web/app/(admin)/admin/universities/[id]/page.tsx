"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  useAdminUniversity,
  useUpdateUniversityStatus,
  useDeleteUniversity,
  useUpdateUniversity,
  useAddUniversityCourse,
  useDeleteUniversityCourse,
  useUploadUniversityDocument,
  useDeleteUniversityDocument,
} from "@/domains/universities";
import { uploadFile } from "@/domains/documents/documents.api";
import { Button } from "@repo/ui";
import { Card, CardContent } from "@repo/ui";
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
  Plus,
  Loader2,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";

type IconComponent = React.ComponentType<{ className?: string }>;

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

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: IconComponent;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-[#ECEAE6] bg-white px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F4F2] sm:h-9 sm:w-9">
        <Icon className="h-3.5 w-3.5 text-[#6B6B6B] sm:h-4 sm:w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-[#9CA3AF] sm:text-xs">{label}</p>
        <p className="truncate text-xs font-medium text-[#111] sm:text-sm">
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
    <div className="flex items-start gap-2.5">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#9CA3AF]" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#9CA3AF]">{label}</p>
        <div className="text-sm text-[#111]">{value}</div>
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
    <div className="mb-4 flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F5F4F2]">
        <Icon className="h-3.5 w-3.5 text-[#6B6B6B]" />
      </div>
      <h3 className="text-sm font-semibold text-[#111]">{title}</h3>
    </div>
  );
}

function BadgeList({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-sm text-[#9CA3AF]">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-md border border-[#ECEAE6] bg-white px-2 py-0.5 text-xs text-[#6B6B6B]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function GalleryGrid({ images }: { images: string[] }) {
  if (!images?.length) return <p className="text-xs text-gray-400">No images in gallery yet.</p>;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((src, i) => (
        <div
          key={i}
          className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[#ECEAE6] bg-[#F5F4F2]"
        >
          <Image
            src={src}
            alt={`Gallery ${i + 1}`}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="-m-4 sm:-m-6 flex flex-1 flex-col animate-pulse">
      <div className="relative h-32 w-full shrink-0 bg-[#F5F4F2] sm:h-44 md:h-52" />
      <div className="w-full space-y-4 px-4 pb-6 sm:space-y-6 sm:px-6 sm:pb-8">
        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-start sm:justify-between sm:pt-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="-mt-10 h-16 w-16 rounded-xl border border-[#ECEAE6] bg-white sm:-mt-14 sm:h-20 sm:w-20" />
            <div className="space-y-2 pt-0.5 sm:pt-1">
              <div className="h-5 w-48 rounded bg-[#ECEAE6] sm:h-6 sm:w-64" />
              <div className="h-3.5 w-24 rounded bg-[#F5F4F2] sm:h-4" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-lg border border-[#ECEAE6] bg-white sm:h-16"
            />
          ))}
        </div>
        <div className="h-9 w-72 max-w-full rounded-lg bg-[#F5F4F2] sm:w-96" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-40 rounded-lg border border-[#ECEAE6] bg-white sm:h-48" />
          <div className="h-40 rounded-lg border border-[#ECEAE6] bg-white sm:h-48" />
        </div>
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

  // New Management Mutations
  const updateUniversityMut = useUpdateUniversity();
  const uploadDocMut = useUploadUniversityDocument();
  const deleteDocMut = useDeleteUniversityDocument();

  // Management State
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const [docForm, setDocForm] = useState({
    type: "PROSPECTUS",
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
      setDocForm({ type: "PROSPECTUS", file: null });
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
    <div className="-m-4 sm:-m-6 flex flex-1 flex-col overflow-hidden">
      {/* Banner hero */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden sm:h-44 md:h-52">
        {university.bannerImage ? (
          <>
            <Image
              src={university.bannerImage}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111]/50 to-transparent" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#F5F4F2] to-[#ECEAE6]" />
        )}
      </div>

      <div className="w-full space-y-4 px-4 pb-6 sm:space-y-6 sm:px-6 sm:pb-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:pt-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="relative -mt-10 h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm sm:-mt-14 sm:h-20 sm:w-20">
              {university.logo ? (
                <Image
                  src={university.logo}
                  alt={university.name}
                  fill
                  className="object-contain p-1"
                  sizes="(max-width: 640px) 64px, 80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#9CA3AF]">
                  <School className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              )}
            </div>
            <div className="min-w-0 pt-0.5 sm:pt-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="text-base font-semibold tracking-tight text-[#111] sm:text-xl md:text-2xl">
                  {university.name}
                </h1>
                <Badge
                  className={`border text-[10px] sm:text-xs ${status.className}`}
                >
                  {status.label}
                </Badge>
              </div>
              <p className="text-xs text-[#6B6B6B] sm:text-sm">
                {university.shortName}
                {loc?.country && ` · ${loc.city}, ${loc.country}`}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="cursor-pointer bg-white border-[#ECEAE6]">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                router.push(`/admin/universities/${params.id}/edit`)
              }
              className="cursor-pointer hover:bg-[#FAFAF8]"
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
            {university.status !== "ACTIVE" ? (
              <Button
                size="sm"
                onClick={() =>
                  updateStatus.mutate({
                    id: params.id as string,
                    status: "ACTIVE",
                  })
                }
                disabled={updateStatus.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                {updateStatus.isPending ? "Activating..." : "Activate"}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateStatus.mutate({
                    id: params.id as string,
                    status: "INACTIVE",
                  })
                }
                disabled={updateStatus.isPending}
                className="text-amber-700 border-amber-300 hover:bg-amber-50 cursor-pointer bg-white"
              >
                {updateStatus.isPending ? "Deactivating..." : "Deactivate"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer bg-white"
              disabled={deleteUniversity.isPending}
              onClick={async () => {
                if (
                  !confirm("Are you sure you want to delete this university?")
                )
                  return;
                await deleteUniversity.mutateAsync(params.id as string);
                router.push("/admin/universities");
              }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              {deleteUniversity.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          <StatCard
            icon={Building2}
            label="Type"
            value={university.type?.replace("_", " ")}
          />
          <StatCard
            icon={Calendar}
            label="Est."
            value={university.establishedYear ?? "—"}
          />
          <StatCard icon={Globe} label="Country" value={loc?.country ?? "—"} />
          <StatCard
            icon={GraduationCap}
            label="Programs"
            value={a?.programs?.length ?? 0}
          />
          <StatCard icon={Users} label="Seats" value={a?.totalSeats ?? "—"} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full min-w-0">
          <TabsList
            variant="line"
            className="h-9 w-full justify-start gap-0 overflow-x-auto border-b border-[#ECEAE6]"
          >
            <TabsTrigger value="overview" className="px-4 text-xs font-medium">
              Overview
            </TabsTrigger>
            <TabsTrigger value="academic" className="px-4 text-xs font-medium">
              Academic
            </TabsTrigger>
            <TabsTrigger
              value="infrastructure"
              className="px-4 text-xs font-medium"
            >
              Infrastructure
            </TabsTrigger>
            <TabsTrigger value="admission" className="px-4 text-xs font-medium">
              Admission
            </TabsTrigger>
            <TabsTrigger value="support" className="px-4 text-xs font-medium">
              Support
            </TabsTrigger>
            <TabsTrigger value="management" className="px-4 text-xs font-bold text-[#3730A3]">
              🛠️ Manage Resources
            </TabsTrigger>
          </TabsList>

          {/* ===== Overview Tab ===== */}
          <TabsContent
            value="overview"
            className="mt-4 space-y-4 sm:mt-6 sm:space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Basic Info */}
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading icon={Building2} title="Basic Information" />
                  <InfoRow
                    icon={School}
                    label="Full Name"
                    value={university.name}
                  />
                  <InfoRow
                    icon={BookOpen}
                    label="Short Name"
                    value={university.shortName}
                  />
                  <InfoRow
                    icon={Building2}
                    label="Type"
                    value={university.type?.replace("_", " ")}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Established"
                    value={university.establishedYear}
                  />
                  {university.brochureUrl && (
                    <InfoRow
                      icon={Download}
                      label="Brochure"
                      value={
                        <a
                          href={university.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#3730A3] hover:underline"
                        >
                          Download Brochure
                          <Download className="h-3 w-3" />
                        </a>
                      }
                    />
                  )}
                </CardContent>
              </Card>

              {/* Location */}
              {loc && (
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={MapPin} title="Location" />
                    <InfoRow icon={Globe} label="Country" value={loc.country} />
                    <InfoRow icon={MapPin} label="State" value={loc.state} />
                    <InfoRow icon={MapPin} label="City" value={loc.city} />
                    <InfoRow
                      icon={MapPin}
                      label="Address"
                      value={loc.address}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Contact */}
              {contact && (
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={Phone} title="Contact" />
                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-[#3730A3] hover:underline"
                        >
                          {contact.email}
                        </a>
                      }
                    />
                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-[#3730A3] hover:underline"
                        >
                          {contact.phone}
                        </a>
                      }
                    />
                    {contact.admissionOfficeHours && (
                      <InfoRow
                        icon={Clock}
                        label="Office Hours"
                        value={contact.admissionOfficeHours}
                      />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Academic Snapshot */}
              {a && (
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading
                      icon={GraduationCap}
                      title="Academic Snapshot"
                    />
                    <InfoRow
                      icon={BookOpen}
                      label="Programs"
                      value={<BadgeList items={a.programs} />}
                    />
                    <InfoRow icon={Clock} label="Duration" value={a.duration} />
                    <InfoRow icon={Globe} label="Medium" value={a.medium} />
                    <InfoRow
                      icon={Calendar}
                      label="Intake"
                      value={<BadgeList items={a.intakeMonths} />}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Gallery */}
            {university.content?.gallery?.length > 0 && (
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="p-4 sm:p-5">
                  <SectionHeading icon={ImageIcon} title="Gallery" />
                  <GalleryGrid images={university.content.gallery} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ===== Academic Tab ===== */}
          <TabsContent
            value="academic"
            className="mt-4 space-y-4 sm:mt-6 sm:space-y-5"
          >
            {a ? (
              <>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Programs & Duration */}
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading
                        icon={BookOpen}
                        title="Programs & Duration"
                      />
                      <InfoRow
                        icon={GraduationCap}
                        label="Programs"
                        value={<BadgeList items={a.programs} />}
                      />
                      <InfoRow
                        icon={Clock}
                        label="Duration"
                        value={a.duration}
                      />
                      <InfoRow icon={Globe} label="Medium" value={a.medium} />
                      <InfoRow
                        icon={Calendar}
                        label="Intake Months"
                        value={<BadgeList items={a.intakeMonths} />}
                      />
                    </CardContent>
                  </Card>

                  {/* Seat Distribution */}
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading icon={Users} title="Seat Distribution" />
                      <InfoRow
                        icon={Users}
                        label="Total Seats"
                        value={a.totalSeats}
                      />
                      <InfoRow
                        icon={Users}
                        label="Government"
                        value={a.governmentSeats}
                      />
                      <InfoRow
                        icon={Users}
                        label="Management"
                        value={a.managementSeats}
                      />
                      <InfoRow icon={Users} label="NRI" value={a.nriSeats} />
                    </CardContent>
                  </Card>

                  {/* Specializations */}
                  {a.specializations?.length > 0 && (
                    <Card size="sm" className="border-[#ECEAE6]">
                      <CardContent className="space-y-3 p-4 sm:p-5">
                        <SectionHeading icon={Medal} title="Specializations" />
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {a.specializations.map((spec) => (
                            <div
                              key={spec}
                              className="flex items-center gap-2 rounded-md border border-[#ECEAE6] bg-[#FAFAF9] px-3 py-2"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                              <span className="text-sm text-[#111]">
                                {spec}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
                <p className="text-sm text-[#9CA3AF]">
                  No academic details available
                </p>
              </div>
            )}
          </TabsContent>

          {/* ===== Infrastructure Tab ===== */}
          <TabsContent
            value="infrastructure"
            className="mt-4 space-y-4 sm:mt-6 sm:space-y-5"
          >
            {infra ? (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
                  <InfraStat
                     icon={Stethoscope}
                     label="Hospital Beds"
                     value={infra.hospitalBeds}
                  />
                  <InfraStat
                     icon={School}
                     label="Departments"
                     value={infra.departments}
                  />
                  <InfraStat
                     icon={FlaskConical}
                     label="Laboratories"
                     value={infra.laboratories}
                  />
                  <InfraStat
                     icon={Bed}
                     label="Hostel (Boys)"
                     value={infra.hostelBoys}
                  />
                  <InfraStat
                     icon={Bed}
                     label="Hostel (Girls)"
                     value={infra.hostelGirls}
                  />
                  <InfraStat
                     icon={MapPin}
                     label="Campus (acres)"
                     value={infra.campusArea}
                  />
                </div>

                {/* Facilities */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="p-4 sm:p-5">
                    <SectionHeading icon={Building2} title="Facilities" />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      <AmenityCheck
                        icon={Library}
                        label="Library"
                        checked={infra.facilities?.includes("Library")}
                      />
                      <AmenityCheck
                        icon={FlaskConical}
                        label="Computer Lab"
                        checked={infra.facilities?.includes("Computer Lab")}
                      />
                      <AmenityCheck
                        icon={Dumbbell}
                        label="Sports Complex"
                        checked={infra.facilities?.includes("Sports Complex")}
                      />
                      <AmenityCheck
                        icon={Coffee}
                        label="Cafeteria"
                        checked={
                          infra.facilities?.includes("Cafeteria") ??
                          infra.cafeteria
                        }
                      />
                      <AmenityCheck
                        icon={Bed}
                        label="Hostel"
                        checked={infra.facilities?.includes("Hostel")}
                      />
                      <AmenityCheck
                        icon={Stethoscope}
                        label="Hospital"
                        checked={infra.facilities?.includes("Hospital")}
                      />
                      <AmenityCheck
                        icon={Wifi}
                        label="WiFi Campus"
                        checked={infra.wifiCampus}
                      />
                      <AmenityCheck
                        icon={Bus}
                        label="Transport"
                        checked={infra.transportation}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
                <p className="text-sm text-[#9CA3AF]">
                  No infrastructure details available
                </p>
              </div>
            )}
          </TabsContent>

          {/* ===== Admission Tab ===== */}
          <TabsContent
            value="admission"
            className="mt-4 space-y-4 sm:mt-6 sm:space-y-5"
          >
            {adm ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Requirements */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={ClipboardList} title="Requirements" />
                    <InfoRow
                      icon={FileText}
                      label="Entrance Exams"
                      value={<BadgeList items={adm.entranceExams} />}
                    />
                    <InfoRow
                      icon={Medal}
                      label="Minimum Marks"
                      value={adm.minimumMarks}
                    />
                    <InfoRow
                      icon={Calendar}
                      label="Age Criteria"
                      value={adm.ageCriteria}
                    />
                    <InfoRow
                      icon={FileText}
                      label="Eligibility"
                      value={adm.eligibility}
                    />
                  </CardContent>
                </Card>

                {/* Documents & Fees */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading
                      icon={ScrollText}
                      title="Documents & Fees"
                    />
                    <InfoRow
                      icon={Banknote}
                      label="Application Fee"
                      value={`₹${adm.applicationFee?.toLocaleString() ?? "—"}`}
                    />
                    <InfoRow
                      icon={Calendar}
                      label="Deadline"
                      value={
                        adm.applicationDeadline
                          ? new Date(
                              adm.applicationDeadline,
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"
                      }
                    />
                    <InfoRow
                      icon={ClipboardList}
                      label="Selection"
                      value={adm.selectionProcess}
                    />
                  </CardContent>
                </Card>

                {/* Required Documents */}
                {adm.requiredDocuments?.length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6] md:col-span-2">
                    <CardContent className="p-4 sm:p-5">
                      <SectionHeading
                        icon={FileText}
                        title="Required Documents"
                      />
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {adm.requiredDocuments.map((doc) => (
                          <div
                            key={doc}
                            className="flex items-center gap-2 rounded-md border border-[#ECEAE6] bg-[#FAFAF9] px-3 py-2"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span className="text-sm text-[#111]">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
                <p className="text-sm text-[#9CA3AF]">
                  No admission details available
                </p>
              </div>
            )}
          </TabsContent>

          {/* ===== Support Tab ===== */}
          <TabsContent
            value="support"
            className="mt-4 space-y-4 sm:mt-6 sm:space-y-5"
          >
            {supp ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Placement */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={TrendingUp} title="Placement" />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      <div className="rounded-lg border border-[#ECEAE6] bg-[#FAFAF9] p-3 text-center sm:p-4">
                        <p className="text-xl font-semibold text-[#111] sm:text-2xl">
                          {supp.placementRate}%
                        </p>
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          Placement Rate
                        </p>
                      </div>
                      <div className="rounded-lg border border-[#ECEAE6] bg-[#FAFAF9] p-3 text-center sm:p-4">
                        <p className="text-xl font-semibold text-[#111] sm:text-2xl">
                          ₹{supp.averagePackage?.toLocaleString() ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          Avg. Package
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={Heart} title="Student Services" />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <AmenityCheck
                        icon={VisaIcon}
                        label="Visa Assistance"
                        checked={supp.visaAssistance}
                      />
                      <AmenityCheck
                        icon={MessageSquare}
                        label="Counseling"
                        checked={supp.counselingServices}
                      />
                      <AmenityCheck
                        icon={Briefcase}
                        label="Career Guidance"
                        checked={supp.careerGuidance}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Language Support */}
                {supp.languageSupport?.length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6] md:col-span-2">
                    <CardContent className="p-4 sm:p-5">
                      <SectionHeading
                        icon={Languages}
                        title="Language Support"
                      />
                      <div className="flex flex-wrap gap-2">
                        {supp.languageSupport.map((lang) => (
                          <div
                            key={lang}
                            className="flex items-center gap-2 rounded-lg border border-[#ECEAE6] bg-white px-3 py-2"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span className="text-sm font-medium text-[#111]">
                              {lang}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
                <p className="text-sm text-[#9CA3AF]">
                  No support details available
                </p>
              </div>
            )}
          </TabsContent>

          {/* ===== 🛠️ Interactive Management Tab ===== */}
          <TabsContent value="management" className="mt-4 space-y-6 sm:mt-6 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* Column 1: Campus Gallery Manager */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-[#ECEAE6]">
                  <CardContent className="p-4 sm:p-5 space-y-4">
                    <SectionHeading icon={ImageIcon} title="Campus Gallery Manager" />
                    <p className="text-xs text-gray-500">Upload campus environment, library, or anatomy lab images directly to S3/R2 storage.</p>
                    
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
                    <div className="border-t pt-4">
                      <h4 className="text-xs font-bold text-[#666] mb-3 uppercase tracking-wider">Current Images ({university.content?.gallery?.length || 0})</h4>
                      {university.content?.gallery && university.content.gallery.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
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
                <Card className="border-[#ECEAE6]">
                  <CardContent className="p-4 sm:p-5 space-y-4">
                    <SectionHeading icon={FileText} title="Document Manager" />
                    
                    <form onSubmit={handleDocUpload} className="space-y-3 bg-[#FAFAF8] p-3 border rounded-xl">
                      <h4 className="text-xs font-bold text-[#111] uppercase tracking-wider">Upload Document</h4>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-semibold uppercase">Document Category</label>
                        <select
                          value={docForm.type}
                          onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                        >
                          <option value="PROSPECTUS">Prospectus Booklet</option>
                          <option value="FEE_STRUCTURE">Detailed Fee Structure</option>
                          <option value="ADMISSION_FORM">Admission Form Template</option>
                          <option value="HOSTEL_RULES">Hostel Rules & Regulations</option>
                          <option value="ANTI_RAGGING_POLICY">Anti-Ragging Compliance</option>
                          <option value="AGREEMENT">Legal Student Agreement</option>
                          <option value="DEGREE_SAMPLE">Degree Certificate Sample</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-semibold uppercase">PDF / Image File</label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => setDocForm({ ...docForm, file: e.target.files?.[0] || null })}
                          className="w-full px-2 py-1 text-xs border rounded-lg bg-white"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isUploadingDoc}
                        className="w-full bg-[#3730A3] text-white text-xs h-8 font-semibold mt-2 cursor-pointer"
                      >
                        {isUploadingDoc ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Uploading...
                          </>
                        ) : (
                          "Upload Document"
                        )}
                      </Button>
                    </form>

                    {/* Document list */}
                    <div className="border-t pt-4">
                      <h4 className="text-xs font-bold text-[#666] mb-3 uppercase tracking-wider">Uploaded Files ({university.documents?.length || 0})</h4>
                      {university.documents && university.documents.length > 0 ? (
                        <div className="space-y-2">
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
                                  className="h-7 w-7 rounded bg-gray-100 hover:bg-gray-200 border flex items-center justify-center text-gray-700"
                                  title="View document"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteDoc(doc.id)}
                                  disabled={deleteDocMut.isPending}
                                  className="h-7 w-7 text-white bg-red-600 hover:bg-red-700"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-[#ECEAE6] bg-white py-4 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F4F2]">
        <Icon className="h-4 w-4 text-[#6B6B6B]" />
      </div>
      <p className="text-lg font-semibold text-[#111]">{value}</p>
      <p className="text-xs text-[#9CA3AF]">{label}</p>
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
      className={`flex items-center gap-2.5 rounded-md border px-3 py-2.5 ${
        checked
          ? "border-emerald-200 bg-emerald-50/40"
          : "border-[#ECEAE6] bg-[#FAFAF9]"
      }`}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          checked
            ? "bg-emerald-100 text-emerald-600"
            : "bg-[#F5F4F2] text-[#9CA3AF]"
        }`}
      >
        {checked ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : (
          <XIcon className="h-3.5 w-3.5" />
        )}
      </div>
      <span
        className={`text-sm ${
          checked ? "font-medium text-emerald-800" : "text-[#6B6B6B]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* Helper component for the X icon used in AmenityCheck */
function XIcon({ className }: { className?: string }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* Local SVG icon components for icons not in lucide-react */
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
