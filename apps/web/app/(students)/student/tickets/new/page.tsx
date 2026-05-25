"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { useCreateTicket, useMyTickets } from "@/domains/tickets";
import { useMyApplications } from "@/domains/student";
import { toast } from "sonner";
import {
  ArrowLeft, Send, AlertCircle,
} from "lucide-react";

export default function NewTicketPage() {
  const router = useRouter();
  const createTicket = useCreateTicket();
  const { data: appsData } = useMyApplications();
  const applications = appsData?.data ?? [];

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [applicationId, setApplicationId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!subject.trim() || subject.trim().length < 3) {
      errs.subject = "Subject must be at least 3 characters";
    }
    if (!description.trim() || description.trim().length < 10) {
      errs.description = "Description must be at least 10 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const ticket = await createTicket.mutateAsync({
        subject: subject.trim(),
        description: description.trim(),
        priority,
        applicationId: applicationId || undefined,
      });
      toast.success("Ticket created successfully");
      router.push(`/student/tickets/${ticket.id}`);
    } catch {
      toast.error("Failed to create ticket. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => router.push("/student/tickets")}
        className="flex items-center gap-1.5 text-sm text-[#4B2D8E] hover:text-[#2D2154] font-medium"
      >
        <ArrowLeft className="size-4" />
        Back to Tickets
      </button>

      <Card size="xl">
        <CardHeader>
          <CardTitle>Create New Ticket</CardTitle>
          <CardDescription>
            Describe your issue and our support team will get back to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="Brief title for your issue"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }));
                }}
              />
              {errors.subject && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="size-3" />
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your issue in detail (minimum 10 characters)"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                }}
                rows={5}
                className="resize-y min-h-[100px]"
              />
              {errors.description && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="size-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as "LOW" | "MEDIUM" | "HIGH" | "URGENT")}
              >
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </Select>
            </div>

            {/* Application */}
            {applications.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="application">Related Application</Label>
                <Select
                  value={applicationId}
                  onValueChange={(v) => setApplicationId(v ?? "")}
                >
                  <SelectItem value="">None (General inquiry)</SelectItem>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.university.name} - {app.firstName} {app.lastName}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/student/tickets")}
                disabled={createTicket.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gap-1.5"
                disabled={createTicket.isPending}
              >
                {createTicket.isPending ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
