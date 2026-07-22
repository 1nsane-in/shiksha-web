"use client";

import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Calendar, 
  Clock, 
  FileText,
  Check
} from "lucide-react";
import { QuestionType, type CreateExamInput, type CreateQuestionInput } from "@/domains/exams/exams.types";

interface Props {
  formData: {
    basicInfo?: Partial<CreateExamInput>;
    questions?: CreateQuestionInput[];
  };
  onPublish: () => void;
  isPending: boolean;
  onBack: () => void;
  submitLabel?: string;
}

const QUESTION_TYPE_LABELS: Record<string, string> = {
  [QuestionType.SINGLE_CHOICE]: "Single Choice",
  [QuestionType.MULTI_CHOICE]: "Multiple Choice",
  [QuestionType.TRUE_FALSE]: "True / False",
  [QuestionType.SUBJECTIVE]: "Subjective",
};

export function ReviewStep({ formData, onPublish, isPending, onBack, submitLabel }: Props) {
  const basic = formData.basicInfo || {};
  const questions = formData.questions || [];
  const totalMarks = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0);

  const questionTypeCounts = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const isReadyToPublish = questions.length > 0;

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
                ? "Your exam is configured and ready to be published."
                : "Please add at least one question before publishing."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
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
          <p className="text-2xl font-medium text-[#111111]">{basic.durationMinutes || 0}</p>
          <p className="text-sm text-[#626260]">Minutes</p>
        </div>
        <div className="bg-[#f5f1ec] rounded-lg p-4 border border-[#d3cec6]">
          <p className="text-2xl font-medium text-[#111111]">{basic.passingPercentage || 0}%</p>
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
              <p className="font-medium text-[#111111]">{basic.name || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-[#9c9fa5] mt-0.5" />
            <div>
              <p className="text-sm text-[#626260]">University</p>
              <p className="font-medium text-[#111111]">{basic.universityId ? basic.universityId.slice(0, 8) + "…" : "N/A"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[#9c9fa5] mt-0.5" />
            <div>
              <p className="text-sm text-[#626260]">Date Window</p>
              <p className="font-medium text-[#111111]">
                {basic.dateWindowStart ? new Date(basic.dateWindowStart).toLocaleDateString("en-IN") : "N/A"} - {basic.dateWindowEnd ? new Date(basic.dateWindowEnd).toLocaleDateString("en-IN") : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-[#9c9fa5] mt-0.5" />
            <div>
              <p className="text-sm text-[#626260]">Duration</p>
              <p className="font-medium text-[#111111]">{basic.durationMinutes} minutes</p>
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

      {/* Questions Preview */}
      {questions.length > 0 && (
        <div className="bg-white rounded-lg border border-[#d3cec6] p-6">
          <h3 className="text-sm font-medium text-[#111111] uppercase tracking-wide mb-4">
            Questions Preview
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {questions.slice(0, 5).map((question, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-[#f5f1ec] rounded-lg">
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

      {/* Action Buttons */}
      <div className="border-t border-[#d3cec6] pt-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-[#ECEAE6] text-[#626260] hover:text-[#111111] font-medium"
          >
            Back to Questions
          </Button>
          <Button
            onClick={onPublish}
            disabled={!isReadyToPublish || isPending}
            className="bg-[#111111] hover:bg-[#313130] text-white"
          >
            {isPending ? "Saving..." : submitLabel || "Create & Publish Exam"}
            <Check className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

