"use client";

import { Card, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
}

export function ApplicationsFilters({ search, onSearchChange, onStatusChange }: Props) {
  return (
    <Card className="p-4 bg-white border border-[#ECEAE6]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search student by name or email..."
            className="pl-9 text-xs bg-white border-gray-200 h-10 w-full"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => onStatusChange(value ?? "all")} defaultValue="all">
          <SelectTrigger className="w-[150px] text-xs h-10 border-gray-200 bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-gray-150 rounded-xl bg-white shadow-md p-1.5 min-w-[150px]">
            <SelectItem value="all" className="text-xs py-2.5 px-4 rounded-lg cursor-pointer hover:bg-gray-50">
              All Statuses
            </SelectItem>
            <SelectItem value="pending" className="text-xs py-2.5 px-4 rounded-lg cursor-pointer hover:bg-gray-50">
              Pending
            </SelectItem>
            <SelectItem value="approved" className="text-xs py-2.5 px-4 rounded-lg cursor-pointer hover:bg-gray-50">
              Approved
            </SelectItem>
            <SelectItem value="rejected" className="text-xs py-2.5 px-4 rounded-lg cursor-pointer hover:bg-gray-50">
              Rejected
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
