"use client";

import { useRouter } from "next/navigation";
import { Button, Badge } from "@repo/ui";
import { ArrowLeft } from "lucide-react";
import { statusColors } from "../student-constants";

interface Props {
  name: string;
  studentId: string;
  applicationStatus: string;
}

export function StudentHeader({ name, studentId, applicationStatus }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/students")}
          className="border-[#ECEAE6] hover:bg-[#FAFAF8] bg-white cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111]">{name}</h1>
          <p className="text-xs text-[#666]">Student ID: {studentId}</p>
        </div>
      </div>
      <Badge className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${statusColors[applicationStatus] || "bg-gray-100 text-gray-800"}`}>
        {applicationStatus.replace(/_/g, " ")}
      </Badge>
    </div>
  );
}
