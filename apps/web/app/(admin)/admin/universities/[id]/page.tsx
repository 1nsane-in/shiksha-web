"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useAdminUniversity,
  useUpdateUniversityStatus,
  useDeleteUniversity,
  useUpdateUniversity,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useUploadDocument,
  useDeleteDocument,
  useUploadImage,
} from "@/domains/universities";
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
  Award,
  ExternalLink,
  Building2,
  Upload,
  Plus,
  Save,
  X,
  AlertCircle,
  Settings,
  FileUp,
  DollarSign,
  Heart,
  Languages,
  TrendingUp,
  MessageSquare,
  ImageIcon,
  ChevronRight,
  Loader2,
  Dumbbell,
} from "lucide-react";
import Image from "next/image";

/* ─── Brand tokens ─── */
const theme = {
  primary: "#3730A3",
  primaryDark: "#312E81",
  primaryLight: "#6366F1",
  primaryMuted: "rgba(55, 48, 163, 0.08)",
  primaryGlow: "rgba(55, 48, 163, 0.12)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  ink: "#111111",
  inkMuted: "#6B6B6B",
  inkSubtle: "#9CA3AF",
  hairline: "#ECEAE6",
  hairlineSoft: "#F5F4F2",
  cardRadius: 12,
  btnRadius: 8,
};

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

/* ─── Shared sub-components ─── */

