"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import {
  useVisaCenters, useCreateVisaCenter, useUpdateVisaCenter, useDeleteVisaCenter,
  useVisaChecklists, useCreateVisaChecklist, useUpdateVisaChecklist, useDeleteVisaChecklist,
  useAllVisaApplications, useDecideVisaApplication,
} from "@/domains/visa-support";
import type { VisaCenter, VisaChecklist, VisaApplication } from "@/domains/visa-support";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";

var statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

function CentersTab() {
  var q = useVisaCenters();
  var createMut = useCreateVisaCenter();
  var updateMut = useUpdateVisaCenter();
  var deleteMut = useDeleteVisaCenter();
  var [open, setOpen] = useState(false);
  var [edit, setEdit] = useState<VisaCenter | null>(null);
  var [form, setForm] = useState({ name: "", city: "", country: "", address: "", contactNo: "", email: "", website: "" });

  function reset() { setForm({ name: "", city: "", country: "", address: "", contactNo: "", email: "", website: "" }); setEdit(null); }

  function beginAdd() { reset(); setOpen(true); }

  function beginEdit(item: VisaCenter) {
    setEdit(item);
    setForm({ name: item.name, city: item.city, country: item.country, address: item.address || "", contactNo: item.contactNo || "", email: item.email || "", website: item.website || "" });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (edit) { await updateMut.mutateAsync({ id: edit.id, ...form }); }
    else { await createMut.mutateAsync(form); }
    setOpen(false); reset();
  }

  if (q.isLoading) return <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>;
  if (q.error) return <div className="text-center py-8 text-red-500">Failed to load visa centers</div>;
  var centers = q.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Visa Centers</h3>
        <Button size="sm" onClick={beginAdd}><Plus className="size-4 mr-1" /> Add Center</Button>
      </div>
      <Sheet open={open} onOpenChange={function(v: boolean) { setOpen(v); if (!v) reset(); }}>
        <SheetContent>
          <SheetHeader><SheetTitle>{edit ? "Edit" : "Add"} Visa Center</SheetTitle></SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-4">
            <div><Label>Name</Label><Input value={form.name} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, name: e.target.value }); }} required /></div>
            <div><Label>City</Label><Input value={form.city} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, city: e.target.value }); }} required /></div>
            <div><Label>Country</Label><Input value={form.country} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, country: e.target.value }); }} required /></div>
            <div><Label>Address</Label><Input value={form.address} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, address: e.target.value }); }} /></div>
            <div><Label>Contact No</Label><Input value={form.contactNo} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, contactNo: e.target.value }); }} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, email: e.target.value }); }} /></div>
            <div><Label>Website</Label><Input value={form.website} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, website: e.target.value }); }} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={function() { setOpen(false); reset(); }}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {((createMut.isPending || updateMut.isPending) ? <Loader2 className="size-4 mr-1 animate-spin" /> : null)}
                {edit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
      {centers.length > 0 ? (
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>City</TableHead><TableHead>Country</TableHead><TableHead>Contact</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>{centers.map(function(c: VisaCenter) { return (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{c.city}</TableCell>
              <TableCell>{c.country}</TableCell>
              <TableCell>{c.contactNo || "-"}</TableCell>
              <TableCell><Badge variant={c.isActive ? "default" : "secondary"}>{c.isActive ? "Active" : "Inactive"}</Badge></TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={function() { beginEdit(c); }}><Pencil className="size-4" /></Button>
                <Button variant="ghost" size="sm" onClick={function() { deleteMut.mutate(c.id); }}><Trash2 className="size-4 text-red-500" /></Button>
              </TableCell>
            </TableRow>); })}</TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-gray-500">No visa centers yet. Add your first one.</div>
      )}
    </div>
  );
}

