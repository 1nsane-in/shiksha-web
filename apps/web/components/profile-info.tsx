"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Avatar, AvatarFallback } from "@repo/ui";
import { Mail, Shield, User as UserIcon, Calendar, Hash } from "lucide-react";
import type { User } from "@/stores/auth-store";

const roleColors: Record<string, string> = {
  STUDENT: "bg-blue-100 text-blue-700",
  ADMIN: "bg-purple-100 text-purple-700",
  SUPER_ADMIN: "bg-amber-100 text-amber-700",
  PARENT: "bg-green-100 text-green-700",
};

export function ProfileInfo({ user }: { user: User }) {
  const initials = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Avatar + Name */}
      <Card size="xl">
        <CardContent className="flex flex-col items-center py-10">
          <Avatar className="size-24 mb-4 ring-4 ring-[#4B2D8E]/10">
            <AvatarFallback className="text-3xl font-bold bg-[#4B2D8E]/10 text-[#4B2D8E]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-[#2D2154]">{user.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          <Badge className={`mt-3 px-3 py-1 text-xs font-medium ${roleColors[user.role] || "bg-gray-100 text-gray-600"}`}>
            {user.role.replace("_", " ")}
          </Badge>
        </CardContent>
      </Card>

      {/* Details */}
      <Card size="xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#2D2154]">
            <UserIcon className="size-4" />
            Account Details
          </CardTitle>
          <CardDescription>Your registered account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <UserIcon className="size-4 text-gray-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-medium text-[#2D2154]">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Mail className="size-4 text-gray-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="text-sm font-medium text-[#2D2154]">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Shield className="size-4 text-gray-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-medium text-[#2D2154]">{user.role.replace("_", " ")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Hash className="size-4 text-gray-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">User ID</p>
              <p className="text-sm font-mono text-[#2D2154]">{user.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Calendar className="size-4 text-gray-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Account Status</p>
              <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