function StatPill({ icon: Icon, label, value }: { icon: IconComponent; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-[#ECEAE6] bg-white px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 transition-shadow hover:shadow-sm">
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

function InfoRow({ icon: Icon, label, value }: { icon?: IconComponent; label: string; value: string | React.ReactNode }) {
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

function SectionLabel({ icon: Icon, title, action }: { icon: IconComponent; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
          <Icon className="h-3.5 w-3.5 text-[#3730A3]" />
        </div>
        <h3 className="text-sm font-semibold text-[#111]">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function BadgeChips({ items }: { items: (string | { name: string })[] }) {
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

function EmptyState({ icon: Icon, message, action }: { icon: IconComponent; message: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed border-[#ECEAE6] py-16">
      <div className="text-center">
        <Icon className="mx-auto mb-3 h-8 w-8 text-[#9CA3AF]" />
        <p className="text-sm text-[#9CA3AF]">{message}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

function DataCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#ECEAE6] bg-white ${className}`}>
      {children}
    </div>
  );
}

function DataCardPad({ children }: { children: React.ReactNode }) {
  return <div className="p-4 sm:p-5">{children}</div>;
}

function DetailGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 | 3 | 4 }) {
  const colMap = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" };
  return (
    <div className={`grid grid-cols-1 ${colMap[cols]} gap-3`}>{children}</div>
  );
}

function DetailCell({ label, value, mono }: { label: string; value: string | React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-[#ECEAE6] bg-[#FAFAF9] px-3 py-2.5">
      <p className="text-xs text-[#9CA3AF]">{label}</p>
      <p className={`text-sm font-medium text-[#111] ${mono ? "font-mono" : ""}`}>{value ?? "—"}</p>
    </div>
  );
}

function AmenityTag({ icon: Icon, label, checked }: { icon: IconComponent; label: string; checked: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ${
        checked
          ? "border-emerald-200 bg-emerald-50/50"
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
      <span className={`text-sm ${checked ? "font-medium text-emerald-800" : "text-[#6B6B6B]"}`}>
        {label}
      </span>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  return (
    <div className="-m-4 sm:-m-6 flex flex-1 flex-col">
      <div className="relative h-32 w-full shrink-0 bg-gradient-to-r from-[#F5F4F2] to-[#ECEAE6] sm:h-44 md:h-52 animate-pulse" />
      <div className="w-full space-y-4 px-4 pb-6 sm:space-y-6 sm:px-6 sm:pb-8">
        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-start sm:justify-between sm:pt-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="-mt-10 h-16 w-16 rounded-xl border border-[#ECEAE6] bg-white sm:-mt-14 sm:h-20 sm:w-20 animate-pulse" />
            <div className="space-y-2 pt-0.5 sm:pt-1">
              <div className="h-5 w-48 rounded bg-[#ECEAE6] sm:h-6 sm:w-64 animate-pulse" />
              <div className="h-3.5 w-24 rounded bg-[#F5F4F2] sm:h-4 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg border border-[#ECEAE6] bg-white animate-pulse sm:h-16" />
          ))}
        </div>
        <div className="h-9 w-72 max-w-full rounded-lg bg-[#F5F4F2] sm:w-96 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-40 rounded-lg border border-[#ECEAE6] bg-white animate-pulse sm:h-48" />
          <div className="h-40 rounded-lg border border-[#ECEAE6] bg-white animate-pulse sm:h-48" />
        </div>
      </div>
    </div>
  );
}

/* Modal backdrop shared */
function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-[#ECEAE6]" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-base font-semibold text-[#111]">{title}</h3>
      <button onClick={onClose} className="rounded-lg p-1.5 text-[#9CA3AF] hover:bg-[#F5F4F2] hover:text-[#6B6B6B] transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─── Course Modal ─── */
function CourseModal({
  course, currency, onClose, onSave,
}: {
  course: any; currency: string; onClose: () => void; onSave: (data: any) => Promise<void>;
}) {
  const [name, setName] = useState(course?.name || "");
  const [duration, setDuration] = useState(course?.duration || 5);
  const [fees, setFees] = useState(course?.fees || 0);
  const [seats, setSeats] = useState(course?.seats || course?.availableSeats || 0);
  const [eligibility, setEligibility] = useState(course?.eligibility || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name, duration: Number(duration), fees: Number(fees), seats: Number(seats), eligibility });
    } finally { setSaving(false); }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title={course ? "Edit Course" : "Add Course"} onClose={onClose} />
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[#6B6B6B]">Course Name</label>
          <input
            className="mt-1 w-full rounded-lg border border-[#ECEAE6] px-3 py-2.5 text-sm focus:border-[#3730A3] focus:ring-1 focus:ring-[#3730A3]/20 focus:outline-none transition-colors"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. MBBS, MD General Medicine"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#6B6B6B]">Duration (years)</label>
            <input type="number" min={1}
              className="mt-1 w-full rounded-lg border border-[#ECEAE6] px-3 py-2.5 text-sm focus:border-[#3730A3] focus:ring-1 focus:ring-[#3730A3]/20 focus:outline-none transition-colors"
              value={duration} onChange={e => setDuration(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B6B6B]">Annual Fee ({currency})</label>
            <input type="number" min={0}
              className="mt-1 w-full rounded-lg border border-[#ECEAE6] px-3 py-2.5 text-sm focus:border-[#3730A3] focus:ring-1 focus:ring-[#3730A3]/20 focus:outline-none transition-colors"
              value={fees} onChange={e => setFees(Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#6B6B6B]">Total Seats</label>
            <input type="number" min={0}
              className="mt-1 w-full rounded-lg border border-[#ECEAE6] px-3 py-2.5 text-sm focus:border-[#3730A3] focus:ring-1 focus:ring-[#3730A3]/20 focus:outline-none transition-colors"
              value={seats} onChange={e => setSeats(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B6B6B]">Eligibility</label>
            <input
              className="mt-1 w-full rounded-lg border border-[#ECEAE6] px-3 py-2.5 text-sm focus:border-[#3730A3] focus:ring-1 focus:ring-[#3730A3]/20 focus:outline-none transition-colors"
              value={eligibility} onChange={e => setEligibility(e.target.value)} placeholder="e.g. NEET 50%" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving || !name.trim()}
          className="bg-[#3730A3] hover:bg-[#312E81] text-white">
          {saving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
          {saving ? "Saving..." : course ? "Update Course" : "Add Course"}
        </Button>
      </div>
    </ModalBackdrop>
  );
}

/* ─── Document Upload Modal ─── */
function DocUploadModal({
  onClose, onUpload,
}: {
  universityId: string; onClose: () => void; onUpload: (formData: FormData) => Promise<void>;
}) {
  const [type, setType] = useState("BROCHURE");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const docTypes = [
    { value: "BROCHURE", label: "Brochure" },
    { value: "PROSPECTUS", label: "Prospectus" },
    { value: "RECOGNITION_CERTIFICATE", label: "Recognition Certificate" },
    { value: "AFFILIATION_DOCUMENT", label: "Affiliation Document" },
    { value: "DEGREE_SAMPLE", label: "Degree Sample" },
    { value: "FEE_STRUCTURE", label: "Fee Structure" },
    { value: "ADMISSION_FORM", label: "Admission Form" },
    { value: "HOSTEL_RULES", label: "Hostel Rules" },
    { value: "ANTI_RAGGING_POLICY", label: "Anti-Ragging Policy" },
    { value: "AGREEMENT", label: "Agreement" },
  ];

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type);
      fd.append("fileName", file.name);
      fd.append("fileSize", String(file.size));
      await onUpload(fd);
    } finally { setUploading(false); }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title="Upload Document" onClose={onClose} />
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[#6B6B6B]">Document Type</label>
          <select
            className="mt-1 w-full rounded-lg border border-[#ECEAE6] px-3 py-2.5 text-sm focus:border-[#3730A3] focus:ring-1 focus:ring-[#3730A3]/20 focus:outline-none transition-colors"
            value={type} onChange={e => setType(e.target.value)}>
            {docTypes.map(dt => <option key={dt.value} value={dt.value}>{dt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[#6B6B6B]">File</label>
          <label className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#ECEAE6] px-4 py-4 text-sm text-[#6B6B6B] hover:border-[#3730A3] hover:text-[#3730A3] transition-colors">
            <FileUp className="h-5 w-5" />
            {file ? file.name : "Choose file..."}
            <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleUpload} disabled={uploading || !file}
          className="bg-[#3730A3] hover:bg-[#312E81] text-white">
          {uploading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </ModalBackdrop>
  );
}

/* ─── Image Upload Modal ─── */
function ImageUploadModal({
  type, onClose, onUpload,
}: {
  universityId: string; type: "logo" | "banner" | "gallery"; onClose: () => void; onUpload: (file: File) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const labels = { logo: "University Logo", banner: "Banner Image", gallery: "Gallery Image" };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try { await onUpload(file); } finally { setUploading(false); }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title={`Upload ${labels[type]}`} onClose={onClose} />
      <div className="space-y-4">
        {file && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#ECEAE6] bg-[#F5F4F2]">
            <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-contain" />
          </div>
        )}
        <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#ECEAE6] px-4 py-6 text-sm text-[#6B6B6B] hover:border-[#3730A3] hover:text-[#3730A3] transition-colors">
          <Upload className="h-5 w-5" />
          {file ? file.name : `Choose ${labels[type]}...`}
          <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleUpload} disabled={uploading || !file}
          className="bg-[#3730A3] hover:bg-[#312E81] text-white">
          {uploading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </ModalBackdrop>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: university, isLoading } = useAdminUniversity(params.id as string);
  const updateStatus = useUpdateUniversityStatus();
  const deleteUniversity = useDeleteUniversity();
  const updateUni = useUpdateUniversity();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const uploadDoc = useUploadDocument();
  const deleteDoc = useDeleteDocument();
  const uploadImage = useUploadImage();

  const [editSection, setEditSection] = useState<string | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState<"logo" | "banner" | "gallery" | null>(null);

  if (isLoading) return <LoadingSkeleton />;
  if (!university) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <School className="mx-auto mb-3 h-10 w-10 text-[#9CA3AF]" />
          <p className="text-sm font-medium text-[#6B6B6B]">University not found</p>
          <Button variant="ghost" className="mt-4" onClick={() => router.push("/admin/universities")}>
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

  return (
    <div className="-m-4 sm:-m-6 flex flex-1 flex-col bg-[#FAF9F6]">
      {/* ═══ Banner ═══ */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden sm:h-44 md:h-52">
        {university.bannerImage ? (
          <>
            <Image src={university.bannerImage} alt="" fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3730A3]/60 via-[#3730A3]/20 to-transparent" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#3730A3] via-[#4F46E5] to-[#6366F1]" />
        )}
        <button
          onClick={() => setShowImageUpload("banner")}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-sm hover:bg-white transition-colors"
          title="Upload banner image"
        >
          <Upload className="h-4 w-4 text-[#6B6B6B]" />
        </button>
      </div>

      <div className="w-full space-y-5 px-4 pb-6 sm:space-y-6 sm:px-6 sm:pb-8">
        {/* ═══ Header ═══ */}
        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:pt-4">
          <div className="flex items-start gap-4">
            <div className="group relative -mt-10 h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm sm:-mt-14 sm:h-20 sm:w-20">
              {university.logo ? (
                <Image src={university.logo} alt={university.name} fill className="object-contain p-1" sizes="(max-width: 640px) 64px, 80px" />
              ) : (
                <div className="flex h-full items-center justify-center text-[#9CA3AF]">
                  <School className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              )}
              <button
                onClick={() => setShowImageUpload("logo")}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                title="Upload logo"
              >
                <Upload className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="min-w-0 pt-0.5 sm:pt-1">
              <div className="flex flex-wrap items-center gap-2">
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
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/universities/${params.id}/edit`)}>
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>
            {university.status !== "ACTIVE" ? (
              <Button size="sm" onClick={() => updateStatus.mutate({ id: params.id as string, status: "ACTIVE" })}
                disabled={updateStatus.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                {updateStatus.isPending ? "Activating..." : "Activate"}
              </Button>
            ) : (
              <Button variant="outline" size="sm"
                onClick={() => updateStatus.mutate({ id: params.id as string, status: "INACTIVE" })}
                disabled={updateStatus.isPending}
                className="text-amber-700 border-amber-300 hover:bg-amber-50">
                {updateStatus.isPending ? "Deactivating..." : "Deactivate"}
              </Button>
            )}
            <Button variant="outline" size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              disabled={deleteUniversity.isPending}
              onClick={async () => {
                if (!confirm("Are you sure you want to delete this university?")) return;
                await deleteUniversity.mutateAsync(params.id as string);
                router.push("/admin/universities");
              }}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              {deleteUniversity.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* ═══ Quick Stats ═══ */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          <StatPill icon={Building2} label="Type" value={university.type?.replace("_", " ")} />
          <StatPill icon={Calendar} label="Est." value={university.establishedYear ?? "—"} />
          <StatPill icon={Globe} label="Country" value={loc?.country ?? "—"} />
          <StatPill icon={GraduationCap} label="Programs" value={a?.programs?.length ?? 0} />
          <StatPill icon={Users} label="Seats" value={(a?.programs || []).reduce((sum: number, p: any) => sum + (typeof p === "string" ? 0 : (p.totalSeats ?? 0)), 0) || "—"} />
        </div>

        {/* ═══ Tabs ═══ */}
        <Tabs defaultValue="overview" className="w-full min-w-0">
          <TabsList variant="line" className="h-9 w-full justify-start gap-0 overflow-x-auto border-b border-[#ECEAE6]">
            <TabsTrigger value="overview" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Overview</TabsTrigger>
            <TabsTrigger value="academic" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Academic</TabsTrigger>
            <TabsTrigger value="infrastructure" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Infrastructure</TabsTrigger>
            <TabsTrigger value="admission" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Admission</TabsTrigger>
            <TabsTrigger value="support" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Support</TabsTrigger>
            <TabsTrigger value="fees" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Fees</TabsTrigger>
            <TabsTrigger value="recognition" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Recognition</TabsTrigger>
            <TabsTrigger value="content" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Content</TabsTrigger>
            <TabsTrigger value="courses" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Courses</TabsTrigger>
            <TabsTrigger value="documents" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Documents</TabsTrigger>
            <TabsTrigger value="admin" className="px-3 text-xs font-medium data-[state=active]:text-[#3730A3]">Admin</TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════════════════════════
             OVERVIEW TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="overview" className="mt-5 space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#3730A3] via-[#4F46E5] to-[#6366F1] p-5 sm:p-6">
              <div className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} />
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{university.name}</h2>
                  <p className="text-indigo-200 text-sm">{university.shortName} · Est. {university.establishedYear}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {university.recognition?.worldRank && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 text-xs text-white font-medium border border-white/10">
                      <Medal className="h-3.5 w-3.5 text-yellow-300" /> World Rank #{university.recognition.worldRank}
                    </div>
                  )}
                  <Badge className="bg-white/15 text-white border-white/10 backdrop-blur-sm text-xs">{university.type?.replace("_", " ")}</Badge>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { icon: Calendar, value: university.establishedYear, label: "Established" },
                { icon: Globe, value: loc?.country, label: "Country" },
                { icon: GraduationCap, value: a?.programs?.length || 0, label: "Programs" },
                { icon: Users, value: university.studentDemographics?.totalStudents?.toLocaleString() || "—", label: "Students" },
                { icon: Medal, value: university.recognition?.worldRank ? `#${university.recognition.worldRank}` : "—", label: "World Rank" },
                { icon: Banknote, value: university.fees?.currency || "₹", label: "Currency" },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl border border-[#ECEAE6] bg-white p-3.5 sm:p-4 transition-shadow hover:shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3730A3]/10 text-[#3730A3] mb-2.5">
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <p className="text-base font-semibold text-[#111] truncate">{stat.value}</p>
                  <p className="text-xs text-[#9CA3AF]">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Main + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* ─── Main Column ─── */}
              <div className="lg:col-span-8 space-y-5">
                {/* About */}
                {university.content?.longDescription && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] bg-[#FAF9F6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <FileText className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">About {university.shortName}</h3>
                      </div>
                    </div>
                    <DataCardPad>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">{university.content.longDescription}</p>
                      {university.content.shortDescription && (
                        <div className="mt-3 rounded-lg border-l-2 border-[#3730A3] bg-[#FAF9F6] px-4 py-3">
                          <p className="text-sm text-[#6B6B6B] italic">{university.content.shortDescription}</p>
                        </div>
                      )}
                    </DataCardPad>
                  </DataCard>
                )}

                {/* Programs */}
                {a?.programs && a.programs.length > 0 && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                            <BookOpen className="h-3.5 w-3.5 text-[#3730A3]" />
                          </div>
                          <h3 className="text-sm font-semibold text-[#111]">Programs Offered</h3>
                        </div>
                        <span className="text-xs text-[#9CA3AF]">{a.programs.length} programs</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {a.programs.map((prog: any, i: number) => {
                          const program = typeof prog === 'string' ? { name: prog } : prog;
                          return (
                            <div key={i} className="group rounded-lg border border-[#ECEAE6] bg-white p-3.5 hover:border-[#3730A3]/30 hover:shadow-sm transition-all">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3730A3]/10 text-[#3730A3] font-bold text-xs">
                                    {i + 1}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-[#111] group-hover:text-[#3730A3] transition-colors">{program.name}</p>
                                    <p className="text-xs text-[#9CA3AF]">{program.duration || a.duration}</p>
                                  </div>
                                </div>
                                {program.totalSeats > 0 && (
                                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                                    {program.totalSeats} seats
                                  </span>
                                )}
                              </div>
                              {program.annualTuition > 0 && (
                                <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] ml-10">
                                  <Banknote className="h-3 w-3" />
                                  <span>{university.fees?.currency} {program.annualTuition?.toLocaleString()}/year</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DataCard>
                )}

                {/* Recognition */}
                {university.recognition && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] bg-amber-50/30 px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-100">
                          <Medal className="h-3.5 w-3.5 text-amber-700" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Recognition & Accreditations</h3>
                      </div>
                    </div>
                    <DataCardPad>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {university.recognition.bodies?.map((body: string) => (
                          <span key={body} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> {body}
                          </span>
                        ))}
                        <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium border ${university.recognition.ecfmgStatus === 'APPROVED' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          ECFMG {university.recognition.ecfmgStatus}
                        </span>
                        {university.recognition.nbaAccredited && (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> NBA Accredited
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-[#3730A3] to-[#4F46E5] p-4 text-white">
                          <Award className="h-6 w-6 mb-1.5 opacity-80" />
                          <p className="text-xl font-bold">#{university.recognition.worldRank || "—"}</p>
                          <p className="text-xs opacity-80">World Ranking</p>
                          {university.recognition.worldRankingSource && (
                            <p className="text-[10px] opacity-60 mt-0.5">{university.recognition.worldRankingSource}</p>
                          )}
                        </div>
                        <div className="rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 p-4 text-white">
                          <Award className="h-6 w-6 mb-1.5 opacity-80" />
                          <p className="text-xl font-bold">#{university.recognition.nationalRank || "—"}</p>
                          <p className="text-xs opacity-80">National Ranking</p>
                          {university.recognition.nationalRankingSource && (
                            <p className="text-[10px] opacity-60 mt-0.5">{university.recognition.nationalRankingSource}</p>
                          )}
                        </div>
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                {/* Fee Overview */}
                {university.fees && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] bg-emerald-50/30 px-5 py-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100">
                            <Banknote className="h-3.5 w-3.5 text-emerald-700" />
                          </div>
                          <h3 className="text-sm font-semibold text-[#111]">Fee Structure</h3>
                        </div>
                        {university.fees.scholarshipAvailable && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> Scholarships
                          </span>
                        )}
                      </div>
                    </div>
                    <DataCardPad>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Tuition/Year", value: university.fees.tuitionAnnual, icon: BookOpen },
                          { label: "Hostel/Year", value: university.fees.hostelAnnual, icon: Bed },
                          { label: "Total Program", value: university.fees.totalProgram, icon: GraduationCap, highlight: true },
                          { label: "Registration", value: university.fees.registration, icon: FileText },
                        ].map((fee, i) => (
                          <div key={i} className={`text-center rounded-lg p-3.5 ${fee.highlight ? 'bg-[#3730A3] text-white' : 'border border-[#ECEAE6] bg-[#FAF9F6]'}`}>
                            <fee.icon className={`h-4 w-4 mx-auto mb-1.5 ${fee.highlight ? 'opacity-80' : 'text-[#9CA3AF]'}`} />
                            <p className={`text-sm font-bold ${fee.highlight ? 'text-white' : 'text-[#111]'}`}>
                              {university.fees?.currency} {fee.value?.toLocaleString() || "—"}
                            </p>
                            <p className={`text-[10px] ${fee.highlight ? 'text-white/70' : 'text-[#9CA3AF]'}`}>{fee.label}</p>
                          </div>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                {/* Infrastructure */}
                {infra && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <Building2 className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Infrastructure</h3>
                      </div>
                    </div>
                    <DataCardPad>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
                        {[
                          { icon: Stethoscope, value: infra.hospitalBeds || "—", label: "Hospital Beds" },
                          { icon: Bed, value: infra.hostelBoys?.toLocaleString() || "—", label: "Hostel (Boys)" },
                          { icon: Bed, value: infra.hostelGirls?.toLocaleString() || "—", label: "Hostel (Girls)" },
                          { icon: MapPin, value: infra.campusArea ? `${infra.campusArea} ac` : "—", label: "Campus Area" },
                          { icon: School, value: infra.departments?.length || "—", label: "Departments" },
                          { icon: FlaskConical, value: infra.laboratories?.length || "—", label: "Laboratories" },
                        ].map((s, i) => (
                          <div key={i} className="text-center rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-3">
                            <p className="text-base font-semibold text-[#111]">{s.value}</p>
                            <p className="text-[10px] text-[#9CA3AF]">{s.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {infra.cafeteria && <FacilityBadge icon={Coffee} label="Cafeteria" />}
                        {infra.wifiCampus && <FacilityBadge icon={Wifi} label="WiFi Campus" />}
                        {infra.transportation && <FacilityBadge icon={Bus} label="Transport" />}
                        {infra.facilities?.map((f: string, i: number) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-md border border-[#ECEAE6] bg-white px-2.5 py-1 text-xs text-[#6B6B6B]">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {f}
                          </span>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                {/* Admission Requirements */}
                {adm && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                            <ClipboardList className="h-3.5 w-3.5 text-[#3730A3]" />
                          </div>
                          <h3 className="text-sm font-semibold text-[#111]">Admission Requirements</h3>
                        </div>
                        {adm.ageCriteria && (
                          <span className="text-xs text-[#9CA3AF]">Age: {adm.ageCriteria}</span>
                        )}
                      </div>
                    </div>
                    <DataCardPad>
                      <DetailGrid cols={3}>
                        <DetailCell label="Entrance Exams" value={adm.entranceExams?.join(", ") || "—"} />
                        <DetailCell label="Application Fee" value={`${university.fees?.currency || "₹"} ${adm.applicationFee?.toLocaleString() || "—"}`} />
                        <DetailCell label="Selection Process" value={adm.selectionProcess || "—"} />
                      </DetailGrid>
                      {adm.eligibility && (
                        <div className="mt-3 rounded-lg bg-amber-50/50 border border-amber-100 px-3.5 py-2.5">
                          <p className="text-xs text-amber-700 font-medium mb-0.5">General Eligibility</p>
                          <p className="text-sm text-amber-900">{adm.eligibility}</p>
                        </div>
                      )}
                      {adm.requiredDocuments && adm.requiredDocuments.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-[#9CA3AF] mb-2">Required Documents</p>
                          <div className="flex flex-wrap gap-1.5">
                            {adm.requiredDocuments.map((doc: string, i: number) => (
                              <span key={i} className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                <CheckCircle2 className="h-3 w-3" /> {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {adm.applicationDeadline && (
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-amber-50/50 border border-amber-100 px-3.5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="h-4 w-4 text-amber-600" />
                            <div>
                              <p className="text-xs text-amber-600">Deadline</p>
                              <p className="text-sm font-semibold text-amber-900">{new Date(adm.applicationDeadline).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${new Date(adm.applicationDeadline) > new Date() ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                            {new Date(adm.applicationDeadline) > new Date() ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      )}
                    </DataCardPad>
                  </DataCard>
                )}

                {/* Program Eligibility */}
                {adm?.programEligibility && adm.programEligibility.length > 0 && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <Medal className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Eligibility by Program</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {adm.programEligibility.map((prog: any, i: number) => {
                          const programName = a?.programs?.[i]?.name || `Program ${i + 1}`;
                          return (
                            <div key={i} className="rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-4">
                              <div className="flex items-center gap-2.5 mb-3">
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10 text-[#3730A3] font-bold text-xs">{i + 1}</div>
                                <h5 className="text-sm font-semibold text-[#111]">{programName}</h5>
                              </div>
                              <div className="space-y-2">
                                <DetailCell label="Minimum Marks" value={prog.minimumMarks || "—"} />
                                <DetailCell label="Eligibility" value={prog.eligibility || "—"} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DataCard>
                )}

                {/* Support Services */}
                {supp && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <Heart className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Student Support</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-[#111] flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-[#3730A3]" /> Placement & Career
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-3">
                              <p className="text-lg font-bold text-[#111]">{supp.placementRate ? `${supp.placementRate}%` : "—"}</p>
                              <p className="text-[10px] text-[#9CA3AF]">Placement Rate</p>
                            </div>
                            <div className="text-center rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-3">
                              <p className="text-lg font-bold text-[#111]">{supp.averagePackage ? `₹${(supp.averagePackage / 100000).toFixed(1)}L` : "—"}</p>
                              <p className="text-[10px] text-[#9CA3AF]">Avg Package</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {supp.careerGuidance && <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 px-2 py-1 text-xs font-medium"><CheckCircle2 className="h-3 w-3" /> Career Guidance</span>}
                            {supp.counselingServices && <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 px-2 py-1 text-xs font-medium"><CheckCircle2 className="h-3 w-3" /> Counseling</span>}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-[#111] flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-[#3730A3]" /> International Support
                          </h4>
                          <div className="space-y-2 text-sm">
                            {supp.visaAssistance && <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><span className="text-[#111]">Visa Assistance</span></div>}
                            {supp.internationalStudentSupport && <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><span className="text-[#111]">International Student Support</span></div>}
                            {supp.alumniNetwork && <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><span className="text-[#111]">Alumni Network</span>{supp.alumniCount && <span className="text-xs text-[#9CA3AF]">({supp.alumniCount.toLocaleString()})</span>}</div>}
                          </div>
                          {supp.languageSupport?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {supp.languageSupport.map((lang: string) => (
                                <span key={lang} className="rounded-md bg-[#F5F4F2] px-2 py-1 text-xs text-[#6B6B6B]">{lang}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {supp.topRecruiters?.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-[#111] flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-[#3730A3]" /> Top Recruiters
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {supp.topRecruiters.map((r: string, i: number) => (
                                <span key={i} className="rounded-lg border border-[#ECEAE6] bg-white px-2.5 py-1 text-xs font-medium text-[#6B6B6B]">{r}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </DataCard>
                )}

                {/* Content Section */}
                {university.content && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <FileText className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Content & Media</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {university.content.shortDescription && (
                            <div>
                              <p className="text-xs text-[#9CA3AF] mb-1">Short Description</p>
                              <p className="text-sm text-[#6B6B6B]">{university.content.shortDescription}</p>
                            </div>
                          )}
                          {university.content.whyChooseUs && (
                            <div>
                              <p className="text-xs text-[#9CA3AF] mb-1">Why Choose Us</p>
                              <p className="text-sm text-[#6B6B6B]">{university.content.whyChooseUs}</p>
                            </div>
                          )}
                          {university.content.highlights?.length > 0 && (
                            <div>
                              <p className="text-xs text-[#9CA3AF] mb-1.5">Highlights</p>
                              <div className="flex flex-wrap gap-1.5">
                                {university.content.highlights.map((h: string, i: number) => (
                                  <span key={i} className="inline-flex items-center gap-1 rounded-md bg-[#3730A3]/10 text-[#3730A3] px-2.5 py-1 text-xs font-medium">
                                    <CheckCircle2 className="h-3 w-3" /> {h}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          {(university.content.videoTour || university.content.virtualTour) && (
                            <div>
                              <p className="text-xs text-[#9CA3AF] mb-1.5">Virtual Tours</p>
                              <div className="space-y-2">
                                {university.content.videoTour && (
                                  <a href={university.content.videoTour} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] px-4 py-3 hover:bg-[#F5F4F2] transition-colors group">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3730A3]/10 text-[#3730A3]">
                                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                    <span className="flex-1 text-sm font-medium text-[#111] group-hover:text-[#3730A3]">Video Tour</span>
                                    <ExternalLink className="h-4 w-4 text-[#9CA3AF]" />
                                  </a>
                                )}
                                {university.content.virtualTour && (
                                  <a href={university.content.virtualTour} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] px-4 py-3 hover:bg-[#F5F4F2] transition-colors group">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </div>
                                    <span className="flex-1 text-sm font-medium text-[#111] group-hover:text-emerald-600">Virtual Tour</span>
                                    <ExternalLink className="h-4 w-4 text-[#9CA3AF]" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DataCard>
                )}

                {/* Admin & Bank Details */}
                {university.admin && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <Settings className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Administration & Banking</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-[#111]">Point of Contact</h4>
                          <DetailGrid cols={2}>
                            <DetailCell label="Name" value={university.admin.pocName} />
                            <DetailCell label="Designation" value={university.admin.pocDesignation} />
                            <DetailCell label="Email" value={university.admin.pocEmail ? <a href={`mailto:${university.admin.pocEmail}`} className="text-[#3730A3] hover:underline">{university.admin.pocEmail}</a> : "—"} />
                            <DetailCell label="Phone" value={`${university.admin.phoneCountryCode || ""} ${university.admin.phoneNumber || "—"}`} />
                          </DetailGrid>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-[#111]">Bank Details</h4>
                          <DetailGrid cols={2}>
                            <DetailCell label="Account Name" value={university.admin.accountName} />
                            <DetailCell label="Bank Name" value={university.admin.bankName} />
                            <DetailCell label="IFSC Code" value={university.admin.ifscCode} mono />
                            <DetailCell label="Commission" value={university.admin.commission ? `${university.admin.commission}%` : "—"} />
                          </DetailGrid>
                        </div>
                      </div>
                      {university.admin.bankCountry && (
                        <div className="mt-4 pt-4 border-t border-[#ECEAE6]">
                          <h4 className="text-xs font-semibold text-[#111] mb-3">International Banking</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            <DetailCell label="Bank Country" value={university.admin.bankCountry} />
                            {university.admin.recipientName && <DetailCell label="Recipient Name" value={university.admin.recipientName} />}
                            {university.admin.recipientBank && <DetailCell label="Recipient Bank" value={university.admin.recipientBank} />}
                            {university.admin.bankIdCode && <DetailCell label="SWIFT/BIC" value={university.admin.bankIdCode} mono />}
                            {university.admin.recipientInn && <DetailCell label="TIN (INN)" value={university.admin.recipientInn} />}
                            {university.admin.recipientKpp && <DetailCell label="KPP" value={university.admin.recipientKpp} />}
                            {university.admin.singleTreasuryAccount && <DetailCell label="Treasury Acct" value={university.admin.singleTreasuryAccount} mono />}
                            {university.admin.paymentPurpose && <DetailCell label="Payment Purpose" value={university.admin.paymentPurpose} />}
                          </div>
                          {university.admin.bankDetails && Object.keys(university.admin.bankDetails).length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-[#9CA3AF] mb-1.5">Additional Bank Info</p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {Object.entries(university.admin.bankDetails).map(([key, value]) => (
                                  <DetailCell key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(value)} />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </DataCard>
                )}

                {/* Gallery */}
                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <ImageIcon className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Gallery</h3>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowImageUpload("gallery")}>
                        <Upload className="mr-1.5 h-3.5 w-3.5" /> Add Image
                      </Button>
                    </div>
                  </div>
                  <DataCardPad>
                    {university.content?.gallery && university.content.gallery.length > 0 ? (
                      <GalleryGrid images={university.content.gallery} />
                    ) : (
                      <p className="text-sm text-[#9CA3AF] text-center py-8">No gallery images yet</p>
                    )}
                  </DataCardPad>
                </DataCard>
              </div>

              {/* ─── Sidebar Column ─── */}
              <div className="lg:col-span-4 space-y-5">
                {/* Contact */}
                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                        <Phone className="h-3.5 w-3.5 text-[#3730A3]" />
                      </div>
                      <h3 className="text-sm font-semibold text-[#111]">Contact Info</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {contact?.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-3 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-3 hover:bg-[#F5F4F2] transition-colors group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3730A3]/10 text-[#3730A3]">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#9CA3AF]">Email</p>
                          <p className="text-xs font-medium text-[#111] truncate group-hover:text-[#3730A3] transition-colors">{contact.email}</p>
                        </div>
                      </a>
                    )}
                    {contact?.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-3 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-3 hover:bg-[#F5F4F2] transition-colors group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#9CA3AF]">Phone</p>
                          <p className="text-xs font-medium text-[#111] group-hover:text-emerald-600 transition-colors">{contact.phone}</p>
                        </div>
                      </a>
                    )}
                    {university.website && (
                      <a href={university.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-3 hover:bg-[#F5F4F2] transition-colors group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#9CA3AF]">Website</p>
                          <p className="text-xs font-medium text-[#111] group-hover:text-sky-600 transition-colors">Visit Website</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-[#9CA3AF]" />
                      </a>
                    )}
                    {contact?.admissionOfficeHours && (
                      <div className="flex items-center gap-3 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-[#9CA3AF]">Office Hours</p>
                          <p className="text-xs font-medium text-[#111]">{contact.admissionOfficeHours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </DataCard>

                {/* Location */}
                {loc && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <MapPin className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Location</h3>
                      </div>
                    </div>
                    <DataCardPad>
                      <div className="h-28 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center mb-3">
                        <div className="text-center">
                          <MapPin className="h-6 w-6 text-green-500 mx-auto mb-0.5" />
                          <span className="text-xs text-green-600 font-medium">{loc.city}, {loc.country}</span>
                        </div>
                      </div>
                      <DetailGrid cols={2}>
                        <DetailCell label="City" value={loc.city} />
                        <DetailCell label="State" value={loc.state} />
                        <DetailCell label="Country" value={loc.country} />
                        <DetailCell label="Address" value={loc.address} />
                      </DetailGrid>
                    </DataCardPad>
                  </DataCard>
                )}

                {/* Student Demographics */}
                {university.studentDemographics && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <Users className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Student Body</h3>
                      </div>
                    </div>
                    <DataCardPad>
                      <div className="space-y-2">
                        {[
                          { label: "Total", value: university.studentDemographics.totalStudents },
                          { label: "Local", value: university.studentDemographics.localStudents },
                          { label: "International", value: university.studentDemographics.foreignStudents },
                        ].map((s, i) => (
                          <div key={i} className="flex justify-between items-center py-1.5 border-b border-[#ECEAE6] last:border-0">
                            <span className="text-sm text-[#6B6B6B]">{s.label}</span>
                            <span className="text-sm font-semibold text-[#111]">{s.value?.toLocaleString() || "—"}</span>
                          </div>
                        ))}
                      </div>
                      {university.studentDemographics.foreignByCountry?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[#ECEAE6]">
                          <p className="text-xs text-[#9CA3AF] mb-1.5">Top Countries</p>
                          <div className="flex flex-wrap gap-1.5">
                            {university.studentDemographics.foreignByCountry.slice(0, 3).map((f: any) => (
                              <span key={f.country} className="rounded-md bg-[#F5F4F2] px-2 py-0.5 text-xs text-[#6B6B6B]">{f.country}: {f.count}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </DataCardPad>
                  </DataCard>
                )}

                {/* Social Links */}
                {university.socialLinks && Object.keys(university.socialLinks).length > 0 && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <Globe className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Social Links</h3>
                      </div>
                    </div>
                    <DataCardPad>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(university.socialLinks).filter(([, v]) => v).map(([platform, url]) => (
                          <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] px-3 py-2 text-xs font-medium text-[#6B6B6B] hover:bg-[#F5F4F2] hover:text-[#3730A3] transition-colors capitalize">
                            <ExternalLink className="h-3 w-3" /> {platform}
                          </a>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                {/* Admission Quick */}
                {adm && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#3730A3]/10">
                          <ClipboardList className="h-3.5 w-3.5 text-[#3730A3]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#111]">Admission</h3>
                      </div>
                    </div>
                    <DataCardPad>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1.5 border-b border-[#ECEAE6]">
                          <span className="text-[#6B6B6B]">Exams</span>
                          <span className="text-[#111] font-medium">{adm.entranceExams?.join(", ") || "—"}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-[#ECEAE6]">
                          <span className="text-[#6B6B6B]">Age</span>
                          <span className="text-[#111] font-medium">{adm.ageCriteria || "—"}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-[#ECEAE6]">
                          <span className="text-[#6B6B6B]">Fee</span>
                          <span className="text-[#111] font-medium">{university.fees?.currency || "₹"} {adm.applicationFee?.toLocaleString() || "—"}</span>
                        </div>
                        {adm.applicationDeadline && (
                          <div className="flex justify-between py-1.5">
                            <span className="text-[#6B6B6B]">Deadline</span>
                            <span className="text-[#111] font-medium">{new Date(adm.applicationDeadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}
              </div>
            </div>

            {/* Subject Rankings */}
            {university.recognition?.subjectRankings && Object.keys(university.recognition.subjectRankings).length > 0 && (
              <DataCard>
                <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-100">
                      <BookOpen className="h-3.5 w-3.5 text-amber-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#111]">Subject Rankings</h3>
                  </div>
                </div>
                <DataCardPad>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(university.recognition.subjectRankings).map(([subject, rank]) => (
                      <span key={subject} className="inline-flex items-center gap-1.5 rounded-lg bg-[#3730A3]/10 text-[#3730A3] px-3 py-1.5 text-xs font-medium">
                        <Award className="h-3 w-3" /> #{rank} {subject}
                      </span>
                    ))}
                  </div>
                </DataCardPad>
              </DataCard>
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             ACADEMIC TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="academic" className="mt-5 space-y-5">
            {a ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={BookOpen} title="Programs & Duration" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-3">
                      <InfoRow icon={GraduationCap} label="Programs" value={<BadgeChips items={a.programs} />} />
                      <InfoRow icon={Clock} label="Duration" value={a.duration} />
                      <InfoRow icon={Globe} label="Medium" value={a.medium} />
                      <InfoRow icon={Calendar} label="Intake Months" value={<BadgeChips items={a.intakeMonths} />} />
                    </div>
                  </DataCardPad>
                </DataCard>

                {a.programs?.length > 0 && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={Users} title="Seat Distribution" />
                    </div>
                    <DataCardPad>
                      <div className="divide-y divide-[#ECEAE6]">
                        {a.programs.map((p: any, i: number) => {
                          const name = typeof p === "string" ? p : p.name;
                          const total = typeof p === "string" ? 0 : (p.totalSeats ?? 0);
                          const govt = typeof p === "string" ? 0 : (p.governmentSeats ?? 0);
                          const mgmt = typeof p === "string" ? 0 : (p.managementSeats ?? 0);
                          const nri = typeof p === "string" ? 0 : (p.nriSeats ?? 0);
                          return (
                            <div key={name || i} className="py-2.5 first:pt-0 last:pb-0">
                              <p className="text-xs font-medium text-[#111] mb-1.5">{name}</p>
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
                    </DataCardPad>
                  </DataCard>
                )}

                {university.studentDemographics && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={Users} title="Student Demographics" />
                    </div>
                    <DataCardPad>
                      <div className="space-y-3">
                        <InfoRow icon={Users} label="Total Students" value={university.studentDemographics.totalStudents?.toLocaleString() ?? "—"} />
                        <InfoRow icon={Users} label="Local" value={university.studentDemographics.localStudents?.toLocaleString() ?? "—"} />
                        <InfoRow icon={Globe} label="Foreign" value={university.studentDemographics.foreignStudents?.toLocaleString() ?? "—"} />
                        {university.studentDemographics?.foreignByCountry?.length > 0 && (
                          <div className="pt-2 border-t border-[#ECEAE6]">
                            <p className="text-xs text-[#9CA3AF] mb-1.5">By Country</p>
                            <div className="flex flex-wrap gap-1.5">
                              {university.studentDemographics.foreignByCountry.map((f: any) => (
                                <span key={f.country} className="inline-flex items-center rounded-md bg-[#F5F4F2] px-2.5 py-1 text-xs font-medium text-[#6B6B6B]">{f.country}: {f.count.toLocaleString()}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                {a.specializations?.length > 0 && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={Medal} title="Specializations" />
                    </div>
                    <DataCardPad>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {a.specializations.map((spec: string) => (
                          <div key={spec} className="flex items-center gap-2 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] px-3 py-2.5">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span className="text-sm text-[#111]">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}
              </div>
            ) : (
              <EmptyState icon={BookOpen} message="No academic details available" />
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             INFRASTRUCTURE TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="infrastructure" className="mt-5 space-y-5">
            {infra ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <StatPill icon={Bed} label="Hostel (Boys)" value={infra.hostelBoys || 0} />
                  <StatPill icon={Bed} label="Hostel (Girls)" value={infra.hostelGirls || 0} />
                  <StatPill icon={MapPin} label="Campus (acres)" value={infra.campusArea ?? 0} />
                  <StatPill icon={Stethoscope} label="Hospital Beds" value={infra.hospitalBeds || 0} />
                  <StatPill icon={School} label="Departments" value={infra.departments?.length || 0} />
                </div>

                {infra.departments?.length > 0 && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={School} title="Departments" />
                    </div>
                    <DataCardPad>
                      <div className="flex flex-wrap gap-1.5">
                        {infra.departments.map((d: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs font-normal bg-[#F5F4F2] text-[#6B6B6B] border-0">{d}</Badge>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                {infra.laboratories?.length > 0 && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={FlaskConical} title="Laboratories" />
                    </div>
                    <DataCardPad>
                      <div className="flex flex-wrap gap-1.5">
                        {infra.laboratories.map((l: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs font-normal bg-[#F5F4F2] text-[#6B6B6B] border-0">{l}</Badge>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={Building2} title="Facilities" />
                  </div>
                  <DataCardPad>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      <AmenityTag icon={Library} label="Library" checked={infra.facilities?.includes("Library")} />
                      <AmenityTag icon={FlaskConical} label="Computer Lab" checked={infra.facilities?.includes("Computer Lab")} />
                      <AmenityTag icon={Dumbbell} label="Sports Complex" checked={infra.facilities?.includes("Sports Complex")} />
                      <AmenityTag icon={Coffee} label="Cafeteria" checked={infra.facilities?.includes("Cafeteria") ?? infra.cafeteria} />
                      <AmenityTag icon={Bed} label="Hostel" checked={infra.facilities?.includes("Hostel")} />
                      <AmenityTag icon={Stethoscope} label="Hospital" checked={infra.facilities?.includes("Hospital")} />
                      <AmenityTag icon={Wifi} label="WiFi Campus" checked={infra.wifiCampus} />
                      <AmenityTag icon={Bus} label="Transport" checked={infra.transportation} />
                    </div>
                  </DataCardPad>
                </DataCard>
              </>
            ) : (
              <EmptyState icon={Building2} message="No infrastructure details available" />
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             ADMISSION TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="admission" className="mt-5 space-y-5">
            {adm ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={ClipboardList} title="Requirements" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-3">
                      <InfoRow icon={FileText} label="Entrance Exams" value={<BadgeChips items={adm.entranceExams} />} />
                      <InfoRow icon={Medal} label="Minimum Marks (Legacy)" value={adm.minimumMarks?.trim() ? adm.minimumMarks : "Not specified"} />
                      <InfoRow icon={Calendar} label="Age Criteria" value={adm.ageCriteria} />
                      <InfoRow icon={FileText} label="Eligibility (Legacy)" value={adm.eligibility?.trim() ? adm.eligibility : "Not specified"} />
                    </div>
                  </DataCardPad>
                </DataCard>

                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={ScrollText} title="Documents & Fees" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-3">
                      <InfoRow icon={Banknote} label="Application Fee" value={`₹${adm.applicationFee?.toLocaleString() ?? "—"}`} />
                      <InfoRow icon={Calendar} label="Deadline" value={adm.applicationDeadline ? new Date(adm.applicationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"} />
                      <InfoRow icon={ClipboardList} label="Selection" value={adm.selectionProcess} />
                    </div>
                  </DataCardPad>
                </DataCard>

                {adm.requiredDocuments?.length > 0 && (
                  <DataCard className="md:col-span-2">
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={FileText} title="Required Documents" />
                    </div>
                    <DataCardPad>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {adm.requiredDocuments.map((doc: string) => (
                          <div key={doc} className="flex items-center gap-2 rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] px-3 py-2.5">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span className="text-sm text-[#111]">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                {adm.programEligibility?.length > 0 && (
                  <DataCard className="md:col-span-2">
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={Medal} title="Eligibility by Program" />
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {adm.programEligibility.map((prog: any, i: number) => (
                          <div key={i} className="rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-4">
                            <p className="text-xs text-[#9CA3AF] mb-1">Program {i + 1}</p>
                            <p className="text-sm font-semibold text-[#111] mb-3">{a?.programs?.[i]?.name || `Program ${i + 1}`}</p>
                            <div className="space-y-2">
                              <DetailCell label="Minimum Marks" value={prog.minimumMarks || "—"} />
                              <DetailCell label="Eligibility" value={prog.eligibility || "—"} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DataCard>
                )}
              </div>
            ) : (
              <EmptyState icon={ClipboardList} message="No admission details available" />
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             SUPPORT TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="support" className="mt-5 space-y-5">
            {supp ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={TrendingUp} title="Placement" />
                  </div>
                  <DataCardPad>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-4 text-center">
                        <p className="text-xl font-semibold text-[#111] sm:text-2xl">{supp.placementRate}%</p>
                        <p className="mt-1 text-xs text-[#9CA3AF]">Placement Rate</p>
                      </div>
                      <div className="rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-4 text-center">
                        <p className="text-xl font-semibold text-[#111] sm:text-2xl">₹{supp.averagePackage?.toLocaleString() ?? "—"}</p>
                        <p className="mt-1 text-xs text-[#9CA3AF]">Avg. Package</p>
                      </div>
                    </div>
                  </DataCardPad>
                </DataCard>

                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={Heart} title="Student Services" />
                  </div>
                  <DataCardPad>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <AmenityTag icon={Globe} label="Visa Assistance" checked={supp.visaAssistance} />
                      <AmenityTag icon={MessageSquare} label="Counseling" checked={supp.counselingServices} />
                      <AmenityTag icon={Briefcase} label="Career Guidance" checked={supp.careerGuidance} />
                    </div>
                  </DataCardPad>
                </DataCard>

                {supp.languageSupport?.length > 0 && (
                  <DataCard className="md:col-span-2">
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={Languages} title="Language Support" />
                    </div>
                    <DataCardPad>
                      <div className="flex flex-wrap gap-2">
                        {supp.languageSupport.map((lang: string) => (
                          <div key={lang} className="flex items-center gap-2 rounded-lg border border-[#ECEAE6] bg-white px-3 py-2">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span className="text-sm font-medium text-[#111]">{lang}</span>
                          </div>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}
              </div>
            ) : (
              <EmptyState icon={Heart} message="No support details available" />
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             FEES TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="fees" className="mt-5 space-y-5">
            {university.fees ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={Banknote} title="Fee Overview" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-3">
                      <InfoRow icon={Banknote} label="Currency" value={university.fees.currency} />
                      <InfoRow icon={ScrollText} label="Tuition (Annual)" value={`${university.fees.currency} ${university.fees.tuitionAnnual?.toLocaleString() ?? "—"}`} />
                      <InfoRow icon={ScrollText} label="Total Program Fee" value={`${university.fees.currency} ${university.fees.totalProgram?.toLocaleString() ?? "—"}`} />
                      <InfoRow icon={Bed} label="Hostel (Annual)" value={`${university.fees.currency} ${university.fees.hostelAnnual?.toLocaleString() ?? "—"}`} />
                      <InfoRow icon={ScrollText} label="Registration" value={`${university.fees.currency} ${university.fees.registration?.toLocaleString() ?? "—"}`} />
                      <InfoRow icon={ScrollText} label="Examination" value={`${university.fees.currency} ${university.fees.examination?.toLocaleString() ?? "—"}`} />
                      <InfoRow icon={Library} label="Library" value={`${university.fees.currency} ${university.fees.library?.toLocaleString() ?? "—"}`} />
                    </div>
                  </DataCardPad>
                </DataCard>

                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={ClipboardList} title="Payment & Policies" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-3">
                      <InfoRow icon={Calendar} label="Payment Schedule" value={university.fees.paymentSchedule} />
                      <InfoRow icon={ScrollText} label="Refund Policy" value={university.fees.refundPolicy} />
                      {university.fees.feeHikePolicy && (
                        <InfoRow icon={TrendingUp} label="Fee Hike Policy" value={university.fees.feeHikePolicy} />
                      )}
                    </div>
                  </DataCardPad>
                </DataCard>

                <DataCard className="md:col-span-2">
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={Medal} title="Scholarships" />
                  </div>
                  <DataCardPad>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${university.fees.scholarshipAvailable ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                        {university.fees.scholarshipAvailable ? "Available" : "Not Available"}
                      </span>
                    </div>
                    {university.fees?.scholarshipDetails && (
                      <p className="text-sm text-[#6B6B6B] mt-2">{university.fees.scholarshipDetails}</p>
                    )}
                  </DataCardPad>
                </DataCard>

                {university.fees.otherFees && Object.keys(university.fees.otherFees).length > 0 && (
                  <DataCard className="md:col-span-2">
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={ScrollText} title="Other Fees" />
                    </div>
                    <DataCardPad>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(university.fees.otherFees).map(([key, value]) => (
                          <div key={key} className="flex justify-between rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] px-3 py-2.5">
                            <span className="text-sm text-[#6B6B6B]">{key}</span>
                            <span className="text-sm font-medium text-[#111]">{university.fees.currency} {Number(value).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                {/* Program Breakdown */}
                {university.fees.programBreakdown && Array.isArray(university.fees.programBreakdown) && university.fees.programBreakdown.length > 0 && (
                  <DataCard className="md:col-span-2">
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={Banknote} title="Fee Breakdown by Program" />
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {university.fees.programBreakdown.map((program: any, i: number) => (
                          <div key={i} className="rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-semibold text-[#111]">{program.programName}</span>
                              <span className="text-sm font-medium text-[#111]">{university.fees?.currency} {program.annualTuition?.toLocaleString()}/yr</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-[#6B6B6B] mb-2">
                              <span className="inline-flex items-center rounded-md bg-white px-2 py-0.5 border border-[#ECEAE6]">Seats: {program.totalSeats}</span>
                              {program.governmentSeats > 0 && <span className="inline-flex items-center rounded-md bg-white px-2 py-0.5 border border-[#ECEAE6]">Govt: {program.governmentSeats}</span>}
                              {program.managementSeats > 0 && <span className="inline-flex items-center rounded-md bg-white px-2 py-0.5 border border-[#ECEAE6]">Mgmt: {program.managementSeats}</span>}
                              {program.nriSeats > 0 && <span className="inline-flex items-center rounded-md bg-white px-2 py-0.5 border border-[#ECEAE6]">NRI: {program.nriSeats}</span>}
                            </div>
                            {program.feeBreakdown && Array.isArray(program.feeBreakdown) && program.feeBreakdown.length > 0 && (
                              <div className="border-t border-[#ECEAE6] pt-2 mt-2">
                                <p className="text-xs text-[#9CA3AF] mb-1">Fee Breakdown:</p>
                                {program.feeBreakdown.map((item: any, j: number) => (
                                  <div key={j} className="flex justify-between text-sm py-0.5">
                                    <span className="text-[#6B6B6B]">{item.name}</span>
                                    <span className="font-medium text-[#111]">{university.fees?.currency} {item.amount?.toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </DataCard>
                )}
              </div>
            ) : (
              <EmptyState icon={Banknote} message="No fee details available" />
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             RECOGNITION TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="recognition" className="mt-5 space-y-5">
            {university.recognition ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={Medal} title="Accreditations & Bodies" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-3">
                      <InfoRow icon={CheckCircle2} label="Recognized Bodies" value={<BadgeChips items={university.recognition.bodies} />} />
                      <InfoRow icon={Medal} label="ECFMG Status" value={university.recognition.ecfmgStatus} />
                      {university.recognition.naacGrade && <InfoRow icon={Medal} label="NAAC Grade" value={university.recognition.naacGrade} />}
                      <InfoRow icon={CheckCircle2} label="NBA Accredited" value={university.recognition.nbaAccredited ? "Yes" : "No"} />
                      <InfoRow icon={CheckCircle2} label="Accreditations" value={<BadgeChips items={university.recognition.accreditations} />} />
                    </div>
                  </DataCardPad>
                </DataCard>

                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={TrendingUp} title="Rankings" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-3">
                      <InfoRow icon={Globe} label="World Rank" value={university.recognition.worldRank ?? "—"} />
                      <InfoRow icon={MapPin} label="National Rank" value={university.recognition.nationalRank ?? "—"} />
                      {university.recognition.rankingSource && <InfoRow icon={Globe} label="Ranking Source" value={university.recognition.rankingSource} />}
                      {university.recognition.worldRankingSource && <InfoRow icon={Globe} label="World Ranking Source" value={university.recognition.worldRankingSource} />}
                      {university.recognition.nationalRankingSource && <InfoRow icon={MapPin} label="National Ranking Source" value={university.recognition.nationalRankingSource} />}
                    </div>
                  </DataCardPad>
                </DataCard>

                {university.recognition.subjectRankings && Object.keys(university.recognition.subjectRankings).length > 0 && (
                  <DataCard className="md:col-span-2">
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={BookOpen} title="Subject Rankings" />
                    </div>
                    <DataCardPad>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(university.recognition.subjectRankings).map(([subject, ranking]) => (
                          <div key={subject} className="flex items-center justify-between rounded-lg border border-[#ECEAE6] bg-[#FAF9F6] px-3 py-2.5">
                            <span className="text-sm text-[#6B6B6B]">{subject}</span>
                            <span className="text-sm font-medium text-[#111]">#{ranking}</span>
                          </div>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}
              </div>
            ) : (
              <EmptyState icon={Medal} message="No recognition details available" />
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             CONTENT TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="content" className="mt-5 space-y-5">
            {university.content ? (
              <div className="grid grid-cols-1 gap-5">
                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={FileText} title="Descriptions" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-4">
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
                    </div>
                  </DataCardPad>
                </DataCard>

                {university.content.highlights?.length > 0 && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={Medal} title="Highlights" />
                    </div>
                    <DataCardPad>
                      <div className="flex flex-wrap gap-2">
                        {university.content.highlights.map((highlight: string, i: number) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-md bg-[#3730A3]/10 text-[#3730A3] px-2.5 py-1 text-xs font-medium">
                            <CheckCircle2 className="h-3 w-3" /> {highlight}
                          </span>
                        ))}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}

                {university.content.gallery?.length > 0 && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={ImageIcon} title="Gallery" />
                    </div>
                    <DataCardPad>
                      <GalleryGrid images={university.content.gallery} />
                    </DataCardPad>
                  </DataCard>
                )}

                {(university.content.videoTour || university.content.virtualTour) && (
                  <DataCard>
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={Globe} title="Virtual Tours" />
                    </div>
                    <DataCardPad>
                      <div className="space-y-3">
                        {university.content.videoTour && (
                          <InfoRow icon={Globe} label="Video Tour" value={
                            <a href={university.content.videoTour} target="_blank" rel="noopener noreferrer" className="text-[#3730A3] hover:underline">Watch Video Tour</a>
                          } />
                        )}
                        {university.content.virtualTour && (
                          <InfoRow icon={Globe} label="Virtual Tour" value={
                            <a href={university.content.virtualTour} target="_blank" rel="noopener noreferrer" className="text-[#3730A3] hover:underline">Explore Virtual Tour</a>
                          } />
                        )}
                      </div>
                    </DataCardPad>
                  </DataCard>
                )}
              </div>
            ) : (
              <EmptyState icon={FileText} message="No content details available" />
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             ADMIN TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="admin" className="mt-5 space-y-5">
            {university.admin ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={Phone} title="Point of Contact" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-3">
                      <InfoRow icon={School} label="Name" value={university.admin.pocName} />
                      <InfoRow icon={Briefcase} label="Designation" value={university.admin.pocDesignation} />
                      <InfoRow icon={Mail} label="Email" value={
                        <a href={`mailto:${university.admin.pocEmail}`} className="text-[#3730A3] hover:underline">{university.admin.pocEmail}</a>
                      } />
                      <InfoRow icon={Phone} label="Phone" value={`${university.admin.phoneCountryCode || "+91"} ${university.admin.phoneNumber || university.admin.pocPhone || "—"}`} />
                    </div>
                  </DataCardPad>
                </DataCard>

                <DataCard>
                  <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                    <SectionLabel icon={Banknote} title="Bank Details" />
                  </div>
                  <DataCardPad>
                    <div className="space-y-3">
                      <InfoRow icon={School} label="Account Name" value={university.admin.accountName || "—"} />
                      <InfoRow icon={ScrollText} label="Account Number" value={university.admin.accountNumber || "—"} />
                      <InfoRow icon={Building2} label="Bank Name" value={university.admin.bankName || "—"} />
                      <InfoRow icon={MapPin} label="Branch" value={university.admin.bankBranch || "—"} />
                      <InfoRow icon={ScrollText} label="IFSC Code" value={university.admin.ifscCode || "—"} />
                      <InfoRow icon={Banknote} label="Commission" value={`${university.admin.commission}%`} />
                      {university.admin.gstNumber && <InfoRow icon={ScrollText} label="GST Number" value={university.admin.gstNumber} />}
                      {university.admin.panNumber && <InfoRow icon={ScrollText} label="PAN Number" value={university.admin.panNumber} />}
                    </div>
                  </DataCardPad>
                </DataCard>

                {university.admin.bankCountry && (
                  <DataCard className="md:col-span-2">
                    <div className="border-b border-[#ECEAE6] px-5 py-3.5">
                      <SectionLabel icon={Globe} title="International Bank Details" />
                    </div>
                    <DataCardPad>
                      <InfoRow icon={Globe} label="Bank Country" value={university.admin.bankCountry} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                        {university.admin.recipientName && <DetailCell label="Recipient Name" value={university.admin.recipientName} />}
                        {university.admin.recipientBank && <DetailCell label="Recipient Bank" value={university.admin.recipientBank} />}
                        {university.admin.bankIdCode && <DetailCell label="Bank ID Code (SWIFT/BIC)" value={university.admin.bankIdCode} mono />}
                        {university.admin.recipientInn && <DetailCell label="Recipient INN (TIN)" value={university.admin.recipientInn} />}
                        {university.admin.recipientKpp && <DetailCell label="Recipient KPP" value={university.admin.recipientKpp} />}
                        {university.admin.singleTreasuryAccount && <DetailCell label="Single Treasury Account" value={university.admin.singleTreasuryAccount} mono />}
                        {university.admin.paymentPurpose && <DetailCell label="Payment Purpose" value={university.admin.paymentPurpose} />}
                      </div>
                      {university.admin.bankDetails && Object.keys(university.admin.bankDetails).length > 0 && (
                        <div className="border-t border-[#ECEAE6] pt-3 mt-3">
                          <p className="text-xs text-[#9CA3AF] mb-2">Additional Bank Info</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(university.admin.bankDetails).map(([key, value]) => (
                              <DetailCell key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(value)} />
                            ))}
                          </div>
                        </div>
                      )}
                    </DataCardPad>
                  </DataCard>
                )}
              </div>
            ) : (
              <EmptyState icon={Settings} message="No admin details available" />
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             COURSES TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="courses" className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <SectionLabel icon={BookOpen} title={`Courses (${university.courses?.length || 0})`}
                action={
                  <Button size="sm" onClick={() => { setEditingCourse(null); setShowCourseModal(true); }}
                    className="bg-[#3730A3] hover:bg-[#312E81] text-white">
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Course
                  </Button>
                } />
            </div>

            {university.courses && university.courses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {university.courses.map((course: any) => (
                  <DataCard key={course.id} className={course.isActive === false ? 'opacity-60' : ''}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3730A3]/10 text-[#3730A3]">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-[#111]">{course.name}</h4>
                            <p className="text-xs text-[#9CA3AF]">{course.duration} years</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          <button onClick={() => { setEditingCourse(course); setShowCourseModal(true); }}
                            className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-[#F5F4F2] hover:text-[#6B6B6B] transition-colors">
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={async () => { if (confirm(`Delete ${course.name}?`)) { await deleteCourse.mutateAsync({ universityId: params.id as string, courseId: course.id }); } }}
                            className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between items-center py-1 border-b border-[#ECEAE6] last:border-0">
                          <span className="text-[#6B6B6B] text-xs">Fee</span>
                          <span className="font-medium text-[#111] text-xs">{university.fees?.currency || "$"} {course.fees?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-[#ECEAE6] last:border-0">
                          <span className="text-[#6B6B6B] text-xs">Seats</span>
                          <span className="font-medium text-[#111] text-xs">{course.seats || course.availableSeats || "—"}</span>
                        </div>
                        {course.eligibility && (
                          <div className="flex justify-between items-center py-1">
                            <span className="text-[#6B6B6B] text-xs">Eligibility</span>
                            <span className="text-right text-xs text-[#111]">{course.eligibility}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </DataCard>
                ))}
              </div>
            ) : (
              <EmptyState icon={BookOpen} message="No courses added yet"
                action={
                  <Button variant="outline" size="sm" onClick={() => { setEditingCourse(null); setShowCourseModal(true); }}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add First Course
                  </Button>
                } />
            )}
          </TabsContent>

          {/* ════════════════════════════════════════════════════════
             DOCUMENTS TAB
             ════════════════════════════════════════════════════════ */}
          <TabsContent value="documents" className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <SectionLabel icon={FileText} title={`Documents (${university.documents?.length || 0})`}
                action={
                  <Button size="sm" onClick={() => setShowDocUpload(true)}
                    className="bg-[#3730A3] hover:bg-[#312E81] text-white">
                    <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload Document
                  </Button>
                } />
            </div>

            {university.documents && university.documents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {university.documents.map((doc: any) => (
                  <DataCard key={doc.id}>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F4F2] shrink-0">
                            <FileText className="h-4 w-4 text-[#6B6B6B]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#111] truncate">{doc.type?.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-[#9CA3AF] truncate">{doc.fileName || 'No filename'}</p>
                            <p className="text-xs text-[#9CA3AF]">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-[#F5F4F2] hover:text-[#3730A3] transition-colors">
                            <Download className="h-3.5 w-3.5" />
                          </a>
                          <button onClick={async () => { if (confirm(`Delete this ${doc.type} document?`)) { await deleteDoc.mutateAsync({ universityId: params.id as string, documentId: doc.id }); } }}
                            className="rounded-md p-1.5 text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </DataCard>
                ))}
              </div>
            ) : (
              <EmptyState icon={FileText} message="No documents uploaded yet"
                action={
                  <Button variant="outline" size="sm" onClick={() => setShowDocUpload(true)}>
                    <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload First Document
                  </Button>
                } />
            )}
          </TabsContent>
        </Tabs>

        {/* ═══ Modals ═══ */}
        {showCourseModal && (
          <CourseModal
            course={editingCourse}
            currency={university.fees?.currency || "USD"}
            onClose={() => setShowCourseModal(false)}
            onSave={async (data) => {
              if (editingCourse) {
                await updateCourse.mutateAsync({ universityId: params.id as string, courseId: editingCourse.id, data });
              } else {
                await createCourse.mutateAsync({ universityId: params.id as string, data });
              }
              setShowCourseModal(false);
            }}
          />
        )}

        {showDocUpload && (
          <DocUploadModal
            universityId={params.id as string}
            onClose={() => setShowDocUpload(false)}
            onUpload={async (formData) => {
              await uploadDoc.mutateAsync({ universityId: params.id as string, data: formData });
              setShowDocUpload(false);
            }}
          />
        )}

        {showImageUpload && (
          <ImageUploadModal
            universityId={params.id as string}
            type={showImageUpload}
            onClose={() => setShowImageUpload(null)}
            onUpload={async (file) => {
              await uploadImage.mutateAsync({ universityId: params.id as string, file, type: showImageUpload! });
              setShowImageUpload(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

/* Helper for facility badges */
function FacilityBadge({ icon: Icon, label }: { icon: IconComponent; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-[#ECEAE6] bg-white px-2.5 py-1 text-xs text-[#6B6B6B]">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}
