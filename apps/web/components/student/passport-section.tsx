"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { useDashboardOverview, useUpdateProfile } from "@/domains/student/student.queries";
import { Plane, Pencil, Check, X } from "lucide-react";

export function PassportSection() {
  const { data: overview } = useDashboardOverview();
  const updateProfile = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ passportNumber: "", passportExpiry: "", passportIssueDate: "", passportIssueCountry: "" });

  const profile = overview?.profile;

  const startEdit = () => {
    setForm({
      passportNumber: profile?.passportNumber || "",
      passportExpiry: profile?.passportExpiry?.split("T")[0] || "",
      passportIssueDate: profile?.passportIssueDate?.split("T")[0] || "",
      passportIssueCountry: profile?.passportIssueCountry || "",
    });
    setEditing(true);
  };

  const save = () => {
    updateProfile.mutate({
      passportNumber: form.passportNumber || undefined,
      passportExpiry: form.passportExpiry || undefined,
      passportIssueDate: form.passportIssueDate || undefined,
      passportIssueCountry: form.passportIssueCountry || undefined,
    }, { onSuccess: () => setEditing(false) });
  };

  return (
    <Card size="xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-[#2D2154]">
          <Plane className="size-4" /> Passport & Travel
        </CardTitle>
        {!editing && (
          <Button size="sm" variant="ghost" onClick={startEdit} className="gap-1 text-xs">
            <Pencil className="size-3" /> Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Passport Number</Label>
                <Input value={form.passportNumber} onChange={e => setForm(f => ({ ...f, passportNumber: e.target.value }))} placeholder="e.g. A1234567" />
              </div>
              <div>
                <Label className="text-xs">Issue Country</Label>
                <Input value={form.passportIssueCountry} onChange={e => setForm(f => ({ ...f, passportIssueCountry: e.target.value }))} placeholder="e.g. India" />
              </div>
              <div>
                <Label className="text-xs">Issue Date</Label>
                <Input type="date" value={form.passportIssueDate} onChange={e => setForm(f => ({ ...f, passportIssueDate: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Expiry Date</Label>
                <Input type="date" value={form.passportExpiry} onChange={e => setForm(f => ({ ...f, passportExpiry: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="gap-1"><X className="size-3" /> Cancel</Button>
              <Button size="sm" onClick={save} disabled={updateProfile.isPending} className="gap-1"><Check className="size-3" /> Save</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Passport Number" value={profile?.passportNumber} />
            <Field label="Issue Country" value={profile?.passportIssueCountry} />
            <Field label="Issue Date" value={profile?.passportIssueDate ? new Date(profile.passportIssueDate).toLocaleDateString() : undefined} />
            <Field label="Expiry Date" value={profile?.passportExpiry ? new Date(profile.passportExpiry).toLocaleDateString() : undefined} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-[#2D2154]">{value || "—"}</p>
    </div>
  );
}
