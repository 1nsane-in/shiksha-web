"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useTicket, useAddTicketMessage } from "@/domains/tickets";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ArrowLeft, Send, AlertCircle, RefreshCw,
} from "lucide-react";

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  WAITING_FOR_CUSTOMER: "bg-orange-100 text-orange-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-500",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-500",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

function formatMessageDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const isYesterday =
    new Date(now.getTime() - 86400000).toDateString() === d.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMessageTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { data: ticket, isLoading, isError, refetch } = useTicket(id);
  const addMessage = useAddTicketMessage(id);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSending = addMessage.isPending;

  const messages = ticket?.messages ?? [];
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;
    try {
      await addMessage.mutateAsync({ content: newMessage.trim() });
      setNewMessage("");
      toast.success("Message sent");
    } catch {
      toast.error("Failed to send message");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Ticket not found</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">This ticket may have been removed.</p>
        <Button onClick={() => router.push("/student/tickets")} variant="outline" className="gap-2">
          <ArrowLeft className="size-4" />
          Back to Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push("/student/tickets")}
        className="flex items-center gap-1.5 text-sm text-[#4B2D8E] hover:text-[#2D2154] font-medium"
      >
        <ArrowLeft className="size-4" />
        Back to Tickets
      </button>

      {/* Ticket Header */}
      <Card size="xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">{ticket.subject}</CardTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className={`${statusColors[ticket.status] ?? ""} text-xs`}>
                  {ticket.status.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline" className={`${priorityColors[ticket.priority] ?? ""} border-0 text-xs`}>
                  {ticket.priority}
                </Badge>
                <span className="text-xs text-gray-400">
                  Created {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card size="xl">
        <CardHeader>
          <CardTitle>Messages ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <p className="text-sm text-gray-500">No messages yet</p>
                <p className="text-xs text-gray-400 mt-1">Start the conversation below</p>
              </div>
            ) : (
              (() => {
                let lastDate = "";
                return messages.map((msg) => {
                  const msgDate = formatMessageDate(msg.createdAt);
                  const showDate = msgDate !== lastDate;
                  lastDate = msgDate;
                  const isMyMessage = msg.senderId === user?.id;

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-xs text-gray-400 shrink-0">{msgDate}</span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>
                      )}
                      <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            isMyMessage
                              ? "bg-[#4B2D8E] text-white rounded-br-md"
                              : "bg-gray-100 text-gray-800 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <div className={`flex items-center gap-2 mt-1 ${isMyMessage ? "justify-end" : "justify-start"}`}>
                            <span
                              className={`text-[10px] ${
                                isMyMessage ? "text-white/60" : "text-gray-400"
                              }`}
                            >
                              {msg.senderRole === "ADMIN" ? "Admin" : "You"}
                            </span>
                            <span
                              className={`text-[10px] ${
                                isMyMessage ? "text-white/50" : "text-gray-400"
                              }`}
                            >
                              {formatMessageTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {ticket.status !== "CLOSED" && ticket.status !== "RESOLVED" && (
        <Card size="sm" className="sticky bottom-0 md:static">
          <CardContent className="py-3">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="min-h-[44px] max-h-32 resize-none text-sm"
                rows={1}
              />
              <Button
                size="sm"
                className="shrink-0 self-end gap-1"
                onClick={handleSend}
                disabled={!newMessage.trim() || isSending}
              >
                {isSending ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
