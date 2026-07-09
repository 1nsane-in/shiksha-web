"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui";
import { Loader2, FileUp, Upload } from "lucide-react";
import { ModalBackdrop, ModalHeader } from "./ui";

/* ─── Course Modal ─── */
export function CourseModal({ course, currency, onClose, onSave }: { course: any; currency: string; onClose: () => void; onSave: (data: any) => Promise<void> }) {
  const [name, setName] = useState(course?.name || "");
  const [duration, setDuration] = useState(course?.duration || 5);
  const [fees, setFees] = useState(course?.fees || 0);
  const [curr, setCurr] = useState(course?.currency || currency || "USD");
  const [seats, setSeats] = useState(course?.seats || 0);
  const [availableSeats, setAvailableSeats] = useState(course?.availableSeats ?? "");
  const [eligibility, setEligibility] = useState(course?.eligibility || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try { await onSave({ name, duration: Number(duration), fees: Number(fees), currency: curr, seats: Number(seats), availableSeats: availableSeats ? Number(availableSeats) : null, eligibility }); }
    finally { setSaving(false); }
  };

  const inputCls = "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700/20 focus:outline-none transition-colors";

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title={course ? "Edit Course" : "Add Course"} onClose={onClose} />
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500">Course Name</label>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. MBBS, MD General Medicine" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Duration (years)</label>
            <input type="number" min={1} className={inputCls} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Annual Fee</label>
            <input type="number" min={0} className={inputCls} value={fees} onChange={(e) => setFees(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Currency</label>
            <select className={inputCls} value={curr} onChange={(e) => setCurr(e.target.value)}>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="RUB">RUB</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Total Seats</label>
            <input type="number" min={0} className={inputCls} value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Available Seats</label>
            <input type="number" min={0} className={inputCls} value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Eligibility</label>
          <input className={inputCls} value={eligibility} onChange={(e) => setEligibility(e.target.value)} placeholder="e.g. NEET 50%" />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving || !name.trim()} className="bg-indigo-700 hover:bg-indigo-900 text-white">
          {saving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
          {saving ? "Saving..." : course ? "Update Course" : "Add Course"}
        </Button>
      </div>
    </ModalBackdrop>
  );
}

/* ─── Doc Upload Modal ─── */
export function DocUploadModal({ onClose, onUpload }: { universityId: string; onClose: () => void; onUpload: (fd: FormData) => Promise<void> }) {
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
          <label className="text-xs font-medium text-gray-500">Document Type</label>
          <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700/20 focus:outline-none transition-colors" value={type} onChange={(e) => setType(e.target.value)}>
            {docTypes.map((dt) => (<option key={dt.value} value={dt.value}>{dt.label}</option>))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">File</label>
          <label className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 px-4 py-4 text-sm text-gray-500 hover:border-indigo-700 hover:text-indigo-700 transition-colors">
            <FileUp className="h-5 w-5" />
            {file ? file.name : "Choose file..."}
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleUpload} disabled={uploading || !file} className="bg-indigo-700 hover:bg-indigo-900 text-white">
          {uploading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </ModalBackdrop>
  );
}

/* ─── Image Upload Modal ─── */
export function ImageUploadModal({ type, onClose, onUpload }: { universityId: string; type: "logo" | "banner" | "gallery"; onClose: () => void; onUpload: (file: File) => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const labels = { logo: "University Logo", banner: "Banner Image", gallery: "Gallery Image" };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try { await onUpload(file); }
    finally { setUploading(false); }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalHeader title={`Upload ${labels[type]}`} onClose={onClose} />
      <div className="space-y-4">
        {file && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-contain" />
          </div>
        )}
        <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 hover:border-indigo-700 hover:text-indigo-700 transition-colors">
          <Upload className="h-5 w-5" />
          {file ? file.name : `Choose ${labels[type]}...`}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleUpload} disabled={uploading || !file} className="bg-indigo-700 hover:bg-indigo-900 text-white">
          {uploading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </ModalBackdrop>
  );
}
