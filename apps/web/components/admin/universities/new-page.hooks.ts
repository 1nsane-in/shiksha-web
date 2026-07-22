import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCreateUniversity } from "@/domains/universities";
import { Country } from "country-state-city";
import {
  getDefaultFormData,
  buildSubmitPayload,
  validateUrls,
} from "./new-page.utils";
import { validateStep, focusFirstError } from "./new-page.validation";
import { STORAGE_KEY, ERROR_CREATE_FAILED } from "./new-page.constants";
import type {
  UniversityFormData,
  ImageKeys,
  LocationCodes,
  ExtraBankField,
  FormFieldValue,
} from "./new-page.types";

export function useUniversityForm() {
  const router = useRouter();
  const createUniversity = useCreateUniversity();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageKeys, setImageKeys] = useState<ImageKeys>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [locationCodes, setLocationCodes] = useState<LocationCodes>({
    countryCode: "",
    stateCode: "",
  });
  const [selectedBankCountry, setSelectedBankCountry] = useState("");
  const [extraBankFields, setExtraBankFields] = useState<ExtraBankField[]>([]);
  const [formData, setFormData] =
    useState<UniversityFormData>(getDefaultFormData);

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed: Record<string, unknown> = JSON.parse(saved);
      const rawForm = parsed.formData as Record<string, unknown> | undefined;
      if (rawForm) {
        const defaults = getDefaultFormData();
        const merged = { ...defaults };
        for (const key of Object.keys(rawForm)) {
          const k = key as keyof UniversityFormData;
          const val = rawForm[k];
          const defaultVal = defaults[k];
          if (
            val !== null &&
            typeof val === "object" &&
            !Array.isArray(val) &&
            defaultVal &&
            typeof defaultVal === "object"
          ) {
            merged[k] = { ...defaultVal, ...val };
          } else {
            (merged as Record<string, unknown>)[k] = val;
          }
        }
        setFormData(merged);
      }
      if (typeof parsed.currentStep === "number")
        setCurrentStep(parsed.currentStep);
      if (parsed.locationCodes)
        setLocationCodes(parsed.locationCodes as LocationCodes);
      if (typeof parsed.selectedBankCountry === "string")
        setSelectedBankCountry(parsed.selectedBankCountry);
      if (parsed.imageKeys)
        setImageKeys(parsed.imageKeys as ImageKeys);
      if (Array.isArray(parsed.extraBankFields))
        setExtraBankFields(parsed.extraBankFields as ExtraBankField[]);
    } catch {
      /* ignore parse errors */
    }
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            formData,
            currentStep,
            locationCodes,
            selectedBankCountry,
            imageKeys,
            extraBankFields,
          }),
        );
      } catch {
        /* ignore quota errors */
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [
    formData,
    currentStep,
    locationCodes,
    selectedBankCountry,
    imageKeys,
    extraBankFields,
  ]);

  const updateField = useCallback(
    (section: string, field: string, value: FormFieldValue) => {
      setFormData((prev) => {
        const sectionData = (prev as Record<string, unknown>)[section];
        if (typeof sectionData === "object" && sectionData !== null && !Array.isArray(sectionData)) {
          return { ...prev, [section]: { ...sectionData, [field]: value } };
        }
        return { ...prev, [section]: { [field]: value } };
      });
    },
    [],
  );

  const updateRootField = useCallback(
    (field: string, value: FormFieldValue) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const removeImage = useCallback(
    async (field: "logo" | "bannerImage" | "brochure") => {
      const key = imageKeys[field];
      if (key) {
        try {
          const { deleteFile } =
            await import("@/domains/documents/documents.api");
          await deleteFile(key);
        } catch {
          /* ignore */
        }
      }
      const formField = field === "brochure" ? "brochureUrl" : field;
      updateRootField(formField, "");
      setImageKeys((prev) => ({ ...prev, [field]: undefined }));
    },
    [imageKeys, updateRootField],
  );

  const handleSubmit = useCallback(async () => {
    const urlErrors = validateUrls(formData);
    if (Object.keys(urlErrors).length > 0) {
      setFormErrors(urlErrors);
      return;
    }
    setLoading(true);
    setFormErrors({});
    try {
      const phoneCode =
        Country.getCountryByCode(locationCodes.countryCode)?.phonecode ?? "";
      const payload = buildSubmitPayload(formData, phoneCode, extraBankFields);
      await createUniversity.mutateAsync(payload);
      localStorage.removeItem(STORAGE_KEY);
      router.push("/admin/universities");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: { fields?: Record<string, string>; message?: string }; fields?: Record<string, string>; message?: string } };
      };
      const errData = err?.response?.data?.error || err?.response?.data;
      if (errData?.fields) setFormErrors(errData.fields);
      else if (errData?.message)
        setFormErrors({ _general: errData.message });
      else setFormErrors({ _general: ERROR_CREATE_FAILED });
    } finally {
      setLoading(false);
    }
  }, [formData, locationCodes, extraBankFields, createUniversity, router]);

  const handleNext = useCallback(() => {
    const { isValid, errors } = validateStep(currentStep, formData);
    if (!isValid) {
      setFormErrors(errors);
      focusFirstError(errors);
      return;
    }
    setFormErrors({});
    setCurrentStep((s) => s + 1);
  }, [currentStep, formData]);

  return {
    currentStep,
    setCurrentStep,
    loading,
    setLoading,
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
  };
}
