"use client";

import { useEffect, useState } from "react";
import { Label } from "@repo/ui";
import { Input } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { Calendar } from "lucide-react";
import { useAdminUniversities } from "@/domains/universities/universities.queries";
import type { CreateExamInput } from "@/domains/exams/exams.types";

interface Props {
  data?: Partial<CreateExamInput>;
  onChange: (data: Partial<CreateExamInput>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export function BasicInfoStep({ data, onChange, onValidationChange }: Props) {
  const { data: uniData, isLoading: uniLoading } = useAdminUniversities();
  const universities = uniData?.data ?? [];

  const [formData, setFormData] = useState<Partial<CreateExamInput>>({
    name: "",
    description: "",
    universityId: "",
    dateWindowStart: "",
    dateWindowEnd: "",
    durationMinutes: 180,
    passingPercentage: 50,
    maxAttempts: 1,
    resultTiming: "IMMEDIATE",
    shuffleQuestions: true,
    shuffleOptions: true,
    ...data,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Exam name is required";
    }
    if (!formData.universityId) {
      newErrors.universityId = "University is required";
    }
    if (!formData.dateWindowStart) {
      newErrors.dateWindowStart = "Start date is required";
    }
    if (!formData.dateWindowEnd) {
      newErrors.dateWindowEnd = "End date is required";
    }
    if (formData.dateWindowStart && formData.dateWindowEnd) {
      const start = new Date(formData.dateWindowStart);
      const end = new Date(formData.dateWindowEnd);
      if (start >= end) {
        newErrors.dateWindowEnd = "End date must be after start date";
      }
    }
    if (!formData.durationMinutes || formData.durationMinutes < 1) {
      newErrors.durationMinutes = "Duration is required";
    }
    if (formData.passingPercentage === undefined || formData.passingPercentage < 0) {
      newErrors.passingPercentage = "Passing marks is required";
    }

    setErrors(newErrors);
    onValidationChange(Object.keys(newErrors).length === 0);
    onChange(formData);
  }, [formData]);

  const handleChange = (field: keyof CreateExamInput, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-[#111111]">Basic Information</h2>
        <p className="text-sm text-[#626260]">
          Enter the exam details and scheduling information.
        </p>
      </div>

      {/* Exam Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-[#111111]">
          Exam Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g., Medical Entrance Exam 2026"
          className={`border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111] ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-[#111111]">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief description of the exam..."
          rows={3}
          className="border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111] resize-none"
        />
      </div>

      {/* University */}
      <div className="space-y-2">
        <Label htmlFor="universityId" className="text-sm font-medium text-[#111111]">
          University <span className="text-red-500">*</span>
        </Label>
        <select
          id="universityId"
          value={formData.universityId}
          onChange={(e) => handleChange("universityId", e.target.value)}
          className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
            errors.universityId
              ? "border-red-500 focus:ring-red-500"
              : "border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111]"
          }`}
        >
          <option value="">{uniLoading ? "Loading..." : "Select University"}</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        {errors.universityId && (
          <p className="text-xs text-red-500">{errors.universityId}</p>
        )}
      </div>

      {/* Date Window */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateWindowStart" className="text-sm font-medium text-[#111111]">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[#626260]" />
            <Input
              id="dateWindowStart"
              type="date"
              value={formData.dateWindowStart}
              onChange={(e) => handleChange("dateWindowStart", e.target.value)}
              className={`pl-10 border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111] ${
                errors.dateWindowStart ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.dateWindowStart && (
            <p className="text-xs text-red-500">{errors.dateWindowStart}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateWindowEnd" className="text-sm font-medium text-[#111111]">
            End Date <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[#626260]" />
            <Input
              id="dateWindowEnd"
              type="date"
              value={formData.dateWindowEnd}
              onChange={(e) => handleChange("dateWindowEnd", e.target.value)}
              className={`pl-10 border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111] ${
                errors.dateWindowEnd ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.dateWindowEnd && (
            <p className="text-xs text-red-500">{errors.dateWindowEnd}</p>
          )}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="durationMinutes" className="text-sm font-medium text-[#111111]">
          Duration (minutes) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="durationMinutes"
          type="number"
          min={1}
          max={300}
          value={formData.durationMinutes}
          onChange={(e) => handleChange("durationMinutes", parseInt(e.target.value) || 0)}
          className={`border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111] ${
            errors.durationMinutes ? "border-red-500" : ""
          }`}
        />
        {errors.durationMinutes && (
          <p className="text-xs text-red-500">{errors.durationMinutes}</p>
        )}
      </div>

      {/* Passing Marks */}
      <div className="space-y-2">
        <Label htmlFor="passingPercentage" className="text-sm font-medium text-[#111111]">
          Passing Marks <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-4">
          <Input
            id="passingPercentage"
            type="number"
            min={0}
            value={formData.passingPercentage}
            onChange={(e) => handleChange("passingPercentage", parseInt(e.target.value) || 0)}
            className={`w-32 border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111] ${
              errors.passingPercentage ? "border-red-500" : ""
            }`}
          />
          <span className="text-sm text-[#626260]">marks</span>
        </div>
        {errors.passingPercentage && (
          <p className="text-xs text-red-500">{errors.passingPercentage}</p>
        )}
      </div>

      {/* Max Attempts */}
      <div className="space-y-2">
        <Label htmlFor="maxAttempts" className="text-sm font-medium text-[#111111]">
          Maximum Attempts
        </Label>
        <Input
          id="maxAttempts"
          type="number"
          min={1}
          max={5}
          value={formData.maxAttempts}
          onChange={(e) => handleChange("maxAttempts", parseInt(e.target.value) || 1)}
          className="w-32 border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111]"
        />
        <p className="text-xs text-[#9c9fa5]">
          How many times a student can attempt this exam
        </p>
      </div>

      {/* Result Timing */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#111111]">Result Timing</Label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="resultTiming"
              value="IMMEDIATE"
              checked={formData.resultTiming === "IMMEDIATE"}
              onChange={(e) => handleChange("resultTiming", e.target.value)}
              className="accent-[#111111]"
            />
            <span className="text-sm text-[#111111]">Show right after exam</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="resultTiming"
              value="SCHEDULED"
              checked={formData.resultTiming === "SCHEDULED"}
              onChange={(e) => handleChange("resultTiming", e.target.value)}
              className="accent-[#111111]"
            />
            <span className="text-sm text-[#111111]">Schedule for later</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="resultTiming"
              value="EMAIL"
              checked={formData.resultTiming === "EMAIL"}
              onChange={(e) => handleChange("resultTiming", e.target.value)}
              className="accent-[#111111]"
            />
            <span className="text-sm text-[#111111]">Send via email</span>
          </label>
        </div>
      </div>

      {/* Shuffle Settings */}
      <div className="space-y-3 pt-4 border-t border-[#ebe7e1]">
        <h3 className="text-sm font-medium text-[#111111]">Randomization</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.shuffleQuestions}
              onChange={(e) => handleChange("shuffleQuestions", e.target.checked)}
              className="accent-[#111111]"
            />
            <span className="text-sm text-[#626260]">Shuffle questions for each student</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.shuffleOptions}
              onChange={(e) => handleChange("shuffleOptions", e.target.checked)}
              className="accent-[#111111]"
            />
            <span className="text-sm text-[#626260]">Shuffle options for questions</span>
          </label>
        </div>
      </div>
    </div>
  );
}
