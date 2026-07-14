"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useCreateExam } from "@/domains/exams/exams.queries";
import type { CreateExamInput } from "@/domains/exams/exams.types";

// Step Components
import { BasicInfoStep } from "@/components/admin/exams/steps/basic-info-step";
import { ProctoringStep } from "@/components/admin/exams/steps/proctoring-step";
import { QuestionsStep } from "@/components/admin/exams/steps/questions-step";
import { ReviewStep } from "@/components/admin/exams/steps/review-step";

const STEPS = [
  { id: "basic", label: "Basic Info", description: "Exam details and schedule" },
  { id: "proctoring", label: "Proctoring", description: "Security settings" },
  { id: "questions", label: "Questions", description: "Build question bank" },
  { id: "review", label: "Review", description: "Publish exam" },
];

export default function CreateExamPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [examId, setExamId] = useState<string | null>(null);
  const [isStepValid, setIsStepValid] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<{
    basicInfo?: Partial<CreateExamInput>;
    proctoring?: Record<string, boolean | number>;
    questions?: Array<Record<string, unknown>>;
  }>({});

  const createExam = useCreateExam();

  const handleNext = async () => {
    if (currentStep === 0 && !examId) {
      if (!formData.basicInfo) {
        toast.error("Please fill in all required fields");
        return;
      }

      try {
        const exam = await createExam.mutateAsync(formData.basicInfo as CreateExamInput);
        setExamId(exam.id);
        setCurrentStep(1);
      } catch {
        // Error handled by mutation
      }
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepChange = (stepIndex: number) => {
    if (stepIndex <= currentStep || examId) {
      setCurrentStep(stepIndex);
    }
  };

  const updateFormData = (step: string, data: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            data={formData.basicInfo}
            onChange={(data) => updateFormData("basicInfo", data)}
            onValidationChange={setIsStepValid}
          />
        );
      case 1:
        return (
          <ProctoringStep
            examId={examId!}
            data={formData.proctoring}
            onChange={(data) => updateFormData("proctoring", data)}
          />
        );
      case 2:
        return (
          <QuestionsStep
            examId={examId!}
            data={formData.questions}
            onChange={(data) => updateFormData("questions", data)}
          />
        );
      case 3:
        return (
          <ReviewStep
            examId={examId!}
            formData={formData}
            onPublished={() => router.push("/admin/exams")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-[#FAF9F6]">
      {/* Header bar — editorial, like university detail page */}
      <div className="border-b border-[#ECEAE6] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/exams")}
              className="border-[#ECEAE6] text-[#626260] hover:text-[#111] font-medium"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              Back
            </Button>
            <div>
              <h1 className="text-base font-semibold text-[#111]">
                Create Online Exam
              </h1>
              <p className="text-xs text-[#7b7b78]">
                {examId
                  ? "ID " + examId.slice(0, 8) + "\u2026"
                  : "Step " + (currentStep + 1) + " of " + STEPS.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper — refined horizontal, no bright green */}
      <div className="border-b border-[#ECEAE6] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-5 md:px-6">
          <div className="flex items-start justify-between gap-0">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || (index === 0 && !!examId);
              const isClickable = index <= currentStep || !!examId;

              return (
                <div
                  key={step.id}
                  className="flex items-start"
                  style={{ flex: index === STEPS.length - 1 ? 0 : 1 }}
                >
                  <button
                    onClick={() => isClickable && handleStepChange(index)}
                    disabled={!isClickable}
                    className="group flex flex-col items-center gap-2 transition-all"
                  >
                    {/* Step circle */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                        isActive
                          ? "border-[#111] bg-[#111] text-white"
                          : isCompleted
                          ? "border-[#111] bg-[#111] text-white"
                          : "border-[#D4D2CE] bg-white text-[#9c9fa5]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* Label */}
                    <div className="hidden sm:block text-center">
                      <p
                        className={`text-xs font-medium leading-tight ${
                          isActive ? "text-[#111]" : "text-[#626260]"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  </button>

                  {/* Connector line */}
                  {index < STEPS.length - 1 && (
                    <div className="hidden sm:block flex-1 self-center mx-3">
                      <div
                        className={`h-px w-full transition-colors ${
                          isCompleted ? "bg-[#111]" : "bg-[#ECEAE6]"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content + Navigation */}
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        {/* Step content card */}
        <div className="rounded-xl border border-[#ECEAE6] bg-white p-6 shadow-sm md:p-8">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="border-[#ECEAE6] text-[#626260] hover:text-[#111] font-medium disabled:opacity-40"
          >
            <ChevronLeft className="mr-1.5 h-3.5 w-3.5" />
            Previous
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid || createExam.isPending}
              className="bg-[#111] text-white hover:bg-[#313130] disabled:opacity-40 font-medium"
            >
              {currentStep === 0 && !examId ? "Create Exam" : "Next"}
              <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
