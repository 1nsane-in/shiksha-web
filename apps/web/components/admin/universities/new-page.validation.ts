import type {
  UniversityFormData,
  Program,
  FeeBreakdownItem,
  SubjectRanking,
  CountryBreakdown,
} from "./new-page.types";
import { isValidUrl } from "./new-page.utils";

function v(
  errors: Record<string, string>,
  field: string,
  condition: boolean,
  msg: string,
): void {
  if (!condition) errors[field] = msg;
}

function validateSeatDistribution(
  e: Record<string, string>,
  p: Program,
  i: number,
): void {
  const govt = p.governmentSeats || 0;
  const mgmt = p.managementSeats || 0;
  const nri = p.nriSeats || 0;
  const total = p.totalSeats || 0;
  if (total > 0 && govt + mgmt + nri !== total) {
    e[`academic.programs.${i}.seats`] =
      `Program ${i + 1}: Govt (${govt}) + Management (${mgmt}) + NRI (${nri}) must equal Total (${total})`;
  }
}

function validateFeeBreakdown(
  e: Record<string, string>,
  p: Program,
  i: number,
): void {
  if (p.annualTuition <= 0) return;
  if (!p.feeBreakdown?.length) {
    e[`academic.programs.${i}.feeBreakdown`] =
      `Program ${i + 1}: Fee breakdown is required when annual fees is set`;
    return;
  }
  let hasInvalid = false;
  p.feeBreakdown.forEach((item: FeeBreakdownItem, fi: number) => {
    if (!item.name?.trim() || !item.amount || item.amount <= 0) {
      e[`academic.programs.${i}.feeBreakdown.${fi}`] =
        `Program ${i + 1}, Fee item ${fi + 1}: Name and amount are required`;
      hasInvalid = true;
    }
  });
  if (hasInvalid) return;
  const sum = p.feeBreakdown.reduce(
    (s: number, item: FeeBreakdownItem) => s + (item.amount || 0),
    0,
  );
  if (sum !== p.annualTuition) {
    e[`academic.programs.${i}.feeBreakdown`] =
      `Program ${i + 1}: Fee breakdown total (${sum}) must equal annual fees (${p.annualTuition})`;
  }
}

function validateDemographics(
  e: Record<string, string>,
  formData: UniversityFormData,
): void {
  const demo = formData.studentDemographics;
  if (!demo) return;
  const total = demo.totalStudents || 0;
  const local = demo.localStudents || 0;
  const foreign = demo.foreignStudents || 0;
  if (total > 0 && local + foreign !== total) {
    e["studentDemographics.total"] =
      `Local (${local}) + Foreign (${foreign}) must equal Total (${total})`;
  }
  if (!demo.foreignByCountry?.length) return;
  let hasInvalid = false;
  demo.foreignByCountry.forEach((c: CountryBreakdown, ci: number) => {
    if (!c.country?.trim() || !c.count || c.count <= 0) {
      e[`studentDemographics.foreignByCountry.${ci}`] =
        `Country breakdown item ${ci + 1}: Country name and student count are required`;
      hasInvalid = true;
    }
  });
  if (hasInvalid) return;
  const sum = demo.foreignByCountry.reduce(
    (s: number, c: CountryBreakdown) => s + (c.count || 0),
    0,
  );
  if (sum !== foreign) {
    e["studentDemographics.breakdown"] =
      `Foreign breakdown total (${sum}) must equal foreign students (${foreign})`;
  }
}

export function validateStep0(
  formData: UniversityFormData,
): Record<string, string> {
  const e: Record<string, string> = {};
  v(e, "name", !!formData.name?.trim(), "University name is required");
  v(e, "shortName", !!formData.shortName?.trim(), "Short name is required");
  if (!formData.establishedYear)
    e.establishedYear = "Established year is required";
  else if (
    formData.establishedYear < 1800 ||
    formData.establishedYear > new Date().getFullYear()
  )
    e.establishedYear = `Year must be between 1800 and ${new Date().getFullYear()}`;
  v(e, "type", !!formData.type, "Type is required");
  if (!formData.website?.trim()) e.website = "Website is required";
  else if (!isValidUrl(formData.website))
    e.website = "Please enter a valid URL (e.g., https://university.edu)";
  const socialKeys = [
    "facebook", "instagram", "youtube", "linkedin", "twitter", "tiktok",
  ] as const;
  for (const f of socialKeys) {
    const val = formData.socialLinks?.[f];
    if (val && !isValidUrl(val)) e[`socialLinks.${f}`] = `Invalid ${f} URL`;
  }
  return e;
}

