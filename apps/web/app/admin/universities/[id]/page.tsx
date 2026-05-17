"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  DollarSign,
  Award,
  Users,
  FileText,
} from "lucide-react";

export default function UniversityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchUniversity();
  }, [params.id]);

  const fetchUniversity = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/universities/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUniversity(data);
      }
    } catch (error) {
      console.error("Failed to fetch university:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!university) {
    return (
      <div className="flex items-center justify-center h-screen">
        University not found
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#2D2154]">
              {university.name}
            </h1>
            <p className="text-sm text-[#6B6B6B]">{university.shortName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            className={`${
              university.status === "ACTIVE"
                ? "bg-green-500"
                : university.status === "DRAFT"
                ? "bg-gray-500"
                : "bg-yellow-500"
            } text-white`}
          >
            {university.status}
          </Badge>
          <Button onClick={() => router.push(`/admin/universities/${params.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="border-b mb-4">
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-[#4B2D8E] text-[#4B2D8E] font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "academic"
                  ? "border-[#4B2D8E] text-[#4B2D8E] font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setActiveTab("fees")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "fees"
                  ? "border-[#4B2D8E] text-[#4B2D8E] font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Fees
            </button>
            <button
              onClick={() => setActiveTab("infrastructure")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "infrastructure"
                  ? "border-[#4B2D8E] text-[#4B2D8E] font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Infrastructure
            </button>
            <button
              onClick={() => setActiveTab("admission")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "admission"
                  ? "border-[#4B2D8E] text-[#4B2D8E] font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Admission
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "admin"
                  ? "border-[#4B2D8E] text-[#4B2D8E] font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <div className={activeTab === "overview" ? "" : "hidden"}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Type</p>
                    <p className="font-medium">{university.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Established</p>
                    <p className="font-medium">{university.establishedYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Website</p>
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4B2D8E] hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {university.location && (
                    <>
                      <div>
                        <p className="text-sm text-[#6B6B6B]">Address</p>
                        <p className="font-medium">{university.location.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B6B6B]">City</p>
                        <p className="font-medium">{university.location.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B6B6B]">State</p>
                        <p className="font-medium">{university.location.state}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B6B6B]">Country</p>
                        <p className="font-medium">{university.location.country}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {university.contact && (
                    <>
                      <div>
                        <p className="text-sm text-[#6B6B6B]">Email</p>
                        <p className="font-medium">{university.contact.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B6B6B]">Phone</p>
                        <p className="font-medium">{university.contact.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B6B6B]">Office Hours</p>
                        <p className="font-medium">
                          {university.contact.admissionOfficeHours}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {university.recognition && (
                    <>
                      <div>
                        <p className="text-sm text-[#6B6B6B]">ECFMG Status</p>
                        <Badge>{university.recognition.ecfmgStatus}</Badge>
                      </div>
                      {university.recognition.naacGrade && (
                        <div>
                          <p className="text-sm text-[#6B6B6B]">NAAC Grade</p>
                          <p className="font-medium">
                            {university.recognition.naacGrade}
                          </p>
                        </div>
                      )}
                      {university.recognition.worldRank && (
                        <div>
                          <p className="text-sm text-[#6B6B6B]">World Rank</p>
                          <p className="font-medium">
                            #{university.recognition.worldRank}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {university.content && (
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#6B6B6B] mb-4">
                      {university.content.shortDescription}
                    </p>
                    <p className="text-sm">{university.content.longDescription}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className={activeTab === "academic" ? "" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {university.academic && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Programs</p>
                    <p className="font-medium">
                      {university.academic.programs?.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Duration</p>
                    <p className="font-medium">{university.academic.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Medium</p>
                    <p className="font-medium">{university.academic.medium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Total Seats</p>
                    <p className="font-medium">{university.academic.totalSeats}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Government Seats</p>
                    <p className="font-medium">
                      {university.academic.governmentSeats}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Management Seats</p>
                    <p className="font-medium">
                      {university.academic.managementSeats}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">NRI Seats</p>
                    <p className="font-medium">{university.academic.nriSeats}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Intake Months</p>
                    <p className="font-medium">
                      {university.academic.intakeMonths?.join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "fees" ? "" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Fee Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {university.fees && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Annual Tuition</p>
                    <p className="font-medium">
                      {university.fees.currency}{" "}
                      {university.fees.tuitionAnnual.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Total Program</p>
                    <p className="font-medium">
                      {university.fees.currency}{" "}
                      {university.fees.totalProgram.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Registration</p>
                    <p className="font-medium">
                      {university.fees.currency}{" "}
                      {university.fees.registration.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Scholarship</p>
                    <Badge>
                      {university.fees.scholarshipAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-[#6B6B6B]">Payment Schedule</p>
                    <p className="font-medium">
                      {university.fees.paymentSchedule}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-[#6B6B6B]">Refund Policy</p>
                    <p className="font-medium">{university.fees.refundPolicy}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "infrastructure" ? "" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {university.infrastructure && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Hospital Beds</p>
                    <p className="font-medium">
                      {university.infrastructure.hospitalBeds}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Departments</p>
                    <p className="font-medium">
                      {university.infrastructure.departments}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Laboratories</p>
                    <p className="font-medium">
                      {university.infrastructure.laboratories}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Hostel (Boys)</p>
                    <p className="font-medium">
                      {university.infrastructure.hostelBoys}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Hostel (Girls)</p>
                    <p className="font-medium">
                      {university.infrastructure.hostelGirls}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Facilities</p>
                    <div className="flex gap-2 flex-wrap">
                      {university.infrastructure.cafeteria && (
                        <Badge variant="outline">Cafeteria</Badge>
                      )}
                      {university.infrastructure.wifiCampus && (
                        <Badge variant="outline">WiFi</Badge>
                      )}
                      {university.infrastructure.transportation && (
                        <Badge variant="outline">Transport</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "admission" ? "" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Admission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {university.admission && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Entrance Exams</p>
                    <p className="font-medium">
                      {university.admission.entranceExams?.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Minimum Marks</p>
                    <p className="font-medium">
                      {university.admission.minimumMarks}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Age Criteria</p>
                    <p className="font-medium">
                      {university.admission.ageCriteria}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Eligibility</p>
                    <p className="font-medium">
                      {university.admission.eligibility}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Application Fee</p>
                    <p className="font-medium">
                      {university.fees?.currency}{" "}
                      {university.admission.applicationFee}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Selection Process</p>
                    <p className="font-medium">
                      {university.admission.selectionProcess}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className={activeTab === "admin" ? "" : "hidden"}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Administrative Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {university.admin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6B6B6B]">POC Name</p>
                    <p className="font-medium">{university.admin.pocName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Designation</p>
                    <p className="font-medium">
                      {university.admin.pocDesignation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Email</p>
                    <p className="font-medium">{university.admin.pocEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Phone</p>
                    <p className="font-medium">{university.admin.pocPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-[#6B6B6B] mb-2">Bank Details</p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="text-[#6B6B6B]">Account:</span>{" "}
                        {university.admin.accountNumber}
                      </p>
                      <p>
                        <span className="text-[#6B6B6B]">Bank:</span>{" "}
                        {university.admin.bankName}
                      </p>
                      <p>
                        <span className="text-[#6B6B6B]">Branch:</span>{" "}
                        {university.admin.bankBranch}
                      </p>
                      <p>
                        <span className="text-[#6B6B6B]">IFSC:</span>{" "}
                        {university.admin.ifscCode}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6B6B]">Commission</p>
                    <p className="font-medium">{university.admin.commission}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
