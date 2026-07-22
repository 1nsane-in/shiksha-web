"use client";

import { Button } from "@repo/ui";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useUniversityForm } from "@/components/admin/universities/new-page.hooks";
import { StepRenderer } from "@/components/admin/universities/new-page-step-renderer";
import { STEPS } from "@/components/admin/universities/new-page.constants";

export default function NewUniversityPage() {
  const {
    currentStep,
    setCurrentStep,
    loading,
    imageKeys,
    setImageKeys,
    formErrors,
    setFormErrors,
    locationCodes,
    setLocationCodes,
    selectedBankCountry,
    setSelectedBankCountry,
    extraBankFields,
    setExtraBankFields,
    formData,
    updateField,
    updateRootField,
    removeImage,
    handleSubmit,
    handleNext,
  } = useUniversityForm();

  return (
    <div className="flex flex-1 flex-col gap-3 max-w-4xl mx-auto w-full sm:gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-[#2D2154] sm:text-2xl">
            Add New University
          </h1>
          <p className="text-xs text-[#6B6B6B] sm:text-sm">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </p>
        </div>
      </div>

      <div className="flex gap-1">
        {STEPS.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full sm:h-2 ${
              index <= currentStep ? "bg-[#4B2D8E]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-3 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">
          {STEPS[currentStep]}
        </h2>
        <StepRenderer
          currentStep={currentStep}
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={updateField}
          onRootFieldUpdate={updateRootField}
          onSetFormErrors={setFormErrors}
          imageKeys={imageKeys}
          onSetImageKeys={setImageKeys}
          onRemoveImage={removeImage}
          locationCodes={locationCodes}
          onSetLocationCodes={setLocationCodes}
          selectedBankCountry={selectedBankCountry}
          onSetSelectedBankCountry={setSelectedBankCountry}
          extraBankFields={extraBankFields}
          onSetExtraBankFields={setExtraBankFields}
        />
      </div>

      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentStep((s: number) => s - 1)}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Previous
        </Button>
        {currentStep < STEPS.length - 1 ? (
          <Button size="sm" onClick={handleNext}>
            Next
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button size="sm" onClick={handleSubmit} disabled={loading}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {loading ? "Creating..." : "Create"}
          </Button>
        )}
      </div>
    </div>
  );
}
