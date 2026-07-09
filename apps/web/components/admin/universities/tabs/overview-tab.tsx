"use client";

import React, { useState } from "react";
import { Card, CardContent, Button } from "@repo/ui";
import {
  SectionHeading,
  InfoRow,
  BadgeList,
  AmenityCheck,
} from "@/components/admin/universities/ui";
import { GalleryGrid } from "@/components/admin/universities/gallery";
import { toast } from "sonner";
import {
  Building2,
  School,
  BookOpen,
  Calendar,
  Globe,
  Download,
  ExternalLink,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  Clock,
  GraduationCap,
  Stethoscope,
  Users,
  Medal,
  FileText,
  Heart,
  PlayCircle,
  ImageIcon,
  Plus,
  Upload,
  Loader2,
  TrendingUp,
  Briefcase,
  MessageSquare,
  Building,
  Languages,
  Award,
  Hash,
} from "lucide-react";

interface Props {
  university: any;
  a: any;
  loc: any;
  contact: any;
  supp: any;
  router: any;
  uniId: string;
  refetch: () => void;
  updateUniversityMut: any;
}

export function OverviewTab({
  university,
  a,
  loc,
  contact,
  supp,
  router,
  uniId,
  refetch,
  updateUniversityMut,
}: Props) {
  const [galleryPreview, setGalleryPreview] = useState<File | null>(null);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setGalleryPreview(e.target.files[0]);
    setGalleryProgress(0);
  };

  const handleGalleryUpload = async () => {
    if (!galleryPreview) return;
    setIsUploadingGallery(true);
    setGalleryProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", galleryPreview);
      const { api } = await import("@/shared/api/axios");
      const cluster = university.slug;
      const res = await api.post(
        "/upload?folder=gallery-images/" + cluster,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e: any) => {
            if (e.total)
              setGalleryProgress(Math.round((e.loaded * 100) / e.total));
          },
        },
      );
      const body = res.data as any;
      const url = body?.url || body?.data?.url;
      const currentGallery = university.content?.gallery || [];
      const updatedGallery = [...currentGallery, url];
      const {
        id: _cid,
        universityId: _cuid2,
        ...contentSafe
      } = university.content || {};
      await updateUniversityMut.mutateAsync({
        id: uniId,
        data: { content: { ...contentSafe, gallery: updatedGallery } },
      });
      toast.success("Media added to gallery");
      setGalleryPreview(null);
      setGalleryProgress(0);
    } catch {
      toast.error("Failed to upload");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleGalleryDelete = async (indexToDelete: number) => {
    if (!confirm("Remove this image from gallery?")) return;
    try {
      const currentGallery = university.content?.gallery || [];
      const updatedGallery = currentGallery.filter(
        (_: any, idx: number) => idx !== indexToDelete,
      );
      const {
        id: _cid,
        universityId: _cuid,
        ...contentSafe
      } = university.content || {};
      await updateUniversityMut.mutateAsync({
        id: uniId,
        data: { content: { ...contentSafe, gallery: updatedGallery } },
      });
      toast.success("Image removed from gallery");
    } catch {
      toast.error("Failed to update gallery");
    }
  };

  return (
    <>
      {/* Info grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Basic Info */}
        <Card size="sm" className="border-brand-hairline shadow-sm">
          <CardContent className="space-y-3 p-4 sm:p-5">
            <SectionHeading
              icon={Building2}
              title="Basic Information"
              onEdit={() =>
                router.push(`/admin/universities/${uniId}/edit?section=basic`)
              }
            />
            <InfoRow icon={School} label="Full Name" value={university.name} />
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
            {university.website && (
              <InfoRow
                icon={Globe}
                label="Website"
                value={
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-gold hover:underline"
                  >
                    {university.website.replace(new RegExp("^https?://"), "")}
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
                    className="inline-flex items-center gap-1 text-brand-gold hover:underline"
                  >
                    Download Brochure <Download className="h-3 w-3" />
                  </a>
                }
              />
            )}
            <InfoRow icon={Globe} label="Slug" value={university.slug} />
            <InfoRow
              icon={CheckCircle2}
              label="Verified"
              value={
                university.verifiedAt
                  ? new Date(university.verifiedAt).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long", year: "numeric" },
                    )
                  : "Not verified"
              }
            />
            {university._count && (
              <InfoRow
                icon={ClipboardList}
                label="Applications"
                value={university._count.applications ?? 0}
              />
            )}
            {university.updatedAt && (
              <InfoRow
                icon={Calendar}
                label="Last Updated"
                value={new Date(university.updatedAt).toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Location */}
        {loc && (
          <Card size="sm" className="border-brand-hairline shadow-sm">
            <CardContent className="space-y-3 p-4 sm:p-5">
              <SectionHeading
                icon={MapPin}
                title="Location"
                onEdit={() =>
                  router.push(
                    `/admin/universities/${uniId}/edit?section=location`,
                  )
                }
              />
              <InfoRow icon={Globe} label="Country" value={loc.country} />
              <InfoRow icon={MapPin} label="State" value={loc.state} />
              <InfoRow icon={MapPin} label="City" value={loc.city} />
              <InfoRow icon={MapPin} label="Address" value={loc.address} />
              <InfoRow
                icon={MapPin}
                label="Latitude"
                value={loc.latitude ?? "—"}
              />
              <InfoRow
                icon={MapPin}
                label="Longitude"
                value={loc.longitude ?? "—"}
              />
            </CardContent>
          </Card>
        )}

        {/* Contact */}
        {contact && (
          <Card size="sm" className="border-brand-hairline shadow-sm">
            <CardContent className="space-y-3 p-4 sm:p-5">
              <SectionHeading
                icon={Phone}
                title="Contact"
                onEdit={() =>
                  router.push(
                    `/admin/universities/${uniId}/edit?section=contact`,
                  )
                }
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-brand-gold hover:underline"
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
                    className="text-brand-gold hover:underline"
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

        {/* Academic */}
        {a && (
          <>
            <Card size="sm" className="border-brand-hairline shadow-sm">
              <CardContent className="space-y-3 p-4 sm:p-5">
                <SectionHeading
                  icon={BookOpen}
                  title="Syllabus & Curriculum"
                  onEdit={() =>
                    router.push(
                      `/admin/universities/${uniId}/edit?section=academic`,
                    )
                  }
                />
                <InfoRow
                  icon={GraduationCap}
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
                {a.curriculumType && (
                  <InfoRow
                    icon={BookOpen}
                    label="Curriculum Type"
                    value={a.curriculumType}
                  />
                )}
                {a.clinicalTraining && (
                  <InfoRow
                    icon={Stethoscope}
                    label="Clinical Training"
                    value={a.clinicalTraining}
                  />
                )}
              </CardContent>
            </Card>
            <Card size="sm" className="border-brand-hairline shadow-sm">
              <CardContent className="space-y-3 p-4 sm:p-5">
                <SectionHeading icon={Users} title="Seat Distribution" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-brand-gold-light/50 p-3 text-center border border-brand-gold-light">
                    <p className="text-lg font-bold text-brand-gold">
                      {a.totalSeats}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-ink-muted">
                      Total
                    </p>
                  </div>
                  <div className="rounded-lg bg-brand-canvas p-3 text-center border border-brand-hairline">
                    <p className="text-lg font-bold text-brand-ink">
                      {a.governmentSeats}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-ink-muted">
                      Govt
                    </p>
                  </div>
                  <div className="rounded-lg bg-brand-canvas p-3 text-center border border-brand-hairline">
                    <p className="text-lg font-bold text-brand-ink">
                      {a.managementSeats}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-ink-muted">
                      Management
                    </p>
                  </div>
                  <div className="rounded-lg bg-brand-canvas p-3 text-center border border-brand-hairline">
                    <p className="text-lg font-bold text-brand-ink">
                      {a.nriSeats}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-ink-muted">
                      NRI
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {a.specializations?.length > 0 && (
              <Card className="border-brand-hairline shadow-sm md:col-span-2">
                <CardContent className="p-5">
                  <SectionHeading
                    icon={Medal}
                    title="Recognized Departments & Specializations"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {a.specializations.map((spec) => (
                      <div
                        key={spec}
                        className="flex items-center gap-2.5 rounded-lg border border-brand-hairline bg-brand-canvas px-3.5 py-2.5 hover:bg-brand-gold-light transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                        <span className="text-sm font-semibold text-brand-ink">
                          {spec}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Social Links */}
        {university.socialLinks && (
          <Card size="sm" className="border-brand-hairline shadow-sm">
            <CardContent className="space-y-3 p-4 sm:p-5">
              <SectionHeading
                icon={ExternalLink}
                title="Social Media"
                onEdit={() =>
                  router.push(
                    `/admin/universities/${uniId}/edit?section=social`,
                  )
                }
              />
              {(() => {
                const links: Record<string, string> =
                  university.socialLinks as Record<string, string>;
                const platformIcons: Record<
                  string,
                  { icon: IconComponent; label: string }
                > = {
                  facebook: { icon: Globe, label: "Facebook" },
                  instagram: { icon: Globe, label: "Instagram" },
                  youtube: { icon: Globe, label: "YouTube" },
                  linkedin: { icon: Globe, label: "LinkedIn" },
                  twitter: { icon: Globe, label: "Twitter / X" },
                  tiktok: { icon: Globe, label: "TikTok" },
                };
                const hasLinks = Object.entries(platformIcons).some(
                  ([key]) => links[key],
                );
                if (!hasLinks)
                  return (
                    <p className="text-xs text-brand-ink-muted italic">
                      No social links added.
                    </p>
                  );
                return (
                  <div className="space-y-2">
                    {Object.entries(platformIcons).map(([key, config]) => {
                      const url = links[key];
                      if (!url) return null;
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-3 rounded-lg border border-brand-hairline bg-brand-canvas/50 px-3 py-2"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gold-light text-brand-gold">
                            <config.icon className="h-3.5 w-3.5" />
                          </div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-brand-ink hover:text-brand-gold transition-colors truncate"
                          >
                            {config.label}
                          </a>
                          <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-brand-ink-muted/50" />
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* About / Content */}
        {university.content &&
          (() => {
            const c = university.content;
            const hasAbout =
              c.shortDescription ||
              c.longDescription ||
              c.highlights?.length > 0 ||
              c.whyChooseUs;
            if (!hasAbout) return null;
            return (
              <Card
                size="sm"
                className="border-brand-hairline shadow-sm md:col-span-2"
              >
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading
                    icon={FileText}
                    title="About"
                    onEdit={() =>
                      router.push(`/admin/universities/${uniId}/edit`)
                    }
                  />
                  {c.shortDescription && (
                    <InfoRow
                      icon={FileText}
                      label="Short Description"
                      value={c.shortDescription}
                    />
                  )}
                  {c.longDescription && (
                    <InfoRow
                      icon={FileText}
                      label="Long Description"
                      value={
                        <div className="relative">
                          <p className="text-sm text-brand-ink leading-relaxed whitespace-pre-line line-clamp-4">
                            {c.longDescription}
                          </p>
                          {c.longDescription.length > 200 && (
                            <button className="mt-1 text-xs font-medium text-brand-gold hover:underline">
                              Read more
                            </button>
                          )}
                        </div>
                      }
                    />
                  )}
                  {c.highlights?.length > 0 && (
                    <InfoRow
                      icon={Medal}
                      label="Highlights"
                      value={
                        <div className="flex flex-wrap gap-1.5">
                          {c.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center rounded-md bg-brand-gold-light px-2.5 py-1 text-xs font-medium text-brand-gold"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      }
                    />
                  )}
                  {c.whyChooseUs && (
                    <InfoRow
                      icon={Heart}
                      label="Why Choose Us"
                      value={
                        <p className="text-sm text-brand-ink-muted leading-relaxed line-clamp-3">
                          {c.whyChooseUs}
                        </p>
                      }
                    />
                  )}

                  {c.virtualTour && (
                    <InfoRow
                      icon={PlayCircle}
                      label="Virtual Tour"
                      value={
                        <a
                          href={c.virtualTour}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-gold hover:underline"
                        >
                          {c.virtualTour} <ExternalLink className="h-3 w-3" />
                        </a>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            );
          })()}

        {/* Student Demographics */}
        {university.studentDemographics &&
          (() => {
            const demo = university.studentDemographics as any;
            const total = demo.totalStudents || 0;
            const local = demo.localStudents || 0;
            const foreign = demo.foreignStudents || 0;
            if (!total && !local && !foreign) return null;
            return (
              <Card size="sm" className="border-brand-hairline shadow-sm">
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <SectionHeading
                    icon={Users}
                    title="Student Demographics"
                    onEdit={() =>
                      router.push(
                        `/admin/universities/${uniId}/edit?section=demographics`,
                      )
                    }
                  />
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: "Total", value: total },
                      { label: "Local", value: local },
                      { label: "Foreign", value: foreign },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl bg-brand-gold-light/40 p-3.5 border border-brand-gold-light"
                      >
                        <p className="text-xl font-bold text-brand-gold">
                          {value.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-ink-muted mt-0.5">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                  {demo.foreignByCountry?.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-ink-muted mb-2">
                        Foreign Students By Country
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {demo.foreignByCountry.map((item: any, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-md border border-brand-gold-light bg-brand-gold-light/30 px-2.5 py-1 text-xs font-medium text-brand-ink"
                          >
                            <Globe className="h-3 w-3 text-brand-gold" />{" "}
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
      <Card size="sm" className="border-brand-hairline shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionHeading icon={ImageIcon} title="Gallery" />
            <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-brand-hairline bg-brand-gold-light/50 px-3 py-1.5 text-xs font-semibold text-brand-gold hover:bg-brand-gold-light transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Add Photo/Video
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleGalleryFileSelect}
                disabled={isUploadingGallery}
              />
            </label>
          </div>

          {galleryPreview && (
            <div className="mb-4 rounded-xl border border-brand-gold-light bg-brand-gold-light/20 p-4">
              <div className="relative mb-3 aspect-video max-h-60 overflow-hidden rounded-lg border border-brand-hairline bg-brand-canvas">
                {galleryPreview.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(galleryPreview)}
                    className="h-full w-full object-contain"
                    controls
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(galleryPreview)}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              {isUploadingGallery ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-brand-ink-muted">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading... {galleryProgress}%
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-brand-hairline">
                    <div
                      className="h-full rounded-full bg-brand-gold transition-all duration-300"
                      style={{ width: `${galleryProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-brand-gold hover:brightness-90 text-white shadow-sm"
                    onClick={handleGalleryUpload}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1" /> Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-brand-hairline text-brand-ink-muted"
                    onClick={() => setGalleryPreview(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          <GalleryGrid
            images={university.content?.gallery || []}
            onDelete={handleGalleryDelete}
          />
        </CardContent>
      </Card>

      {/* Support — merged from old Support tab */}
      {supp && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card className="border-brand-hairline bg-white rounded-xl shadow-sm">
              <CardContent className="space-y-4 p-5">
                <SectionHeading
                  icon={TrendingUp}
                  title="Placement History & Statistics"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-brand-gold-light bg-brand-gold-light/40 p-5 text-center">
                    <p className="text-3xl font-bold text-brand-gold">
                      {supp.placementRate}%
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-brand-ink-muted">
                      Placement Rate
                    </p>
                  </div>
                  <div className="rounded-xl border border-brand-gold-light bg-brand-gold-light/40 p-5 text-center">
                    <p className="text-3xl font-bold text-brand-gold">
                      ₹{supp.averagePackage?.toLocaleString() ?? "—"}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-brand-ink-muted">
                      Avg Annual Package
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {supp.topRecruiters?.length > 0 && (
              <Card className="border-brand-hairline shadow-sm">
                <CardContent className="p-5">
                  <SectionHeading icon={Briefcase} title="Top Recruiters" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {supp.topRecruiters.map((r: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-lg border border-brand-gold-light bg-brand-gold-light/30 px-3 py-1.5 text-sm font-medium text-brand-ink hover:bg-brand-gold-light transition-colors"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="border-brand-hairline bg-white rounded-xl shadow-sm">
              <CardContent className="space-y-4 p-5">
                <SectionHeading
                  icon={Heart}
                  title="Student Support & Services"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AmenityCheck
                    icon={Globe}
                    label="Visa Processing Assistance"
                    checked={supp.visaAssistance}
                  />
                  <AmenityCheck
                    icon={MessageSquare}
                    label="Counseling Services"
                    checked={supp.counselingServices}
                  />
                  <AmenityCheck
                    icon={Briefcase}
                    label="Post-Graduation Guidance"
                    checked={supp.careerGuidance}
                  />
                  <AmenityCheck
                    icon={Users}
                    label="International Student Support"
                    checked={supp.internationalStudentSupport}
                  />
                  <AmenityCheck
                    icon={Building2}
                    label="Alumni Network"
                    checked={supp.alumniNetwork}
                  />
                </div>
                {supp.alumniCount != null && (
                  <InfoRow
                    icon={Users}
                    label="Alumni Count"
                    value={supp.alumniCount.toLocaleString()}
                  />
                )}
              </CardContent>
            </Card>
            {supp.languageSupport?.length > 0 && (
              <Card className="border-brand-hairline bg-white rounded-xl shadow-sm md:col-span-2">
                <CardContent className="p-5">
                  <SectionHeading icon={Languages} title="Language Support" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {supp.languageSupport.map((lang: string) => (
                      <div
                        key={lang}
                        className="inline-flex items-center gap-2 rounded-lg border border-brand-gold-light bg-brand-gold-light/30 px-3.5 py-2 hover:bg-brand-gold-light transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-gold" />
                        <span className="text-sm font-semibold text-brand-ink">
                          {lang}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </>
  );
}
