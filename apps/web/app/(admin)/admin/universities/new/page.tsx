"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Checkbox } from "@repo/ui";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

const steps = [
  "Basic Info",
  "Location & Contact",
  "Academic Details",
  "Recognition",
  "Fees",
  "Infrastructure",
  "Admission",
  "Support & Content",
  "Admin Details",
];

export default function NewUniversityPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const createUniversity = useCreateUniversity();
  const [formData, setFormData] = useState<any>({
    name: "",
    shortName: "",
    establishedYear: new Date().getFullYear(),
    type: "PRIVATE",
    website: "",
    logo: "",
    bannerImage: "",
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
      programs: ["MBBS"],
      duration: "5.5 years",
      medium: "English",
      specializations: [],
      intakeMonths: ["August"],
      totalSeats: 0,
      governmentSeats: 0,
      managementSeats: 0,
      nriSeats: 0,
    },
    recognition: {
      bodies: [],
      ecfmgStatus: "PENDING",
      nbaAccredited: false,
      accreditations: [],
    },
    fees: {
      tuitionAnnual: 0,
      totalProgram: 0,
      registration: 0,
      currency: "INR",
      scholarshipAvailable: false,
      paymentSchedule: "",
      refundPolicy: "",
    },
    infrastructure: {
      hospitalBeds: 0,
      departments: 0,
      hostelBoys: 0,
      hostelGirls: 0,
      laboratories: 0,
      facilities: [],
      cafeteria: false,
      wifiCampus: false,
      transportation: false,
    },
    admission: {
      entranceExams: ["NEET"],
      minimumMarks: "",
      ageCriteria: "",
      eligibility: "",
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
      pocPhone: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
      bankBranch: "",
      ifscCode: "",
      commission: 10,
    },
  });

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createUniversity.mutateAsync(formData);
      router.push("/admin/universities");
    } catch (error) {
      console.error("Failed to create university:", error);
      alert("Failed to create university");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label>University Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateRootField("name", e.target.value)}
                placeholder="ABC Medical College"
              />
            </div>
            <div>
              <Label>Short Name *</Label>
              <Input
                value={formData.shortName}
                onChange={(e) => updateRootField("shortName", e.target.value)}
                placeholder="ABC MC"
              />
            </div>
            <div>
              <Label>Established Year *</Label>
              <Input
                type="number"
                value={formData.establishedYear}
                onChange={(e) =>
                  updateRootField("establishedYear", parseInt(e.target.value))
                }
              />
            </div>
            <div>
              <Label>Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => updateRootField("type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GOVERNMENT">Government</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="DEEMED">Deemed</SelectItem>
                  <SelectItem value="AUTONOMOUS">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Website *</Label>
              <Input
                value={formData.website}
                onChange={(e) => updateRootField("website", e.target.value)}
                placeholder="https://university.edu"
              />
            </div>
            <div>
              <Label>Logo URL *</Label>
              <Input
                value={formData.logo}
                onChange={(e) => updateRootField("logo", e.target.value)}
                placeholder="https://cdn.example.com/logo.png"
              />
            </div>
            <div>
              <Label>Banner Image URL *</Label>
              <Input
                value={formData.bannerImage}
                onChange={(e) => updateRootField("bannerImage", e.target.value)}
                placeholder="https://cdn.example.com/banner.jpg"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Location</h3>
            <div>
              <Label>Country *</Label>
              <Input
                value={formData.location.country}
                onChange={(e) =>
                  updateField("location", "country", e.target.value)
                }
              />
            </div>
            <div>
              <Label>State *</Label>
              <Input
                value={formData.location.state}
                onChange={(e) =>
                  updateField("location", "state", e.target.value)
                }
              />
            </div>
            <div>
              <Label>City *</Label>
              <Input
                value={formData.location.city}
                onChange={(e) => updateField("location", "city", e.target.value)}
              />
            </div>
            <div>
              <Label>Address *</Label>
              <Textarea
                value={formData.location.address}
                onChange={(e) =>
                  updateField("location", "address", e.target.value)
                }
              />
            </div>
            <h3 className="font-semibold mt-6">Contact</h3>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.contact.email}
                onChange={(e) =>
                  updateField("contact", "email", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input
                value={formData.contact.phone}
                onChange={(e) =>
                  updateField("contact", "phone", e.target.value)
                }
                placeholder="+91-9876543210"
              />
            </div>
            <div>
              <Label>Office Hours *</Label>
              <Input
                value={formData.contact.admissionOfficeHours}
                onChange={(e) =>
                  updateField("contact", "admissionOfficeHours", e.target.value)
                }
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Duration *</Label>
              <Input
                value={formData.academic.duration}
                onChange={(e) =>
                  updateField("academic", "duration", e.target.value)
                }
                placeholder="5.5 years"
              />
            </div>
            <div>
              <Label>Medium of Instruction *</Label>
              <Input
                value={formData.academic.medium}
                onChange={(e) =>
                  updateField("academic", "medium", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Total Seats *</Label>
              <Input
                type="number"
                value={formData.academic.totalSeats}
                onChange={(e) =>
                  updateField("academic", "totalSeats", parseInt(e.target.value))
                }
              />
            </div>
            <div>
              <Label>Government Seats *</Label>
              <Input
                type="number"
                value={formData.academic.governmentSeats}
                onChange={(e) =>
                  updateField(
                    "academic",
                    "governmentSeats",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <Label>Management Seats *</Label>
              <Input
                type="number"
                value={formData.academic.managementSeats}
                onChange={(e) =>
                  updateField(
                    "academic",
                    "managementSeats",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <Label>NRI Seats *</Label>
              <Input
                type="number"
                value={formData.academic.nriSeats}
                onChange={(e) =>
                  updateField("academic", "nriSeats", parseInt(e.target.value))
                }
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
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
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="NOT_APPROVED">Not Approved</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>NAAC Grade</Label>
              <Input
                value={formData.recognition.naacGrade || ""}
                onChange={(e) =>
                  updateField("recognition", "naacGrade", e.target.value)
                }
                placeholder="A+"
              />
            </div>
            <div>
              <Label>World Rank</Label>
              <Input
                type="number"
                value={formData.recognition.worldRank || ""}
                onChange={(e) =>
                  updateField(
                    "recognition",
                    "worldRank",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <Label>National Rank</Label>
              <Input
                type="number"
                value={formData.recognition.nationalRank || ""}
                onChange={(e) =>
                  updateField(
                    "recognition",
                    "nationalRank",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.recognition.nbaAccredited}
                onCheckedChange={(checked) =>
                  updateField("recognition", "nbaAccredited", checked)
                }
              />
              <Label>NBA Accredited</Label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Annual Tuition Fee *</Label>
              <Input
                type="number"
                value={formData.fees.tuitionAnnual}
                onChange={(e) =>
                  updateField("fees", "tuitionAnnual", parseFloat(e.target.value))
                }
              />
            </div>
            <div>
              <Label>Total Program Fee *</Label>
              <Input
                type="number"
                value={formData.fees.totalProgram}
                onChange={(e) =>
                  updateField("fees", "totalProgram", parseFloat(e.target.value))
                }
              />
            </div>
            <div>
              <Label>Registration Fee *</Label>
              <Input
                type="number"
                value={formData.fees.registration}
                onChange={(e) =>
                  updateField("fees", "registration", parseFloat(e.target.value))
                }
              />
            </div>
            <div>
              <Label>Currency *</Label>
              <Select
                value={formData.fees.currency}
                onValueChange={(v) => updateField("fees", "currency", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Schedule *</Label>
              <Textarea
                value={formData.fees.paymentSchedule}
                onChange={(e) =>
                  updateField("fees", "paymentSchedule", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Refund Policy *</Label>
              <Textarea
                value={formData.fees.refundPolicy}
                onChange={(e) =>
                  updateField("fees", "refundPolicy", e.target.value)
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.fees.scholarshipAvailable}
                onCheckedChange={(checked) =>
                  updateField("fees", "scholarshipAvailable", checked)
                }
              />
              <Label>Scholarship Available</Label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label>Hospital Beds *</Label>
              <Input
                type="number"
                value={formData.infrastructure.hospitalBeds}
                onChange={(e) =>
                  updateField(
                    "infrastructure",
                    "hospitalBeds",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <Label>Departments *</Label>
              <Input
                type="number"
                value={formData.infrastructure.departments}
                onChange={(e) =>
                  updateField(
                    "infrastructure",
                    "departments",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <Label>Hostel Capacity (Boys) *</Label>
              <Input
                type="number"
                value={formData.infrastructure.hostelBoys}
                onChange={(e) =>
                  updateField(
                    "infrastructure",
                    "hostelBoys",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <Label>Hostel Capacity (Girls) *</Label>
              <Input
                type="number"
                value={formData.infrastructure.hostelGirls}
                onChange={(e) =>
                  updateField(
                    "infrastructure",
                    "hostelGirls",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <Label>Laboratories *</Label>
              <Input
                type="number"
                value={formData.infrastructure.laboratories}
                onChange={(e) =>
                  updateField(
                    "infrastructure",
                    "laboratories",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.infrastructure.cafeteria}
                onCheckedChange={(checked) =>
                  updateField("infrastructure", "cafeteria", checked)
                }
              />
              <Label>Cafeteria</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.infrastructure.wifiCampus}
                onCheckedChange={(checked) =>
                  updateField("infrastructure", "wifiCampus", checked)
                }
              />
              <Label>WiFi Campus</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.infrastructure.transportation}
                onCheckedChange={(checked) =>
                  updateField("infrastructure", "transportation", checked)
                }
              />
              <Label>Transportation</Label>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <Label>Minimum Marks *</Label>
              <Input
                value={formData.admission.minimumMarks}
                onChange={(e) =>
                  updateField("admission", "minimumMarks", e.target.value)
                }
                placeholder="50th percentile"
              />
            </div>
            <div>
              <Label>Age Criteria *</Label>
              <Input
                value={formData.admission.ageCriteria}
                onChange={(e) =>
                  updateField("admission", "ageCriteria", e.target.value)
                }
                placeholder="17-25 years"
              />
            </div>
            <div>
              <Label>Eligibility *</Label>
              <Textarea
                value={formData.admission.eligibility}
                onChange={(e) =>
                  updateField("admission", "eligibility", e.target.value)
                }
                placeholder="10+2 with PCB"
              />
            </div>
            <div>
              <Label>Application Deadline *</Label>
              <Input
                type="date"
                value={formData.admission.applicationDeadline}
                onChange={(e) =>
                  updateField("admission", "applicationDeadline", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Application Fee *</Label>
              <Input
                type="number"
                value={formData.admission.applicationFee}
                onChange={(e) =>
                  updateField(
                    "admission",
                    "applicationFee",
                    parseFloat(e.target.value)
                  )
                }
              />
            </div>
            <div>
              <Label>Selection Process *</Label>
              <Textarea
                value={formData.admission.selectionProcess}
                onChange={(e) =>
                  updateField("admission", "selectionProcess", e.target.value)
                }
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Support Services</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.support.alumniNetwork}
                onCheckedChange={(checked) =>
                  updateField("support", "alumniNetwork", checked)
                }
              />
              <Label>Alumni Network</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.support.internationalStudentSupport}
                onCheckedChange={(checked) =>
                  updateField("support", "internationalStudentSupport", checked)
                }
              />
              <Label>International Student Support</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.support.visaAssistance}
                onCheckedChange={(checked) =>
                  updateField("support", "visaAssistance", checked)
                }
              />
              <Label>Visa Assistance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.support.counselingServices}
                onCheckedChange={(checked) =>
                  updateField("support", "counselingServices", checked)
                }
              />
              <Label>Counseling Services</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.support.careerGuidance}
                onCheckedChange={(checked) =>
                  updateField("support", "careerGuidance", checked)
                }
              />
              <Label>Career Guidance</Label>
            </div>
            <h3 className="font-semibold mt-6">Content</h3>
            <div>
              <Label>Short Description *</Label>
              <Textarea
                value={formData.content.shortDescription}
                onChange={(e) =>
                  updateField("content", "shortDescription", e.target.value)
                }
                placeholder="Brief description (150-200 chars)"
              />
            </div>
            <div>
              <Label>Long Description *</Label>
              <Textarea
                rows={6}
                value={formData.content.longDescription}
                onChange={(e) =>
                  updateField("content", "longDescription", e.target.value)
                }
                placeholder="Detailed description"
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Point of Contact</h3>
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.admin.pocName}
                onChange={(e) => updateField("admin", "pocName", e.target.value)}
              />
            </div>
            <div>
              <Label>Designation *</Label>
              <Input
                value={formData.admin.pocDesignation}
                onChange={(e) =>
                  updateField("admin", "pocDesignation", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.admin.pocEmail}
                onChange={(e) =>
                  updateField("admin", "pocEmail", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input
                value={formData.admin.pocPhone}
                onChange={(e) =>
                  updateField("admin", "pocPhone", e.target.value)
                }
              />
            </div>
            <h3 className="font-semibold mt-6">Bank Details</h3>
            <div>
              <Label>Account Name *</Label>
              <Input
                value={formData.admin.accountName}
                onChange={(e) =>
                  updateField("admin", "accountName", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Account Number *</Label>
              <Input
                value={formData.admin.accountNumber}
                onChange={(e) =>
                  updateField("admin", "accountNumber", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Bank Name *</Label>
              <Input
                value={formData.admin.bankName}
                onChange={(e) =>
                  updateField("admin", "bankName", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Branch *</Label>
              <Input
                value={formData.admin.bankBranch}
                onChange={(e) =>
                  updateField("admin", "bankBranch", e.target.value)
                }
              />
            </div>
            <div>
              <Label>IFSC Code *</Label>
              <Input
                value={formData.admin.ifscCode}
                onChange={(e) =>
                  updateField("admin", "ifscCode", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Commission (%) *</Label>
              <Input
                type="number"
                value={formData.admin.commission}
                onChange={(e) =>
                  updateField("admin", "commission", parseFloat(e.target.value))
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#2D2154]">
            Add New University
          </h1>
          <p className="text-sm text-[#6B6B6B]">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded ${
              index <= currentStep ? "bg-[#4B2D8E]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create University"}
          </Button>
        )}
      </div>
    </div>
  );
}

