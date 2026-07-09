"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import {
  useAdminUniversity,
  useUpdateUniversityStatus,
  useDeleteUniversity,
  useUpdateUniversity,
  useUploadUniversityDocument,
  useDeleteUniversityDocument,
} from "@/domains/universities";
import { uploadFile } from "@/domains/documents/documents.api";
import {
  Button,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui";
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
  Upload,
  Video,
  X,
  Loader2,
  PlayCircle,
  Award,
  BarChart3,
  DollarSign,
  CreditCard,
  Landmark,
  UserCog,
  Shield,
  Building,
  Star,
  Hash,
  FileUp,
} from "lucide-react";
import Image from "next/image";

/* ─── Extracted components ─── */
import {
  LoadingSkeleton,
  InfoRow,
  SectionHeading,
  BadgeList,
  EmptyState,
  AmenityCheck,
  StatCard,
  statusConfig,
} from "@/components/admin/universities/ui";
// Tab components
import { OverviewTab } from "@/components/admin/universities/tabs/overview-tab";
import { InfrastructureTab } from "@/components/admin/universities/tabs/infrastructure-tab";
import { AdmissionTab } from "@/components/admin/universities/tabs/admission-tab";
import { RecognitionTab } from "@/components/admin/universities/tabs/recognition-tab";
import { FeesTab } from "@/components/admin/universities/tabs/fees-tab";
import { AdminTab } from "@/components/admin/universities/tabs/admin-tab";
import { DocumentsTab } from "@/components/admin/universities/tabs/documents-tab";
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
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

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
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Universities
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

  // Banner / Logo Handlers
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingBanner(true);
    try {
      const file = e.target.files[0];
      const res = await uploadFile(file, "banners");
      await updateUniversityMut.mutateAsync({
        id: uniId,
        data: { bannerImage: res.url },
      });
      toast.success("Banner image updated");
    } catch {
      toast.error("Failed to upload banner");
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploadingLogo(true);
    try {
      const file = e.target.files[0];
      const res = await uploadFile(file, "logos");
      await updateUniversityMut.mutateAsync({
        id: uniId,
        data: { logo: res.url },
      });
      toast.success("Logo updated");
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Simple callbacks for tab components
  const handleDeleteDoc = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await deleteDocMut.mutateAsync(docId);
      toast.success("Document deleted!");
      refetch();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  const handleUploadDoc = async (fd: FormData) => {
    const file = fd.get("file") as File;
    const type = fd.get("type") as string;
    if (!file) return;
    const res = await uploadFile(file, "documents");
    await uploadDocMut.mutateAsync({
      uniId,
      data: {
        type,
        fileUrl: res.url,
        fileName: file.name,
        fileSize: file.size,
      },
    });
    toast.success("Document uploaded!");
    refetch();
  };

  const handleSaveBank = async (data: any) => {
    await updateUniversityMut.mutateAsync({ id: uniId, data: { admin: data } });
    refetch();
  };

  const handleAddBankField = async (details: Record<string, any>) => {
    await updateUniversityMut.mutateAsync({
      id: uniId,
      data: { admin: { bankDetails: details } },
    });
    refetch();
  };

  return (
    <div className="flex flex-1 flex-col gap-6 max-w-7xl mx-auto p-4 md:p-6 bg-[#FAF9F6]">
      {/* Editorial Hero Banner */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl border bg-white shadow-sm sm:h-56 md:h-64 border-[#ECEAE6]">
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
                <input
                  type="file"
                  accept="image/*,image/svg+xml"
                  className="hidden"
                  onChange={handleBannerUpload}
                  disabled={isUploadingBanner}
                />
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
            <input
              type="file"
              accept="image/*,image/svg+xml"
              className="hidden"
              onChange={handleBannerUpload}
              disabled={isUploadingBanner}
            />
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
              onClick={() =>
                router.push(`/admin/universities/${params.id}/edit`)
              }
              className="cursor-pointer bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white text-gray-800 font-semibold"
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>

            {university.status !== "ACTIVE" ? (
              <Button
                size="sm"
                onClick={() =>
                  updateStatus.mutate({ id: uniId, status: "ACTIVE" })
                }
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
                onClick={() =>
                  updateStatus.mutate({ id: uniId, status: "INACTIVE" })
                }
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
                if (
                  !confirm("Are you sure you want to delete this university?")
                )
                  return;
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
              <Image
                src={university.logo}
                alt="Logo"
                fill
                className="object-contain p-1"
                sizes="64px"
              />
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition hover:bg-black/40 hover:opacity-100">
                <Edit className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*,image/svg+xml"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                />
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
              <input
                type="file"
                accept="image/*,image/svg+xml"
                className="hidden"
                onChange={handleLogoUpload}
                disabled={isUploadingLogo}
              />
            </label>
          )}
          <div>
            <h1 className="text-2xl font-bold text-[#111] sm:text-3xl">
              {university.name}
            </h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              {university.shortName}
            </p>
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
          <TabsTrigger
            value="infrastructure"
            className="px-4 text-xs font-medium"
          >
            Infrastructure
          </TabsTrigger>
          <TabsTrigger value="admission" className="px-4 text-xs font-medium">
            Admission
          </TabsTrigger>
          <TabsTrigger value="recognition" className="px-4 text-xs font-medium">
            Recognition
          </TabsTrigger>
          <TabsTrigger value="fees" className="px-4 text-xs font-medium">
            Fees
          </TabsTrigger>
          <TabsTrigger value="admin" className="px-4 text-xs font-medium">
            Admin
          </TabsTrigger>
          <TabsTrigger value="documents" className="px-4 text-xs font-medium">
            Documents
          </TabsTrigger>
          {/* <TabsTrigger value="courses" className="px-4 text-xs font-medium">
              Courses
            </TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="mt-5 space-y-5">
          <OverviewTab
            university={university}
            a={a}
            loc={loc}
            contact={contact}
            supp={supp}
            router={router}
            uniId={uniId}
            refetch={refetch}
            updateUniversityMut={updateUniversityMut}
          />
        </TabsContent>
        <TabsContent value="infrastructure" className="mt-5 space-y-5">
          <InfrastructureTab infra={infra} router={router} uniId={uniId} />
        </TabsContent>
        <TabsContent value="admission" className="mt-5 space-y-5">
          <AdmissionTab adm={adm} router={router} uniId={uniId} />
        </TabsContent>
        <TabsContent value="recognition" className="space-y-6">
          <RecognitionTab
            recognition={university.recognition}
            router={router}
            uniId={uniId}
          />
        </TabsContent>
        <TabsContent value="fees" className="space-y-6">
          <FeesTab fees={university.fees} router={router} uniId={uniId} />
        </TabsContent>
        <TabsContent value="admin" className="space-y-6">
          <AdminTab
            admin={university.admin}
            loc={loc}
            uniId={uniId}
            router={router}
            onSaveBank={handleSaveBank}
            onAddBankField={handleAddBankField}
          />
        </TabsContent>
        <TabsContent value="documents" className="space-y-6">
          <DocumentsTab
            documents={university.documents || []}
            onDeleteDoc={handleDeleteDoc}
            onUploadDoc={handleUploadDoc}
            uniId={uniId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
