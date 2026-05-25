"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useMyVisaApplications, useCreateVisaApplication, useSubmitVisaApplication,
  useVisaCenters, useVisaChecklists,
} from "@/domains/visa-support";
import { Plus, Send, Loader2, Globe, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

var statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-800" },
  PROCESSING: { label: "Processing", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

export default function StudentVisaSupportPage() {
  var apps = useMyVisaApplications();
  var centers = useVisaCenters();
  var checklists = useVisaChecklists();
  var createMut = useCreateVisaApplication();
  var submitMut = useSubmitVisaApplication();
  var [open, setOpen] = useState(false);
  var [form, setForm] = useState({
    studentId: "", visaCenterId: "", checklistId: "",
    passportNumber: "", passportExpiry: "", visaType: "", remarks: "",
  });

  function resetForm() {
    setForm({ studentId: "", visaCenterId: "", checklistId: "", passportNumber: "", passportExpiry: "", visaType: "", remarks: "" });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createMut.mutateAsync(form);
    setOpen(false); resetForm();
  }

  async function handleSubmit(id: string) {
    await submitMut.mutateAsync(id);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between items-start">
        <div><h1 className="text-2xl font-bold">Visa Support</h1><p className="text-sm text-gray-500">Apply for visa assistance and track your application</p></div>
        <Sheet open={open} onOpenChange={function(v: boolean) { setOpen(v); if (!v) resetForm(); }}>
          <SheetTrigger>
            <Button><Plus className="size-4 mr-1" /> New Application</Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-lg overflow-y-auto">
            <SheetHeader><SheetTitle>New Visa Application</SheetTitle></SheetHeader>
            <form onSubmit={handleCreate} className="space-y-3 mt-4">
              <div><Label>Visa Center</Label>
                <Select value={form.visaCenterId} onValueChange={function(v: string | null) { setForm({ ...form, visaCenterId: v || "" }); }}>
                  <SelectTrigger><SelectValue placeholder="Select center" /></SelectTrigger>
                  <SelectContent>{(centers.data || []).map(function(c: any) { return <SelectItem key={c.id} value={c.id}>{c.name} - {c.city}, {c.country}</SelectItem>; })}</SelectContent>
                </Select>
              </div>
              <div><Label>Visa Checklist</Label>
                <Select value={form.checklistId} onValueChange={function(v: string | null) { setForm({ ...form, checklistId: v || "" }); }}>
                  <SelectTrigger><SelectValue placeholder="Select checklist" /></SelectTrigger>
                  <SelectContent>{(checklists.data || []).map(function(cl: any) { return <SelectItem key={cl.id} value={cl.id}>{cl.title} ({cl.country})</SelectItem>; })}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Passport Number</Label><Input value={form.passportNumber} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, passportNumber: e.target.value }); }} placeholder="e.g. Z1234567" /></div>
                <div><Label>Passport Expiry</Label><Input type="date" value={form.passportExpiry} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, passportExpiry: e.target.value }); }} /></div>
              </div>
              <div><Label>Visa Type</Label><Input value={form.visaType} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, visaType: e.target.value }); }} placeholder="e.g. Student Visa (D)" /></div>
              <div><Label>Remarks</Label><Textarea value={form.remarks} onChange={function(e: React.ChangeEvent<HTMLTextAreaElement>) { setForm({ ...form, remarks: e.target.value }); }} rows={3} placeholder="Any additional information" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={function() { setOpen(false); resetForm(); }}>Cancel</Button>
                <Button type="submit" disabled={createMut.isPending}>{createMut.isPending ? <Loader2 className="size-4 mr-1 animate-spin" /> : null} Create Draft</Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {apps.isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map(function(_: any, i: number) { return <Skeleton key={i} className="h-32 w-full" />; })}</div>
      ) : apps.error ? (
        <div className="text-center py-12"><p className="text-red-500">Failed to load visa applications</p><Button variant="outline" className="mt-2" onClick={function() { window.location.reload(); }}>Retry</Button></div>
      ) : (apps.data || []).length > 0 ? (
        <div className="space-y-3">{(apps.data || []).map(function(app: any) { return (
          <Card key={app.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="size-4 text-[#4B2D8E]" />
                    {app.visaCenter ? app.visaCenter.name : "Visa Application"}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{app.visaCenter ? app.visaCenter.city + ", " + app.visaCenter.country : ""}</p>
                </div>
                <Badge className={(statusConfig[app.status as string] || {}).color || ""}>{(statusConfig[app.status as string] || {}).label || app.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Passport:</span> <span className="font-medium">{app.passportNumber || "-"}</span></div>
                <div><span className="text-gray-500">Visa Type:</span> <span className="font-medium">{app.visaType || "-"}</span></div>
                {app.passportExpiry ? <div><span className="text-gray-500">Expiry:</span> <span className="font-medium">{new Date(app.passportExpiry).toLocaleDateString()}</span></div> : null}
                <div><span className="text-gray-500">Created:</span> <span className="font-medium">{new Date(app.createdAt).toLocaleDateString()}</span></div>
              </div>
              {app.remarks ? <p className="text-sm text-gray-600 mt-2 italic">{app.remarks}</p> : null}
              {app.status === "DRAFT" ? (
                <div className="mt-3">
                  <Button size="sm" onClick={function() { handleSubmit(app.id); }} disabled={submitMut.isPending}>
                    <Send className="size-4 mr-1" /> Submit Application
                  </Button>
                </div>
              ) : null}
              {app.status === "REJECTED" && app.remarks ? (
                <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">Reason: {app.remarks}</div>
              ) : null}
            </CardContent>
          </Card>); })}</div>
      ) : (
        <div className="text-center py-12">
          <Globe className="size-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-600">No visa applications yet</h3>
          <p className="text-sm text-gray-400 mt-1">Start your visa application process</p>
        </div>
      )}
    </div>
  );
}




