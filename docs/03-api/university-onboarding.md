# University Onboarding — Data Fields

## 1. Basic Identity

| Field | Type | Description |
|---|---|---|
| Official Name | `string` | Legal institution name |
| Short Name / Abbreviation | `string` | e.g. JAIU, OSMU |
| slug | `string` | URL-safe identifier |
| Logo | `file` | SVG + PNG variants |
| Cover / Banner Image | `file` | Hero section background |
| Tagline / Short Description | `text` | One-liner for preview cards |
| Website URL | `url` | Official site |
| Year Established | `string` | Trust signal |
| Type | `enum` | Public / Private / Deemed / Trust |

## 2. Location & Campus

| Field | Type | Description |
|---|---|---|
| Country | `string` | Primary filter for students |
| City | `string` | Student decision factor |
| Full Address | `text` | Official correspondence |
| Campus Images | `file[]` | 3-5 images for gallery |
| Campus Video URL | `url` | YouTube / Vimeo promo |

## 3. Accreditation & Recognition

| Field | Type | Description |
|---|---|---|
| National Accreditation Body | `string` | e.g. Ministry of Education |
| Accreditation Status | `enum` | Approved / Pending / Conditional |
| International Accreditations | `string[]` | ECFMG, WHO, NMC, GMC, etc. |
| Medical Council Recognitions | `text` | Country-wise licensure eligibility |
| Accreditation Certificate | `file` | PDF upload |
| Accreditation Expiry Date | `date` | Validity tracking |
| Ministry Approval | `boolean` | Legal compliance flag |

## 4. Academic Programs

| Field | Type | Description |
|---|---|---|
| Degree Offered | `string` | MBBS / MD / Bachelor / etc. |
| Course Name | `string` | Full program title |
| Duration | `string` | e.g. "5.8 Years" or "6 Years" |
| Language of Instruction | `string` | English / Russian / Turkish |
| Medium | `string` | English-medium, bilingual |
| Specialization | `string` | e.g. General Medicine, Dentistry |
| Curriculum Overview | `file` | PDF syllabus |
| Clinical Rotation Partners | `text` | Hospital names + MOUs |
| Foundation Course Available | `boolean` | Pre-medical pathway |

## 5. Admission Details

| Field | Type | Description |
|---|---|---|
| Intake Periods | `string[]` | Sep, Jan, Mar |
| Application Deadline | `date` | Urgency driver |
| Minimum GPA / Grade % | `string` | Eligibility filter |
| Required Subjects (10+2) | `string[]` | Physics, Chemistry, Biology |
| Minimum Age | `number` | Legal requirement |
| Entrance Exam Required | `string` | NEET, SAT, YÖS, etc. |
| English Proficiency Required | `boolean` | IELTS / TOEFL |
| English Proficiency Score | `string` | Minimum band / score |
| Application Fee | `number` | One-time fee |
| Selection Process | `enum` | Interview / Merit / First-come |

## 6. Fee Structure

| Field | Type | Description |
|---|---|---|
| Tuition Fee Per Year | `number` | Annual cost |
| Tuition Fee Total | `number` | Full program cost |
| Hostel Fee | `number` | Per year / total |
| Other Fees | `text` | Library, lab, insurance |
| Payment Schedule | `text` | Installment options |
| Refund Policy | `text` | Terms and conditions |
| Scholarship Available | `boolean` | Marketing lever |
| Scholarship Criteria | `text` | Eligibility requirements |
| Bank Details for Remittance | `text` | Payment collection info |

## 7. Infrastructure

| Field | Type | Description |
|---|---|---|
| Campus Size | `string` | Acres / sq ft |
| Hostel Capacity | `number` | Total seats |
| Hostel Type | `enum` | Single / Shared / Both |
| Teaching Hospital Name | `string` | Clinical training site |
| Hospital Bed Count | `number` | Training depth indicator |
| Laboratory Facilities | `text` | Available labs |
| Library Details | `text` | Collection size, digital access |
| Sports / Recreation | `text` | Available facilities |

## 8. Faculty

| Field | Type | Description |
|---|---|---|
| Total Faculty Count | `number` | Scale indicator |
| Professors / Doctors Count | `number` | Quality metric |
| Student-to-Faculty Ratio | `string` | Ratio string |
| International Faculty | `boolean` | Appeal factor |

## 9. Student Support

| Field | Type | Description |
|---|---|---|
| International Student Office | `boolean` | Dedicated support |
| Orientation Program | `boolean` | Onboarding quality |
| Airport Pickup | `boolean` | Student prep |
| Indian / Mess Food Available | `boolean` | Key for Indian students |
| Health Insurance Provided | `boolean` | Requirement |
| Visa Support Provided | `boolean` | Critical for admission |

## 10. Contact & Signatory

| Field | Type | Description |
|---|---|---|
| Admissions Email | `email` | Primary communication |
| Admissions Phone / WhatsApp | `string` | Direct contact |
| International Office Email | `email` | International queries |
| Authorized Signatory Name | `string` | Contract signing |
| Authorized Signatory Title | `string` | Role / designation |
| Partner Support Email | `email` | Operational contact |

## 11. Partnership Documents (File Uploads)

| Document | Required |
|---|---|
| University Registration / Incorporation Certificate | Yes |
| Accreditation Certificates (bundle) | Yes |
| Fee Structure (signed & sealed) | Yes |
| MOU / Partnership Agreement | Yes |
| Authorization Letter for Representation | Yes |
| Sample Degree Certificate | Recommended |
| University Brochure / Prospectus | Recommended |

---

## Current `University` Interface

```typescript
interface University {
  name: string;
  slug: string;
  shortName: string;
  image: string;
  country: string;
  degree: string;
  course: string;
  type: string;
  intake: string;
  grade: string;
  duration: string;
  established: string;
  fee: string;
  worldRank: string;
  medium: string;
  ecfmg: string;
  specialization: string;
  brochureUrl: string;
  detailUrl: string;
}
```

## Recommended V1 Priority Additions

1. Accreditation certificates (ECFMG/WHO/MCI status + document uploads)
2. Contact details (email, phone for admissions queries)
3. Fee breakdown (tuition vs hostel vs other, separate fields)
4. Admission requirements (min GPA, age, entrance exam requirements)
5. Legal documents (MOU, authorization letter, registration certificate)
