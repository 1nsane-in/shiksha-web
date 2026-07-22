import type {
  UniversityFormData,
  ExtraBankField,
  FeeBreakdownItem,
  Program,
  SubjectRanking,
  CountryBreakdown,
  ProgramEligibility,
  SocialLinks,
} from "./new-page.types";

export function normalizeUrl(url: string): string {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return "https://" + trimmed;
  return trimmed;
}

export function isValidUrl(url: string): boolean {
  if (!url?.trim()) return true;
  try {
    const parsed = new URL(normalizeUrl(url));
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

export function validateUrls(
  formData: UniversityFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!formData.website) {
    errors.website = "Website is required";
  } else if (!isValidUrl(formData.website)) {
    errors.website =
      "Please enter a valid URL (e.g., https://university.edu or university.edu)";
  }
  const socialFields: (keyof SocialLinks)[] = [
    "facebook", "instagram", "youtube", "linkedin", "twitter", "tiktok",
  ];
  for (const field of socialFields) {
    const value = formData.socialLinks?.[field];
    if (value && !isValidUrl(value)) {
      errors[`socialLinks.${field}`] =
        `Invalid ${field} URL. Try: facebook.com/university or https://facebook.com/university`;
    }
  }
  return errors;
}

export function normalizeUrlField(
  section: string,
  field: string,
  value: string,
  updateRootField: (field: string, value: string) => void,
  updateField: (section: string, field: string, value: string) => void,
): void {
  const normalized = normalizeUrl(value);
  if (normalized !== value) {
    if (section === "root") updateRootField(field, normalized);
    else updateField(section, field, normalized);
  }
}

export function getDefaultFormData(): UniversityFormData {
  return {
    name: "",
    shortName: "",
    establishedYear: new Date().getFullYear(),
    type: "PRIVATE",
    website: "",
    logo: "",
    bannerImage: "",
    brochureUrl: "",
    location: { country: "", state: "", city: "", address: "" },
    contact: { email: "", phone: "", admissionOfficeHours: "Mon-Fri 9AM-5PM" },
    academic: {
      programs: [
        {
          name: "MBBS",
          duration: "5.5 years",
          annualTuition: 0,
          registration: 0,
          totalSeats: 0,
          governmentSeats: 0,
          managementSeats: 0,
          nriSeats: 0,
          feeBreakdown: [],
        },
      ],
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
      subjectRankings: [],
    },
    fees: {
      currency: "INR",
      scholarshipAvailable: false,
      scholarships: [],
      paymentSchedule: "",
      refundPolicy: "",
      feeBreakdown: [],
    },
    infrastructure: {
      departments: [],
      hostelBoys: 0,
      hostelGirls: 0,
      laboratories: [],
      facilities: [],
      cafeteria: false,
      wifiCampus: false,
      transportation: false,
    },
    admission: {
      entranceExams: ["NEET"],
      ageCriteria: "",
      programEligibility: [],
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
      extraServices: [],
      counselingServices: false,
      careerGuidance: false,
    },
    content: { shortDescription: "", longDescription: "", highlights: [], gallery: [] },
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
      foreignByCountry: [],
    },
    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: "",
      twitter: "",
      tiktok: "",
    },
  };
}

export function buildSubmitPayload(
  formData: UniversityFormData,
  phoneCode: string,
  extraBankFields: ExtraBankField[],
): Record<string, unknown> {
  const otherFees: Record<string, number> = {};
  for (const prog of formData.academic.programs) {
    if (prog.feeBreakdown?.length && prog.name?.trim()) {
      for (const item of prog.feeBreakdown) {
        if (item.name?.trim()) {
          otherFees[`${prog.name.trim()} - ${item.name.trim()}`] = item.amount;
        }
      }
    }
  }

  const scholarshipDetails = formData.fees.scholarships
    .filter((s: string) => s.trim())
    .join(", ");

  const payload: Record<string, unknown> = {
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
    ...(formData.brochureUrl
      ? { brochureUrl: formData.brochureUrl }
      : { brochureUrl: undefined }),
  };

  delete (payload.fees as Record<string, unknown>).feeBreakdown;
  delete (payload.fees as Record<string, unknown>).scholarships;

  const support = payload.support as Record<string, unknown>;
  const extras = (support.extraServices as string[])?.filter((s: string) => s.trim()) ?? [];
  support.languageSupport = [
    ...((support.languageSupport as string[]) ?? []),
    ...extras,
  ];
  delete support.extraServices;

  if (extraBankFields?.length) {
    const admin = payload.admin as Record<string, unknown>;
    const bankDetails = admin.bankDetails as Record<string, string>;
    for (const item of extraBankFields) {
      if (item.key?.trim()) {
        bankDetails[item.key.trim()] = item.value;
      }
    }
  }

  const rawRankings = (
    payload.recognition as Record<string, unknown>
  ).subjectRankings;
  const subjectRankingsRecord: Record<string, string> = {};
  if (Array.isArray(rawRankings)) {
    for (const item of rawRankings as SubjectRanking[]) {
      if (item.subject?.trim()) {
        subjectRankingsRecord[item.subject.trim()] = item.ranking ?? "";
      }
    }
  }
  (payload.recognition as Record<string, unknown>).subjectRankings =
    subjectRankingsRecord;

  const socialLinks = payload.socialLinks as Record<string, string> | undefined;
  if (socialLinks) {
    for (const key of Object.keys(socialLinks)) {
      if (!socialLinks[key]) delete socialLinks[key];
    }
    if (Object.keys(socialLinks).length === 0) delete payload.socialLinks;
  }

  if (typeof payload.bannerImage === "string")
    payload.bannerImage = payload.bannerImage.replace(/ /g, "%20");
  if (typeof payload.brochureUrl === "string")
    payload.brochureUrl = payload.brochureUrl.replace(/ /g, "%20");

  if (!payload.logo) delete payload.logo;
  if (!payload.bannerImage) delete payload.bannerImage;
  if (!payload.brochureUrl) delete payload.brochureUrl;

  return payload;
}