export function validateStep1(
  formData: UniversityFormData,
): Record<string, string> {
  const e: Record<string, string> = {};
  v(
    e,
    "location.country",
    !!formData.location?.country?.trim(),
    "Country is required",
  );
  v(
    e,
    "location.state",
    !!formData.location?.state?.trim(),
    "State is required",
  );
  v(
    e,
    "location.city",
    !!formData.location?.city?.trim(),
    "City is required",
  );
  v(
    e,
    "location.address",
    !!formData.location?.address?.trim(),
    "Address is required",
  );
  if (!formData.contact?.email?.trim()) e["contact.email"] = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email))
    e["contact.email"] = "Please enter a valid email address";
  if (!formData.contact?.phone?.trim()) e["contact.phone"] = "Phone is required";
  else if (formData.contact.phone.length < 8)
    e["contact.phone"] = "Phone number must be at least 8 digits";
  v(
    e,
    "contact.admissionOfficeHours",
    !!formData.contact?.admissionOfficeHours?.trim(),
    "Office hours are required",
  );
  return e;
}

export function validateStep2(
  formData: UniversityFormData,
): Record<string, string> {
  const e: Record<string, string> = {};
  v(
    e,
    "academic.medium",
    !!formData.academic?.medium,
    "Medium of instruction is required",
  );
  v(
    e,
    "academic.intakeMonths",
    !!formData.academic?.intakeMonths?.length,
    "At least one intake month is required",
  );
  if (!formData.academic?.programs?.length) {
    e["academic.programs"] = "At least one program is required";
  } else {
    formData.academic.programs.forEach((p: Program, i: number) => {
      v(
        e,
        `academic.programs.${i}.name`,
        !!p.name?.trim(),
        `Program ${i + 1}: Name is required`,
      );
      v(
        e,
        `academic.programs.${i}.duration`,
        !!p.duration?.trim(),
        `Program ${i + 1}: Duration is required`,
      );
      v(
        e,
        `academic.programs.${i}.annualTuition`,
        p.annualTuition || p.annualTuition === 0,
        `Program ${i + 1}: Annual fees is required`,
      );
      v(
        e,
        `academic.programs.${i}.totalSeats`,
        p.totalSeats || p.totalSeats === 0,
        `Program ${i + 1}: Total seats is required`,
      );
      validateSeatDistribution(e, p, i);
      validateFeeBreakdown(e, p, i);
    });
  }
  validateDemographics(e, formData);
  return e;
}

export function validateStep3(
  formData: UniversityFormData,
): Record<string, string> {
  const e: Record<string, string> = {};
  v(
    e,
    "recognition.ecfmgStatus",
    !!formData.recognition?.ecfmgStatus,
    "ECFMG status is required",
  );
  if (formData.recognition?.subjectRankings?.length) {
    formData.recognition.subjectRankings.forEach(
      (item: SubjectRanking, i: number) => {
        if (!item.subject?.trim() || !item.ranking?.trim())
          e[`recognition.subjectRankings.${i}`] =
            `Subject ranking ${i + 1}: Subject and ranking are required`;
      },
    );
  }
  return e;
}

export function validateStep4(
  formData: UniversityFormData,
): Record<string, string> {
  const e: Record<string, string> = {};
  v(e, "fees.currency", !!formData.fees?.currency, "Currency is required");
  v(
    e,
    "fees.paymentSchedule",
    !!formData.fees?.paymentSchedule?.trim(),
    "Payment schedule is required",
  );
  v(
    e,
    "fees.refundPolicy",
    !!formData.fees?.refundPolicy?.trim(),
    "Refund policy is required",
  );
  if (formData.fees?.scholarshipAvailable && formData.fees?.scholarships?.length) {
    formData.fees.scholarships.forEach((name: string, i: number) => {
      if (!name?.trim())
        e[`fees.scholarships.${i}`] = `Scholarship ${i + 1}: Name is required`;
    });
  }
  return e;
}

export function validateStep5(
  formData: UniversityFormData,
): Record<string, string> {
  const e: Record<string, string> = {};
  const listKeys = ["departments", "laboratories", "facilities"] as const;
  for (const key of listKeys) {
    const items = (formData.infrastructure?.[key] ?? []) as string[];
    items.forEach((item: string, i: number) => {
      if (!item?.trim())
        e[`infrastructure.${key}.${i}`] = `${key.charAt(0).toUpperCase() + key.slice(1)} ${i + 1}: Name is required`;
    });
  }
  if ((formData.infrastructure?.hostelBoys ?? 0) < 0)
    e["infrastructure.hostelBoys"] = "Hostel capacity cannot be negative";
  if ((formData.infrastructure?.hostelGirls ?? 0) < 0)
    e["infrastructure.hostelGirls"] = "Hostel capacity cannot be negative";
  return e;
}

