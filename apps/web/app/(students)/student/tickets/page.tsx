"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { useMyTickets } from "@/domains/tickets";
import {
  MessageSquare, Plus, RefreshCw, AlertCircle, Inbox,
  ChevronRight
} from "lucide-react";
import type { Ticket } from "@/domains/tickets";

const statusStyles: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"> = {
  OPEN: "default",
  IN_PROGRESS: "secondary",
  WAITING_FOR_CUSTOMER: "outline",
  RESOLVED: "default",
  CLOSED: "ghost",
};

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  WAITING_FOR_CUSTOMER: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  RESOLVED: "bg-green-100 text-green-700 hover:bg-green-100",
  CLOSED: "bg-gray-100 text-gray-500 hover:bg-gray-100",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-500 hover:bg-gray-100",
  MEDIUM: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  HIGH: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  URGENT: "bg-red-100 text-red-700 hover:bg-red-100",
};

function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left"
    >
      <Card size="sm" className="cursor-pointer hover:border-[#4B2D8E]/30 transition-colors">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm text-[#2D2154] truncate">{ticket.subject}</h3>
                <Badge className={`${statusColors[ticket.status] ?? ""} text-xs`}>
                  {ticket.status.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline" className={`${priorityColors[ticket.priority] ?? ""} border-0 text-xs`}>
                  {ticket.priority}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{ticket.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <ChevronRight className="size-4 text-gray-400 shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

export default function TicketsPage() {
  const router = useRouter();
  const { data: tickets, isLoading, isError, refetch } = useMyTickets();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Failed to load tickets</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Something went wrong. Please try again.</p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2D2154]">My Tickets</h1>
            <p className="text-sm text-gray-500 mt-1">Support and inquiries</p>
          </div>
          <Button className="gap-1.5" onClick={() => router.push("/student/tickets/new")}>
            <Plus className="size-4" />
            Create Ticket
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="size-16 text-[#4B2D8E]/30 mb-4" />
          <h2 className="text-xl font-bold text-[#2D2154]">No support tickets</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Need help? Create a ticket and our team will assist you.
          </p>
          <Button className="mt-6 gap-1.5" onClick={() => router.push("/student/tickets/new")}>
            <Plus className="size-4" />
            Create Ticket
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2154]">My Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
          </Button>
          <Button className="gap-1.5" onClick={() => router.push("/student/tickets/new")}>
            <Plus className="size-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => router.push(`/student/tickets/${ticket.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

