"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Input } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { Search, RefreshCw, AlertCircle, MessageSquare, UserCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useAllTickets, useUpdateTicketStatus, useAssignTicket, useAdminTicketDetail } from "@/domains/admin";

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  WAITING_FOR_CUSTOMER: "bg-orange-100 text-orange-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-600",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

export default function AdminTicketsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assignInputs, setAssignInputs] = useState<Record<string, string>>({});

  const { data, isLoading, isError, refetch } = useAllTickets({ page, limit: 20, status: statusFilter || undefined });
  const { data: expandedTicket } = useAdminTicketDetail(expandedId ?? "");
  const updateStatusMutation = useUpdateTicketStatus();
  const assignMutation = useAssignTicket();

  const handleStatusChange = async (id: string, status: string) => {
    await updateStatusMutation.mutateAsync({ id, data: { status: status as any } });
    refetch();
  };

  const handleAssign = async (id: string) => {
    const adminId = assignInputs[id];
    if (!adminId) return;
    await assignMutation.mutateAsync({ id, assignedTo: adminId });
    setAssignInputs((prev) => ({ ...prev, [id]: "" }));
    refetch();
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Failed to load tickets</h2>
        <Button onClick={() => refetch()} variant="outline" className="gap-2 mt-4">
          <RefreshCw className="size-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#2D2154]">Support Tickets</h1>
          <p className="text-sm text-gray-500">Manage student support tickets</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input placeholder="Search tickets..." className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v ?? ""); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="WAITING_FOR_CUSTOMER">Waiting</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card size="xl">
        <CardHeader>
          <CardTitle>All Tickets ({data?.total ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : !data || data.data.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <MessageSquare className="size-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No tickets found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.data.map((ticket) => {
                const isExpanded = expandedId === ticket.id;
                return (
                  <div key={ticket.id} className="border rounded-lg">
                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <MessageSquare className="size-4 text-gray-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#2D2154] truncate">{ticket.subject}</p>
                          <p className="text-xs text-gray-500 truncate">{ticket.student?.user?.name ?? "Unknown"}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={`text-xs ${priorityColors[ticket.priority] ?? ""}`}>{ticket.priority}</Badge>
                          <Badge className={`text-xs ${statusColors[ticket.status] ?? ""}`}>{ticket.status.replace("_", " ")}</Badge>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="size-4 text-gray-400 shrink-0 ml-2" /> : <ChevronDown className="size-4 text-gray-400 shrink-0 ml-2" />}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t pt-3 space-y-3">
                        <p className="text-sm text-gray-600">{ticket.description}</p>
                        {expandedTicket?.messages?.slice(-3).map((msg) => (
                          <div key={msg.id} className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                            <span className="font-medium">{msg.senderRole}:</span> {msg.content}
                          </div>
                        ))}
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <select
                            className="text-xs border rounded px-2 py-1"
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="WAITING_FOR_CUSTOMER">Waiting</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                          </select>
                          <div className="flex items-center gap-1 ml-auto">
                            <Input
                              placeholder="Admin ID"
                              className="h-8 w-32 text-xs"
                              value={assignInputs[ticket.id] ?? ""}
                              onChange={(e) => setAssignInputs((p) => ({ ...p, [ticket.id]: e.target.value }))}
                            />
                            <Button size="sm" variant="ghost" className="h-8 text-xs gap-1" onClick={() => handleAssign(ticket.id)}>
                              <UserCheck className="size-3" /> Assign
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {data.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-gray-500">Page {data.page} of {data.totalPages}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <Button size="sm" variant="outline" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
