"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateUniversity } from "@/domains/universities";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Textarea } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Checkbox } from "@repo/ui";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  SUPPORTED_FOREIGN_BANK_COUNTRIES,
  getBankConfig,
  type BankFieldConfig,
} from "@repo/shared-types";

const steps = [
  "Basic Info",
  "Location & Contact",
  "Academic Details",
  "Recognition",
  "Fees",
  "Infrastructure",
  "Admission",
  "Support & Content",
  "Bank Details",
];

export default function NewUniversityPage() {
  const router = useRouter();

  const UNIVERSAL_MEDIUMS = [
    "English",
    "Hindi",
    "Russian",
    "French",
    "Spanish",
    "Arabic",
    "Chinese",
    "German",
    "Portuguese",
    "Japanese",
    "Korean",
    "Italian",
    "Turkish",
    "Bengali",
    "Urdu",
    "Kazakh",
    "Uzbek",
    "Ukrainian",
    "Swahili",
    "Amharic",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const createUniversity = useCreateUniversity();
  const [imageKeys, setImageKeys] = useState<{ logo?: string; bannerImage?: string; brochure?: string }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [locationCodes, setLocationCodes] = useState<{ countryCode: string; stateCode: string }>({ countryCode: "", stateCode: "" });
  const [selectedBankCountry, setSelectedBankCountry] = useState("");
  const [extraBankFields, setExtraBankFields] = useState<Array<{ key: string; value: string }>>([]);
  const getDefaultFormData = () => ({
    name: "",
    shortName: "",
    establishedYear: new Date().getFullYear(),
    type: "PRIVATE",
    website: "",
    logo: "",
    bannerImage: "",
    brochureUrl: "",
    location: {
      country: "",
      state: "",
      city: "",
      address: "",
    },
    contact: {
      email: "",
      phone: "",
      admissionOfficeHours: "Mon-Fri 9AM-5PM",
    },
    academic: {
      programs: [{ name: "MBBS", duration: "5.5 years", annualTuition: 0, registration: 0, totalSeats: 0, governmentSeats: 0, managementSeats: 0, nriSeats: 0, feeBreakdown: [] }],
      duration: "5.5 years",
      medium: "English",
      specializations: [],
      intakeMonths: ["August"],
    },
    recognition: {
      bodies: [],
      ecfmgStatus: "PENDING",
      nbaAccredited: false,
      accreditations: [],
      worldRankingSource: "",
      nationalRankingSource: "",
      otherRankingSource: "",
      otherNationalRankingSource: "",
      subjectRankings: [] as Array<{ subject: string; ranking: string }>,
    },
    fees: {
      currency: "INR",
      scholarshipAvailable: false,
      scholarships: [] as string[],
      paymentSchedule: "",
      refundPolicy: "",
      feeBreakdown: [] as Array<{ id: string; name: string; amount: number }>,
    },
    infrastructure: {
      departments: [] as string[],
      hostelBoys: 0,
      hostelGirls: 0,
      laboratories: [] as string[],
      facilities: [],
      cafeteria: false,
      wifiCampus: false,
      transportation: false,
    },
    admission: {
      entranceExams: ["NEET"],
      ageCriteria: "",
      programEligibility: [] as { minimumMarks: string; eligibility: string }[],
      requiredDocuments: [],
      applicationDeadline: "",
      applicationFee: 0,
      selectionProcess: "",
    },
    support: {
      topRecruiters: [],
      alumniNetwork: false,
      internationalStudentSupport: false,
      visaAssistance: false,
      languageSupport: [],
      extraServices: [] as string[],
      counselingServices: false,
      careerGuidance: false,
    },
    content: {
      shortDescription: "",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
    admin: {
      pocName: "",
      pocDesignation: "",
      pocEmail: "",
      phoneCountryCode: "+91",
      phoneNumber: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
      bankBranch: "",
      ifscCode: "",
      gstNumber: "",
      panNumber: "",
      commission: 0,
      bankCountry: "",
      bankDetails: {},
    },
    studentDemographics: {
      totalStudents: 0,
      localStudents: 0,
      foreignStudents: 0,
      foreignByCountry: [] as { country: string; count: number }[],
    },
    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: "",
      twitter: "",
      tiktok: "",
    },
  });

  const [formData, setFormData] = useState<any>(getDefaultFormData());

  const isOtherMedium = formData?.academic?.medium?.startsWith("Other:");
  const otherMediumValue = isOtherMedium ? formData.academic.medium.replace("Other:", "") : "";

  const STORAGE_KEY = "university-create-form";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          const defaults = getDefaultFormData();
          const merged: any = { ...defaults };
          const d = defaults as Record<string, any>;
          for (const key of Object.keys(parsed.formData)) {
            const val = parsed.formData[key];
            if (val !== null && typeof val === "object" && !Array.isArray(val) && d[key] && typeof d[key] === "object") {
              merged[key] = { ...d[key], ...val };
            } else {
              merged[key] = val;
            }
          }
          setFormData(merged);
        }
        if (parsed.currentStep !== undefined) setCurrentStep(parsed.currentStep);
        if (parsed.locationCodes) setLocationCodes(parsed.locationCodes);
        if (parsed.selectedBankCountry !== undefined) setSelectedBankCountry(parsed.selectedBankCountry);
        if (parsed.imageKeys) setImageKeys(parsed.imageKeys);
        if (parsed.extraBankFields) setExtraBankFields(parsed.extraBankFields);
      }
    } catch {}
  }, []);

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
          })
        );
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [formData, currentStep, locationCodes, selectedBankCountry, imageKeys, extraBankFields]);

  const updateField = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateRootField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBankField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      admin: {
        ...prev.admin,
        bankDetails: {
          ...(prev.admin.bankDetails || {}),
          [field]: value,
        },
      },
    }));
  };

  const renderBankFields = (countryCode: string) => {
    const config = getBankConfig(countryCode);
    if (!config) return null;

    return (
      <>
        {config.fields.map((field: BankFieldConfig) => {
          const val = formData.admin.bankDetails?.[field.name] || "";
          const commonProps = {
            value: val,
            onChange: (e: any) => updateBankField(field.name, e.target.value),
            placeholder: field.placeholder,
          };

          if (field.type === "textarea") {
            return (
              <div key={field.name} className="sm:col-span-2">
                <Label>
                  {field.label}
                  {field.required && <span className="text-destructive ml-0.5">*</span>}
                </Label>
                <Textarea rows={2} {...commonProps} />
                {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
              </div>
            );
          }

          return (
            <div key={field.name}>
              <Label>
                {field.label}
                {field.required && <span className="text-destructive ml-0.5">*</span>}
              </Label>
              <Input {...commonProps} />
              {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
            </div>
          );
        })}

        {/* Extra key-value fields */}
        {(extraBankFields || []).map((item, idx) => (
          <div key={`extra-${idx}`} className="relative sm:col-span-2 flex items-start gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <Label>Field Name</Label>
                <Input
                  value={item.key}
                  onChange={(e) => {
                    const copy = [...extraBankFields];
                    copy[idx] = { ...copy[idx], key: e.target.value };
                    setExtraBankFields(copy);
                  }}
                  placeholder="e.g. Routing Number"
                />
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  value={item.value}
                  onChange={(e) => {
                    const copy = [...extraBankFields];
                    copy[idx] = { ...copy[idx], value: e.target.value };
                    setExtraBankFields(copy);
                  }}
                  placeholder="Field value"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-6 shrink-0 h-9 w-9 text-destructive"
              onClick={() => setExtraBankFields(extraBankFields.filter((_, i) => i !== idx))}
            >
              ✕
            </Button>
          </div>
        ))}

        <div className="sm:col-span-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExtraBankFields([...extraBankFields, { key: "", value: "" }])}
          >
            + Add Extra
          </Button>
        </div>
      </>
    );
  };

  const removeImage = async (field: "logo" | "bannerImage" | "brochure") => {
    const key = imageKeys[field];
    if (key) {
      try {
        const { deleteFile } = await import("@/domains/documents/documents.api");
        await deleteFile(key);
      } catch { /* ignore delete failure */ }
    }
    const formField = field === "brochure" ? "brochureUrl" : field;
    updateRootField(formField, "");
    setImageKeys((prev) => ({ ...prev, [field]: undefined }));
  };

  // URL validation helper - more lenient, accepts domains without protocol
  const normalizeUrl = (url: string): string => {
    if (!url || url.trim() === "") return "";
    url = url.trim();
    // Auto-add https:// if no protocol
    if (!url.match(/^https?:\/\//i)) {
      url = "https://" + url;
    }
    return url;
  };

  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim() === "") return true; // Empty is valid (optional fields)
    try {
      const normalized = normalizeUrl(url);
      const parsed = new URL(normalized);
      // Must have valid protocol and some domain
      return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname.includes(".");
    } catch {
      return false;
    }
  };

  const validateUrls = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Website (required) - normalize and validate
    if (!formData.website) {
      errors.website = "Website is required";
    } else if (!isValidUrl(formData.website)) {
      errors.website = "Please enter a valid URL (e.g., https://university.edu or university.edu)";
    }
    
    // Social links (optional but must be valid if provided)
    const socialFields = ["facebook", "instagram", "youtube", "linkedin", "twitter", "tiktok"] as const;
    socialFields.forEach((field) => {
      const value = formData.socialLinks?.[field];
      if (value && !isValidUrl(value)) {
        errors[`socialLinks.${field}`] = `Invalid ${field} URL. Try: facebook.com/university or https://facebook.com/university`;
      }
    });
    
    return errors;
  };

  // Auto-normalize URL on blur (add https:// if missing)
  const normalizeUrlField = (section: string, field: string, value: string) => {
    const normalized = normalizeUrl(value);
    if (normalized !== value) {
      if (section === "root") {
        updateRootField(field, normalized);
      } else {
        updateField(section, field, normalized);
      }
    }
  };

  const handleSubmit = async () => {
    // Validate URLs first
    const urlErrors = validateUrls();
    if (Object.keys(urlErrors).length > 0) {
      setFormErrors(urlErrors);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setFormErrors({});
    try {
      const phoneCode = Country.getCountryByCode(locationCodes.countryCode)?.phonecode || "";
      const otherFees: Record<string, number> = {};
      // Per-program fee breakdowns (prefixed with program name)
      (formData.academic.programs || []).forEach((prog: any) => {
        if (prog.feeBreakdown && prog.name?.trim()) {
          prog.feeBreakdown.forEach((item: any) => {
            if (item.name?.trim()) {
              const key = `${prog.name.trim()} - ${item.name.trim()}`;
              otherFees[key] = item.amount || 0;
            }
          });
        }
      });
      const scholarshipDetails = formData.fees.scholarships
        .filter((s: string) => s.trim())
        .join(", ");
      const payload = {
        ...formData,
        contact: {
          email: formData.contact.email,
          phone: `+${phoneCode}-${formData.contact.phone}`,
          admissionOfficeHours: formData.contact.admissionOfficeHours,
        },
        fees: {
          ...formData.fees,
          otherFees,
          ...(scholarshipDetails ? { scholarshipDetails } : {}),
        },
        ...(formData.brochureUrl ? { brochureUrl: formData.brochureUrl } : { brochureUrl: undefined }),
      };
      delete payload.fees.feeBreakdown;
      delete (payload.fees as any).scholarships;
      // Merge extra services into languageSupport for backend
      const extras = (payload.support as any).extraServices?.filter((s: string) => s.trim()) || [];
      payload.support.languageSupport = [...(payload.support.languageSupport || []), ...extras];
      delete (payload.support as any).extraServices;
      // Merge extra bank fields into bankDetails
      if (extraBankFields?.length) {
        for (const item of extraBankFields) {
          if (item.key?.trim()) {
            payload.admin.bankDetails[item.key.trim()] = item.value;
          }
        }
      }
      // Transform subjectRankings array to Record for backend
      const subjectRankingsRecord: Record<string, string> = {};
      (payload.recognition.subjectRankings || []).forEach((item: { subject: string; ranking: string }) => {
        if (item.subject?.trim()) {
          subjectRankingsRecord[item.subject.trim()] = item.ranking || "";
        }
      });
      payload.recognition.subjectRankings = subjectRankingsRecord;
      await createUniversity.mutateAsync(payload);
      localStorage.removeItem(STORAGE_KEY);
      router.push("/admin/universities");
    } catch (error: any) {
      const errData = error?.response?.data?.error || error?.response?.data;
      if (errData?.fields) {
        setFormErrors(errData.fields);
      } else if (errData?.message) {
        setFormErrors({ _general: errData.message });
      } else {
        setFormErrors({ _general: "Failed to create university. Please check all fields and try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step validation function
  const validateStep = (step: number): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 0: // Step 1: Basic Info
        // Required fields
        if (!formData.name?.trim()) {
          errors.name = "University name is required";
        }
        if (!formData.shortName?.trim()) {
          errors.shortName = "Short name is required";
        }
        if (!formData.establishedYear) {
          errors.establishedYear = "Established year is required";
        } else if (formData.establishedYear < 1800 || formData.establishedYear > new Date().getFullYear()) {
          errors.establishedYear = `Year must be between 1800 and ${new Date().getFullYear()}`;
        }
        if (!formData.type) {
          errors.type = "Type is required";
        }
        if (!formData.website?.trim()) {
          errors.website = "Website is required";
        } else if (!isValidUrl(formData.website)) {
          errors.website = "Please enter a valid URL (e.g., https://university.edu)";
        }
        // Validate social links (optional but must be valid if provided)
        const socialFields = ["facebook", "instagram", "youtube", "linkedin", "twitter", "tiktok"] as const;
        socialFields.forEach((field) => {
          const value = formData.socialLinks?.[field];
          if (value && !isValidUrl(value)) {
            errors[`socialLinks.${field}`] = `Invalid ${field} URL`;
          }
        });
        break;
        
      case 1: // Step 2: Location & Contact
        if (!formData.location?.country?.trim()) {
          errors["location.country"] = "Country is required";
        }
        if (!formData.location?.state?.trim()) {
          errors["location.state"] = "State is required";
        }
        if (!formData.location?.city?.trim()) {
          errors["location.city"] = "City is required";
        }
        if (!formData.location?.address?.trim()) {
          errors["location.address"] = "Address is required";
        }
        if (!formData.contact?.email?.trim()) {
          errors["contact.email"] = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
          errors["contact.email"] = "Please enter a valid email address";
        }
        if (!formData.contact?.phone?.trim()) {
          errors["contact.phone"] = "Phone is required";
        } else if (formData.contact.phone.length < 8) {
          errors["contact.phone"] = "Phone number must be at least 8 digits";
        }
        if (!formData.contact?.admissionOfficeHours?.trim()) {
          errors["contact.admissionOfficeHours"] = "Office hours are required";
        }
        break;
        
      case 2: // Step 3: Academic Details
        if (!formData.academic?.medium) {
          errors["academic.medium"] = "Medium of instruction is required";
        }
        if (!formData.academic?.intakeMonths?.length) {
          errors["academic.intakeMonths"] = "At least one intake month is required";
        }
        if (!formData.academic?.programs?.length) {
          errors["academic.programs"] = "At least one program is required";
        } else {
          // Validate each program
          formData.academic.programs.forEach((p: any, i: number) => {
            // Name required
            if (!p.name?.trim()) {
              errors[`academic.programs.${i}.name`] = `Program ${i + 1}: Name is required`;
            }
            // Duration required
            if (!p.duration?.trim()) {
              errors[`academic.programs.${i}.duration`] = `Program ${i + 1}: Duration is required`;
            }
            // Annual fees required
            if (!p.annualTuition && p.annualTuition !== 0) {
              errors[`academic.programs.${i}.annualTuition`] = `Program ${i + 1}: Annual fees is required`;
            }
            // Total seats required
            if (!p.totalSeats && p.totalSeats !== 0) {
              errors[`academic.programs.${i}.totalSeats`] = `Program ${i + 1}: Total seats is required`;
            }
            // Seat distribution validation: total = govt + management + NRI
            const govt = p.governmentSeats || 0;
            const mgmt = p.managementSeats || 0;
            const nri = p.nriSeats || 0;
            const total = p.totalSeats || 0;
            if (total > 0 && (govt + mgmt + nri) !== total) {
              errors[`academic.programs.${i}.seats`] = `Program ${i + 1}: Govt (${govt}) + Management (${mgmt}) + NRI (${nri}) must equal Total (${total})`;
            }
            // Fee breakdown validation: sum must equal annual fees
            if (p.annualTuition > 0) {
              if (!p.feeBreakdown || p.feeBreakdown.length === 0) {
                errors[`academic.programs.${i}.feeBreakdown`] = `Program ${i + 1}: Fee breakdown is required when annual fees is set`;
              } else {
                // Validate each fee breakdown item has name and amount
                const invalidFeeItems = p.feeBreakdown.some((item: any, fi: number) => {
                  if (!item.name?.trim() || !item.amount || item.amount <= 0) {
                    errors[`academic.programs.${i}.feeBreakdown.${fi}`] = `Program ${i + 1}, Fee item ${fi + 1}: Name and amount are required`;
                    return true;
                  }
                  return false;
                });
                
                if (!invalidFeeItems) {
                  const breakdownSum = p.feeBreakdown.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
                  if (breakdownSum !== p.annualTuition) {
                    errors[`academic.programs.${i}.feeBreakdown`] = `Program ${i + 1}: Fee breakdown total (${breakdownSum}) must equal annual fees (${p.annualTuition})`;
                  }
                }
              }
            }
          });
        }
        // Student demographics validation
        const demo = formData.studentDemographics;
        if (demo) {
          const total = demo.totalStudents || 0;
          const local = demo.localStudents || 0;
          const foreign = demo.foreignStudents || 0;
          if (total > 0 && (local + foreign) !== total) {
            errors["studentDemographics.total"] = `Local (${local}) + Foreign (${foreign}) must equal Total (${total})`;
          }
          // Validate foreignByCountry items have country and count
          if (demo.foreignByCountry?.length) {
            const invalidCountryItems = demo.foreignByCountry.some((c: any, ci: number) => {
              if (!c.country?.trim() || !c.count || c.count <= 0) {
                errors[`studentDemographics.foreignByCountry.${ci}`] = `Country breakdown item ${ci + 1}: Country name and student count are required`;
                return true;
              }
              return false;
            });
            
            if (!invalidCountryItems) {
              const foreignSum = demo.foreignByCountry.reduce((sum: number, c: any) => sum + (c.count || 0), 0);
              if (foreignSum !== foreign) {
                errors["studentDemographics.breakdown"] = `Foreign breakdown total (${foreignSum}) must equal foreign students (${foreign})`;
              }
            }
          }
        }
        break;
        
      case 3: // Step 4: Recognition
        if (!formData.recognition?.ecfmgStatus) {
          errors["recognition.ecfmgStatus"] = "ECFMG status is required";
        }
        // Validate subject rankings have both subject and ranking
        if (formData.recognition?.subjectRankings?.length) {
          formData.recognition.subjectRankings.forEach((item: any, i: number) => {
            if (!item.subject?.trim() || !item.ranking?.trim()) {
              errors[`recognition.subjectRankings.${i}`] = `Subject ranking ${i + 1}: Subject and ranking are required`;
            }
          });
        }
        break;
        
      case 4: // Step 5: Fees
        if (!formData.fees?.currency) {
          errors["fees.currency"] = "Currency is required";
        }
        if (!formData.fees?.paymentSchedule?.trim()) {
          errors["fees.paymentSchedule"] = "Payment schedule is required";
        }
        if (!formData.fees?.refundPolicy?.trim()) {
          errors["fees.refundPolicy"] = "Refund policy is required";
        }
        // Validate scholarship names if scholarship is available
        if (formData.fees?.scholarshipAvailable && formData.fees?.scholarships?.length) {
          formData.fees.scholarships.forEach((name: string, i: number) => {
            if (!name?.trim()) {
              errors[`fees.scholarships.${i}`] = `Scholarship ${i + 1}: Name is required`;
            }
          });
        }
        break;
        
      case 5: // Step 6: Infrastructure
        // Validate departments have names
        if (formData.infrastructure?.departments?.length) {
          formData.infrastructure.departments.forEach((dept: string, i: number) => {
            if (!dept?.trim()) {
              errors[`infrastructure.departments.${i}`] = `Department ${i + 1}: Name is required`;
            }
          });
        }
        // Validate laboratories have names
        if (formData.infrastructure?.laboratories?.length) {
          formData.infrastructure.laboratories.forEach((lab: string, i: number) => {
            if (!lab?.trim()) {
              errors[`infrastructure.laboratories.${i}`] = `Laboratory ${i + 1}: Name is required`;
            }
          });
        }
        // Validate hostel capacity is positive
        if (formData.infrastructure?.hostelBoys < 0) {
          errors["infrastructure.hostelBoys"] = "Hostel capacity cannot be negative";
        }
        if (formData.infrastructure?.hostelGirls < 0) {
          errors["infrastructure.hostelGirls"] = "Hostel capacity cannot be negative";
        }
        // Validate extra facilities have names
        if (formData.infrastructure?.facilities?.length) {
          formData.infrastructure.facilities.forEach((facility: string, i: number) => {
            if (!facility?.trim()) {
              errors[`infrastructure.facilities.${i}`] = `Facility ${i + 1}: Name is required`;
            }
          });
        }
        break;
        
      case 6: // Step 7: Admission
        // Global: Age criteria
        if (!formData.admission?.ageCriteria?.trim()) {
          errors["admission.ageCriteria"] = "Age criteria is required";
        } else {
          // Validate age range format (e.g., "17-25 years")
          const ageMatch = formData.admission.ageCriteria.match(/(\d+)\s*[-–]\s*(\d+)/);
          if (!ageMatch) {
            errors["admission.ageCriteria"] = "Please use format: 17-25 years";
          } else {
            const minAge = parseInt(ageMatch[1]);
            const maxAge = parseInt(ageMatch[2]);
            if (minAge < 0 || maxAge > 100 || minAge >= maxAge) {
              errors["admission.ageCriteria"] = "Please enter a valid age range (e.g., 17-25)";
            }
          }
        }
        
        // Global: Application deadline, fee, selection process
        if (!formData.admission?.applicationDeadline) {
          errors["admission.applicationDeadline"] = "Application deadline is required";
        }
        if (formData.admission?.applicationFee === undefined || formData.admission?.applicationFee === null || formData.admission?.applicationFee === "" || (typeof formData.admission?.applicationFee === "number" && isNaN(formData.admission?.applicationFee))) {
          errors["admission.applicationFee"] = "Application fee is required";
        } else if (typeof formData.admission?.applicationFee === "number" && formData.admission?.applicationFee < 0) {
          errors["admission.applicationFee"] = "Application fee cannot be negative";
        }
        if (!formData.admission?.selectionProcess?.trim()) {
          errors["admission.selectionProcess"] = "Selection process is required";
        }
        
        // Per-program: Minimum marks and Eligibility
        if (formData.academic?.programs?.length) {
          formData.academic.programs.forEach((prog: any, i: number) => {
            if (prog.name?.trim()) {
              // Check if program has eligibility data
              const progEligibility = formData.admission?.programEligibility?.[i];
              
              // Minimum marks per program
              if (!progEligibility?.minimumMarks?.trim()) {
                errors[`admission.programEligibility.${i}.minimumMarks`] = `${prog.name}: Minimum marks required`;
              } else {
                const marksMatch = progEligibility.minimumMarks.match(/(\d+)/);
                if (!marksMatch) {
                  errors[`admission.programEligibility.${i}.minimumMarks`] = `${prog.name}: Include numeric value`;
                } else if (parseInt(marksMatch[1]) < 0) {
                  errors[`admission.programEligibility.${i}.minimumMarks`] = `${prog.name}: Marks cannot be negative`;
                }
              }
              
              // Eligibility per program
              if (!progEligibility?.eligibility?.trim()) {
                errors[`admission.programEligibility.${i}.eligibility`] = `${prog.name}: Eligibility criteria required`;
              }
            }
          });
        }
        
        // Validate required documents (optional but if present, each should have text)
        if (formData.admission?.requiredDocuments?.length) {
          formData.admission.requiredDocuments.forEach((doc: string, i: number) => {
            if (!doc?.trim()) {
              errors[`admission.requiredDocuments.${i}`] = `Document ${i + 1}: Name is required`;
            }
          });
        }
        // Validate entrance exams (optional but if present, each should have text)
        if (formData.admission?.entranceExams?.length) {
          formData.admission.entranceExams.forEach((exam: string, i: number) => {
            if (!exam?.trim()) {
              errors[`admission.entranceExams.${i}`] = `Exam ${i + 1}: Name is required`;
            }
          });
        }
        break;
        
      case 7: // Step 8: Support
        // Validate content descriptions
        if (!formData.content?.shortDescription?.trim()) {
          errors["content.shortDescription"] = "Short description is required";
        }
        if (!formData.content?.longDescription?.trim()) {
          errors["content.longDescription"] = "Long description is required";
        }
        // Validate extra services - if present, each should have text
        if (formData.support?.extraServices?.length) {
          formData.support.extraServices.forEach((service: string, i: number) => {
            if (!service?.trim()) {
              errors[`support.extraServices.${i}`] = `Extra service ${i + 1}: Name is required`;
            }
          });
        }
        break;
        
      case 8: // Step 9: Bank Details
        if (!formData.admin?.pocName?.trim()) {
          errors["admin.pocName"] = "Name is required";
        }
        if (!formData.admin?.pocDesignation?.trim()) {
          errors["admin.pocDesignation"] = "Designation is required";
        }
        if (!formData.admin?.pocEmail?.trim()) {
          errors["admin.pocEmail"] = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin.pocEmail)) {
          errors["admin.pocEmail"] = "Please enter a valid email address";
        }
        // Phone validation with country code
        if (!formData.admin?.phoneCountryCode?.trim()) {
          errors["admin.phoneCountryCode"] = "Country code is required";
        }
        if (!formData.admin?.phoneNumber?.trim()) {
          errors["admin.phoneNumber"] = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.admin.phoneNumber)) {
          errors["admin.phoneNumber"] = "Phone number must be exactly 10 digits";
        }
        if (!formData.admin?.accountName?.trim()) {
          errors["admin.accountName"] = "Account name is required";
        }
        if (!formData.admin?.accountNumber?.trim()) {
          errors["admin.accountNumber"] = "Account number is required";
        }
        if (!formData.admin?.bankName?.trim()) {
          errors["admin.bankName"] = "Bank name is required";
        }
        if (!formData.admin?.bankBranch?.trim()) {
          errors["admin.bankBranch"] = "Bank branch is required";
        }
        if (!formData.admin?.ifscCode?.trim()) {
          errors["admin.ifscCode"] = "IFSC code is required";
        }
        if (formData.admin?.commission === undefined || formData.admin?.commission === null) {
          errors["admin.commission"] = "Commission is required";
        }
        break;
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleNext = () => {
    const { isValid, errors } = validateStep(currentStep);
    if (!isValid) {
      setFormErrors(errors);
      // Focus first error field after a brief delay to allow render
      setTimeout(() => {
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          let element: HTMLElement | null = null;
          
          // Handle dynamic indexed field selectors from all steps
          const handleDynamicField = (fieldPrefix: string, baseSelector: string) => {
            if (firstErrorField.startsWith(fieldPrefix)) {
              const parts = firstErrorField.split('.');
              if (parts.length >= 3) {
                const index = parts[2];
                // Try exact field first, then parent container
                const selectors = [
                  `[data-error-field="${firstErrorField}"]`,
                  `[data-error-field="${baseSelector}.${index}"]`,
                  `[data-error-field="${baseSelector}"]`,
                ];
                for (const sel of selectors) {
                  element = document.querySelector(sel) as HTMLElement;
                  if (element) break;
                }
              }
              return true;
            }
            return false;
          };
          
          // Check all dynamic field patterns from different steps
          const handled = 
            handleDynamicField('academic.programs.', 'academic.programs') || // Step 3: Programs
            handleDynamicField('fees.scholarships.', 'fees.scholarships') || // Step 5: Scholarships
            handleDynamicField('recognition.subjectRankings.', 'recognition.subjectRankings') || // Step 4: Subject rankings
            handleDynamicField('infrastructure.departments.', 'infrastructure.departments') || // Step 6: Departments
            handleDynamicField('infrastructure.laboratories.', 'infrastructure.laboratories') || // Step 6: Labs
            handleDynamicField('infrastructure.facilities.', 'infrastructure.facilities'); // Step 6: Facilities
          
          // Check student demographics breakdown
          if (!handled && firstErrorField.startsWith('studentDemographics.foreignByCountry.')) {
            const parts = firstErrorField.split('.');
            if (parts.length >= 3) {
              const index = parts[2];
              const selectors = [
                `[data-error-field="${firstErrorField}"]`,
                `[data-error-field="studentDemographics.foreignByCountry.${index}"]`,
                `[data-error-field="studentDemographics"]`,
              ];
              for (const sel of selectors) {
                element = document.querySelector(sel) as HTMLElement;
                if (element) break;
              }
            }
          }
          // Check fee breakdown items
          else if (!handled && firstErrorField.match(/academic\.programs\.\d+\.feeBreakdown\.\d+/)) {
            const match = firstErrorField.match(/academic\.programs\.(\d+)\.feeBreakdown\.(\d+)/);
            if (match) {
              const programIndex = match[1];
              const itemIndex = match[2];
              const selectors = [
                `[data-error-field="${firstErrorField}"]`,
                `[data-error-field="academic.programs.${programIndex}.feeBreakdown.${itemIndex}"]`,
                `[data-error-field="academic.programs.${programIndex}.feeBreakdown"]`,
                `[data-error-field="academic.programs.${programIndex}"]`,
                `[data-error-field="academic.programs"]`,
              ];
              for (const sel of selectors) {
                element = document.querySelector(sel) as HTMLElement;
                if (element) break;
              }
            }
          }
          // Check extra services
          else if (!handled && firstErrorField.match(/support\.extraServices\.\d+/)) {
            const match = firstErrorField.match(/support\.extraServices\.(\d+)/);
            if (match) {
              const index = match[1];
              const selectors = [
                `[data-error-field="${firstErrorField}"]`,
                `[data-error-field="support.extraServices.${index}"]`,
                `[data-error-field="support.extraServices"]`,
                `[data-error-field="support"]`,
              ];
              for (const sel of selectors) {
                element = document.querySelector(sel) as HTMLElement;
                if (element) break;
              }
            }
          }
          // Check per-program eligibility
          else if (!handled && firstErrorField.match(/admission\.programEligibility\.\d+/)) {
            const match = firstErrorField.match(/admission\.programEligibility\.(\d+)/);
            if (match) {
              const programIndex = match[1];
              const selectors = [
                `[data-error-field="${firstErrorField}"]`,
                `[data-error-field="admission.programEligibility.${programIndex}"]`,
                `[data-error-field="admission.programEligibility"]`,
                `[data-error-field="admission"]`,
              ];
              for (const sel of selectors) {
                element = document.querySelector(sel) as HTMLElement;
                if (element) break;
              }
            }
          }
          // Standard fields - try exact selector
          else if (!handled) {
            element = document.querySelector(`[data-error-field="${firstErrorField}"]`) as HTMLElement;
          }
          
          // Scroll and focus if element found
          if (element) {
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset + rect.top - 150;
            window.scrollTo({ top: scrollTop, behavior: 'smooth' });
            element.focus();
          }
        }
      }, 150);
      return;
    }
    setFormErrors({});
    setCurrentStep(currentStep + 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Identity */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Identity</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label>University Name *</Label>
                  <Input
                    data-error-field="name"
                    value={formData.name}
                    onChange={(e) => updateRootField("name", e.target.value)}
                    placeholder="ABC Medical College"
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-destructive mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <Label>Short Name *</Label>
                  <Input
                    data-error-field="shortName"
                    value={formData.shortName}
                    onChange={(e) => updateRootField("shortName", e.target.value)}
                    placeholder="ABC MC"
                    className={formErrors.shortName ? "border-destructive" : ""}
                  />
                  {formErrors.shortName && (
                    <p className="text-xs text-destructive mt-1">{formErrors.shortName}</p>
                  )}
                </div>
                <div>
                  <Label>Established Year *</Label>
                  <Input
                    data-error-field="establishedYear"
                    type="number"
                    inputMode="numeric"
                    min={1800}
                    max={new Date().getFullYear()}
                    value={formData.establishedYear ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Allow empty temporarily, validate on submit
                      if (val === "") {
                        updateRootField("establishedYear", null as any);
                      } else {
                        const num = parseInt(val);
                        if (!isNaN(num)) {
                          updateRootField("establishedYear", num);
                        }
                      }
                    }}
                    placeholder="e.g. 2000"
                    className={formErrors.establishedYear ? "border-destructive" : ""}
                  />
                  {formErrors.establishedYear && (
                    <p className="text-xs text-destructive mt-1">{formErrors.establishedYear}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-error-field="type">
                  <Label>Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => {
                      updateRootField("type", v);
                      // Clear error when selected
                      if (v && formErrors.type) {
                        setFormErrors((prev: any) => ({ ...prev, type: undefined }));
                      }
                    }}
                  >
                    <SelectTrigger className={`w-full ${formErrors.type ? "border-destructive" : ""}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GOVERNMENT">Government</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="DEEMED">Deemed</SelectItem>
                      <SelectItem value="AUTONOMOUS">Autonomous</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.type && (
                    <p className="text-xs text-destructive mt-1">{formErrors.type}</p>
                  )}
                </div>
                <div>
                  <Label>Website *</Label>
                  <Input
                    data-error-field="website"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    value={formData.website}
                    onChange={(e) => updateRootField("website", e.target.value)}
                    onBlur={(e) => normalizeUrlField("root", "website", e.target.value)}
                    placeholder="https://university.edu"
                    className={formErrors.website ? "border-destructive" : ""}
                  />
                  {formErrors.website && (
                    <p className="text-xs text-destructive mt-1">{formErrors.website}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Social Media</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Facebook</Label>
                  <Input
                    data-error-field="socialLinks.facebook"
                    type="url"
                    inputMode="url"
                    value={formData.socialLinks?.facebook || ""}
                    onChange={(e) => updateField("socialLinks", "facebook", e.target.value)}
                    onBlur={(e) => normalizeUrlField("socialLinks", "facebook", e.target.value)}
                    placeholder="https://facebook.com/university"
                    className={formErrors["socialLinks.facebook"] ? "border-destructive" : ""}
                  />
                  {formErrors["socialLinks.facebook"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.facebook"]}</p>
                  )}
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input
                    data-error-field="socialLinks.instagram"
                    type="url"
                    inputMode="url"
                    value={formData.socialLinks?.instagram || ""}
                    onChange={(e) => updateField("socialLinks", "instagram", e.target.value)}
                    onBlur={(e) => normalizeUrlField("socialLinks", "instagram", e.target.value)}
                    placeholder="https://instagram.com/university"
                    className={formErrors["socialLinks.instagram"] ? "border-destructive" : ""}
                  />
                  {formErrors["socialLinks.instagram"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.instagram"]}</p>
                  )}
                </div>
                <div>
                  <Label>YouTube</Label>
                  <Input
                    data-error-field="socialLinks.youtube"
                    type="url"
                    inputMode="url"
                    value={formData.socialLinks?.youtube || ""}
                    onChange={(e) => updateField("socialLinks", "youtube", e.target.value)}
                    onBlur={(e) => normalizeUrlField("socialLinks", "youtube", e.target.value)}
                    placeholder="https://youtube.com/channel"
                    className={formErrors["socialLinks.youtube"] ? "border-destructive" : ""}
                  />
                  {formErrors["socialLinks.youtube"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.youtube"]}</p>
                  )}
                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    data-error-field="socialLinks.linkedin"
                    type="url"
                    inputMode="url"
                    value={formData.socialLinks?.linkedin || ""}
                    onChange={(e) => updateField("socialLinks", "linkedin", e.target.value)}
                    onBlur={(e) => normalizeUrlField("socialLinks", "linkedin", e.target.value)}
                    placeholder="https://linkedin.com/school/university"
                    className={formErrors["socialLinks.linkedin"] ? "border-destructive" : ""}
                  />
                  {formErrors["socialLinks.linkedin"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.linkedin"]}</p>
                  )}
                </div>
                <div>
                  <Label>Twitter / X</Label>
                  <Input
                    data-error-field="socialLinks.twitter"
                    type="url"
                    inputMode="url"
                    value={formData.socialLinks?.twitter || ""}
                    onChange={(e) => updateField("socialLinks", "twitter", e.target.value)}
                    onBlur={(e) => normalizeUrlField("socialLinks", "twitter", e.target.value)}
                    placeholder="https://twitter.com/university"
                    className={formErrors["socialLinks.twitter"] ? "border-destructive" : ""}
                  />
                  {formErrors["socialLinks.twitter"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.twitter"]}</p>
                  )}
                </div>
                <div>
                  <Label>TikTok</Label>
                  <Input
                    data-error-field="socialLinks.tiktok"
                    type="url"
                    inputMode="url"
                    value={formData.socialLinks?.tiktok || ""}
                    onChange={(e) => updateField("socialLinks", "tiktok", e.target.value)}
                    onBlur={(e) => normalizeUrlField("socialLinks", "tiktok", e.target.value)}
                    placeholder="https://tiktok.com/@university"
                    className={formErrors["socialLinks.tiktok"] ? "border-destructive" : ""}
                  />
                  {formErrors["socialLinks.tiktok"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["socialLinks.tiktok"]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Media</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:gap-6 items-start">
                {/* Logo */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Logo</Label>
                  <div className="relative">
                    <div
                      className="group flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (!file || !file.type.startsWith("image/")) return;
                        try {
                          const { uploadFile } = await import("@/domains/documents/documents.api");
                          const res = await uploadFile(file, "logos");
                          updateRootField("logo", res.url);
                          setImageKeys((prev) => ({ ...prev, logo: res.key }));
                        } catch { alert("Logo upload failed"); }
                      }}
                      onClick={() => !formData.logo && document.getElementById("logo-upload")?.click()}
                    >
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <>
                          <svg className="mb-1 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
                          <span className="text-[10px] text-muted-foreground">Upload</span>
                        </>
                      )}
                      <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { uploadFile } = await import("@/domains/documents/documents.api");
                          const res = await uploadFile(file, "logos");
                          updateRootField("logo", res.url);
                          setImageKeys((prev) => ({ ...prev, logo: res.key }));
                        } catch { alert("Logo upload failed"); }
                      }} />
                    </div>
                    {formData.logo && (
                      <button type="button" onClick={() => removeImage("logo")} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] shadow hover:bg-destructive/90">✕</button>
                    )}
                  </div>
                </div>
                {/* Banner */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Banner Image</Label>
                  <div className="relative">
                    <div
                      className="group flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (!file || !file.type.startsWith("image/")) return;
                        try {
                          const { uploadFile } = await import("@/domains/documents/documents.api");
                          const res = await uploadFile(file, "banners");
                          updateRootField("bannerImage", res.url);
                          setImageKeys((prev) => ({ ...prev, bannerImage: res.key }));
                        } catch { alert("Banner upload failed"); }
                      }}
                      onClick={() => !formData.bannerImage && document.getElementById("banner-upload")?.click()}
                    >
                      {formData.bannerImage ? (
                        <img src={formData.bannerImage} alt="Banner" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <>
                          <svg className="mb-1 h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4a2 2 0 012.8 0L16 17m-2-2l1.6-1.6a2 2 0 012.8 0L20 15M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="text-xs text-muted-foreground">Drop or click to upload banner</span>
                          <span className="text-[10px] text-muted-foreground/60">1200×400px recommended</span>
                        </>
                      )}
                      <input id="banner-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { uploadFile } = await import("@/domains/documents/documents.api");
                          const res = await uploadFile(file, "banners");
                          updateRootField("bannerImage", res.url);
                          setImageKeys((prev) => ({ ...prev, bannerImage: res.key }));
                        } catch { alert("Banner upload failed"); }
                      }} />
                    </div>
                    {formData.bannerImage && (
                      <button type="button" onClick={() => removeImage("bannerImage")} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] shadow hover:bg-destructive/90">✕</button>
                    )}
                  </div>
                </div>
              </div>
              {/* Brochure */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Brochure (PDF)</Label>
                <div className="relative">
                  {formData.brochureUrl ? (
                    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                      <svg className="h-8 w-8 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6H7zm7 1.5L18.5 8H14V3.5zM9 13h6v1.5H9V13zm0 3h6v1.5H9V16zm0-6h3v1.5H9V10z"/></svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Brochure uploaded</p>
                        <p className="text-xs text-muted-foreground truncate">{formData.brochureUrl}</p>
                      </div>
                      <button type="button" onClick={() => removeImage("brochure")} className="text-destructive/70 hover:text-destructive text-xs font-medium">Remove</button>
                    </div>
                  ) : (
                    <div
                      className="group flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => document.getElementById("brochure-upload")?.click()}
                    >
                      <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
                      <span className="text-sm text-muted-foreground">Upload brochure PDF</span>
                    </div>
                  )}
                  <input id="brochure-upload" type="file" accept=".pdf,application/pdf" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.type !== "application/pdf") { alert("Please upload a PDF file"); return; }
                    try {
                      const { uploadFile } = await import("@/domains/documents/documents.api");
                      const res = await uploadFile(file, "brochures");
                      updateRootField("brochureUrl", res.url);
                      setImageKeys((prev) => ({ ...prev, brochure: res.key }));
                    } catch { alert("Brochure upload failed"); }
                  }} />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Location */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div data-error-field="location.country">
                  <Label>Country *</Label>
                  <SearchableSelect
                    options={Country.getAllCountries().map((c) => ({ label: c.name, value: c.isoCode }))}
                    value={locationCodes.countryCode}
                    onChange={(code) => {
                      setLocationCodes({ countryCode: code, stateCode: "" });
                      const name = Country.getCountryByCode(code)?.name || "";
                      updateField("location", "country", name);
                      updateField("location", "state", "");
                      updateField("location", "city", "");
                      // Clear error when selected
                      if (code && formErrors["location.country"]) {
                        setFormErrors((prev: any) => ({ ...prev, "location.country": undefined }));
                      }
                    }}
                    placeholder="Search country..."
                  />
                  {formErrors["location.country"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["location.country"]}</p>
                  )}
                </div>
                <div data-error-field="location.state">
                  <Label>State *</Label>
                  <SearchableSelect
                    options={
                      locationCodes.countryCode
                        ? State.getStatesOfCountry(locationCodes.countryCode).map((s) => ({ label: s.name, value: s.isoCode }))
                        : []
                    }
                    value={locationCodes.stateCode}
                    onChange={(code) => {
                      setLocationCodes((prev) => ({ ...prev, stateCode: code }));
                      const name = State.getStateByCodeAndCountry(code, locationCodes.countryCode)?.name || "";
                      updateField("location", "state", name);
                      updateField("location", "city", "");
                      // Clear error when selected
                      if (code && formErrors["location.state"]) {
                        setFormErrors((prev: any) => ({ ...prev, "location.state": undefined }));
                      }
                    }}
                    placeholder="Search state..."
                    disabled={!locationCodes.countryCode}
                  />
                  {formErrors["location.state"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["location.state"]}</p>
                  )}
                </div>
                <div data-error-field="location.city">
                  <Label>City *</Label>
                  <SearchableSelect
                    options={
                      locationCodes.countryCode && locationCodes.stateCode
                        ? City.getCitiesOfState(locationCodes.countryCode, locationCodes.stateCode).map((c) => ({ label: c.name, value: c.name }))
                        : []
                    }
                    value={formData.location.city}
                    onChange={(val) => {
                      updateField("location", "city", val);
                      // Clear error when selected
                      if (val && formErrors["location.city"]) {
                        setFormErrors((prev: any) => ({ ...prev, "location.city": undefined }));
                      }
                    }}
                    placeholder="Search city..."
                    disabled={!locationCodes.stateCode}
                  />
                  {formErrors["location.city"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["location.city"]}</p>
                  )}
                </div>
              </div>
              <div data-error-field="location.address">
                <Label>Address *</Label>
                <Textarea
                  data-error-field="location.address"
                  value={formData.location.address}
                  onChange={(e) => updateField("location", "address", e.target.value)}
                  placeholder="Full street address"
                  rows={2}
                  className={formErrors["location.address"] ? "border-destructive" : ""}
                />
                {formErrors["location.address"] && (
                  <p className="text-xs text-destructive mt-1">{formErrors["location.address"]}</p>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-error-field="contact.email">
                  <Label>Email *</Label>
                  <Input
                    data-error-field="contact.email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => updateField("contact", "email", e.target.value)}
                    placeholder="admissions@university.edu"
                    className={formErrors["contact.email"] ? "border-destructive" : ""}
                  />
                  {(formErrors["contact.email"] || (formData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email))) && (
                    <p className="text-xs text-destructive mt-1">
                      {formErrors["contact.email"] || "Please enter a valid email address"}
                    </p>
                  )}
                </div>
                <div data-error-field="contact.phone">
                  <Label>Phone *</Label>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-10 items-center rounded-md border border-border bg-muted px-3 text-sm font-medium text-muted-foreground select-none">
                      +{Country.getCountryByCode(locationCodes.countryCode)?.phonecode || "—"}
                    </span>
                    <Input
                      data-error-field="contact.phone"
                      className={`flex-1 ${formErrors["contact.phone"] ? "border-destructive" : ""}`}
                      value={formData.contact.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        updateField("contact", "phone", digits);
                        // Clear error when typing
                        if (digits && formErrors["contact.phone"]) {
                          setFormErrors((prev: any) => ({ ...prev, "contact.phone": undefined }));
                        }
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </div>
                  {formErrors["contact.phone"] ? (
                    <p className="text-xs text-destructive mt-1">{formErrors["contact.phone"]}</p>
                  ) : formData.contact.phone && formData.contact.phone.length < 10 ? (
                    <p className="text-xs text-muted-foreground mt-1">{formData.contact.phone.length}/10 digits</p>
                  ) : null}
                </div>
              </div>
              <div data-error-field="contact.admissionOfficeHours">
                <Label>Office Hours *</Label>
                <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 mt-1">
                  <Select
                    value={formData.contact._officeHoursDays || "Mon-Fri"}
                    onValueChange={(val) => {
                      updateField("contact", "_officeHoursDays", val);
                      const time = `${formData.contact._officeHoursFrom || "09:00"} - ${formData.contact._officeHoursTo || "17:00"}`;
                      updateField("contact", "admissionOfficeHours", `${val} ${time}`);
                      // Clear error when selected
                      if (val && formErrors["contact.admissionOfficeHours"]) {
                        setFormErrors((prev: any) => ({ ...prev, "contact.admissionOfficeHours": undefined }));
                      }
                    }}
                  >
                    <SelectTrigger className={formErrors["contact.admissionOfficeHours"] ? "border-destructive" : ""}><SelectValue placeholder="Days" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mon-Fri">Mon – Fri</SelectItem>
                      <SelectItem value="Mon-Sat">Mon – Sat</SelectItem>
                      <SelectItem value="Mon-Sun">Mon – Sun</SelectItem>
                      <SelectItem value="Sat-Sun">Sat – Sun</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">from</span>
                  <Input
                    type="time"
                    value={formData.contact._officeHoursFrom || "09:00"}
                    onChange={(e) => {
                      updateField("contact", "_officeHoursFrom", e.target.value);
                      const days = formData.contact._officeHoursDays || "Mon-Fri";
                      const to = formData.contact._officeHoursTo || "17:00";
                      updateField("contact", "admissionOfficeHours", `${days} ${e.target.value} - ${to}`);
                    }}
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={formData.contact._officeHoursTo || "17:00"}
                    onChange={(e) => {
                      updateField("contact", "_officeHoursTo", e.target.value);
                      const days = formData.contact._officeHoursDays || "Mon-Fri";
                      const from = formData.contact._officeHoursFrom || "09:00";
                      updateField("contact", "admissionOfficeHours", `${days} ${from} - ${e.target.value}`);
                    }}
                  />
                </div>
                {formErrors["contact.admissionOfficeHours"] ? (
                  <p className="text-xs text-destructive mt-1">{formErrors["contact.admissionOfficeHours"]}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">{formData.contact.admissionOfficeHours}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Program Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Program Information</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Add program to academic
                    updateField("academic", "programs", [
                      ...(formData.academic.programs || []),
                      { name: "", duration: "5.5 years", annualTuition: 0, registration: 0, totalSeats: 0, governmentSeats: 0, managementSeats: 0, nriSeats: 0, feeBreakdown: [] },
                    ]);
                    // Also add empty eligibility entry for this program
                    const currentEligibility = formData.admission?.programEligibility || [];
                    updateField("admission", "programEligibility", [
                      ...currentEligibility,
                      { minimumMarks: "", eligibility: "" }
                    ]);
                  }}
                >
                  + Add Program
                </Button>
              </div>
              {(!formData.academic.programs || formData.academic.programs.length === 0) ? (
                <div className="rounded-lg border border-dashed border-border/60 bg-card p-6 text-center">
                  <p className="text-sm text-muted-foreground">No programs added yet. Click "Add Program" to add MBBS, etc.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.academic.programs.map((prog: any, i: number) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-card p-3 space-y-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Program {i + 1}</h5>
                        <button
                          type="button"
                          onClick={() => {
                            // Remove program from academic
                            const updated = formData.academic.programs.filter((_: any, j: number) => j !== i);
                            updateField("academic", "programs", updated);
                            // Also remove corresponding eligibility entry
                            const updatedEligibility = (formData.admission?.programEligibility || [])
                              .filter((_: any, j: number) => j !== i);
                            updateField("admission", "programEligibility", updatedEligibility);
                          }}
                          className="text-destructive/70 hover:text-destructive text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label>Program Name *</Label>
                          <Input
                            value={prog.name}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], name: e.target.value };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="e.g. MBBS"
                          />
                        </div>
                        <div>
                          <Label>Duration *</Label>
                          <Select
                            value={prog.duration}
                            onValueChange={(v) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], duration: v };
                              updateField("academic", "programs", updated);
                            }}
                          >
                            <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4.5 years">4.5 years</SelectItem>
                              <SelectItem value="5 years">5 years</SelectItem>
                              <SelectItem value="5.5 years">5.5 years</SelectItem>
                              <SelectItem value="6 years">6 years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div data-error-field={`academic.programs.${i}.annualTuition`}>
                          <Label>Annual Fees *</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.annualTuition || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], annualTuition: parseFloat(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="e.g. 500000"
                            className={formErrors[`academic.programs.${i}.annualTuition`] || formErrors[`academic.programs.${i}.feeBreakdown`] ? "border-destructive" : ""}
                          />
                          {formErrors[`academic.programs.${i}.annualTuition`] && (
                            <p className="text-xs text-destructive mt-1">{formErrors[`academic.programs.${i}.annualTuition`]}</p>
                          )}
                        </div>
                        <div>
                          <Label>Registration *</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.registration || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], registration: parseFloat(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="e.g. 25000"
                          />
                        </div>
                        <div data-error-field={`academic.programs.${i}.totalSeats`}>
                          <Label>Total Seats *</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.totalSeats || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], totalSeats: parseInt(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="e.g. 150"
                            className={formErrors[`academic.programs.${i}.totalSeats`] || formErrors[`academic.programs.${i}.seats`] ? "border-destructive" : ""}
                          />
                          {formErrors[`academic.programs.${i}.totalSeats`] && (
                            <p className="text-xs text-destructive mt-1">{formErrors[`academic.programs.${i}.totalSeats`]}</p>
                          )}
                          {formErrors[`academic.programs.${i}.seats`] && (
                            <p className="text-xs text-destructive mt-1">{formErrors[`academic.programs.${i}.seats`]}</p>
                          )}
                        </div>
                      </div>
                       {/* Seat Distribution */}
                      <div data-error-field={`academic.programs.${i}.seats`} className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${formErrors[`academic.programs.${i}.seats`] ? "border border-destructive rounded-lg p-2" : ""}`}>
                        <div>
                          <Label>Govt Seats *</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.governmentSeats || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], governmentSeats: parseInt(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="0"
                            className={formErrors[`academic.programs.${i}.seats`] ? "border-destructive" : ""}
                          />
                        </div>
                        <div>
                          <Label>Management Seats *</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.managementSeats || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], managementSeats: parseInt(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="0"
                            className={formErrors[`academic.programs.${i}.seats`] ? "border-destructive" : ""}
                          />
                        </div>
                        <div>
                          <Label>NRI Seats *</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.nriSeats || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], nriSeats: parseInt(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="0"
                            className={formErrors[`academic.programs.${i}.seats`] ? "border-destructive" : ""}
                          />
                        </div>
                        {formErrors[`academic.programs.${i}.seats`] && (
                          <div className="sm:col-span-3">
                            <p className="text-xs text-destructive">{formErrors[`academic.programs.${i}.seats`]}</p>
                          </div>
                        )}
                      </div>

                      {/* Per-Program Fee Breakdown */}
                      <div data-error-field={`academic.programs.${i}.feeBreakdown`} className={`border-t border-border/40 pt-3 ${formErrors[`academic.programs.${i}.feeBreakdown`] ? "border-destructive" : ""}`}>
                        <div className="flex items-center justify-between mb-2">
                          <Label className={`text-xs ${formErrors[`academic.programs.${i}.feeBreakdown`] ? "text-destructive" : "text-muted-foreground"}`}>
                            Fee Breakdown {prog.annualTuition > 0 && "*"}
                            {prog.annualTuition > 0 && (
                              <span className="ml-1 text-muted-foreground">
                                (Sum must equal {prog.annualTuition})
                              </span>
                            )}
                          </Label>
                          {formErrors[`academic.programs.${i}.feeBreakdown`] && (
                            <p className="text-xs text-destructive">{formErrors[`academic.programs.${i}.feeBreakdown`]}</p>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = [...formData.academic.programs];
                              const uid = crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
                              updated[i] = {
                                ...updated[i],
                                feeBreakdown: [...(updated[i].feeBreakdown || []), { id: uid, name: "", amount: 0 }],
                              };
                              updateField("academic", "programs", updated);
                            }}
                          >
                            + Add Item
                          </Button>
                        </div>
                        {(!prog.feeBreakdown || prog.feeBreakdown.length === 0) ? (
                          <p className="text-xs text-muted-foreground">No fee breakdown items yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {prog.feeBreakdown.map((item: any, fi: number) => {
                              const itemError = formErrors[`academic.programs.${i}.feeBreakdown.${fi}`];
                              return (
                                <div key={item.id || fi} data-error-field={`academic.programs.${i}.feeBreakdown.${fi}`} className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={item.name}
                                      onChange={(e) => {
                                        const updated = [...formData.academic.programs];
                                        updated[i].feeBreakdown = [...(updated[i].feeBreakdown || [])];
                                        updated[i].feeBreakdown[fi] = { ...updated[i].feeBreakdown[fi], name: e.target.value };
                                        updateField("academic", "programs", updated);
                                        // Clear error when typing
                                        if (e.target.value && formErrors[`academic.programs.${i}.feeBreakdown.${fi}`]) {
                                          setFormErrors((prev: any) => ({ ...prev, [`academic.programs.${i}.feeBreakdown.${fi}`]: undefined }));
                                        }
                                      }}
                                      placeholder="Fee name"
                                      className={`flex-1 ${itemError || (!item.name && item.amount) ? "border-destructive" : ""}`}
                                    />
                                    <Input
                                      type="text"
                                      inputMode="numeric"
                                      value={item.amount || ""}
                                      onChange={(e) => {
                                        const updated = [...formData.academic.programs];
                                        updated[i].feeBreakdown = [...(updated[i].feeBreakdown || [])];
                                        updated[i].feeBreakdown[fi] = { ...updated[i].feeBreakdown[fi], amount: parseFloat(e.target.value) || 0 };
                                        updateField("academic", "programs", updated);
                                        // Clear error when typing
                                        if (e.target.value && formErrors[`academic.programs.${i}.feeBreakdown.${fi}`]) {
                                          setFormErrors((prev: any) => ({ ...prev, [`academic.programs.${i}.feeBreakdown.${fi}`]: undefined }));
                                        }
                                      }}
                                      placeholder="Amount"
                                      className={`w-28 ${itemError || (item.name && !item.amount) ? "border-destructive" : ""}`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...formData.academic.programs];
                                        updated[i].feeBreakdown = (updated[i].feeBreakdown || []).filter((_: any, k: number) => k !== fi);
                                        updateField("academic", "programs", updated);
                                      }}
                                      className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                                    >
                                      ×
                                    </button>
                                  </div>
                                  {(itemError || (!item.name && item.amount) || (item.name && !item.amount)) && (
                                    <p className="text-xs text-destructive">
                                      {itemError || "Name and amount are required"}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Medium of Instruction (Universal) */}
            <div data-error-field="academic.medium" className="rounded-lg border border-border/60 bg-card p-3 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-3">Medium of Instruction *</h4>
              <div className="max-w-xs">
                <Select
                  value={isOtherMedium ? "Other" : formData.academic.medium}
                  onValueChange={(v) => {
                    if (v === "Other") {
                      updateField("academic", "medium", "Other:");
                    } else {
                      updateField("academic", "medium", v);
                    }
                    // Clear error when selected
                    if (v && formErrors["academic.medium"]) {
                      setFormErrors((prev: any) => ({ ...prev, "academic.medium": undefined }));
                    }
                  }}
                >
                  <SelectTrigger className={formErrors["academic.medium"] ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIVERSAL_MEDIUMS.map((lang: string) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                    <SelectItem value="Other">Others</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors["academic.medium"] && (
                  <p className="text-xs text-destructive mt-1">{formErrors["academic.medium"]}</p>
                )}
                {isOtherMedium && (
                  <Input
                    value={otherMediumValue}
                    onChange={(e) => updateField("academic", "medium", `Other:${e.target.value}`)}
                    placeholder="Type the medium of instruction"
                    className="mt-2"
                  />
                )}
              </div>
            </div>



            {/* Student Demographics */}
            <div data-error-field="studentDemographics" className={`rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4 ${formErrors["studentDemographics.total"] || formErrors["studentDemographics.breakdown"] ? "border-destructive" : ""}`}>
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Student Demographics</h4>
              {(formErrors["studentDemographics.total"] || formErrors["studentDemographics.breakdown"]) && (
                <p className="text-xs text-destructive">{formErrors["studentDemographics.total"] || formErrors["studentDemographics.breakdown"]}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div data-error-field="studentDemographics.total">
                  <Label>Total Students</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.studentDemographics.totalStudents || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        studentDemographics: { ...prev.studentDemographics, totalStudents: parseInt(e.target.value) || 0 },
                      }))
                    }
                    placeholder="e.g. 5000"
                    className={formErrors["studentDemographics.total"] ? "border-destructive" : ""}
                  />
                </div>
                <div>
                  <Label>Local Students</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.studentDemographics.localStudents || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        studentDemographics: { ...prev.studentDemographics, localStudents: parseInt(e.target.value) || 0 },
                      }))
                    }
                    placeholder="e.g. 3500"
                    className={formErrors["studentDemographics.total"] ? "border-destructive" : ""}
                  />
                </div>
                <div>
                  <Label>Foreign Students</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.studentDemographics.foreignStudents || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        studentDemographics: { ...prev.studentDemographics, foreignStudents: parseInt(e.target.value) || 0 },
                      }))
                    }
                    placeholder="e.g. 1500"
                    className={formErrors["studentDemographics.total"] || formErrors["studentDemographics.breakdown"] ? "border-destructive" : ""}
                  />
                </div>
              </div>

              {/* Foreign By Country */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">Breakdown by Country</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        studentDemographics: {
                          ...prev.studentDemographics,
                          foreignByCountry: [...prev.studentDemographics.foreignByCountry, { country: "", count: 0 }],
                        },
                      }))
                    }
                  >
                    + Add Country
                  </Button>
                </div>
                {formData.studentDemographics.foreignByCountry.map((entry: any, ci: number) => {
                  const countryError = formErrors[`studentDemographics.foreignByCountry.${ci}`];
                  return (
                    <div key={ci} data-error-field={`studentDemographics.foreignByCountry.${ci}`} className="mb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`flex-1 ${countryError || (!entry.country && entry.count) ? "border-destructive" : ""}`}>
                          <SearchableSelect
                            options={Country.getAllCountries().map((c) => ({ label: c.name, value: c.isoCode }))}
                            value={Country.getAllCountries().find((c) => c.name === entry.country)?.isoCode ?? ""}
                            onChange={(code) => {
                              const name = Country.getCountryByCode(code)?.name || "";
                              setFormData((prev: any) => {
                                const updated = [...prev.studentDemographics.foreignByCountry];
                                updated[ci] = { ...updated[ci], country: name };
                                return { ...prev, studentDemographics: { ...prev.studentDemographics, foreignByCountry: updated } };
                              });
                              // Clear error when selected
                              if (name && formErrors[`studentDemographics.foreignByCountry.${ci}`]) {
                                setFormErrors((prev: any) => ({ ...prev, [`studentDemographics.foreignByCountry.${ci}`]: undefined }));
                              }
                            }}
                            placeholder="Search country..."
                          />
                        </div>
                        <Input
                          className={`w-24 ${countryError || (entry.country && !entry.count) ? "border-destructive" : ""}`}
                          type="text"
                          inputMode="numeric"
                          value={entry.count || ""}
                          onChange={(e) => {
                            const count = parseInt(e.target.value) || 0;
                            setFormData((prev: any) => {
                              const updated = [...prev.studentDemographics.foreignByCountry];
                              updated[ci] = { ...updated[ci], count };
                              return { ...prev, studentDemographics: { ...prev.studentDemographics, foreignByCountry: updated } };
                            });
                            // Clear error when typing
                            if (count > 0 && formErrors[`studentDemographics.foreignByCountry.${ci}`]) {
                              setFormErrors((prev: any) => ({ ...prev, [`studentDemographics.foreignByCountry.${ci}`]: undefined }));
                            }
                          }}
                          placeholder="Count"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() =>
                            setFormData((prev: any) => ({
                              ...prev,
                              studentDemographics: {
                                ...prev.studentDemographics,
                                foreignByCountry: prev.studentDemographics.foreignByCountry.filter((_: any, j: number) => j !== ci),
                              },
                            }))
                          }
                        >
                          ✕
                        </Button>
                      </div>
                      {(countryError || (!entry.country && entry.count) || (entry.country && !entry.count)) && (
                        <p className="text-xs text-destructive">
                          {countryError || "Country name and student count are required"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Status Section */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Accreditation Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>ECFMG Status *</Label>
                  <Select
                    value={formData.recognition.ecfmgStatus}
                    onValueChange={(v) =>
                      updateField("recognition", "ecfmgStatus", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVED">✅ Approved</SelectItem>
                      <SelectItem value="NOT_APPROVED">❌ Not Approved</SelectItem>
                      <SelectItem value="PENDING">⏳ Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>WHO Listed</Label>
                  <Select
                    value={(formData.recognition.bodies || []).includes("WHO") ? "YES" : "NO"}
                    onValueChange={(v) => {
                      const current = formData.recognition.bodies || [];
                      if (v === "YES" && !current.includes("WHO")) {
                        updateField("recognition", "bodies", [...current, "WHO"]);
                      } else if (v === "NO") {
                        updateField("recognition", "bodies", current.filter((b: string) => b !== "WHO"));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YES">Yes</SelectItem>
                      <SelectItem value="NO">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-full sm:w-1/2">
                <Label>NMC Approved</Label>
                <Select
                  value={(formData.recognition.bodies || []).includes("NMC") ? "YES" : "NO"}
                  onValueChange={(v) => {
                    const current = formData.recognition.bodies || [];
                    if (v === "YES" && !current.includes("NMC")) {
                      updateField("recognition", "bodies", [...current, "NMC"]);
                    } else if (v === "NO") {
                      updateField("recognition", "bodies", current.filter((b: string) => b !== "NMC"));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">Yes</SelectItem>
                    <SelectItem value="NO">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Rankings Section */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Rankings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>World Rank</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.recognition.worldRank || ""}
                    onChange={(e) =>
                      updateField("recognition", "worldRank", e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="e.g. 450"
                  />
                </div>
                <div>
                  <Label>National Rank</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.recognition.nationalRank || ""}
                    onChange={(e) =>
                      updateField("recognition", "nationalRank", e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="e.g. 25"
                  />
                </div>
                <div>
                  <Label>World Ranking Source</Label>
                  <Select
                    value={formData.recognition.worldRankingSource || ""}
                    onValueChange={(v) => {
                      updateField("recognition", "worldRankingSource", v || null);
                      if (v !== "Other") {
                        updateField("recognition", "otherRankingSource", null);
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QS World">QS World Rankings</SelectItem>
                      <SelectItem value="THE">Times Higher Education</SelectItem>
                      <SelectItem value="US News">US News & World Report</SelectItem>
                      <SelectItem value="Webometrics">Webometrics</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.recognition.worldRankingSource === "Other" && (
                    <Input
                      className="mt-2"
                      value={formData.recognition.otherRankingSource || ""}
                      onChange={(e) => updateField("recognition", "otherRankingSource", e.target.value || null)}
                      placeholder="Enter ranking source name"
                    />
                  )}
                </div>
                <div>
                  <Label>National Ranking Source</Label>
                  <Select
                    value={formData.recognition.nationalRankingSource || ""}
                    onValueChange={(v) => updateField("recognition", "nationalRankingSource", v || null)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUG Complete">CUG Complete University Guide (UK)</SelectItem>
                      <SelectItem value="NIRF">NIRF (India)</SelectItem>
                      <SelectItem value="Guardian">Guardian University Guide (UK)</SelectItem>
                       <SelectItem value="Forbes">Forbes (US)</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.recognition.nationalRankingSource === "Other" && (
                    <Input
                      className="mt-2"
                      value={formData.recognition.otherNationalRankingSource || ""}
                      onChange={(e) => updateField("recognition", "otherNationalRankingSource", e.target.value || null)}
                      placeholder="Enter national ranking source name"
                    />
                  )}
                </div>
              </div>

              {/* Subject Rankings */}
              <div className="border-t border-border/40 pt-3 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <Label className={`text-xs ${formErrors["recognition.subjectRankings"] || Object.keys(formErrors).some(k => k.startsWith("recognition.subjectRankings.")) ? "text-destructive" : "text-muted-foreground"}`}>
                    Subject Rankings
                    {Object.keys(formErrors).some(k => k.startsWith("recognition.subjectRankings.")) && (
                      <span className="ml-1 text-destructive">(Subject and ranking required)</span>
                    )}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateField("recognition", "subjectRankings", [...(formData.recognition.subjectRankings || []), { subject: "", ranking: "" }])
                    }
                  >
                    + Add Subject Ranking
                  </Button>
                </div>
                {(formData.recognition.subjectRankings || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No subject rankings listed yet.</p>
                ) : (
                  <div className="space-y-2">
                    {(formData.recognition.subjectRankings || []).map((item: { subject: string; ranking: string }, i: number) => {
                      const itemError = formErrors[`recognition.subjectRankings.${i}`];
                      return (
                        <div key={i} data-error-field={`recognition.subjectRankings.${i}`} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Input
                              value={item.subject}
                              onChange={(e) => {
                                const updated = [...(formData.recognition.subjectRankings || [])];
                                updated[i] = { ...updated[i], subject: e.target.value };
                                updateField("recognition", "subjectRankings", updated);
                                // Clear error when typing
                                if (e.target.value && formErrors[`recognition.subjectRankings.${i}`]) {
                                  setFormErrors((prev: any) => ({ ...prev, [`recognition.subjectRankings.${i}`]: undefined }));
                                }
                              }}
                              placeholder="e.g. Medicine"
                              className={`flex-1 ${itemError || (!item.subject && item.ranking) ? "border-destructive" : ""}`}
                            />
                            <Input
                              value={item.ranking}
                              onChange={(e) => {
                                const updated = [...(formData.recognition.subjectRankings || [])];
                                updated[i] = { ...updated[i], ranking: e.target.value };
                                updateField("recognition", "subjectRankings", updated);
                                // Clear error when typing
                                if (e.target.value && formErrors[`recognition.subjectRankings.${i}`]) {
                                  setFormErrors((prev: any) => ({ ...prev, [`recognition.subjectRankings.${i}`]: undefined }));
                                }
                              }}
                              placeholder="e.g. Top 100"
                              className={`flex-1 ${itemError || (item.subject && !item.ranking) ? "border-destructive" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (formData.recognition.subjectRankings || []).filter((_: any, j: number) => j !== i);
                                updateField("recognition", "subjectRankings", updated);
                              }}
                              className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                            >
                              ×
                            </button>
                          </div>
                          {(itemError || (!item.subject && item.ranking) || (item.subject && !item.ranking)) && (
                            <p className="text-xs text-destructive">
                              {itemError || "Subject and ranking are required"}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Fee Structure */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Fee Structure</h4>

              <div data-error-field="fees.currency">
                <Label>Currency *</Label>
                <div className="max-w-xs">
                  <Select
                    value={formData.fees.currency}
                    onValueChange={(v) => {
                      updateField("fees", "currency", v);
                      // Clear error when selected
                      if (v && formErrors["fees.currency"]) {
                        setFormErrors((prev: any) => ({ ...prev, "fees.currency": undefined }));
                      }
                    }}
                  >
                    <SelectTrigger className={formErrors["fees.currency"] ? "border-destructive" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ INR</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                      <SelectItem value="RUB">₽ RUB</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors["fees.currency"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["fees.currency"]}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="scholarship-toggle"
                  checked={formData.fees.scholarshipAvailable}
                  onCheckedChange={(checked) => updateField("fees", "scholarshipAvailable", checked)}
                />
                <Label htmlFor="scholarship-toggle" className="cursor-pointer font-medium">Scholarship Available</Label>
              </div>

              {formData.fees.scholarshipAvailable && (
                <div className="border-t border-border/40 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-muted-foreground">Scholarship Names</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateField("fees", "scholarships", [...formData.fees.scholarships, ""])
                      }
                    >
                      + Add Scholarship
                    </Button>
                  </div>
                  {formData.fees.scholarships.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No scholarships listed yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.fees.scholarships.map((name: string, i: number) => {
                        const itemError = formErrors[`fees.scholarships.${i}`];
                        return (
                          <div key={i} data-error-field={`fees.scholarships.${i}`} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Input
                                value={name}
                                onChange={(e) => {
                                  const updated = [...formData.fees.scholarships];
                                  updated[i] = e.target.value;
                                  updateField("fees", "scholarships", updated);
                                  // Clear error when typing
                                  if (e.target.value && formErrors[`fees.scholarships.${i}`]) {
                                    setFormErrors((prev: any) => ({ ...prev, [`fees.scholarships.${i}`]: undefined }));
                                  }
                                }}
                                placeholder="e.g. Merit-Based Scholarship"
                                className={`flex-1 ${itemError || (name === "") ? "border-destructive" : ""}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formData.fees.scholarships.filter((_: string, j: number) => j !== i);
                                  updateField("fees", "scholarships", updated);
                                }}
                                className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                              >
                                ×
                              </button>
                            </div>
                            {itemError && (
                              <p className="text-xs text-destructive">{itemError}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment & Policies */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Payment & Policies</h4>
              <div data-error-field="fees.paymentSchedule">
                <Label>Payment Schedule *</Label>
                <Textarea
                  data-error-field="fees.paymentSchedule"
                  value={formData.fees.paymentSchedule}
                  onChange={(e) => updateField("fees", "paymentSchedule", e.target.value)}
                  placeholder="e.g. Semester-wise, 50% at admission + 50% before 2nd year"
                  rows={2}
                  className={formErrors["fees.paymentSchedule"] ? "border-destructive" : ""}
                />
                {formErrors["fees.paymentSchedule"] && (
                  <p className="text-xs text-destructive mt-1">{formErrors["fees.paymentSchedule"]}</p>
                )}
              </div>
              <div data-error-field="fees.refundPolicy">
                <Label>Refund Policy *</Label>
                <Textarea
                  data-error-field="fees.refundPolicy"
                  value={formData.fees.refundPolicy}
                  onChange={(e) => updateField("fees", "refundPolicy", e.target.value)}
                  placeholder="e.g. Full refund before classes start, 50% within first month"
                  rows={2}
                  className={formErrors["fees.refundPolicy"] ? "border-destructive" : ""}
                />
                {formErrors["fees.refundPolicy"] && (
                  <p className="text-xs text-destructive mt-1">{formErrors["fees.refundPolicy"]}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Departments */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Departments</h4>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">Department Names</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateField("infrastructure", "departments", [...(formData.infrastructure.departments || []), ""])}
                  >
                    + Add Department
                  </Button>
                </div>
                {(!formData.infrastructure.departments || formData.infrastructure.departments.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No departments added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {formData.infrastructure.departments.map((dept: string, i: number) => {
                      const itemError = formErrors[`infrastructure.departments.${i}`];
                      return (
                        <div key={i} data-error-field={`infrastructure.departments.${i}`} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Input
                              value={dept}
                              onChange={(e) => {
                                const updated = [...formData.infrastructure.departments];
                                updated[i] = e.target.value;
                                updateField("infrastructure", "departments", updated);
                                // Clear error when typing
                                if (e.target.value && formErrors[`infrastructure.departments.${i}`]) {
                                  setFormErrors((prev: any) => ({ ...prev, [`infrastructure.departments.${i}`]: undefined }));
                                }
                              }}
                              placeholder="e.g. Cardiology"
                              className={`flex-1 ${itemError ? "border-destructive" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.infrastructure.departments.filter((_: any, j: number) => j !== i);
                                updateField("infrastructure", "departments", updated);
                              }}
                              className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                            >
                              ×
                            </button>
                          </div>
                          {itemError && (
                            <p className="text-xs text-destructive">{itemError}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Laboratories */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Laboratories</h4>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">Laboratory Names</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateField("infrastructure", "laboratories", [...(formData.infrastructure.laboratories || []), ""])}
                  >
                    + Add Laboratory
                  </Button>
                </div>
                {(!formData.infrastructure.laboratories || formData.infrastructure.laboratories.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No laboratories added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {formData.infrastructure.laboratories.map((lab: string, i: number) => {
                      const itemError = formErrors[`infrastructure.laboratories.${i}`];
                      return (
                        <div key={i} data-error-field={`infrastructure.laboratories.${i}`} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Input
                              value={lab}
                              onChange={(e) => {
                                const updated = [...formData.infrastructure.laboratories];
                                updated[i] = e.target.value;
                                updateField("infrastructure", "laboratories", updated);
                                // Clear error when typing
                                if (e.target.value && formErrors[`infrastructure.laboratories.${i}`]) {
                                  setFormErrors((prev: any) => ({ ...prev, [`infrastructure.laboratories.${i}`]: undefined }));
                                }
                              }}
                              placeholder="e.g. Anatomy Lab"
                              className={`flex-1 ${itemError ? "border-destructive" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.infrastructure.laboratories.filter((_: any, j: number) => j !== i);
                                updateField("infrastructure", "laboratories", updated);
                              }}
                              className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                            >
                              ×
                            </button>
                          </div>
                          {itemError && (
                            <p className="text-xs text-destructive">{itemError}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Hostel */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Hostel Capacity</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-error-field="infrastructure.hostelBoys">
                  <Label>Boys</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.infrastructure.hostelBoys || ""}
                    onChange={(e) => updateField("infrastructure", "hostelBoys", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 500"
                    className={formErrors["infrastructure.hostelBoys"] ? "border-destructive" : ""}
                  />
                  {formErrors["infrastructure.hostelBoys"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["infrastructure.hostelBoys"]}</p>
                  )}
                </div>
                <div data-error-field="infrastructure.hostelGirls">
                  <Label>Girls</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.infrastructure.hostelGirls || ""}
                    onChange={(e) => updateField("infrastructure", "hostelGirls", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 500"
                    className={formErrors["infrastructure.hostelGirls"] ? "border-destructive" : ""}
                  />
                  {formErrors["infrastructure.hostelGirls"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["infrastructure.hostelGirls"]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Facilities</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateField("infrastructure", "facilities", [...(formData.infrastructure.facilities || []), ""])
                  }
                >
                  + Add Extra
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: "cafeteria", label: "Cafeteria" },
                  { key: "wifiCampus", label: "WiFi Campus" },
                  { key: "transportation", label: "Transportation" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 rounded-md border border-border/60 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={formData.infrastructure[item.key]}
                      onCheckedChange={(checked) => updateField("infrastructure", item.key, checked)}
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
                {formData.infrastructure.facilities?.map((name: string, i: number) => {
                  const itemError = formErrors[`infrastructure.facilities.${i}`];
                  return (
                    <div key={i} data-error-field={`infrastructure.facilities.${i}`} className={`flex flex-col gap-1 rounded-md border p-3 ${itemError ? "border-destructive" : "border-border/60"}`}>
                      <div className="flex items-center gap-2">
                        <Input
                          value={name}
                          onChange={(e) => {
                            const updated = [...(formData.infrastructure.facilities || [])];
                            updated[i] = e.target.value;
                            updateField("infrastructure", "facilities", updated);
                            // Clear error when typing
                            if (e.target.value && formErrors[`infrastructure.facilities.${i}`]) {
                              setFormErrors((prev: any) => ({ ...prev, [`infrastructure.facilities.${i}`]: undefined }));
                            }
                          }}
                          placeholder="Facility name"
                          className={`h-7 text-sm flex-1 min-w-0 ${itemError ? "border-destructive" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.infrastructure.facilities || []).filter((_: string, j: number) => j !== i);
                            updateField("infrastructure", "facilities", updated);
                          }}
                          className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                        >
                          ×
                        </button>
                      </div>
                      {itemError && (
                        <p className="text-xs text-destructive">{itemError}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Global Eligibility */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Global Eligibility</h4>
              <div data-error-field="admission.ageCriteria">
                <Label>Age Criteria *</Label>
                <Input
                  data-error-field="admission.ageCriteria"
                  value={formData.admission.ageCriteria}
                  onChange={(e) => updateField("admission", "ageCriteria", e.target.value)}
                  placeholder="e.g. 17-25 years"
                  className={formErrors["admission.ageCriteria"] ? "border-destructive" : ""}
                />
                {formErrors["admission.ageCriteria"] && (
                  <p className="text-xs text-destructive mt-1">{formErrors["admission.ageCriteria"]}</p>
                )}
              </div>
            </div>

            {/* Per-Program Eligibility */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                Eligibility by Program
              </h4>
              {formData.academic?.programs?.length > 0 ? (
                <div className="space-y-6">
                  {formData.academic.programs.map((prog: any, i: number) => {
                    if (!prog.name?.trim()) return null;
                    const progEligibility = formData.admission?.programEligibility?.[i] || { minimumMarks: "", eligibility: "" };
                    const minMarksError = formErrors[`admission.programEligibility.${i}.minimumMarks`];
                    const eligibilityError = formErrors[`admission.programEligibility.${i}.eligibility`];
                    
                    return (
                      <div key={i} className="border border-border/50 rounded-md p-4 bg-muted/20">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                            {i + 1}
                          </span>
                          <span className="font-medium">{prog.name}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div data-error-field={`admission.programEligibility.${i}.minimumMarks`}>
                            <Label>Minimum Marks *</Label>
                            <Input
                              data-error-field={`admission.programEligibility.${i}.minimumMarks`}
                              value={progEligibility.minimumMarks}
                              onChange={(e) => {
                                const newEligibility = [...(formData.admission?.programEligibility || [])];
                                newEligibility[i] = { 
                                  ...newEligibility[i], 
                                  minimumMarks: e.target.value,
                                  eligibility: newEligibility[i]?.eligibility || ""
                                };
                                updateField("admission", "programEligibility", newEligibility);
                              }}
                              placeholder="e.g. 50th percentile or 720 marks"
                              className={minMarksError ? "border-destructive" : ""}
                            />
                            {minMarksError && (
                              <p className="text-xs text-destructive mt-1">{minMarksError}</p>
                            )}
                          </div>
                          <div data-error-field={`admission.programEligibility.${i}.eligibility`}>
                            <Label>Eligibility Criteria *</Label>
                            <Input
                              data-error-field={`admission.programEligibility.${i}.eligibility`}
                              value={progEligibility.eligibility}
                              onChange={(e) => {
                                const newEligibility = [...(formData.admission?.programEligibility || [])];
                                newEligibility[i] = { 
                                  ...newEligibility[i], 
                                  eligibility: e.target.value,
                                  minimumMarks: newEligibility[i]?.minimumMarks || ""
                                };
                                updateField("admission", "programEligibility", newEligibility);
                              }}
                              placeholder="e.g. 10+2 with PCB, 50% aggregate"
                              className={eligibilityError ? "border-destructive" : ""}
                            />
                            {eligibilityError && (
                              <p className="text-xs text-destructive mt-1">{eligibilityError}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-4 text-center">
                  No programs added in Step 3. Please add programs first.
                </div>
              )}
            </div>

            {/* Application */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Application Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-error-field="admission.applicationDeadline">
                  <Label>Application Deadline *</Label>
                  <Input
                    data-error-field="admission.applicationDeadline"
                    type="date"
                    value={formData.admission.applicationDeadline}
                    onChange={(e) => updateField("admission", "applicationDeadline", e.target.value)}
                    className={formErrors["admission.applicationDeadline"] ? "border-destructive" : ""}
                  />
                  {formErrors["admission.applicationDeadline"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["admission.applicationDeadline"]}</p>
                  )}
                </div>
                <div data-error-field="admission.applicationFee">
                  <Label>Application Fee *</Label>
                  <Input
                    data-error-field="admission.applicationFee"
                    type="text"
                    inputMode="numeric"
                    value={formData.admission.applicationFee || ""}
                    onChange={(e) => updateField("admission", "applicationFee", parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 1500"
                    className={formErrors["admission.applicationFee"] ? "border-destructive" : ""}
                  />
                  {formErrors["admission.applicationFee"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["admission.applicationFee"]}</p>
                  )}
                </div>
              </div>
              <div data-error-field="admission.selectionProcess">
                <Label>Selection Process *</Label>
                <Textarea
                  data-error-field="admission.selectionProcess"
                  value={formData.admission.selectionProcess}
                  onChange={(e) => updateField("admission", "selectionProcess", e.target.value)}
                  placeholder="e.g. NEET score → Counseling → Document verification → Admission confirmation"
                  rows={2}
                  className={formErrors["admission.selectionProcess"] ? "border-destructive" : ""}
                />
                {formErrors["admission.selectionProcess"] && (
                  <p className="text-xs text-destructive mt-1">{formErrors["admission.selectionProcess"]}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Point of Contact */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Point of Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div data-error-field="admin.pocName">
                  <Label>Name *</Label>
                  <Input
                    data-error-field="admin.pocName"
                    value={formData.admin.pocName}
                    onChange={(e) => updateField("admin", "pocName", e.target.value)}
                    placeholder="Contact person name"
                    className={formErrors["admin.pocName"] ? "border-destructive" : ""}
                  />
                  {formErrors["admin.pocName"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["admin.pocName"]}</p>
                  )}
                </div>
                <div data-error-field="admin.pocDesignation">
                  <Label>Designation *</Label>
                  <Input
                    data-error-field="admin.pocDesignation"
                    value={formData.admin.pocDesignation}
                    onChange={(e) => updateField("admin", "pocDesignation", e.target.value)}
                    placeholder="e.g. Admissions Officer"
                    className={formErrors["admin.pocDesignation"] ? "border-destructive" : ""}
                  />
                  {formErrors["admin.pocDesignation"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["admin.pocDesignation"]}</p>
                  )}
                </div>
                <div data-error-field="admin.pocEmail">
                  <Label>Email *</Label>
                  <Input
                    data-error-field="admin.pocEmail"
                    type="email"
                    value={formData.admin.pocEmail}
                    onChange={(e) => updateField("admin", "pocEmail", e.target.value)}
                    placeholder="admin@university.edu"
                    className={formErrors["admin.pocEmail"] ? "border-destructive" : ""}
                  />
                  {formErrors["admin.pocEmail"] && (
                    <p className="text-xs text-destructive mt-1">{formErrors["admin.pocEmail"]}</p>
                  )}
                </div>
                <div data-error-field="admin.phoneNumber">
                  <Label>Phone *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.admin.phoneCountryCode || "+91"}
                      onValueChange={(value) => updateField("admin", "phoneCountryCode", value)}
                    >
                      <SelectTrigger className="w-[100px] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {/* Asia */}
                        <SelectItem value="+91">🇮🇳 +91 India</SelectItem>
                        <SelectItem value="+86">🇨🇳 +86 China</SelectItem>
                        <SelectItem value="+81">🇯🇵 +81 Japan</SelectItem>
                        <SelectItem value="+82">🇰🇷 +82 South Korea</SelectItem>
                        <SelectItem value="+65">🇸🇬 +65 Singapore</SelectItem>
                        <SelectItem value="+66">🇹🇭 +66 Thailand</SelectItem>
                        <SelectItem value="+62">🇮🇩 +62 Indonesia</SelectItem>
                        <SelectItem value="+60">🇲🇾 +60 Malaysia</SelectItem>
                        <SelectItem value="+63">🇵🇭 +63 Philippines</SelectItem>
                        <SelectItem value="+84">🇻🇳 +84 Vietnam</SelectItem>
                        <SelectItem value="+880">🇧🇩 +880 Bangladesh</SelectItem>
                        <SelectItem value="+92">🇵🇰 +92 Pakistan</SelectItem>
                        <SelectItem value="+94">🇱🇰 +94 Sri Lanka</SelectItem>
                        <SelectItem value="+95">🇲🇲 +95 Myanmar</SelectItem>
                        <SelectItem value="+977">🇳🇵 +977 Nepal</SelectItem>
                        <SelectItem value="+968">🇴🇲 +968 Oman</SelectItem>
                        <SelectItem value="+971">🇦🇪 +971 UAE</SelectItem>
                        <SelectItem value="+966">🇸🇦 +966 Saudi Arabia</SelectItem>
                        <SelectItem value="+974">🇶🇦 +974 Qatar</SelectItem>
                        <SelectItem value="+973">🇧🇭 +973 Bahrain</SelectItem>
                        <SelectItem value="+965">🇰🇼 +965 Kuwait</SelectItem>
                        <SelectItem value="+962">🇯🇴 +962 Jordan</SelectItem>
                        <SelectItem value="+961">🇱🇧 +961 Lebanon</SelectItem>
                        <SelectItem value="+90">🇹🇷 +90 Turkey</SelectItem>
                        <SelectItem value="+98">🇮🇷 +98 Iran</SelectItem>
                        <SelectItem value="+964">🇮🇶 +964 Iraq</SelectItem>
                        <SelectItem value="+967">🇾🇪 +967 Yemen</SelectItem>
                        <SelectItem value="+93">🇦🇫 +93 Afghanistan</SelectItem>
                        <SelectItem value="+976">🇲🇳 +976 Mongolia</SelectItem>
                        <SelectItem value="+850">🇰🇵 +850 North Korea</SelectItem>
                        <SelectItem value="+95">🇲🇲 +95 Myanmar</SelectItem>
                        <SelectItem value="+855">🇰🇭 +855 Cambodia</SelectItem>
                        <SelectItem value="+856">🇱🇦 +856 Laos</SelectItem>
                        <SelectItem value="+673">🇧🇳 +673 Brunei</SelectItem>
                        <SelectItem value="+670">🇹🇱 +670 Timor-Leste</SelectItem>
                        <SelectItem value="+960">🇲🇻 +960 Maldives</SelectItem>
                        <SelectItem value="+975">🇧🇹 +975 Bhutan</SelectItem>
                        {/* Europe */}
                        <SelectItem value="+44">🇬🇧 +44 UK</SelectItem>
                        <SelectItem value="+49">🇩🇪 +49 Germany</SelectItem>
                        <SelectItem value="+33">🇫🇷 +33 France</SelectItem>
                        <SelectItem value="+39">🇮🇹 +39 Italy</SelectItem>
                        <SelectItem value="+34">🇪🇸 +34 Spain</SelectItem>
                        <SelectItem value="+31">🇳🇱 +31 Netherlands</SelectItem>
                        <SelectItem value="+32">🇧🇪 +32 Belgium</SelectItem>
                        <SelectItem value="+41">🇨🇭 +41 Switzerland</SelectItem>
                        <SelectItem value="+43">🇦🇹 +43 Austria</SelectItem>
                        <SelectItem value="+45">🇩🇰 +45 Denmark</SelectItem>
                        <SelectItem value="+46">🇸🇪 +46 Sweden</SelectItem>
                        <SelectItem value="+47">🇳🇴 +47 Norway</SelectItem>
                        <SelectItem value="+358">🇫🇮 +358 Finland</SelectItem>
                        <SelectItem value="+48">🇵🇱 +48 Poland</SelectItem>
                        <SelectItem value="+420">🇨🇿 +420 Czech Republic</SelectItem>
                        <SelectItem value="+421">🇸🇰 +421 Slovakia</SelectItem>
                        <SelectItem value="+36">🇭🇺 +36 Hungary</SelectItem>
                        <SelectItem value="+40">🇷🇴 +40 Romania</SelectItem>
                        <SelectItem value="+359">🇧🇬 +359 Bulgaria</SelectItem>
                        <SelectItem value="+386">🇸🇮 +386 Slovenia</SelectItem>
                        <SelectItem value="+385">🇭🇷 +385 Croatia</SelectItem>
                        <SelectItem value="+381">🇷🇸 +381 Serbia</SelectItem>
                        <SelectItem value="+382">🇲🇪 +382 Montenegro</SelectItem>
                        <SelectItem value="+383">🇽🇰 +383 Kosovo</SelectItem>
                        <SelectItem value="+389">🇲🇰 +389 North Macedonia</SelectItem>
                        <SelectItem value="+387">🇧🇦 +387 Bosnia</SelectItem>
                        <SelectItem value="+355">🇦🇱 +355 Albania</SelectItem>
                        <SelectItem value="+30">🇬🇷 +30 Greece</SelectItem>
                        <SelectItem value="+357">🇨🇾 +357 Cyprus</SelectItem>
                        <SelectItem value="+356">🇲🇹 +356 Malta</SelectItem>
                        <SelectItem value="+372">🇪🇪 +372 Estonia</SelectItem>
                        <SelectItem value="+371">🇱🇻 +371 Latvia</SelectItem>
                        <SelectItem value="+370">🇱🇹 +370 Lithuania</SelectItem>
                        <SelectItem value="+375">🇧🇾 +375 Belarus</SelectItem>
                        <SelectItem value="+380">🇺🇦 +380 Ukraine</SelectItem>
                        <SelectItem value="+7">🇷🇺 +7 Russia</SelectItem>
                        <SelectItem value="+374">🇦🇲 +374 Armenia</SelectItem>
                        <SelectItem value="+995">🇬🇪 +995 Georgia</SelectItem>
                        <SelectItem value="+994">🇦🇿 +994 Azerbaijan</SelectItem>
                        <SelectItem value="+373">🇲🇩 +373 Moldova</SelectItem>
                        {/* Americas */}
                        <SelectItem value="+1">🇺🇸 +1 USA</SelectItem>
                        <SelectItem value="+1">🇨🇦 +1 Canada</SelectItem>
                        <SelectItem value="+52">🇲🇽 +52 Mexico</SelectItem>
                        <SelectItem value="+55">🇧🇷 +55 Brazil</SelectItem>
                        <SelectItem value="+54">🇦🇷 +54 Argentina</SelectItem>
                        <SelectItem value="+56">🇨🇱 +56 Chile</SelectItem>
                        <SelectItem value="+51">🇵🇪 +51 Peru</SelectItem>
                        <SelectItem value="+57">🇨🇴 +57 Colombia</SelectItem>
                        <SelectItem value="+58">🇻🇪 +58 Venezuela</SelectItem>
                        <SelectItem value="+593">🇪🇨 +593 Ecuador</SelectItem>
                        <SelectItem value="+591">🇧🇴 +591 Bolivia</SelectItem>
                        <SelectItem value="+595">🇵🇾 +595 Paraguay</SelectItem>
                        <SelectItem value="+598">🇺🇾 +598 Uruguay</SelectItem>
                        <SelectItem value="+502">🇬🇹 +502 Guatemala</SelectItem>
                        <SelectItem value="+503">🇸🇻 +503 El Salvador</SelectItem>
                        <SelectItem value="+504">🇭🇳 +504 Honduras</SelectItem>
                        <SelectItem value="+505">🇳🇮 +505 Nicaragua</SelectItem>
                        <SelectItem value="+506">🇨🇷 +506 Costa Rica</SelectItem>
                        <SelectItem value="+507">🇵🇦 +507 Panama</SelectItem>
                        <SelectItem value="+809">🇩🇴 +809 Dominican Republic</SelectItem>
                        <SelectItem value="+876">🇯🇲 +876 Jamaica</SelectItem>
                        <SelectItem value="+1">🇹🇹 +1 Trinidad</SelectItem>
                        <SelectItem value="+53">🇨🇺 +53 Cuba</SelectItem>
                        {/* Africa */}
                        <SelectItem value="+27">🇿🇦 +27 South Africa</SelectItem>
                        <SelectItem value="+234">🇳🇬 +234 Nigeria</SelectItem>
                        <SelectItem value="+254">🇰🇪 +254 Kenya</SelectItem>
                        <SelectItem value="+20">🇪🇬 +20 Egypt</SelectItem>
                        <SelectItem value="+212">🇲🇦 +212 Morocco</SelectItem>
                        <SelectItem value="+213">🇩🇿 +213 Algeria</SelectItem>
                        <SelectItem value="+216">🇹🇳 +216 Tunisia</SelectItem>
                        <SelectItem value="+218">🇱🇾 +218 Libya</SelectItem>
                        <SelectItem value="+249">🇸🇩 +249 Sudan</SelectItem>
                        <SelectItem value="+251">🇪🇹 +251 Ethiopia</SelectItem>
                        <SelectItem value="+255">🇹🇿 +255 Tanzania</SelectItem>
                        <SelectItem value="+256">🇺🇬 +256 Uganda</SelectItem>
                        <SelectItem value="+243">🇨🇩 +243 DR Congo</SelectItem>
                        <SelectItem value="+242">🇨🇬 +242 Congo</SelectItem>
                        <SelectItem value="+225">🇨🇮 +225 Ivory Coast</SelectItem>
                        <SelectItem value="+233">🇬🇭 +233 Ghana</SelectItem>
                        <SelectItem value="+228">🇹🇬 +228 Togo</SelectItem>
                        <SelectItem value="+229">🇧🇯 +229 Benin</SelectItem>
                        <SelectItem value="+227">🇳🇪 +227 Niger</SelectItem>
                        <SelectItem value="+235">🇹🇩 +235 Chad</SelectItem>
                        <SelectItem value="+237">🇨🇲 +237 Cameroon</SelectItem>
                        <SelectItem value="+241">🇬🇦 +241 Gabon</SelectItem>
                        <SelectItem value="+240">🇬🇶 +240 Equatorial Guinea</SelectItem>
                        <SelectItem value="+244">🇦🇴 +244 Angola</SelectItem>
                        <SelectItem value="+260">🇿🇲 +260 Zambia</SelectItem>
                        <SelectItem value="+263">🇿🇼 +263 Zimbabwe</SelectItem>
                        <SelectItem value="+264">🇳🇦 +264 Namibia</SelectItem>
                        <SelectItem value="+267">🇧🇼 +267 Botswana</SelectItem>
                        <SelectItem value="+265">🇲🇼 +265 Malawi</SelectItem>
                        <SelectItem value="+265">🇲🇿 +258 Mozambique</SelectItem>
                        <SelectItem value="+261">🇲🇬 +261 Madagascar</SelectItem>
                        <SelectItem value="+230">🇲🇺 +230 Mauritius</SelectItem>
                        {/* Oceania */}
                        <SelectItem value="+61">🇦🇺 +61 Australia</SelectItem>
                        <SelectItem value="+64">🇳🇿 +64 New Zealand</SelectItem>
                        <SelectItem value="+675">🇵🇬 +675 Papua New Guinea</SelectItem>
                        <SelectItem value="+679">🇫🇯 +679 Fiji</SelectItem>
                        <SelectItem value="+682">🇨🇰 +682 Cook Islands</SelectItem>
                        <SelectItem value="+683">🇳🇺 +683 Niue</SelectItem>
                        <SelectItem value="+685">🇼🇸 +685 Samoa</SelectItem>
                        <SelectItem value="+676">🇹🇴 +676 Tonga</SelectItem>
                        <SelectItem value="+678">🇻🇺 +678 Vanuatu</SelectItem>
                        <SelectItem value="+680">🇵🇼 +680 Palau</SelectItem>
                        <SelectItem value="+674">🇳🇷 +674 Nauru</SelectItem>
                        <SelectItem value="+672">🇰🇮 +672 Kiribati</SelectItem>
                        <SelectItem value="+691">🇫🇲 +691 Micronesia</SelectItem>
                        <SelectItem value="+692">🇲🇭 +692 Marshall Islands</SelectItem>
                        <SelectItem value="+688">🇹🇻 +688 Tuvalu</SelectItem>
                        <SelectItem value="+677">🇸🇧 +677 Solomon Islands</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      data-error-field="admin.phoneNumber"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={formData.admin.phoneNumber}
                      onChange={(e) => {
                        // Only allow digits, max 10
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        updateField("admin", "phoneNumber", digits);
                      }}
                      placeholder="10-digit number"
                      className={formErrors["admin.phoneNumber"] || formErrors["admin.phoneCountryCode"] ? "border-destructive" : ""}
                    />
                  </div>
                  {(formErrors["admin.phoneNumber"] || formErrors["admin.phoneCountryCode"]) && (
                    <p className="text-xs text-destructive mt-1">
                      {formErrors["admin.phoneNumber"] || formErrors["admin.phoneCountryCode"]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Bank Details</h4>
              <div>
                <Label>Bank Country *</Label>
                <Select
                  value={selectedBankCountry}
                  onValueChange={(code: string | null) => {
                    const countryCode = code ?? "";
                    setSelectedBankCountry(countryCode);
                    setExtraBankFields([]);
                    updateField("admin", "bankCountry", countryCode);
                    if (countryCode && countryCode !== "IN") {
                      updateField("admin", "bankDetails", {});
                    }
                  }}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                    {SUPPORTED_FOREIGN_BANK_COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBankCountry === "IN" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div data-error-field="admin.accountName">
                    <Label>Account Name *</Label>
                    <Input
                      data-error-field="admin.accountName"
                      value={formData.admin.accountName}
                      onChange={(e) => updateField("admin", "accountName", e.target.value)}
                      placeholder="Name on bank account"
                      className={formErrors["admin.accountName"] ? "border-destructive" : ""}
                    />
                    {formErrors["admin.accountName"] && (
                      <p className="text-xs text-destructive mt-1">{formErrors["admin.accountName"]}</p>
                    )}
                  </div>
                  <div data-error-field="admin.accountNumber">
                    <Label>Account Number *</Label>
                    <Input
                      data-error-field="admin.accountNumber"
                      value={formData.admin.accountNumber}
                      onChange={(e) => updateField("admin", "accountNumber", e.target.value)}
                      placeholder="Bank account number"
                      className={formErrors["admin.accountNumber"] ? "border-destructive" : ""}
                    />
                    {formErrors["admin.accountNumber"] && (
                      <p className="text-xs text-destructive mt-1">{formErrors["admin.accountNumber"]}</p>
                    )}
                  </div>
                  <div data-error-field="admin.bankName">
                    <Label>Bank Name *</Label>
                    <Input
                      data-error-field="admin.bankName"
                      value={formData.admin.bankName}
                      onChange={(e) => updateField("admin", "bankName", e.target.value)}
                      placeholder="e.g. State Bank of India"
                      className={formErrors["admin.bankName"] ? "border-destructive" : ""}
                    />
                    {formErrors["admin.bankName"] && (
                      <p className="text-xs text-destructive mt-1">{formErrors["admin.bankName"]}</p>
                    )}
                  </div>
                  <div data-error-field="admin.bankBranch">
                    <Label>Bank Branch *</Label>
                    <Input
                      data-error-field="admin.bankBranch"
                      value={formData.admin.bankBranch}
                      onChange={(e) => updateField("admin", "bankBranch", e.target.value)}
                      placeholder="Branch name"
                      className={formErrors["admin.bankBranch"] ? "border-destructive" : ""}
                    />
                    {formErrors["admin.bankBranch"] && (
                      <p className="text-xs text-destructive mt-1">{formErrors["admin.bankBranch"]}</p>
                    )}
                  </div>
                  <div data-error-field="admin.ifscCode">
                    <Label>IFSC / SWIFT Code *</Label>
                    <Input
                      data-error-field="admin.ifscCode"
                      value={formData.admin.ifscCode}
                      onChange={(e) => updateField("admin", "ifscCode", e.target.value)}
                      placeholder="e.g. SBIN0001234"
                      className={formErrors["admin.ifscCode"] ? "border-destructive" : ""}
                    />
                    {formErrors["admin.ifscCode"] && (
                      <p className="text-xs text-destructive mt-1">{formErrors["admin.ifscCode"]}</p>
                    )}
                  </div>
                  <div data-error-field="admin.commission">
                    <Label>Commission (%) *</Label>
                    <Input
                      data-error-field="admin.commission"
                      type="text"
                      inputMode="numeric"
                      value={formData.admin.commission || ""}
                      onChange={(e) => updateField("admin", "commission", parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 10"
                      className={formErrors["admin.commission"] ? "border-destructive" : ""}
                    />
                    {formErrors["admin.commission"] && (
                      <p className="text-xs text-destructive mt-1">{formErrors["admin.commission"]}</p>
                    )}
                  </div>
                  <div>
                    <Label>GST Number</Label>
                    <Input
                      value={formData.admin.gstNumber}
                      onChange={(e) => updateField("admin", "gstNumber", e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label>PAN Number</Label>
                    <Input
                      value={formData.admin.panNumber}
                      onChange={(e) => updateField("admin", "panNumber", e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              )}

              {selectedBankCountry && selectedBankCountry !== "IN" && (
                <div>
                  <h5 className="text-sm font-medium text-foreground/80 mb-3">
                    {getBankConfig(selectedBankCountry)?.countryName || selectedBankCountry} Bank Details
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderBankFields(selectedBankCountry)}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Support Services */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Support Services</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateField("support", "extraServices", [...(formData.support.extraServices || []), ""])
                  }
                >
                  + Add Extra
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: "alumniNetwork", label: "Alumni Network" },
                  { key: "internationalStudentSupport", label: "International Student Support" },
                  { key: "visaAssistance", label: "Visa Assistance" },
                  { key: "counselingServices", label: "Counseling Services" },
                  { key: "careerGuidance", label: "Career Guidance" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 rounded-md border border-border/60 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={formData.support[item.key]}
                      onCheckedChange={(checked) => updateField("support", item.key, checked)}
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
                {formData.support.extraServices?.map((name: string, i: number) => {
                  const error = formErrors[`support.extraServices.${i}`];
                  return (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 rounded-md border border-border/60 p-3">
                        <Input
                          data-error-field={`support.extraServices.${i}`}
                          value={name}
                          onChange={(e) => {
                            const updated = [...(formData.support.extraServices || [])];
                            updated[i] = e.target.value;
                            updateField("support", "extraServices", updated);
                          }}
                          placeholder="Service name"
                          className={`h-7 text-sm flex-1 min-w-0 ${error ? "border-destructive" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.support.extraServices || []).filter((_: string, j: number) => j !== i);
                            updateField("support", "extraServices", updated);
                          }}
                          className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                        >
                          ×
                        </button>
                      </div>
                      {error && <p className="text-xs text-destructive px-1">{error}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Content</h4>
              <div data-error-field="content.shortDescription">
                <Label>Short Description *</Label>
                <Textarea
                  data-error-field="content.shortDescription"
                  value={formData.content.shortDescription}
                  onChange={(e) => updateField("content", "shortDescription", e.target.value)}
                  placeholder="Brief overview of the university (150-200 characters)"
                  rows={2}
                  className={formErrors["content.shortDescription"] ? "border-destructive" : ""}
                />
                <div className="flex items-center justify-between mt-1">
                  {formErrors["content.shortDescription"] ? (
                    <p className="text-xs text-destructive">{formErrors["content.shortDescription"]}</p>
                  ) : (
                    <span />
                  )}
                  {formData.content.shortDescription && (
                    <p className="text-xs text-muted-foreground">{formData.content.shortDescription.length} characters</p>
                  )}
                </div>
              </div>
              <div data-error-field="content.longDescription">
                <Label>Long Description *</Label>
                <Textarea
                  data-error-field="content.longDescription"
                  rows={5}
                  value={formData.content.longDescription}
                  onChange={(e) => updateField("content", "longDescription", e.target.value)}
                  placeholder="Detailed description covering history, achievements, campus life, and unique offerings"
                  className={formErrors["content.longDescription"] ? "border-destructive" : ""}
                />
                {formErrors["content.longDescription"] && (
                  <p className="text-xs text-destructive mt-1">{formErrors["content.longDescription"]}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-3 max-w-4xl mx-auto w-full sm:gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-[#2D2154] sm:text-2xl">
            Add New University
          </h1>
          <p className="text-xs text-[#6B6B6B] sm:text-sm">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>
      </div>

      <div className="flex gap-1">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full sm:h-2 ${
              index <= currentStep ? "bg-[#4B2D8E]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-3 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">{steps[currentStep]}</h2>
        {renderStep()}
      </div>

      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
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