export function validateStep6(
  formData: UniversityFormData,
): Record<string, string> {
  const e: Record<string, string> = {};
  if (!formData.admission?.ageCriteria?.trim()) {
    e["admission.ageCriteria"] = "Age criteria is required";
  } else {
    const m = formData.admission.ageCriteria.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (!m) e["admission.ageCriteria"] = "Please use format: 17-25 years";
    else if (
      parseInt(m[1]) < 0 ||
      parseInt(m[2]) > 100 ||
      parseInt(m[1]) >= parseInt(m[2])
    )
      e["admission.ageCriteria"] = "Please enter a valid age range (e.g., 17-25)";
  }
  v(
    e,
    "admission.applicationDeadline",
    !!formData.admission?.applicationDeadline,
    "Application deadline is required",
  );
  const fee = formData.admission?.applicationFee;
  if (fee === undefined || fee === null || fee === "" || (typeof fee === "number" && isNaN(fee))) {
    e["admission.applicationFee"] = "Application fee is required";
  } else if (typeof fee === "number" && fee < 0) {
    e["admission.applicationFee"] = "Application fee cannot be negative";
  }
  v(
    e,
    "admission.selectionProcess",
    !!formData.admission?.selectionProcess?.trim(),
    "Selection process is required",
  );
  if (formData.academic?.programs?.length) {
    formData.academic.programs.forEach((prog: Program, i: number) => {
      if (prog.name?.trim()) {
        const pe = formData.admission?.programEligibility?.[i];
        v(
          e,
          `admission.programEligibility.${i}.minimumMarks`,
          !!pe?.minimumMarks?.trim(),
          `${prog.name}: Minimum marks required`,
        );
        v(
          e,
          `admission.programEligibility.${i}.eligibility`,
          !!pe?.eligibility?.trim(),
          `${prog.name}: Eligibility criteria required`,
        );
      }
    });
  }
  (formData.admission?.requiredDocuments ?? []).forEach(
    (doc: string, i: number) => {
      if (!doc?.trim())
        e[`admission.requiredDocuments.${i}`] = `Document ${i + 1}: Name is required`;
    },
  );
  (formData.admission?.entranceExams ?? []).forEach(
    (exam: string, i: number) => {
      if (!exam?.trim())
        e[`admission.entranceExams.${i}`] = `Exam ${i + 1}: Name is required`;
    },
  );
  return e;
}

export function validateStep7(
  formData: UniversityFormData,
): Record<string, string> {
  const e: Record<string, string> = {};
  v(
    e,
    "content.shortDescription",
    !!formData.content?.shortDescription?.trim(),
    "Short description is required",
  );
  v(
    e,
    "content.longDescription",
    !!formData.content?.longDescription?.trim(),
    "Long description is required",
  );
  (formData.support?.extraServices ?? []).forEach(
    (s: string, i: number) => {
      if (!s?.trim())
        e[`support.extraServices.${i}`] = `Extra service ${i + 1}: Name is required`;
    },
  );
  return e;
}

export function validateStep8(
  formData: UniversityFormData,
): Record<string, string> {
  const e: Record<string, string> = {};
  v(e, "admin.pocName", !!formData.admin?.pocName?.trim(), "Name is required");
  v(
    e,
    "admin.pocDesignation",
    !!formData.admin?.pocDesignation?.trim(),
    "Designation is required",
  );
  if (!formData.admin?.pocEmail?.trim()) e["admin.pocEmail"] = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin.pocEmail))
    e["admin.pocEmail"] = "Please enter a valid email address";
  v(
    e,
    "admin.phoneCountryCode",
    !!formData.admin?.phoneCountryCode?.trim(),
    "Country code is required",
  );
  if (!formData.admin?.phoneNumber?.trim())
    e["admin.phoneNumber"] = "Phone number is required";
  else if (!/^\d{10}$/.test(formData.admin.phoneNumber))
    e["admin.phoneNumber"] = "Phone number must be exactly 10 digits";
  v(
    e,
    "admin.accountName",
    !!formData.admin?.accountName?.trim(),
    "Account name is required",
  );
  v(
    e,
    "admin.accountNumber",
    !!formData.admin?.accountNumber?.trim(),
    "Account number is required",
  );
  v(
    e,
    "admin.bankName",
    !!formData.admin?.bankName?.trim(),
    "Bank name is required",
  );
  v(
    e,
    "admin.bankBranch",
    !!formData.admin?.bankBranch?.trim(),
    "Bank branch is required",
  );
  v(
    e,
    "admin.ifscCode",
    !!formData.admin?.ifscCode?.trim(),
    "IFSC code is required",
  );
  v(
    e,
    "admin.commission",
    formData.admin?.commission !== undefined &&
      formData.admin?.commission !== null,
    "Commission is required",
  );
  return e;
}

