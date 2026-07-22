"use client";

import { Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox } from "@repo/ui";
import type { WizardStep0Props } from "./new-page.types";

export function BasicInfoStep(props: WizardStep0Props) {
  const { formData, formErrors, onFieldUpdate, onRootFieldUpdate, onSetFormErrors, imageKeys, onSetImageKeys, onRemoveImage, onNormalizeUrl } = props;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Identity */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Identity</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>University Name *</Label>
            <Input
              data-error-field="name"
              value={formData.name}
              onChange={(e) => onRootFieldUpdate("name", e.target.value)}
              placeholder="ABC Medical College"
              className={formErrors.name ? "border-destructive" : ""}
            />
            {formErrors.name && (
              <p className="text-xs text-destructive mt-1">{formErrors.name}</p>
            )}
          </div>
          <div>
            <Label>Short Name *</Label>
            <Input
              data-error-field="shortName"
              value={formData.shortName}
              onChange={(e) => onRootFieldUpdate("shortName", e.target.value)}
              placeholder="ABC MC"
              className={formErrors.shortName ? "border-destructive" : ""}
            />
            {formErrors.shortName && (
              <p className="text-xs text-destructive mt-1">{formErrors.shortName}</p>
            )}
          </div>
          <div>
            <Label>Established Year *</Label>
            <Input
              data-error-field="establishedYear"
              type="number"
              inputMode="numeric"
              min={1800}
              max={new Date().getFullYear()}
              value={formData.establishedYear ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  onRootFieldUpdate("establishedYear", null as any);
                } else {
                  const num = parseInt(val);
                  if (!isNaN(num)) {
                    onRootFieldUpdate("establishedYear", num);
                  }
                }
              }}
              placeholder="e.g. 2000"
              className={formErrors.establishedYear ? "border-destructive" : ""}
            />
            {formErrors.establishedYear && (
              <p className="text-xs text-destructive mt-1">{formErrors.establishedYear}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div data-error-field="type">
            <Label>Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => {
                onRootFieldUpdate("type", v);
                if (v && formErrors.type) {
                  onSetFormErrors((prev: any) => ({ ...prev, type: undefined }));
                }
              }}
            >
              <SelectTrigger className={`w-full ${formErrors.type ? "border-destructive" : ""}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GOVERNMENT">Government</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="DEEMED">Deemed</SelectItem>
                <SelectItem value="AUTONOMOUS">Autonomous</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.type && (
              <p className="text-xs text-destructive mt-1">{formErrors.type}</p>
            )}
          </div>
          <div>
            <Label>Website *</Label>
            <Input
              data-error-field="website"
              type="url"
              inputMode="url"
              autoComplete="url"
              value={formData.website}
              onChange={(e) => onRootFieldUpdate("website", e.target.value)}
              onBlur={(e) => onNormalizeUrl("root", "website", e.target.value)}
              placeholder="https://university.edu"
              className={formErrors.website ? "border-destructive" : ""}
            />
            {formErrors.website && (
              <p className="text-xs text-destructive mt-1">{formErrors.website}</p>
            )}
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Social Media</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Facebook</Label>
            <Input
              data-error-field="socialLinks.facebook"
              type="url"
              inputMode="url"
              value={formData.socialLinks?.facebook || ""}
              onChange={(e) => onFieldUpdate("socialLinks", "facebook", e.target.value)}
              onBlur={(e) => onNormalizeUrl("socialLinks", "facebook", e.target.value)}
              placeholder="https://facebook.com/university"
              className={formErrors["socialLinks.facebook"] ? "border-destructive" : ""}
            />
            {formErrors["socialLinks.facebook"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.facebook"]}</p>
            )}
          </div>
          <div>
            <Label>Instagram</Label>
            <Input
              data-error-field="socialLinks.instagram"
              type="url"
              inputMode="url"
              value={formData.socialLinks?.instagram || ""}
              onChange={(e) => onFieldUpdate("socialLinks", "instagram", e.target.value)}
              onBlur={(e) => onNormalizeUrl("socialLinks", "instagram", e.target.value)}
              placeholder="https://instagram.com/university"
              className={formErrors["socialLinks.instagram"] ? "border-destructive" : ""}
            />
            {formErrors["socialLinks.instagram"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.instagram"]}</p>
            )}
          </div>
          <div>
            <Label>YouTube</Label>
            <Input
              data-error-field="socialLinks.youtube"
              type="url"
              inputMode="url"
              value={formData.socialLinks?.youtube || ""}
              onChange={(e) => onFieldUpdate("socialLinks", "youtube", e.target.value)}
              onBlur={(e) => onNormalizeUrl("socialLinks", "youtube", e.target.value)}
              placeholder="https://youtube.com/channel"
              className={formErrors["socialLinks.youtube"] ? "border-destructive" : ""}
            />
            {formErrors["socialLinks.youtube"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.youtube"]}</p>
            )}
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input
              data-error-field="socialLinks.linkedin"
              type="url"
              inputMode="url"
              value={formData.socialLinks?.linkedin || ""}
              onChange={(e) => onFieldUpdate("socialLinks", "linkedin", e.target.value)}
              onBlur={(e) => onNormalizeUrl("socialLinks", "linkedin", e.target.value)}
              placeholder="https://linkedin.com/school/university"
              className={formErrors["socialLinks.linkedin"] ? "border-destructive" : ""}
            />
            {formErrors["socialLinks.linkedin"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.linkedin"]}</p>
            )}
          </div>
          <div>
            <Label>Twitter / X</Label>
            <Input
              data-error-field="socialLinks.twitter"
              type="url"
              inputMode="url"
              value={formData.socialLinks?.twitter || ""}
              onChange={(e) => onFieldUpdate("socialLinks", "twitter", e.target.value)}
              onBlur={(e) => onNormalizeUrl("socialLinks", "twitter", e.target.value)}
              placeholder="https://twitter.com/university"
              className={formErrors["socialLinks.twitter"] ? "border-destructive" : ""}
            />
            {formErrors["socialLinks.twitter"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.twitter"]}</p>
            )}
          </div>
          <div>
            <Label>TikTok</Label>
            <Input
              data-error-field="socialLinks.tiktok"
              type="url"
              inputMode="url"
              value={formData.socialLinks?.tiktok || ""}
              onChange={(e) => onFieldUpdate("socialLinks", "tiktok", e.target.value)}
              onBlur={(e) => onNormalizeUrl("socialLinks", "tiktok", e.target.value)}
              placeholder="https://tiktok.com/@university"
              className={formErrors["socialLinks.tiktok"] ? "border-destructive" : ""}
            />
            {formErrors["socialLinks.tiktok"] && (
              <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.tiktok"]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Media</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:gap-6 items-start">
          {/* Logo */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Logo</Label>
            <div className="relative">
              <div
                className="group flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={async (e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file || !file.type.startsWith("image/")) return;
                  try {
                    const { uploadFile } = await import("@/domains/documents/documents.api");
                    const res = await uploadFile(file, "logos");
                    onRootFieldUpdate("logo", res.url);
                    onSetImageKeys((prev) => ({ ...prev, logo: res.key }));
                  } catch { alert("Logo upload failed"); }
                }}
                onClick={() => !formData.logo && document.getElementById("logo-upload")?.click()}
              >
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <>
                    <svg className="mb-1 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
                    <span className="text-[10px] text-muted-foreground">Upload</span>
                  </>
                )}
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const { uploadFile } = await import("@/domains/documents/documents.api");
                    const res = await uploadFile(file, "logos");
                    onRootFieldUpdate("logo", res.url);
                    onSetImageKeys((prev) => ({ ...prev, logo: res.key }));
                  } catch { alert("Logo upload failed"); }
                }} />
              </div>
              {formData.logo && (
                <button type="button" onClick={() => onRemoveImage("logo")} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] shadow hover:bg-destructive/90">✕</button>
              )}
            </div>
          </div>
          {/* Banner */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Banner Image</Label>
            <div className="relative">
              <div
                className="group flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={async (e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file || !file.type.startsWith("image/")) return;
                  try {
                    const { uploadFile } = await import("@/domains/documents/documents.api");
                    const res = await uploadFile(file, "banners");
                    onRootFieldUpdate("bannerImage", res.url);
                    onSetImageKeys((prev) => ({ ...prev, bannerImage: res.key }));
                  } catch { alert("Banner upload failed"); }
                }}
                onClick={() => !formData.bannerImage && document.getElementById("banner-upload")?.click()}
              >
                {formData.bannerImage ? (
                  <img src={formData.bannerImage} alt="Banner" className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <>
                    <svg className="mb-1 h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4a2 2 0 012.8 0L16 17m-2-2l1.6-1.6a2 2 0 012.8 0L20 15M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-xs text-muted-foreground">Drop or click to upload banner</span>
                    <span className="text-[10px] text-muted-foreground/60">1200×400px recommended</span>
                  </>
                )}
                <input id="banner-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const { uploadFile } = await import("@/domains/documents/documents.api");
                    const res = await uploadFile(file, "banners");
                    onRootFieldUpdate("bannerImage", res.url);
                    onSetImageKeys((prev) => ({ ...prev, bannerImage: res.key }));
                  } catch { alert("Banner upload failed"); }
                }} />
              </div>
              {formData.bannerImage && (
                <button type="button" onClick={() => onRemoveImage("bannerImage")} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] shadow hover:bg-destructive/90">✕</button>
              )}
            </div>
          </div>
        </div>
        {/* Brochure */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Brochure (PDF)</Label>
          <div className="relative">
            {formData.brochureUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                <svg className="h-8 w-8 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6H7zm7 1.5L18.5 8H14V3.5zM9 13h6v1.5H9V13zm0 3h6v1.5H9V16zm0-6h3v1.5H9V10z"/></svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Brochure uploaded</p>
                  <p className="text-xs text-muted-foreground truncate">{formData.brochureUrl}</p>
                </div>
                <button type="button" onClick={() => onRemoveImage("brochure")} className="text-destructive/70 hover:text-destructive text-xs font-medium">Remove</button>
              </div>
            ) : (
              <div
                className="group flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                onClick={() => document.getElementById("brochure-upload")?.click()}
              >
                <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
                <span className="text-sm text-muted-foreground">Upload brochure PDF</span>
              </div>
            )}
            <input id="brochure-upload" type="file" accept=".pdf,application/pdf" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.type !== "application/pdf") { alert("Please upload a PDF file"); return; }
              try {
                const { uploadFile } = await import("@/domains/documents/documents.api");
                const res = await uploadFile(file, "brochures");
                onRootFieldUpdate("brochureUrl", res.url);
                onSetImageKeys((prev) => ({ ...prev, brochure: res.key }));
              } catch { alert("Brochure upload failed"); }
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
