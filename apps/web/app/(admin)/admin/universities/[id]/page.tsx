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
  useAddUniversityCourse,
  useUpdateUniversityCourse,
  useDeleteUniversityCourse,
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
  ImageIcon,
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
  Briefcase,
  Clock,
  Stethoscope,
  FlaskConical,
  Library,
  Bed,
  ClipboardList,
  ScrollText,
  Banknote,
  Trash2,
  TrendingUp,
  Heart,
  MessageSquare,
  Languages,
  Dumbbell,
  Building2,
  Plus,
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
  onEdit,
}: {
  icon: IconComponent;
  title: string;
  onEdit?: () => void;
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#111]">{title}</h3>
      </div>
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Edit className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
      )}
    </div>
  );
}

function BadgeList({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-sm text-[#9CA3AF]">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="inline-flex items-center rounded-md border border-[#ECEAE6] bg-white px-2 py-0.5 text-xs text-[#6B6B6B]"
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
  const addCourseMut = useAddUniversityCourse();
  const updateCourseMut = useUpdateUniversityCourse();
  const deleteCourseMut = useDeleteUniversityCourse();

  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
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
    } catch (err) {
      toast.error("Failed to update gallery");
    }
  };

  // Banner / Logo Handlers
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingBanner(true);
    try {
      const file = e.target.files[0];
      const res = await uploadFile(file, "banners");
      await updateUniversityMut.mutateAsync({ id: uniId, data: { bannerImage: res.url } });
      toast.success("Banner image updated");
    } catch { toast.error("Failed to upload banner"); }
    finally { setIsUploadingBanner(false); }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingLogo(true);
    try {
      const file = e.target.files[0];
      const res = await uploadFile(file, "logos");
      await updateUniversityMut.mutateAsync({ id: uniId, data: { logo: res.url } });
      toast.success("Logo updated");
    } catch { toast.error("Failed to upload logo"); }
    finally { setIsUploadingLogo(false); }
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
            <div className="absolute bottom-3 right-3 z-10">
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-white border border-white/20">
                <Edit className="h-3 w-3" /> Change Banner
                <input type="file" accept="image/*,image/svg+xml" className="hidden" onChange={handleBannerUpload} disabled={isUploadingBanner} />
              </label>
            </div>
          </>
        ) : (
          <label className="flex h-full w-full cursor-pointer items-center justify-center bg-gradient-to-br from-[#FAFAF8] to-[#ECEAE6] transition hover:from-gray-100 hover:to-gray-200">
            <div className="flex flex-col items-center gap-1.5 text-gray-400">
              {isUploadingBanner ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              ) : (
                <>
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-xs font-medium">Add Banner Image</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*,image/svg+xml" className="hidden" onChange={handleBannerUpload} disabled={isUploadingBanner} />
          </label>
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

      </div>

      {/* Header with Logo, Title, and Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {university.logo ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#ECEAE6] bg-white">
              <Image src={university.logo} alt="Logo" fill className="object-contain p-1" sizes="64px" />
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition hover:bg-black/40 hover:opacity-100">
                <Edit className="h-4 w-4 text-white" />
                <input type="file" accept="image/*,image/svg+xml" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
              </label>
            </div>
          ) : (
            <label className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#D4D2CE] bg-[#FAF9F6] transition hover:bg-gray-100">
              {isUploadingLogo ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              ) : (
                <div className="flex flex-col items-center gap-0.5 text-gray-400">
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Logo</span>
                </div>
              )}
              <input type="file" accept="image/*,image/svg+xml" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
            </label>
          )}
          <div>
            <h1 className="text-2xl font-bold text-[#111] sm:text-3xl">{university.name}</h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">{university.shortName}</p>
          </div>
        </div>
        <Badge className={status.className}>{status.label}</Badge>
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
          <StatCard
            icon={Globe}
            label="Country"
            value={loc?.country ?? "—"}
          />
          <StatCard
            icon={GraduationCap}
            label="Programs"
            value={a?.programs?.length ?? 0}
          />
          <StatCard
            icon={Users}
            label="Seats"
            value={a?.totalSeats ?? "—"}
          />
        </div>

      {/* Tabs */}
      <Tabs
          defaultValue="overview"
          className="w-full min-w-0"
        >
          <TabsList variant="line" className="h-9 w-full justify-start gap-0 overflow-x-auto border-b border-[#ECEAE6]">
            <TabsTrigger value="overview" className="px-4 text-xs font-medium">
              Overview
            </TabsTrigger>
            <TabsTrigger value="academic" className="px-4 text-xs font-medium">
              Academic
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="px-4 text-xs font-medium">
              Infrastructure
            </TabsTrigger>
            <TabsTrigger value="admission" className="px-4 text-xs font-medium">
              Admission
            </TabsTrigger>
            <TabsTrigger value="support" className="px-4 text-xs font-medium">
              Support
            </TabsTrigger>
            <TabsTrigger value="courses" className="px-4 text-xs font-medium">
              Courses
            </TabsTrigger>
          </TabsList>

          {/* ===== Overview Tab ===== */}
          <TabsContent value="overview" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Basic Info */}
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading
                    icon={Building2}
                    title="Basic Information"
                    onEdit={() => router.push(`/admin/universities/${uniId}/edit?section=basic`)}
                  />
                  <InfoRow icon={School} label="Full Name" value={university.name} />
                  <InfoRow icon={BookOpen} label="Short Name" value={university.shortName} />
                  <InfoRow icon={Building2} label="Type" value={university.type?.replace("_", " ")} />
                  <InfoRow icon={Calendar} label="Established" value={university.establishedYear} />
                  {university.website && (
                    <InfoRow
                      icon={Globe}
                      label="Website"
                      value={
                        <a
                          href={university.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#3730A3] hover:underline"
                        >
                          {university.website.replace(/^https?:\/\//, '')}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      }
                    />
                  )}
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
                    <SectionHeading
                      icon={MapPin}
                      title="Location"
                      onEdit={() => router.push(`/admin/universities/${uniId}/edit?section=location`)}
                    />
                    <InfoRow icon={Globe} label="Country" value={loc.country} />
                    <InfoRow icon={MapPin} label="State" value={loc.state} />
                    <InfoRow
                      icon={MapPin}
                      label="City"
                      value={loc.city}
                    />
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
                    <SectionHeading
                      icon={Phone}
                      title="Contact"
                      onEdit={() => router.push(`/admin/universities/${uniId}/edit?section=contact`)}
                    />
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
                      onEdit={() => router.push(`/admin/universities/${uniId}/edit?section=academic`)}
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

              {/* Social Links */}
              {university.socialLinks && (
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading
                      icon={ExternalLink}
                      title="Social Media"
                      onEdit={() => router.push(`/admin/universities/${uniId}/edit?section=social`)}
                    />
                    {(() => {
                      const links: Record<string, string> = university.socialLinks as Record<string, string>;
                      const platformIcons: Record<string, { icon: IconComponent; label: string }> = {
                        facebook: { icon: Globe, label: "Facebook" },
                        instagram: { icon: Globe, label: "Instagram" },
                        youtube: { icon: Globe, label: "YouTube" },
                        linkedin: { icon: Globe, label: "LinkedIn" },
                        twitter: { icon: Globe, label: "Twitter / X" },
                        tiktok: { icon: Globe, label: "TikTok" },
                      };
                      const hasLinks = Object.entries(platformIcons).some(([key]) => links[key]);
                      if (!hasLinks) return <p className="text-xs text-gray-400 italic">No social links added.</p>;
                      return (
                        <div className="space-y-2">
                          {Object.entries(platformIcons).map(([key, config]) => {
                            const url = links[key];
                            if (!url) return null;
                            return (
                              <div key={key} className="flex items-center gap-3">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                                  <config.icon className="h-3.5 w-3.5 text-gray-500" />
                                </div>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-[#3730A3] hover:underline truncate"
                                >
                                  {config.label}
                                </a>
                                <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-gray-300" />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

                {/* Student Demographics */}
              {university.studentDemographics && (() => {
                const demo = university.studentDemographics as any;
                const total = demo.totalStudents || 0;
                const local = demo.localStudents || 0;
                const foreign = demo.foreignStudents || 0;
                if (!total && !local && !foreign) return null;
                return (
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading
                        icon={Users}
                        title="Student Demographics"
                        onEdit={() => router.push(`/admin/universities/${uniId}/edit?section=demographics`)}
                      />
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                          <p className="text-lg font-extrabold text-[#111]">{total.toLocaleString()}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                          <p className="text-lg font-extrabold text-[#111]">{local.toLocaleString()}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Local</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                          <p className="text-lg font-extrabold text-[#111]">{foreign.toLocaleString()}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Foreign</p>
                        </div>
                      </div>
                      {demo.foreignByCountry?.length > 0 && (
                        <div className="pt-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Foreign Students By Country</p>
                          <div className="flex flex-wrap gap-1.5">
                            {demo.foreignByCountry.map((item: any, i: number) => (
                              <span key={i} className="inline-flex items-center gap-1 rounded-md border border-[#ECEAE6] bg-white px-2 py-1 text-xs text-[#6B6B6B]">
                                <Globe className="h-3 w-3" />
                                {item.country}: {item.count}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}
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

                  {/* Seat Distribution */}
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading icon={Users} title="Seat Distribution" />
                      <InfoRow icon={Users} label="Total Seats" value={a.totalSeats} />
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
          <TabsContent value="infrastructure" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
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
            </>
          ) : (
            <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
              No infrastructure metrics documented.
            </div>
          )}
        </TabsContent>

          {/* ===== Admission Tab ===== */}
          <TabsContent value="admission" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
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
                    <InfoRow icon={Calendar} label="Age Criteria" value={adm.ageCriteria} />
                    <InfoRow icon={FileText} label="Eligibility" value={adm.eligibility} />
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
                <p className="text-sm text-[#9CA3AF]">No admission details available</p>
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

                {/* Language Support */}
                {supp.languageSupport?.length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6] md:col-span-2">
                    <CardContent className="p-4 sm:p-5">
                      <SectionHeading icon={Languages} title="Language Support" />
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
                <p className="text-sm text-[#9CA3AF]">No support details available</p>
              </div>
            )}
          </TabsContent>

        {/* ===== Courses Tab ===== */}
        <TabsContent value="courses" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#111]">Offered Courses</h3>
            <Button
              size="sm"
              className="bg-[#3730A3] hover:bg-[#2e288a] text-white font-medium cursor-pointer h-9 px-4"
              onClick={() => {
                const name = prompt("Course name:");
                if (!name) return;
                addCourseMut.mutate(
                  { uniId: university.id, data: { name, duration: 5, fees: 0, seats: 0 } },
                  { onError: () => toast.error("Failed to add course") }
                );
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Course
            </Button>
          </div>

          {university.courses && university.courses.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#ECEAE6] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#ECEAE6] bg-[#FAFAF8]">
                    <th className="px-4 py-3 text-left font-semibold text-[#111]">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#111]">Duration</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#111]">Fees</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#111]">Seats</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#111]">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-[#111]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {university.courses.map((course) => (
                    <tr key={course.id} className="border-b border-[#ECEAE6] last:border-0 hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3 font-medium text-[#111]">{course.name}</td>
                      <td className="px-4 py-3 text-[#6B6B6B]">{course.duration} yrs</td>
                      <td className="px-4 py-3 text-[#6B6B6B]">₹{course.fees?.toLocaleString() ?? "—"}</td>
                      <td className="px-4 py-3 text-[#6B6B6B]">{course.seats}</td>
                      <td className="px-4 py-3">
                        <Badge className={course.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"}>
                          {course.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs cursor-pointer"
                            onClick={() => {
                              const newName = prompt("Course name:", course.name);
                              if (!newName) return;
                              updateCourseMut.mutate(
                                { courseId: course.id, data: { name: newName } },
                                { onError: () => toast.error("Failed to update course") }
                              );
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                            onClick={() => {
                              if (!confirm(`Delete course "${course.name}"?`)) return;
                              deleteCourseMut.mutate(course.id, {
                                onError: () => toast.error("Failed to delete course"),
                              });
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
              No courses added yet.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: IconComponent;
  label: string;
  value: unknown;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border bg-white py-4 text-center shadow-xs" style={{ borderColor: "#ECEAE6" }}>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-base font-extrabold text-[#111]">{String(value ?? "—")}</p>
      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{label}</p>
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
  value: unknown;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border bg-white py-4 text-center shadow-xs" style={{ borderColor: "#ECEAE6" }}>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-base font-extrabold text-[#111]">{Array.isArray(value) ? value.length : String(value ?? "—")}</p>
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

/* Local SVG icon components for icons not in lucide-react */
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