const validators: Record<
  number,
  (d: UniversityFormData) => Record<string, string>
> = {
  0: validateStep0,
  1: validateStep1,
  2: validateStep2,
  3: validateStep3,
  4: validateStep4,
  5: validateStep5,
  6: validateStep6,
  7: validateStep7,
  8: validateStep8,
};

export function validateStep(
  step: number,
  formData: UniversityFormData,
): { isValid: boolean; errors: Record<string, string> } {
  const fn = validators[step];
  if (!fn) return { isValid: true, errors: {} };
  const errors = fn(formData);
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function focusFirstError(
  errors: Record<string, string>,
): void {
  const firstErrorField = Object.keys(errors)[0];
  if (!firstErrorField) return;
  setTimeout(() => {
    let element: HTMLElement | null = null;
    const dynamicPatterns = [
      { prefix: "academic.programs.", base: "academic.programs" },
      { prefix: "fees.scholarships.", base: "fees.scholarships" },
      { prefix: "recognition.subjectRankings.", base: "recognition.subjectRankings" },
      { prefix: "infrastructure.departments.", base: "infrastructure.departments" },
      { prefix: "infrastructure.laboratories.", base: "infrastructure.laboratories" },
      { prefix: "infrastructure.facilities.", base: "infrastructure.facilities" },
    ];
    for (const dp of dynamicPatterns) {
      if (firstErrorField.startsWith(dp.prefix)) {
        const parts = firstErrorField.split(".");
        if (parts.length >= 3) {
          for (const sel of [
            `[data-error-field="${firstErrorField}"]`,
            `[data-error-field="${dp.base}.${parts[2]}"]`,
            `[data-error-field="${dp.base}"]`,
          ]) {
            element = document.querySelector(sel) as HTMLElement;
            if (element) break;
          }
        }
        break;
      }
    }
    if (
      !element &&
      firstErrorField.startsWith("studentDemographics.foreignByCountry.")
    ) {
      const parts = firstErrorField.split(".");
      if (parts.length >= 3) {
        for (const sel of [
          `[data-error-field="${firstErrorField}"]`,
          `[data-error-field="studentDemographics.foreignByCountry.${parts[2]}"]`,
          `[data-error-field="studentDemographics"]`,
        ]) {
          element = document.querySelector(sel) as HTMLElement;
          if (element) break;
        }
      }
    }
    const fbMatch = firstErrorField.match(
      /academic\.programs\.(\d+)\.feeBreakdown\.(\d+)/,
    );
    if (!element && fbMatch) {
      for (const sel of [
        `[data-error-field="${firstErrorField}"]`,
        `[data-error-field="academic.programs.${fbMatch[1]}.feeBreakdown.${fbMatch[2]}"]`,
        `[data-error-field="academic.programs.${fbMatch[1]}.feeBreakdown"]`,
        `[data-error-field="academic.programs.${fbMatch[1]}"]`,
        `[data-error-field="academic.programs"]`,
      ]) {
        element = document.querySelector(sel) as HTMLElement;
        if (element) break;
      }
    }
    const esMatch = firstErrorField.match(/support\.extraServices\.(\d+)/);
    if (!element && esMatch) {
      for (const sel of [
        `[data-error-field="${firstErrorField}"]`,
        `[data-error-field="support.extraServices.${esMatch[1]}"]`,
        `[data-error-field="support.extraServices"]`,
        `[data-error-field="support"]`,
      ]) {
        element = document.querySelector(sel) as HTMLElement;
        if (element) break;
      }
    }
    const peMatch = firstErrorField.match(
      /admission\.programEligibility\.(\d+)/,
    );
    if (!element && peMatch) {
      for (const sel of [
        `[data-error-field="${firstErrorField}"]`,
        `[data-error-field="admission.programEligibility.${peMatch[1]}"]`,
        `[data-error-field="admission.programEligibility"]`,
        `[data-error-field="admission"]`,
      ]) {
        element = document.querySelector(sel) as HTMLElement;
        if (element) break;
      }
    }
    if (!element) {
      element = document.querySelector(
        `[data-error-field="${firstErrorField}"]`,
      ) as HTMLElement;
    }
    if (element) {
      const rect = element.getBoundingClientRect();
      window.scrollTo({
        top: window.pageYOffset + rect.top - 150,
        behavior: "smooth",
      });
      element.focus();
    }
  }, 150);
}
