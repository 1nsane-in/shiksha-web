"use client";

import { useAuth } from "@/hooks/useAuth";
import { ProfileInfo } from "@/components/admin/profile-info";
import { Skeleton } from "@repo/ui";
import { AlertCircle } from "lucide-react";
import { Button } from "@repo/ui";
import Link from "next/link";

export default function AdminProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-6">
        <div className="flex flex-col items-center py-10">
          <Skeleton className="size-24 rounded-full mb-4" />
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Not signed in</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Please log in to view your profile.</p>
        <Link href="/login">
          <Button variant="outline">Go to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 max-w-6xl mx-auto w-full px-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2D2154]">Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Your account details</p>
          </div>
          <ProfileInfo user={user} />
        </div>
      </div>
    </div>
  );
}