function ChecklistsTab() {
  var q = useVisaChecklists();
  var createMut = useCreateVisaChecklist();
  var updateMut = useUpdateVisaChecklist();
  var deleteMut = useDeleteVisaChecklist();
  var [open, setOpen] = useState(false);
  var [edit, setEdit] = useState<VisaChecklist | null>(null);
  var [form, setForm] = useState({ country: "", title: "", description: "", documentsText: "" });

  function reset() { setForm({ country: "", title: "", description: "", documentsText: "" }); setEdit(null); }

  function beginAdd() { reset(); setOpen(true); }

  function beginEdit(item: VisaChecklist) {
    setEdit(item);
    setForm({ country: item.country, title: item.title, description: item.description || "", documentsText: item.documents.join(String.fromCharCode(10)) });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    var docs = form.documentsText.split(String.fromCharCode(10)).map(function(s: string) { return s.trim(); }).filter(Boolean);
    var payload = { country: form.country, title: form.title, description: form.description || undefined, documents: docs };
    if (edit) { await updateMut.mutateAsync({ id: edit.id, ...payload }); }
    else { await createMut.mutateAsync(payload); }
    setOpen(false); reset();
  }

  if (q.isLoading) return <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>;
  if (q.error) return <div className="text-center py-8 text-red-500">Failed to load checklists</div>;
  var data = q.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Visa Checklists</h3>
        <Button size="sm" onClick={beginAdd}><Plus className="size-4 mr-1" /> Add Checklist</Button>
      </div>
      <Sheet open={open} onOpenChange={function(v: boolean) { setOpen(v); if (!v) reset(); }}>
        <SheetContent className="max-w-lg">
          <SheetHeader><SheetTitle>{edit ? "Edit" : "Add"} Visa Checklist</SheetTitle></SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-4">
            <div><Label>Country</Label><Input value={form.country} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, country: e.target.value }); }} required /></div>
            <div><Label>Title</Label><Input value={form.title} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, title: e.target.value }); }} required /></div>
            <div><Label>Description</Label><Input value={form.description} onChange={function(e: React.ChangeEvent<HTMLInputElement>) { setForm({ ...form, description: e.target.value }); }} /></div>
            <div><Label>Required Documents</Label><Textarea value={form.documentsText} onChange={function(e: React.ChangeEvent<HTMLTextAreaElement>) { setForm({ ...form, documentsText: e.target.value }); }} rows={4} placeholder="One document per line" /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={function() { setOpen(false); reset(); }}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {((createMut.isPending || updateMut.isPending) ? <Loader2 className="size-4 mr-1 animate-spin" /> : null)}
                {edit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
      <div className="space-y-3">
      {data.length > 0 ? data.map(function(cl: VisaChecklist) { return (
        <Card key={cl.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div><CardTitle className="text-base">{cl.title}</CardTitle><p className="text-sm text-gray-500">{cl.country}</p></div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={function() { beginEdit(cl); }}><Pencil className="size-4" /></Button>
                <Button variant="ghost" size="sm" onClick={function() { deleteMut.mutate(cl.id); }}><Trash2 className="size-4 text-red-500" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {cl.description ? <p className="text-sm mb-2">{cl.description}</p> : null}
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {cl.documents.map(function(d: string, i: number) { return <li key={i}>{d}</li>; })}
            </ul>
          </CardContent>
        </Card>); }) : (
        <div className="text-center py-8 text-gray-500">No checklists yet. Add your first one.</div>
      )}
      </div>
    </div>
  );
}

function ApplicationsTab() {
  var q = useAllVisaApplications();
  var decideMut = useDecideVisaApplication();

  function handleDecide(id: string, decision: "APPROVED" | "REJECTED") {
    decideMut.mutateAsync({ id: id, decision: decision });
  }

  if (q.isLoading) return <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>;
  if (q.error) return <div className="text-center py-8 text-red-500">Failed to load applications</div>;
  var data = q.data || [];

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Visa Applications</h3>
      {data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow><TableHead>ID</TableHead><TableHead>Passport</TableHead><TableHead>Visa Type</TableHead><TableHead>Center</TableHead><TableHead>Status</TableHead><TableHead>Submitted</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>{data.map(function(app: VisaApplication) { return (
            <TableRow key={app.id}>
              <TableCell className="font-mono text-xs">{app.id.slice(0, 8)}...</TableCell>
              <TableCell>{app.passportNumber || "-"}</TableCell>
              <TableCell>{app.visaType || "-"}</TableCell>
              <TableCell>{app.visaCenter ? app.visaCenter.name : "-"}</TableCell>
              <TableCell><Badge className={statusColors[app.status] || ""}>{app.status}</Badge></TableCell>
              <TableCell>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "-"}</TableCell>
              <TableCell className="text-right">
                {(app.status === "SUBMITTED" || app.status === "PROCESSING") ? (
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="sm" className="text-green-600" onClick={function() { handleDecide(app.id, "APPROVED"); }} disabled={decideMut.isPending}><CheckCircle className="size-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={function() { handleDecide(app.id, "REJECTED"); }} disabled={decideMut.isPending}><XCircle className="size-4" /></Button>
                  </div>
                ) : null}
              </TableCell>
            </TableRow>); })}</TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-gray-500">No visa applications yet.</div>
      )}
    </div>
  );
}

export default function AdminVisaSupportPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div><h1 className="text-2xl font-bold">Visa Support</h1><p className="text-sm text-gray-500">Manage visa centers, checklists, and applications</p></div>
      <Tabs defaultValue="centers">
        <TabsList><TabsTrigger value="centers">Visa Centers</TabsTrigger><TabsTrigger value="checklists">Checklists</TabsTrigger><TabsTrigger value="applications">Applications</TabsTrigger></TabsList>
        <TabsContent value="centers"><Card><CardContent className="pt-6"><CentersTab /></CardContent></Card></TabsContent>
        <TabsContent value="checklists"><Card><CardContent className="pt-6"><ChecklistsTab /></CardContent></Card></TabsContent>
        <TabsContent value="applications"><Card><CardContent className="pt-6"><ApplicationsTab /></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

