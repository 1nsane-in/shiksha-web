import React from "react";
import { BasicInfoStep } from "./step-0-basic-info";
import { LocationStep } from "./step-1-location";
import { AcademicStep } from "./step-2-academic";
import { RecognitionStep } from "./step-3-recognition";
import { FeesStep } from "./step-4-fees";
import { InfrastructureStep } from "./step-5-infrastructure";
import { AdmissionStep } from "./step-6-admission";
import { SupportContentStep } from "./step-7-support-content";
import { BankDetailsStep } from "./step-8-bank-details";
import { normalizeUrlField } from "./new-page.utils";
import type { StepRendererProps } from "./new-page.types";

export const StepRenderer = React.memo(function StepRenderer(
  props: StepRendererProps,
) {
  const {
    currentStep,
    formData,
    formErrors,
    onFieldUpdate,
    onRootFieldUpdate,
    onSetFormErrors,
    imageKeys,
    onSetImageKeys,
    onRemoveImage,
    locationCodes,
    onSetLocationCodes,
    selectedBankCountry,
    onSetSelectedBankCountry,
    extraBankFields,
    onSetExtraBankFields,
  } = props;

  switch (currentStep) {
    case 0:
      return (
        <BasicInfoStep
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={onFieldUpdate}
          onRootFieldUpdate={onRootFieldUpdate}
          onSetFormErrors={onSetFormErrors}
          imageKeys={imageKeys}
          onSetImageKeys={onSetImageKeys}
          onRemoveImage={onRemoveImage}
          onNormalizeUrl={normalizeUrlField}
        />
      );
    case 1:
      return (
        <LocationStep
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={onFieldUpdate}
          onRootFieldUpdate={onRootFieldUpdate}
          onSetFormErrors={onSetFormErrors}
          locationCodes={locationCodes}
          onSetLocationCodes={onSetLocationCodes}
        />
      );
    case 2:
      return (
        <AcademicStep
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={onFieldUpdate}
          onRootFieldUpdate={onRootFieldUpdate}
          onSetFormErrors={onSetFormErrors}
        />
      );
    case 3:
      return (
        <RecognitionStep
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={onFieldUpdate}
          onRootFieldUpdate={onRootFieldUpdate}
          onSetFormErrors={onSetFormErrors}
        />
      );
    case 4:
      return (
        <FeesStep
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={onFieldUpdate}
          onRootFieldUpdate={onRootFieldUpdate}
          onSetFormErrors={onSetFormErrors}
        />
      );
    case 5:
      return (
        <InfrastructureStep
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={onFieldUpdate}
          onRootFieldUpdate={onRootFieldUpdate}
          onSetFormErrors={onSetFormErrors}
        />
      );
    case 6:
      return (
        <AdmissionStep
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={onFieldUpdate}
          onRootFieldUpdate={onRootFieldUpdate}
          onSetFormErrors={onSetFormErrors}
        />
      );
    case 7:
      return (
        <SupportContentStep
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={onFieldUpdate}
          onRootFieldUpdate={onRootFieldUpdate}
          onSetFormErrors={onSetFormErrors}
        />
      );
    case 8:
      return (
        <BankDetailsStep
          formData={formData}
          formErrors={formErrors}
          onFieldUpdate={onFieldUpdate}
          onRootFieldUpdate={onRootFieldUpdate}
          onSetFormErrors={onSetFormErrors}
          selectedBankCountry={selectedBankCountry}
          onSetSelectedBankCountry={onSetSelectedBankCountry}
          extraBankFields={extraBankFields}
          onSetExtraBankFields={onSetExtraBankFields}
        />
      );
    default:
      return null;
  }
});
