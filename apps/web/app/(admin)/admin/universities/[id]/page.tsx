"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminUniversity, useUpdateUniversityStatus, useDeleteUniversity } from "@/domains/universities";
import { Button } from "@repo/ui";
import { Card, CardContent } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
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
  Award,
  ExternalLink,
  Building2,
  DollarSign,
  Shield,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

type IconComponent = React.ComponentType<{ className?: string }>;

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
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
        <p className="truncate text-xs font-medium text-[#111] sm:text-sm">{value}</p>
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
      {Icon && (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#9CA3AF]" />
      )}
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

function BadgeList({ items }: { items: (string | { name: string })[] }) {
  if (!items?.length) return <span className="text-sm text-[#9CA3AF]">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => {
        const name = typeof item === "string" ? item : item.name;
        return (
          <span
            key={name || i}
            className="inline-flex items-center rounded-md border border-[#ECEAE6] bg-white px-2 py-0.5 text-xs text-[#6B6B6B]"
          >
            {name}
          </span>
        );
      })}
    </div>
  );
}

function GalleryGrid({ images }: { images: string[] }) {
  if (!images?.length) return null;
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
            <div key={i} className="h-14 rounded-lg border border-[#ECEAE6] bg-white sm:h-16" />
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
  const { data: university, isLoading } = useAdminUniversity(params.id as string);
  const updateStatus = useUpdateUniversityStatus();
  const deleteUniversity = useDeleteUniversity();

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

      <div className="w-full space-y-4 px-4 pb-6 sm:space-y-6 sm:px-6 sm:pb-8">
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
                <Badge className={`border text-[10px] sm:text-xs ${status.className}`}>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(
                `/admin/universities/${params.id}/edit`
              )}
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
            {university.status !== "ACTIVE" ? (
              <Button
                size="sm"
                onClick={() => updateStatus.mutate({ id: params.id as string, status: "ACTIVE" })}
                disabled={updateStatus.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                {updateStatus.isPending ? "Activating..." : "Activate"}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateStatus.mutate({ id: params.id as string, status: "INACTIVE" })}
                disabled={updateStatus.isPending}
                className="text-amber-700 border-amber-300 hover:bg-amber-50"
              >
                {updateStatus.isPending ? "Deactivating..." : "Deactivate"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              disabled={deleteUniversity.isPending}
              onClick={async () => {
                if (!confirm("Are you sure you want to delete this university?")) return;
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
            value={(a?.programs || []).reduce((sum: number, p: any) => sum + (typeof p === "string" ? 0 : (p.totalSeats ?? 0)), 0) || "—"}
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
            <TabsTrigger value="fees" className="px-4 text-xs font-medium">
              Fees
            </TabsTrigger>
            <TabsTrigger value="recognition" className="px-4 text-xs font-medium">
              Recognition
            </TabsTrigger>
            <TabsTrigger value="content" className="px-4 text-xs font-medium">
              Content
            </TabsTrigger>
            <TabsTrigger value="admin" className="px-4 text-xs font-medium">
              Admin
            </TabsTrigger>
          </TabsList>

          {/* ===== Overview Tab - Pro Max Design ===== */}
          <TabsContent value="overview" className="mt-4 space-y-6 sm:mt-6">
            {/* Hero Section with Gradient Background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3730A3] via-[#4F46E5] to-[#6366F1] p-6 sm:p-8">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{university.name}</h2>
                    <p className="text-indigo-100 text-sm sm:text-base">{university.shortName} • Est. {university.establishedYear}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {university.recognition?.worldRank && (
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <Medal className="h-5 w-5 text-yellow-300" />
                        <span className="text-white font-semibold">World Rank #{university.recognition.worldRank}</span>
                      </div>
                    )}
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {university.type?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Stats Section - Glassmorphism Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Calendar, value: university.establishedYear, label: "Established", color: "from-orange-400 to-pink-500" },
                { icon: Globe, value: loc?.country, label: "Country", color: "from-blue-400 to-cyan-500" },
                { icon: GraduationCap, value: a?.programs?.length || 0, label: "Programs", color: "from-green-400 to-emerald-500" },
                { icon: Users, value: university.studentDemographics?.totalStudents?.toLocaleString() || "—", label: "Students", color: "from-purple-400 to-violet-500" },
                { icon: Medal, value: university.recognition?.worldRank ? `#${university.recognition.worldRank}` : "—", label: "World Rank", color: "from-yellow-400 to-amber-500" },
                { icon: Banknote, value: university.fees?.currency || "₹", label: "Currency", color: "from-rose-400 to-red-500" },
              ].map((stat, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold text-slate-900 truncate">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Content Column - 8 cols */}
              <div className="lg:col-span-8 space-y-6">
                {/* About Section - Feature Card */}
                {university.content?.longDescription && (
                  <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-bold">About {university.shortName}</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-600 leading-relaxed">{university.content.longDescription}</p>
                        {university.content.shortDescription && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-xl border-l-4 border-indigo-500">
                            <p className="text-sm text-slate-700 italic">{university.content.shortDescription}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Programs - Interactive Cards */}
                {a?.programs && a.programs.length > 0 && (
                  <Card className="border-0 shadow-lg shadow-slate-200/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">Programs Offered</h3>
                            <p className="text-sm text-slate-500">{a.programs.length} programs available</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {a.programs.map((prog: any, i: number) => {
                          const program = typeof prog === 'string' ? { name: prog } : prog;
                          return (
                            <div key={i} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full" />
                              <div className="relative">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                                      {i + 1}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{program.name}</p>
                                      <p className="text-xs text-slate-500">{program.duration || a.duration}</p>
                                    </div>
                                  </div>
                                  {program.totalSeats > 0 && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                                      {program.totalSeats} seats
                                    </span>
                                  )}
                                </div>
                                {program.annualTuition > 0 && (
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Banknote className="h-4 w-4 text-slate-400" />
                                    <span>{university.fees?.currency} {program.annualTuition?.toLocaleString()}/year</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recognition - Premium Card */}
                {university.recognition && (
                  <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                          <Medal className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Recognition & Accreditations</h3>
                          <p className="text-sm text-slate-500">Approved by leading medical bodies</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {university.recognition.bodies?.map((body: string) => (
                          <span key={body} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-emerald-700 text-sm font-semibold shadow-sm border border-emerald-100">
                            <CheckCircle2 className="h-4 w-4" />
                            {body}
                          </span>
                        ))}
                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border ${university.recognition.ecfmgStatus === 'APPROVED' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                          ECFMG {university.recognition.ecfmgStatus}
                        </span>
                        {university.recognition.nbaAccredited && (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-emerald-700 text-sm font-semibold shadow-sm border border-emerald-100">
                            <CheckCircle2 className="h-4 w-4" />
                            NBA Accredited
                          </span>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-5 text-white">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full" />
                          <Award className="h-8 w-8 mb-2 opacity-80" />
                          <p className="text-3xl font-bold">#{university.recognition.worldRank || "—"}</p>
                          <p className="text-sm opacity-80">World Ranking</p>
                          {university.recognition.worldRankingSource && (
                            <p className="text-xs opacity-60 mt-1">{university.recognition.worldRankingSource}</p>
                          )}
                        </div>
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 p-5 text-white">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full" />
                          <TrendingUp className="h-8 w-8 mb-2 opacity-80" />
                          <p className="text-3xl font-bold">#{university.recognition.nationalRank || "—"}</p>
                          <p className="text-sm opacity-80">National Ranking</p>
                          {university.recognition.nationalRankingSource && (
                            <p className="text-xs opacity-60 mt-1">{university.recognition.nationalRankingSource}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Fee Overview - Modern Card */}
                {university.fees && (
                  <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                              <Banknote className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">Fee Structure</h3>
                              <p className="text-sm opacity-80">Affordable education with scholarships</p>
                            </div>
                          </div>
                          {university.fees.scholarshipAvailable && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                              <CheckCircle2 className="h-3 w-3" />
                              Scholarships Available
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { label: "Tuition/Year", value: university.fees.tuitionAnnual, icon: BookOpen },
                            { label: "Hostel/Year", value: university.fees.hostelAnnual, icon: Bed },
                            { label: "Total Program", value: university.fees.totalProgram, icon: GraduationCap, highlight: true },
                            { label: "Registration", value: university.fees.registration, icon: FileText },
                          ].map((fee, i) => (
                            <div key={i} className={`text-center p-4 rounded-xl ${fee.highlight ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-50 border border-slate-100'}`}>
                              <fee.icon className={`h-5 w-5 mx-auto mb-2 ${fee.highlight ? 'opacity-80' : 'text-slate-400'}`} />
                              <p className={`text-lg font-bold ${fee.highlight ? '' : 'text-slate-900'}`}>
                                {university.fees?.currency} {fee.value?.toLocaleString() || "—"}
                              </p>
                              <p className={`text-xs ${fee.highlight ? 'opacity-80' : 'text-slate-500'}`}>{fee.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar Column - 4 cols */}
              <div className="lg:col-span-4 space-y-6">
                {/* Contact Info - Elevated Card */}
                <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Info
                    </h3>
                  </div>
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      {contact?.email && (
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors group">
                          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">Email</p>
                            <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">{contact.email}</p>
                          </div>
                        </a>
                      )}
                      {contact?.phone && (
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-emerald-50 transition-colors group">
                          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                            <Phone className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">Phone</p>
                            <p className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors">{contact.phone}</p>
                          </div>
                        </a>
                      )}
                      {university.website && (
                        <a href={university.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-purple-50 transition-colors group">
                          <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <Globe className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">Website</p>
                            <p className="text-sm font-medium text-slate-900 group-hover:text-purple-600 transition-colors">Visit Website</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-purple-500" />
                        </a>
                      )}
                      {contact?.admissionOfficeHours && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-500">Office Hours</p>
                            <p className="text-sm font-medium text-slate-900">{contact.admissionOfficeHours}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Location - Map Card */}
                {loc && (
                  <Card className="border-0 shadow-lg shadow-slate-200/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                      <h3 className="text-white font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Location
                      </h3>
                    </div>
                    <CardContent className="p-5">
                      <div className="relative">
                        {/* Map Placeholder */}
                        <div className="h-32 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center mb-4">
                          <div className="text-center">
                            <MapPin className="h-8 w-8 text-green-500 mx-auto mb-1" />
                            <span className="text-xs text-green-600 font-medium">{loc.city}, {loc.country}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span className="font-medium text-slate-900">{loc.city}, {loc.state}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{loc.country}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">{loc.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Student Demographics */}
                {university.studentDemographics && (
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="p-5">
                      <SectionHeading icon={Users} title="Student Body" />
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#6B6B6B]">Total</span>
                          <span className="font-semibold text-[#111]">{university.studentDemographics.totalStudents?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#6B6B6B]">Local</span>
                          <span className="font-semibold text-[#111]">{university.studentDemographics.localStudents?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#6B6B6B]">International</span>
                          <span className="font-semibold text-[#111]">{university.studentDemographics.foreignStudents?.toLocaleString()}</span>
                        </div>
                        {university.studentDemographics.foreignByCountry && university.studentDemographics.foreignByCountry.length > 0 && (
                          <div className="pt-2 border-t border-[#ECEAE6]">
                            <p className="text-xs text-[#9CA3AF] mb-2">Top Countries</p>
                            <div className="flex flex-wrap gap-1">
                              {university.studentDemographics.foreignByCountry.slice(0, 3).map((f: any) => (
                                <span key={f.country} className="text-xs bg-[#F5F4F2] px-2 py-1 rounded text-[#6B6B6B]">
                                  {f.country}: {f.count}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Social Links */}
                {university.socialLinks && Object.keys(university.socialLinks).length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="p-5">
                      <SectionHeading icon={Globe} title="Social Media" />
                      <div className="flex flex-wrap gap-2">
                        {university.socialLinks.facebook && (
                          <a href={university.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#F5F4F2] hover:bg-[#ECEAE6] transition-colors">
                            <span className="text-xs font-medium text-[#6B6B6B]">Facebook</span>
                          </a>
                        )}
                        {university.socialLinks.instagram && (
                          <a href={university.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#F5F4F2] hover:bg-[#ECEAE6] transition-colors">
                            <span className="text-xs font-medium text-[#6B6B6B]">Instagram</span>
                          </a>
                        )}
                        {university.socialLinks.youtube && (
                          <a href={university.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#F5F4F2] hover:bg-[#ECEAE6] transition-colors">
                            <span className="text-xs font-medium text-[#6B6B6B]">YouTube</span>
                          </a>
                        )}
                        {university.socialLinks.linkedin && (
                          <a href={university.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#F5F4F2] hover:bg-[#ECEAE6] transition-colors">
                            <span className="text-xs font-medium text-[#6B6B6B]">LinkedIn</span>
                          </a>
                        )}
                        {university.socialLinks.twitter && (
                          <a href={university.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#F5F4F2] hover:bg-[#ECEAE6] transition-colors">
                            <span className="text-xs font-medium text-[#6B6B6B]">Twitter</span>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Admission Quick Info */}
                {adm && (
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="p-5">
                      <SectionHeading icon={ClipboardList} title="Admission" />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#6B6B6B]">Exams:</span>
                          <span className="text-[#111] font-medium">{adm.entranceExams?.join(", ") || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B6B6B]">Age:</span>
                          <span className="text-[#111] font-medium">{adm.ageCriteria || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B6B6B]">Fee:</span>
                          <span className="text-[#111] font-medium">{university.fees?.currency || "₹"} {adm.applicationFee?.toLocaleString() || "—"}</span>
                        </div>
                        {adm.applicationDeadline && (
                          <div className="flex justify-between">
                            <span className="text-[#6B6B6B]">Deadline:</span>
                            <span className="text-[#111] font-medium">{new Date(adm.applicationDeadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Infrastructure - Pro Max Design */}
            {infra && (
              <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Building2 className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">World-Class Infrastructure</h3>
                      <p className="text-slate-300 text-sm">Modern facilities for comprehensive learning</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    {[
                      { icon: Stethoscope, value: infra.hospitalBeds || "—", label: "Hospital Beds", color: "from-rose-400 to-red-500" },
                      { icon: Bed, value: infra.hostelBoys?.toLocaleString() || "—", label: "Hostel Boys", color: "from-blue-400 to-indigo-500" },
                      { icon: Heart, value: infra.hostelGirls?.toLocaleString() || "—", label: "Hostel Girls", color: "from-pink-400 to-rose-500" },
                      { icon: MapPin, value: infra.campusArea ? `${infra.campusArea} acres` : "—", label: "Campus Area", color: "from-green-400 to-emerald-500" },
                      { icon: School, value: infra.departments?.length || "—", label: "Departments", color: "from-amber-400 to-orange-500" },
                      { icon: FlaskConical, value: infra.laboratories?.length || "—", label: "Labs", color: "from-violet-400 to-purple-500" },
                    ].map((stat, i) => (
                      <div key={i} className="group relative overflow-hidden rounded-xl bg-slate-50 border border-slate-200 p-4 hover:shadow-lg hover:shadow-slate-500/10 transition-all duration-300 hover:-translate-y-1">
                        <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />
                        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg mb-2 group-hover:scale-110 transition-transform`}>
                          <stat.icon className="h-5 w-5" />
                        </div>
                        <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Facilities */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Campus Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {infra.cafeteria && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow">
                          <Coffee className="h-4 w-4" /> Cafeteria
                        </span>
                      )}
                      {infra.wifiCampus && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow">
                          <Wifi className="h-4 w-4" /> WiFi Campus
                        </span>
                      )}
                      {infra.transportation && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-shadow">
                          <Bus className="h-4 w-4" /> Transport
                        </span>
                      )}
                    </div>
                    {infra.facilities && infra.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {infra.facilities.map((facility: string, i: number) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-200 transition-colors">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            {facility}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Departments & Labs Lists */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
                    {infra.departments && infra.departments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <School className="h-4 w-4 text-indigo-500" /> Departments
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {infra.departments.map((dept: string, i: number) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {infra.laboratories && infra.laboratories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <FlaskConical className="h-4 w-4 text-violet-500" /> Laboratories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {infra.laboratories.map((lab: string, i: number) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium border border-violet-100">
                              {lab}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fee Structure - Pro Max Design */}
            {university.fees && (
              <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Banknote className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Fee Structure</h3>
                        <p className="text-emerald-50 text-sm">Transparent pricing & flexible payment options</p>
                      </div>
                    </div>
                    {university.fees.scholarshipAvailable && (
                      <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                        <Medal className="h-5 w-5 text-yellow-300" />
                        <span className="font-semibold">Scholarships Available</span>
                      </div>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Fee Breakdown */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <ScrollText className="h-4 w-4 text-emerald-500" /> Annual Fee Breakdown
                      </h4>
                      <div className="space-y-3">
                        {[
                          { label: "Tuition Fee", value: university.fees.tuitionAnnual, icon: BookOpen, color: "blue" },
                          { label: "Hostel Fee", value: university.fees.hostelAnnual, icon: Bed, color: "indigo" },
                          { label: "Registration", value: university.fees.registration, icon: FileText, color: "amber" },
                          { label: "Examination", value: university.fees.examination, icon: ClipboardList, color: "rose" },
                          { label: "Library", value: university.fees.library, icon: Library, color: "violet" },
                        ].map((fee, i) => (
                          <div key={i} className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`h-9 w-9 rounded-lg bg-${fee.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <fee.icon className={`h-4 w-4 text-${fee.color}-600`} />
                              </div>
                              <span className="text-sm text-slate-600 font-medium">{fee.label}</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                              {university.fees?.currency} {fee.value?.toLocaleString() || "—"}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                              <GraduationCap className="h-5 w-5" />
                            </div>
                            <span className="font-semibold">Total Program Fee</span>
                          </div>
                          <span className="text-xl font-bold">
                            {university.fees?.currency} {university.fees.totalProgram?.toLocaleString() || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Other Fees & Policies */}
                    <div className="space-y-6">
                      {university.fees.otherFees && Object.keys(university.fees.otherFees).length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-amber-500" /> Additional Fees
                          </h4>
                          <div className="space-y-2 p-4 rounded-xl bg-amber-50 border border-amber-100">
                            {Object.entries(university.fees.otherFees).map(([name, amount], i) => (
                              <div key={i} className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0">
                                <span className="text-sm text-amber-800">{name}</span>
                                <span className="text-sm font-semibold text-amber-900">
                                  {university.fees?.currency} {(amount as number).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Policies */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-500" /> Policies
                        </h4>
                        <div className="space-y-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-blue-600 font-medium uppercase">Payment Schedule</p>
                              <p className="text-sm text-blue-900">{university.fees.paymentSchedule || "Not specified"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <RefreshCw className="h-4 w-4 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-xs text-blue-600 font-medium uppercase">Refund Policy</p>
                              <p className="text-sm text-blue-900">{university.fees.refundPolicy || "Not specified"}</p>
                            </div>
                          </div>
                          {university.fees.feeHikePolicy && (
                            <div className="flex items-start gap-3">
                              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                              <div>
                                <p className="text-xs text-blue-600 font-medium uppercase">Fee Hike Policy</p>
                                <p className="text-sm text-blue-900">{university.fees.feeHikePolicy}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Scholarship Details */}
                      {university.fees.scholarshipAvailable && university.fees.scholarshipDetails && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-200">
                          <div className="flex items-start gap-3">
                            <Medal className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-amber-900">Scholarship Information</p>
                              <p className="text-sm text-amber-700 mt-1">{university.fees.scholarshipDetails}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admission Requirements - Pro Max Design */}
            {adm && (
              <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 p-6 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <ClipboardList className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Admission Requirements</h3>
                        <p className="text-violet-50 text-sm">Program-wise eligibility criteria</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Age: {adm.ageCriteria || "—"}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  {/* Global Admission Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                      <p className="text-xs text-violet-600 font-medium uppercase mb-1">Entrance Exams</p>
                      <p className="text-lg font-bold text-violet-900">{adm.entranceExams?.join(", ") || "—"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-fuchsia-50 border border-fuchsia-100">
                      <p className="text-xs text-fuchsia-600 font-medium uppercase mb-1">Application Fee</p>
                      <p className="text-lg font-bold text-fuchsia-900">
                        {university.fees?.currency} {adm.applicationFee?.toLocaleString() || "—"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <p className="text-xs text-purple-600 font-medium uppercase mb-1">Selection Process</p>
                      <p className="text-sm font-semibold text-purple-900">{adm.selectionProcess || "—"}</p>
                    </div>
                  </div>

                  {/* Program-wise Cards */}
                  {adm.programEligibility && adm.programEligibility.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">By Program</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {adm.programEligibility.map((prog: any, i: number) => {
                          const programName = a?.programs?.[i]?.name || `Program ${i + 1}`;
                          const programData = typeof a?.programs?.[i] === 'object' ? a?.programs?.[i] : null;
                          return (
                            <div key={i} className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                              <div className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-bold text-sm shadow-lg">
                                    {i + 1}
                                  </div>
                                  <h5 className="font-bold text-slate-900">{programName}</h5>
                                </div>
                                <div className="space-y-3">
                                  <div className="p-3 rounded-lg bg-slate-50">
                                    <p className="text-xs text-slate-500 uppercase font-medium mb-1">Minimum Marks</p>
                                    <p className="text-lg font-bold text-violet-600">{prog.minimumMarks || "—"}</p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-slate-50">
                                    <p className="text-xs text-slate-500 uppercase font-medium mb-1">Eligibility</p>
                                    <p className="text-sm text-slate-700">{prog.eligibility || "—"}</p>
                                  </div>
                                  {programData?.feeBreakdown && programData.feeBreakdown.length > 0 && (
                                    <div className="pt-3 border-t border-slate-100">
                                      <p className="text-xs text-slate-500 uppercase font-medium mb-2">Fee Breakdown</p>
                                      <div className="space-y-1.5">
                                        {programData.feeBreakdown.map((fee: any, fi: number) => (
                                          <div key={fi} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600">{fee.name}</span>
                                            <span className="font-semibold text-slate-900">
                                              {university.fees?.currency} {fee.amount?.toLocaleString()}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Legacy Eligibility */}
                  {adm.eligibility && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-xs text-slate-500 uppercase font-medium mb-1">General Eligibility</p>
                      <p className="text-sm text-slate-700">{adm.eligibility}</p>
                    </div>
                  )}

                  {/* Required Documents */}
                  {adm.requiredDocuments && adm.requiredDocuments.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Required Documents</h4>
                      <div className="flex flex-wrap gap-2">
                        {adm.requiredDocuments.map((doc: string, i: number) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-sm font-medium border border-violet-100">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Application Deadline */}
                  {adm.applicationDeadline && (
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-600 font-medium uppercase">Application Deadline</p>
                          <p className="text-lg font-bold text-amber-900">
                            {new Date(adm.applicationDeadline).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-amber-600">Status</p>
                        <p className="text-sm font-semibold text-amber-900">
                          {new Date(adm.applicationDeadline) > new Date() ? 'Open' : 'Closed'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Subject Rankings */}
            {university.recognition?.subjectRankings && Object.keys(university.recognition.subjectRankings).length > 0 && (
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="p-5">
                  <SectionHeading icon={BookOpen} title="Subject Rankings" />
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(university.recognition.subjectRankings).map(([subject, rank]) => (
                      <div key={subject} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3730A3]/10 text-[#3730A3]">
                        <span className="font-semibold">#{rank}</span>
                        <span className="text-sm">{subject}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Support Services */}
            {supp && (
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="p-5">
                  <SectionHeading icon={Heart} title="Student Support Services" />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Placement & Career */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-[#111] flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-[#3730A3]" />
                        Placement & Career
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 rounded-lg bg-[#F5F4F2]">
                          <p className="text-xl font-bold text-[#111]">{supp.placementRate ? `${supp.placementRate}%` : "—"}</p>
                          <p className="text-xs text-[#6B6B6B]">Placement Rate</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-[#F5F4F2]">
                          <p className="text-lg font-bold text-[#111]">{supp.averagePackage ? `₹${(supp.averagePackage / 100000).toFixed(1)}L` : "—"}</p>
                          <p className="text-xs text-[#6B6B6B]">Avg Package</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {supp.careerGuidance && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 className="h-3 w-3" /> Career Guidance
                          </span>
                        )}
                        {supp.counselingServices && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                            <CheckCircle2 className="h-3 w-3" /> Counseling
                          </span>
                        )}
                      </div>
                    </div>

                    {/* International Support */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-[#111] flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#3730A3]" />
                        International Support
                      </h4>
                      <div className="space-y-2">
                        {supp.visaAssistance && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-[#111]">Visa Assistance</span>
                          </div>
                        )}
                        {supp.internationalStudentSupport && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-[#111]">International Student Support</span>
                          </div>
                        )}
                        {supp.alumniNetwork && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-[#111]">Alumni Network</span>
                            {supp.alumniCount && (
                              <span className="text-xs text-[#9CA3AF]">({supp.alumniCount.toLocaleString()} members)</span>
                            )}
                          </div>
                        )}
                      </div>
                      {supp.languageSupport && supp.languageSupport.length > 0 && (
                        <div>
                          <p className="text-xs text-[#9CA3AF] mb-1">Language Support</p>
                          <div className="flex flex-wrap gap-1">
                            {supp.languageSupport.map((lang: string) => (
                              <span key={lang} className="px-2 py-0.5 rounded bg-[#F5F4F2] text-xs text-[#6B6B6B]">{lang}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Top Recruiters */}
                    {supp.topRecruiters && supp.topRecruiters.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-[#111] flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#3730A3]" />
                          Top Recruiters
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {supp.topRecruiters.map((recruiter: string, i: number) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-[#F5F4F2] text-xs font-medium text-[#6B6B6B] border border-[#ECEAE6]">
                              {recruiter}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Section */}
            {university.content && (
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="p-5">
                  <SectionHeading icon={FileText} title="Content & Media" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Short Description & Highlights */}
                    <div className="space-y-4">
                      {university.content.shortDescription && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#111] mb-2">Short Description</h4>
                          <p className="text-sm text-[#6B6B6B] leading-relaxed">{university.content.shortDescription}</p>
                        </div>
                      )}
                      {university.content.whyChooseUs && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#111] mb-2">Why Choose Us</h4>
                          <p className="text-sm text-[#6B6B6B] leading-relaxed">{university.content.whyChooseUs}</p>
                        </div>
                      )}
                      {university.content.highlights && university.content.highlights.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#111] mb-2">Highlights</h4>
                          <div className="flex flex-wrap gap-2">
                            {university.content.highlights.map((highlight: string, i: number) => (
                              <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#3730A3]/10 text-[#3730A3] text-xs font-medium">
                                <CheckCircle2 className="h-3 w-3" />
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Virtual Tours */}
                    <div className="space-y-4">
                      {(university.content.videoTour || university.content.virtualTour) && (
                        <div>
                          <h4 className="text-sm font-semibold text-[#111] mb-2">Virtual Tours</h4>
                          <div className="space-y-2">
                            {university.content.videoTour && (
                              <a
                                href={university.content.videoTour}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F4F2] hover:bg-[#ECEAE6] transition-colors group"
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3730A3] text-white">
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-[#111] group-hover:text-[#3730A3]">Video Tour</p>
                                  <p className="text-xs text-[#9CA3AF]">Watch campus tour video</p>
                                </div>
                                <Globe className="h-4 w-4 text-[#9CA3AF]" />
                              </a>
                            )}
                            {university.content.virtualTour && (
                              <a
                                href={university.content.virtualTour}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F4F2] hover:bg-[#ECEAE6] transition-colors group"
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-[#111] group-hover:text-emerald-600">Virtual Tour</p>
                                  <p className="text-xs text-[#9CA3AF]">Explore campus in 360°</p>
                                </div>
                                <Globe className="h-4 w-4 text-[#9CA3AF]" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admin & Bank Details */}
            {university.admin && (
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="p-5">
                  <SectionHeading icon={Building2} title="Administration & Banking" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Point of Contact */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-[#111] flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#3730A3]" />
                        Point of Contact
                      </h4>
                      <div className="space-y-3 p-4 rounded-lg bg-[#F5F4F2]">
                        <div>
                          <p className="text-xs text-[#9CA3AF]">Name</p>
                          <p className="text-sm font-medium text-[#111]">{university.admin.pocName || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF]">Designation</p>
                          <p className="text-sm text-[#111]">{university.admin.pocDesignation || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF]">Email</p>
                          <a href={`mailto:${university.admin.pocEmail}`} className="text-sm text-[#3730A3] hover:underline">
                            {university.admin.pocEmail || "—"}
                          </a>
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF]">Phone</p>
                          <a href={`tel:${university.admin.phoneCountryCode}${university.admin.phoneNumber}`} className="text-sm text-[#3730A3] hover:underline">
                            {university.admin.phoneCountryCode} {university.admin.phoneNumber}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-[#111] flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-[#3730A3]" />
                        Bank Details
                      </h4>
                      {university.admin.bankCountry === "IN" ? (
                        <div className="space-y-2 p-4 rounded-lg bg-[#F5F4F2]">
                          <div className="flex justify-between">
                            <span className="text-xs text-[#9CA3AF]">Account Name</span>
                            <span className="text-sm text-[#111]">{university.admin.accountName || "—"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-[#9CA3AF]">Bank</span>
                            <span className="text-sm text-[#111]">{university.admin.bankName || "—"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-[#9CA3AF]">Branch</span>
                            <span className="text-sm text-[#111]">{university.admin.bankBranch || "—"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-[#9CA3AF]">IFSC</span>
                            <span className="text-sm font-mono text-[#111]">{university.admin.ifscCode || "—"}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-[#ECEAE6]">
                            <span className="text-xs text-[#9CA3AF]">Commission</span>
                            <span className="text-sm font-semibold text-[#111]">{university.admin.commission}%</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 p-4 rounded-lg bg-[#F5F4F2]">
                          <div className="flex justify-between">
                            <span className="text-xs text-[#9CA3AF]">Country</span>
                            <span className="text-sm text-[#111]">{university.admin.bankCountry || "—"}</span>
                          </div>
                          {university.admin.bankDetails && Object.entries(university.admin.bankDetails).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-xs text-[#9CA3AF]">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="text-sm font-mono text-[#111]">{String(value) || "—"}</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-2 border-t border-[#ECEAE6]">
                            <span className="text-xs text-[#9CA3AF]">Commission</span>
                            <span className="text-sm font-semibold text-[#111]">{university.admin.commission}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {university.content?.gallery && university.content.gallery.length > 0 && (
              <Card size="sm" className="border-[#ECEAE6]">
                <CardContent className="p-5">
                  <SectionHeading icon={ImageIcon} title="Gallery" />
                  <GalleryGrid images={university.content.gallery} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ===== Academic Tab ===== */}
          <TabsContent value="academic" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            {a ? (
              <>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Programs & Duration */}
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading icon={BookOpen} title="Programs & Duration" />
                      <InfoRow
                        icon={GraduationCap}
                        label="Programs"
                        value={<BadgeList items={a.programs} />}
                      />
                      <InfoRow icon={Clock} label="Duration" value={a.duration} />
                      <InfoRow icon={Globe} label="Medium" value={a.medium} />
                      <InfoRow
                        icon={Calendar}
                        label="Intake Months"
                        value={<BadgeList items={a.intakeMonths} />}
                      />
                    </CardContent>
                  </Card>

                  {/* Seat Distribution */}
                  {a.programs?.length > 0 && (
                    <Card size="sm" className="border-[#ECEAE6]">
                      <CardContent className="space-y-3 p-4 sm:p-5">
                        <SectionHeading icon={Users} title="Seat Distribution" />
                        <div className="divide-y divide-[#ECEAE6]">
                          {a.programs.map((p: any, i: number) => {
                            const name = typeof p === "string" ? p : p.name;
                            const total = typeof p === "string" ? 0 : (p.totalSeats ?? 0);
                            const govt = typeof p === "string" ? 0 : (p.governmentSeats ?? 0);
                            const mgmt = typeof p === "string" ? 0 : (p.managementSeats ?? 0);
                            const nri = typeof p === "string" ? 0 : (p.nriSeats ?? 0);
                            return (
                              <div key={name || i} className="py-2 first:pt-0 last:pb-0">
                                <p className="text-xs font-medium text-[#292524] mb-1.5">{name}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B6B6B]">
                                  <span>Total: <strong>{total}</strong></span>
                                  <span>Govt: <strong>{govt}</strong></span>
                                  <span>Mgmt: <strong>{mgmt}</strong></span>
                                  <span>NRI: <strong>{nri}</strong></span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Student Demographics */}
                  {university.studentDemographics && (
                    <Card size="sm" className="border-[#ECEAE6]">
                      <CardContent className="space-y-3 p-4 sm:p-5">
                        <SectionHeading icon={Users} title="Student Demographics" />
                        <InfoRow icon={Users} label="Total Students" value={university.studentDemographics.totalStudents?.toLocaleString() ?? "—"} />
                        <InfoRow icon={Users} label="Local" value={university.studentDemographics.localStudents?.toLocaleString() ?? "—"} />
                        <InfoRow icon={Globe} label="Foreign" value={university.studentDemographics.foreignStudents?.toLocaleString() ?? "—"} />
                        {university.studentDemographics?.foreignByCountry && university.studentDemographics.foreignByCountry.length > 0 && (
                          <div className="pt-1">
                            <p className="text-xs text-[#777] mb-1.5">By Country:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {university.studentDemographics?.foreignByCountry?.map((f: any) => (
                                <span key={f.country} className="inline-flex items-center gap-1 rounded-full bg-[#F0F0EE] px-2.5 py-0.5 text-xs font-medium text-[#555]">
                                  {f.country}: {f.count.toLocaleString()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Specializations */}
                  {a.specializations?.length > 0 && (
                    <Card size="sm" className="border-[#ECEAE6]">
                      <CardContent className="space-y-3 p-4 sm:p-5">
                        <SectionHeading
                          icon={Medal}
                          title="Specializations"
                        />
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {a.specializations.map((spec) => (
                            <div
                              key={spec}
                              className="flex items-center gap-2 rounded-md border border-[#ECEAE6] bg-[#FAFAF9] px-3 py-2"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                              <span className="text-sm text-[#111]">{spec}</span>
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
                <p className="text-sm text-[#9CA3AF]">No academic details available</p>
              </div>
            )}
          </TabsContent>

          {/* ===== Infrastructure Tab ===== */}
          <TabsContent value="infrastructure" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            {infra ? (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
                  <InfraStat icon={Bed} label="Hostel (Boys)" value={infra.hostelBoys} />
                  <InfraStat icon={Bed} label="Hostel (Girls)" value={infra.hostelGirls} />
                  <InfraStat icon={MapPin} label="Campus (acres)" value={infra.campusArea ?? 0} />
                </div>

                {/* Departments */}
                {infra.departments?.length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="p-4 sm:p-5">
                      <SectionHeading icon={School} title="Departments" />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {infra.departments.map((d: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs font-normal bg-[#F5F4F2] text-[#6B6B6B] border-0">
                            {d}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Laboratories */}
                {infra.laboratories?.length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="p-4 sm:p-5">
                      <SectionHeading icon={FlaskConical} title="Laboratories" />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {infra.laboratories.map((l: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs font-normal bg-[#F5F4F2] text-[#6B6B6B] border-0">
                            {l}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Facilities */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="p-4 sm:p-5">
                    <SectionHeading icon={Building2} title="Facilities" />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      <AmenityCheck icon={Library} label="Library" checked={infra.facilities?.includes("Library")} />
                      <AmenityCheck icon={FlaskConical} label="Computer Lab" checked={infra.facilities?.includes("Computer Lab")} />
                      <AmenityCheck icon={Dumbbell} label="Sports Complex" checked={infra.facilities?.includes("Sports Complex")} />
                      <AmenityCheck icon={Coffee} label="Cafeteria" checked={infra.facilities?.includes("Cafeteria") ?? infra.cafeteria} />
                      <AmenityCheck icon={Bed} label="Hostel" checked={infra.facilities?.includes("Hostel")} />
                      <AmenityCheck icon={Stethoscope} label="Hospital" checked={infra.facilities?.includes("Hospital")} />
                      <AmenityCheck icon={Wifi} label="WiFi Campus" checked={infra.wifiCampus} />
                      <AmenityCheck icon={Bus} label="Transport" checked={infra.transportation} />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
                <p className="text-sm text-[#9CA3AF]">No infrastructure details available</p>
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
                      label="Minimum Marks (Legacy)"
                      value={adm.minimumMarks?.trim() ? adm.minimumMarks : "Not specified"}
                    />
                    <InfoRow icon={Calendar} label="Age Criteria" value={adm.ageCriteria} />
                    <InfoRow icon={FileText} label="Eligibility (Legacy)" value={adm.eligibility?.trim() ? adm.eligibility : "Not specified"} />
                  </CardContent>
                </Card>

                {/* Documents & Fees */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={ScrollText} title="Documents & Fees" />
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
                              adm.applicationDeadline
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

                {/* Program-wise Eligibility */}
                {adm.programEligibility && adm.programEligibility.length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6] md:col-span-2">
                    <CardContent className="p-4 sm:p-5">
                      <SectionHeading icon={Medal} title="Eligibility by Program" />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {adm.programEligibility?.map((prog: any, i: number) => (
                          <div key={i} className="rounded-lg border border-[#ECEAE6] bg-[#FAFAF9] p-4">
                            <p className="text-xs font-medium text-[#9CA3AF] mb-1">Program {i + 1}</p>
                            <p className="text-sm font-semibold text-[#111] mb-3">
                              {university.academic?.programs?.[i]?.name || `Program ${i + 1}`}
                            </p>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-[#9CA3AF]">Minimum Marks</p>
                                <p className="text-sm font-medium text-[#111]">{prog.minimumMarks || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#9CA3AF]">Eligibility</p>
                                <p className="text-sm text-[#111]">{prog.eligibility || "—"}</p>
                              </div>
                            </div>
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
          <TabsContent value="support" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
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
                      <AmenityCheck icon={VisaIcon} label="Visa Assistance" checked={supp.visaAssistance} />
                      <AmenityCheck icon={MessageSquare} label="Counseling" checked={supp.counselingServices} />
                      <AmenityCheck icon={Briefcase} label="Career Guidance" checked={supp.careerGuidance} />
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

          {/* ===== Fees Tab ===== */}
          <TabsContent value="fees" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            {university.fees ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Fee Overview */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={Banknote} title="Fee Overview" />
                    <InfoRow icon={Banknote} label="Currency" value={university.fees.currency} />
                    <InfoRow icon={ScrollText} label="Tuition (Annual)" value={`${university.fees.currency} ${university.fees.tuitionAnnual?.toLocaleString() ?? "—"}`} />
                    <InfoRow icon={ScrollText} label="Total Program Fee" value={`${university.fees.currency} ${university.fees.totalProgram?.toLocaleString() ?? "—"}`} />
                    <InfoRow icon={Bed} label="Hostel (Annual)" value={`${university.fees.currency} ${university.fees.hostelAnnual?.toLocaleString() ?? "—"}`} />
                    <InfoRow icon={ScrollText} label="Registration" value={`${university.fees.currency} ${university.fees.registration?.toLocaleString() ?? "—"}`} />
                    <InfoRow icon={ScrollText} label="Examination" value={`${university.fees.currency} ${university.fees.examination?.toLocaleString() ?? "—"}`} />
                    <InfoRow icon={Library} label="Library" value={`${university.fees.currency} ${university.fees.library?.toLocaleString() ?? "—"}`} />
                  </CardContent>
                </Card>

                {/* Payment & Policies */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={ClipboardList} title="Payment & Policies" />
                    <InfoRow icon={Calendar} label="Payment Schedule" value={university.fees.paymentSchedule} />
                    <InfoRow icon={ScrollText} label="Refund Policy" value={university.fees.refundPolicy} />
                    {university.fees.feeHikePolicy && (
                      <InfoRow icon={TrendingUp} label="Fee Hike Policy" value={university.fees.feeHikePolicy} />
                    )}
                  </CardContent>
                </Card>

                {/* Scholarships */}
                <Card size="sm" className="border-[#ECEAE6] md:col-span-2">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={Medal} title="Scholarships" />
                    <div className="flex items-center gap-2">
                      {university.fees && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${university.fees.scholarshipAvailable ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                          {university.fees.scholarshipAvailable ? "Available" : "Not Available"}
                        </span>
                      )}
                    </div>
                    {university.fees?.scholarshipDetails && (
                      <p className="text-sm text-[#6B6B6B] mt-2">{university.fees.scholarshipDetails}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Other Fees */}
                {university.fees.otherFees && Object.keys(university.fees.otherFees).length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6] md:col-span-2">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading icon={ScrollText} title="Other Fees" />
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {Object.entries(university.fees.otherFees).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between rounded-md border border-[#ECEAE6] bg-[#FAFAF9] px-3 py-2">
                            <span className="text-sm text-[#6B6B6B]">{key}</span>
                            <span className="text-sm font-medium text-[#111]">{university.fees.currency} {Number(value).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
                <p className="text-sm text-[#9CA3AF]">No fee details available</p>
              </div>
            )}
          </TabsContent>

          {/* ===== Recognition Tab ===== */}
          <TabsContent value="recognition" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            {university.recognition ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Accreditations */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={Medal} title="Accreditations & Bodies" />
                    <InfoRow icon={CheckCircle2} label="Recognized Bodies" value={<BadgeList items={university.recognition.bodies} />} />
                    <InfoRow icon={Medal} label="ECFMG Status" value={university.recognition.ecfmgStatus} />
                    {university.recognition.naacGrade && (
                      <InfoRow icon={Medal} label="NAAC Grade" value={university.recognition.naacGrade} />
                    )}
                    <InfoRow icon={CheckCircle2} label="NBA Accredited" value={university.recognition.nbaAccredited ? "Yes" : "No"} />
                    <InfoRow icon={CheckCircle2} label="Accreditations" value={<BadgeList items={university.recognition.accreditations} />} />
                  </CardContent>
                </Card>

                {/* Rankings */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={TrendingUp} title="Rankings" />
                    <InfoRow icon={Globe} label="World Rank" value={university.recognition.worldRank ?? "—"} />
                    <InfoRow icon={MapPin} label="National Rank" value={university.recognition.nationalRank ?? "—"} />
                    {university.recognition.rankingSource && (
                      <InfoRow icon={Globe} label="Ranking Source" value={university.recognition.rankingSource} />
                    )}
                    {university.recognition.worldRankingSource && (
                      <InfoRow icon={Globe} label="World Ranking Source" value={university.recognition.worldRankingSource} />
                    )}
                    {university.recognition.nationalRankingSource && (
                      <InfoRow icon={MapPin} label="National Ranking Source" value={university.recognition.nationalRankingSource} />
                    )}
                  </CardContent>
                </Card>

                {/* Subject Rankings */}
                {university.recognition.subjectRankings && Object.keys(university.recognition.subjectRankings).length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6] md:col-span-2">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading icon={BookOpen} title="Subject Rankings" />
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {Object.entries(university.recognition.subjectRankings).map(([subject, ranking]) => (
                          <div key={subject} className="flex items-center justify-between rounded-md border border-[#ECEAE6] bg-[#FAFAF9] px-3 py-2">
                            <span className="text-sm text-[#6B6B6B]">{subject}</span>
                            <span className="text-sm font-medium text-[#111]">#{ranking}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
                <p className="text-sm text-[#9CA3AF]">No recognition details available</p>
              </div>
            )}
          </TabsContent>

          {/* ===== Content Tab ===== */}
          <TabsContent value="content" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            {university.content ? (
              <div className="grid grid-cols-1 gap-5">
                {/* Descriptions */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-4 p-4 sm:p-5">
                    <SectionHeading icon={FileText} title="Descriptions" />
                    <div>
                      <p className="text-xs text-[#9CA3AF] mb-1">Short Description</p>
                      <p className="text-sm text-[#111]">{university.content.shortDescription}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#9CA3AF] mb-1">Long Description</p>
                      <p className="text-sm text-[#111] whitespace-pre-wrap">{university.content.longDescription}</p>
                    </div>
                    {university.content.whyChooseUs && (
                      <div>
                        <p className="text-xs text-[#9CA3AF] mb-1">Why Choose Us</p>
                        <p className="text-sm text-[#111]">{university.content.whyChooseUs}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Highlights */}
                {university.content.highlights?.length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="p-4 sm:p-5">
                      <SectionHeading icon={Medal} title="Highlights" />
                      <div className="flex flex-wrap gap-2">
                        {university.content.highlights.map((highlight: string, i: number) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-[#F0F0EE] px-2.5 py-1 text-xs font-medium text-[#555]">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Gallery */}
                {university.content.gallery?.length > 0 && (
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="p-4 sm:p-5">
                      <SectionHeading icon={ImageIcon} title="Gallery" />
                      <GalleryGrid images={university.content.gallery} />
                    </CardContent>
                  </Card>
                )}

                {/* Video Tours */}
                {(university.content.videoTour || university.content.virtualTour) && (
                  <Card size="sm" className="border-[#ECEAE6]">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading icon={Globe} title="Virtual Tours" />
                      {university.content.videoTour && (
                        <InfoRow
                          icon={Globe}
                          label="Video Tour"
                          value={
                            <a href={university.content.videoTour} target="_blank" rel="noopener noreferrer" className="text-[#3730A3] hover:underline">
                              Watch Video Tour
                            </a>
                          }
                        />
                      )}
                      {university.content.virtualTour && (
                        <InfoRow
                          icon={Globe}
                          label="Virtual Tour"
                          value={
                            <a href={university.content.virtualTour} target="_blank" rel="noopener noreferrer" className="text-[#3730A3] hover:underline">
                              Explore Virtual Tour
                            </a>
                          }
                        />
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
                <p className="text-sm text-[#9CA3AF]">No content details available</p>
              </div>
            )}
          </TabsContent>

          {/* ===== Admin Tab ===== */}
          <TabsContent value="admin" className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
            {university.admin ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Point of Contact */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={Phone} title="Point of Contact" />
                    <InfoRow icon={School} label="Name" value={university.admin.pocName} />
                    <InfoRow icon={Briefcase} label="Designation" value={university.admin.pocDesignation} />
                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={
                        <a href={`mailto:${university.admin.pocEmail}`} className="text-[#3730A3] hover:underline">
                          {university.admin.pocEmail}
                        </a>
                      }
                    />
                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={`${university.admin.phoneCountryCode || "+91"} ${university.admin.phoneNumber || university.admin.pocPhone || "—"}`}
                    />
                  </CardContent>
                </Card>

                {/* Bank Details */}
                <Card size="sm" className="border-[#ECEAE6]">
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <SectionHeading icon={Banknote} title="Bank Details" />
                    <InfoRow icon={School} label="Account Name" value={university.admin.accountName || "—"} />
                    <InfoRow icon={ScrollText} label="Account Number" value={university.admin.accountNumber || "—"} />
                    <InfoRow icon={Building2} label="Bank Name" value={university.admin.bankName || "—"} />
                    <InfoRow icon={MapPin} label="Branch" value={university.admin.bankBranch || "—"} />
                    <InfoRow icon={ScrollText} label="IFSC Code" value={university.admin.ifscCode || "—"} />
                    <InfoRow icon={Banknote} label="Commission" value={`${university.admin.commission}%`} />
                    {university.admin.gstNumber && (
                      <InfoRow icon={ScrollText} label="GST Number" value={university.admin.gstNumber} />
                    )}
                    {university.admin.panNumber && (
                      <InfoRow icon={ScrollText} label="PAN Number" value={university.admin.panNumber} />
                    )}
                  </CardContent>
                </Card>

                {/* Bank Country & Additional Details */}
                {university.admin.bankCountry && (
                  <Card size="sm" className="border-[#ECEAE6] md:col-span-2">
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <SectionHeading icon={Globe} title="International Bank Details" />
                      <InfoRow icon={Globe} label="Bank Country" value={university.admin.bankCountry} />
                      {university.admin.bankDetails && Object.keys(university.admin.bankDetails).length > 0 && (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 mt-2">
                          {Object.entries(university.admin.bankDetails).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between rounded-md border border-[#ECEAE6] bg-[#FAFAF9] px-3 py-2">
                              <span className="text-sm text-[#6B6B6B]">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="text-sm font-medium text-[#111]">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
                <p className="text-sm text-[#9CA3AF]">No admin details available</p>
              </div>
            )}
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
          checked ? "bg-emerald-100 text-emerald-600" : "bg-[#F5F4F2] text-[#9CA3AF]"
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* Local SVG icon components for icons not in lucide-react */
function ImageIcon({ className }: { className?: string }) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
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
