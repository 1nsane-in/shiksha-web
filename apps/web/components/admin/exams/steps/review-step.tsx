"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Calendar, 
  Clock, 
  Shield,
  Video,
  Mic,
  Monitor,
  Eye,
  MousePointer,
  AlertTriangle,
  FileText,
  Users,
  Check
} from "lucide-react";
import { useExam, usePublishExam } from "@/domains/exams/exams.queries";
import { ExamStatus, QuestionType } from "@/domains/exams/exams.types";

interface Props {
  examId: string;
  formData: {
    basicInfo?: Record<string, unknown>;
    proctoring?: Record<string, unknown>;
    questions?: unknown[];
  };
  onPublished: () => void;
}

const QUESTION_TYPE_LABELS: Record<string, string> = {
  [QuestionType.SINGLE_CHOICE]: "Single Choice",
  [QuestionType.MULTI_CHOICE]: "Multiple Choice",
  [QuestionType.TRUE_FALSE]: "True / False",
  [QuestionType.SUBJECTIVE]: "Subjective",
};

export function ReviewStep({ examId, formData, onPublished }: Props) {
  const router = useRouter();
  const { data: exam, isLoading } = useExam(examId);
  const publishExam = usePublishExam(examId);
  const [isConfirming, setIsConfirming] = useState(false);

  if (isLoading || !exam) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#ebe7e1] rounded w-48" />
          <div className="h-32 bg-[#ebe7e1] rounded w-full" />
        </div>
      </div>
    );
  }

  const questions = exam.questions || [];
  const proctoring = exam.proctoringConfig;
  const totalMarks = questions.reduce((sum, q) => sum + Number(q.marks), 0);

  const questionTypeCounts = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handlePublish = async () => {
    try {
      await publishExam.mutateAsync();
      onPublished();
    } catch {
      // Error handled by mutation
    }
  };

  const isReadyToPublish = questions.length > 0 && exam.status === ExamStatus.DRAFT;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-medium text-[#111111]">Review & Publish</h2>
        <p className="text-sm text-[#626260]">
          Review your exam configuration before publishing
        </p>
      </div>

      {/* Status Banner */}
      <div className={`rounded-lg p-4 border ${
        isReadyToPublish 
          ? "bg-emerald-50 border-emerald-200" 
          : "bg-amber-50 border-amber-200"
      }`}>
        <div className="flex items-start gap-3">
          {isReadyToPublish ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          )}
          <div>
            <h3 className={`font-medium ${
              isReadyToPublish ? "text-emerald-900" : "text-amber-900"
            }`}>
              {isReadyToPublish ? "Ready to Publish" : "Not Ready to Publish"}
            </h3>
            <p className={`text-sm ${
              isReadyToPublish ? "text-emerald-700" : "text-amber-700"
            }`}>
              {isReadyToPublish 
                ? "Your exam is configured and ready to be published. Students will be able to register once published."
                : "Please add at least one question before publishing."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Exam Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#f5f1ec] rounded-lg p-4 border border-[#d3cec6]">
          <p className="text-2xl font-medium text-[#111111]">{questions.length}</p>
          <p className="text-sm text-[#626260]">Questions</p>
        </div>
        <div className="bg-[#f5f1ec] rounded-lg p-4 border border-[#d3cec6]">
          <p className="text-2xl font-medium text-[#111111]">{totalMarks}</p>
          <p className="text-sm text-[#626260]">Total Marks</p>
        </div>
        <div className="bg-[#f5f1ec] rounded-lg p-4 border border-[#d3cec6]">
          <p className="text-2xl font-medium text-[#111111]">{exam.durationMinutes}</p>
          <p className="text-sm text-[#626260]">Minutes</p>
        </div>
        <div className="bg-[#f5f1ec] rounded-lg p-4 border border-[#d3cec6]">
          <p className="text-2xl font-medium text-[#111111]">{exam.passingPercentage}%</p>
          <p className="text-sm text-[#626260]">Passing</p>
        </div>
      </div>

      {/* Basic Info Summary */}
      <div className="bg-white rounded-lg border border-[#d3cec6] p-6">
        <h3 className="text-sm font-medium text-[#111111] uppercase tracking-wide mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-[#9c9fa5] mt-0.5" />
            <div>
              <p className="text-sm text-[#626260]">Exam Name</p>
              <p className="font-medium text-[#111111]">{exam.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-[#9c9fa5] mt-0.5" />
            <div>
              <p className="text-sm text-[#626260]">University</p>
              <p className="font-medium text-[#111111]">{exam.university?.name || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#9c9fa5] mt-0.5" />
            <div>
              <p className="text-sm text-[#626260]">Date Window</p>
              <p className="font-medium text-[#111111]">
                {new Date(exam.dateWindowStart).toLocaleDateString("en-IN")} - {new Date(exam.dateWindowEnd).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-[#9c9fa5] mt-0.5" />
            <div>
              <p className="text-sm text-[#626260]">Duration</p>
              <p className="font-medium text-[#111111]">{exam.durationMinutes} minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Question Types Summary */}
      <div className="bg-white rounded-lg border border-[#d3cec6] p-6">
        <h3 className="text-sm font-medium text-[#111111] uppercase tracking-wide mb-4">
          Question Breakdown
        </h3>
        {Object.keys(questionTypeCounts).length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {Object.entries(questionTypeCounts).map(([type, count]) => (
              <Badge 
                key={type} 
                variant="outline"
                className="bg-[#f5f1ec] border-[#d3cec6] text-[#111111] px-3 py-1"
              >
                {QUESTION_TYPE_LABELS[type] || type}: {count}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#626260]">No questions added yet</p>
        )}
      </div>

      {/* Proctoring Summary */}
      {proctoring && (
        <div className="bg-white rounded-lg border border-[#d3cec6] p-6">
          <h3 className="text-sm font-medium text-[#111111] uppercase tracking-wide mb-4">
            Security Settings
          </h3>
          <div className="flex flex-wrap gap-3">
            <FeatureBadge 
              enabled={proctoring.aiProctoringEnabled} 
              icon={Shield}
              label="AI Proctoring"
            />
            <FeatureBadge 
              enabled={proctoring.webcamRequired} 
              icon={Video}
              label="Webcam"
            />
            <FeatureBadge 
              enabled={proctoring.microphoneRequired} 
              icon={Mic}
              label="Microphone"
            />
            <FeatureBadge 
              enabled={proctoring.screenRecordingEnabled} 
              icon={Monitor}
              label="Screen Recording"
            />
            <FeatureBadge 
              enabled={proctoring.faceDetectionEnabled} 
              icon={Eye}
              label="Face Detection"
            />
            <FeatureBadge 
              enabled={proctoring.gazeTrackingEnabled} 
              icon={MousePointer}
              label="Gaze Tracking"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-[#ebe7e1] text-sm text-[#626260]">
            <p>Tab Switch Warnings: <span className="font-medium text-[#111111]">{proctoring.tabSwitchWarnings}</span></p>
            <p>Connectivity Grace: <span className="font-medium text-[#111111]">{proctoring.connectivityGraceMinutes} minutes</span></p>
          </div>
        </div>
      )}

      {/* Questions Preview */}
      {questions.length > 0 && (
        <div className="bg-white rounded-lg border border-[#d3cec6] p-6">
          <h3 className="text-sm font-medium text-[#111111] uppercase tracking-wide mb-4">
            Questions Preview
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {questions.slice(0, 5).map((question, index) => (
              <div key={question.id} className="flex items-start gap-3 p-3 bg-[#f5f1ec] rounded-lg">
                <span className="text-sm font-medium text-[#626260] w-6">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#111111] line-clamp-2">{question.questionText}</p>
                  <p className="text-xs text-[#626260] mt-1">
                    {QUESTION_TYPE_LABELS[question.type]} • {question.marks} marks
                  </p>
                </div>
              </div>
            ))}
            {questions.length > 5 && (
              <p className="text-sm text-[#626260] text-center">
                + {questions.length - 5} more questions
              </p>
            )}
          </div>
        </div>
      )}

      {/* Publish Confirmation */}
      <div className="border-t border-[#d3cec6] pt-6">
        {!isConfirming ? (
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#626260]">
              <p>Once published, students will be able to register for this exam.</p>
              <p>You can still edit questions and settings after publishing.</p>
            </div>
            <Button
              onClick={() => setIsConfirming(true)}
              disabled={!isReadyToPublish}
              className="bg-[#111111] hover:bg-[#313130] text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Publish Exam
            </Button>
          </div>
        ) : (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Confirm Publishing</h4>
                <p className="text-sm text-amber-700">
                  Are you sure you want to publish this exam? Students will be notified and can register.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsConfirming(false)}
                className="border-[#d3cec6]"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                disabled={publishExam.isPending}
                className="bg-[#111111] hover:bg-[#313130] text-white"
              >
                {publishExam.isPending ? "Publishing..." : "Yes, Publish Exam"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Feature Badge Component
function FeatureBadge({ 
  enabled, 
  icon: Icon, 
  label 
}: { 
  enabled: boolean; 
  icon: React.ElementType; 
  label: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
      enabled 
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
        : "bg-gray-50 text-gray-500 border border-gray-200"
    }`}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {enabled && <Check className="h-3 w-3" />}
    </div>
  );
}
