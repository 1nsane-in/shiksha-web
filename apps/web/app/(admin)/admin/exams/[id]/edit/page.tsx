"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useExam, useUpdateExam } from "@/domains/exams/exams.queries";
import type { CreateExamInput, CreateQuestionInput } from "@/domains/exams/exams.types";

import { BasicInfoStep } from "@/components/admin/exams/steps/basic-info-step";
import { QuestionsStep } from "@/components/admin/exams/steps/questions-step";
import { ReviewStep } from "@/components/admin/exams/steps/review-step";

const STEPS = [
  { id: "basic", label: "Basic Info", description: "Exam details and schedule" },
  { id: "questions", label: "Questions", description: "Build question bank" },
  { id: "review", label: "Review", description: "Save changes" },
];

export default function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: exam, isLoading } = useExam(id);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(false);

  const [formData, setFormData] = useState<{
    basicInfo?: Partial<CreateExamInput>;
    questions?: CreateQuestionInput[];
  }>({});

  const updateExam = useUpdateExam(id);

  // Pre-fill form from loaded exam
  useEffect(() => {
    if (!exam) return;
    setFormData({
      basicInfo: {
        name: exam.name,
        description: exam.description,
        universityId: exam.universityId,
        dateWindowStart: exam.dateWindowStart.split("T")[0],
        dateWindowEnd: exam.dateWindowEnd.split("T")[0],
        durationMinutes: exam.durationMinutes,
        passingPercentage: exam.passingPercentage,
        maxAttempts: exam.maxAttempts,
        resultTiming: exam.resultTiming,
        shuffleQuestions: exam.shuffleQuestions,
        shuffleOptions: exam.shuffleOptions,
      },
      questions: exam.questions?.map((q) => ({
        type: q.type,
        questionText: q.questionText,
        questionImageUrl: q.questionImageUrl,
        marks: q.marks,
        negativeMarks: q.negativeMarks,
        difficulty: q.difficulty,
        topic: q.topic,
        options: q.options?.map((o) => ({
          optionText: o.optionText,
          isCorrect: o.isCorrect,
        })),
        config: q.config,
      })),
    });
  }, [exam]);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleStepChange = (stepIndex: number) => {
    if (stepIndex <= currentStep) setCurrentStep(stepIndex);
  };

  const updateFormData = (step: string, data: unknown) => {
    setFormData((prev) => ({ ...prev, [step]: data }));
  };

  const handleSave = async () => {
    if (!formData.basicInfo?.name || !formData.basicInfo.universityId) {
      toast.error("Basic info incomplete");
      return;
    }

    try {
      await updateExam.mutateAsync({
        name: formData.basicInfo.name,
        description: formData.basicInfo.description,
        universityId: formData.basicInfo.universityId,
        dateWindowStart: formData.basicInfo.dateWindowStart!,
        dateWindowEnd: formData.basicInfo.dateWindowEnd!,
        durationMinutes: formData.basicInfo.durationMinutes!,
        passingPercentage: formData.basicInfo.passingPercentage!,
        maxAttempts: formData.basicInfo.maxAttempts,
        resultTiming: formData.basicInfo.resultTiming,
        shuffleQuestions: formData.basicInfo.shuffleQuestions,
        shuffleOptions: formData.basicInfo.shuffleOptions,
      });
      router.push(`/admin/exams/${id}`);
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#9c9fa5]" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-[#111111]">Exam not found</p>
        <Button variant="outline" onClick={() => router.push("/admin/exams")} className="border-[#ECEAE6] text-[#626260]">Back to Exams</Button>
      </div>
    );
  }

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
          <QuestionsStep
            data={formData.questions}
            onChange={(data) => updateFormData("questions", data)}
          />
        );
      case 2:
        return (
          <ReviewStep
            formData={formData}
            onPublish={handleSave}
            isPending={updateExam.isPending}
            onBack={() => setCurrentStep(1)}
            submitLabel="Save Changes"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      {/* Header bar */}
      <div>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/exams/${id}`)}
              className="border-[#ECEAE6] text-[#626260] hover:text-[#111] font-medium"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              Back
            </Button>
            <div>
              <h1 className="text-base font-semibold text-[#111]">Edit Exam</h1>
              <p className="text-xs text-[#7b7b78]">
                Step {currentStep + 1} of {STEPS.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div>
        <div className="mx-auto max-w-3xl px-4 py-5 md:px-6">
          <div className="flex items-start justify-between gap-0">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isClickable = index <= currentStep;

              return (
                <div key={step.id} className="flex items-start" style={{ flex: index === STEPS.length - 1 ? 0 : 1 }}>
                  <button
                    onClick={() => isClickable && handleStepChange(index)}
                    disabled={!isClickable}
                    className="group flex flex-col items-center gap-2 transition-all"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                      isActive || isCompleted
                        ? "border-[#111] bg-[#111] text-white"
                        : "border-[#D4D2CE] bg-white text-[#9c9fa5]"
                    }`}>
                      {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : <span className="text-xs font-medium">{index + 1}</span>}
                    </div>
                    <div className="hidden sm:block text-center">
                      <p className={`text-xs font-medium leading-tight ${isActive ? "text-[#111]" : "text-[#626260]"}`}>{step.label}</p>
                    </div>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className="hidden sm:block flex-1 self-center mx-3">
                      <div className={`h-px w-full transition-colors ${isCompleted ? "bg-[#111]" : "bg-[#ECEAE6]"}`} />
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
        <div className="rounded-xl border border-[#ECEAE6] bg-white p-6 shadow-sm md:p-8">
          {renderStep()}
        </div>

        {currentStep < STEPS.length - 1 && (
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
            <Button
              onClick={handleNext}
              disabled={currentStep === 0 ? !isStepValid : false}
              className="bg-[#111] text-white hover:bg-[#313130] disabled:opacity-40 font-medium"
            >
              Next
              <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
