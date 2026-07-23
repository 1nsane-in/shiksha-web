"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Check, 
  X,
  Image as ImageIcon,
  HelpCircle,
} from "lucide-react";
import type { CreateQuestionInput } from "@/domains/exams/exams.types";
import { toast } from "sonner";
import { uploadFile } from "@/domains/documents/documents.api";

interface Props {
  data?: CreateQuestionInput[];
  onChange: (data: CreateQuestionInput[]) => void;
}

export function QuestionsStep({ data = [], onChange }: Props) {
  const [questions, setQuestions] = useState<CreateQuestionInput[]>(data);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddQuestion = () => {
    const newQuestion: CreateQuestionInput = {
      questionText: "",
      options: [
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setEditingIndex(questions.length);
    onChange([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (index: number, updates: Partial<CreateQuestionInput>) => {
    const updated = questions.map((q, i) => i === index ? { ...q, ...updates } : q);
    setQuestions(updated);
    onChange(updated);
  };

  const handleDeleteQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    setEditingIndex(null);
    onChange(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, field: string, value: unknown) => {
    const question = questions[qIndex];
    const updatedOptions = question.options?.map((opt, i) => 
      i === optIndex ? { ...opt, [field]: value } : opt
    ) || [];
    handleUpdateQuestion(qIndex, { options: updatedOptions });
  };

  const handleAddOption = (qIndex: number) => {
    const question = questions[qIndex];
    handleUpdateQuestion(qIndex, { 
      options: [...(question.options || []), { optionText: "", isCorrect: false }]
    });
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const question = questions[qIndex];
    if (question.options && question.options.length <= 2) {
      toast.error("Minimum 2 options required");
      return;
    }
    handleUpdateQuestion(qIndex, { 
      options: question.options?.filter((_, i) => i !== optIndex)
    });
  };

  const handleSetCorrectOption = (qIndex: number, optIndex: number) => {
    const question = questions[qIndex];
    const updatedOptions = question.options?.map((opt, i) => ({
      ...opt,
      isCorrect: i === optIndex,
    }));
    handleUpdateQuestion(qIndex, { options: updatedOptions });
  };

  const totalMarks = questions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-[#111111]">Question Bank</h2>
          <p className="text-sm text-[#626260]">
            {questions.length} questions • {totalMarks} total marks (1 mark each)
          </p>
        </div>
        <Button
          onClick={handleAddQuestion}
          className="bg-[#111111] hover:bg-[#313130] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add MCQ
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            index={index}
            question={question}
            isEditing={editingIndex === index}
            onEdit={() => setEditingIndex(index)}
            onClose={() => setEditingIndex(null)}
            onUpdate={(updates) => handleUpdateQuestion(index, updates)}
            onDelete={() => handleDeleteQuestion(index)}
            onOptionChange={(optIndex, field, value) => handleOptionChange(index, optIndex, field, value)}
            onAddOption={() => handleAddOption(index)}
            onRemoveOption={(optIndex) => handleRemoveOption(index, optIndex)}
            onSetCorrect={(optIndex) => handleSetCorrectOption(index, optIndex)}
          />
        ))}

        {questions.length === 0 && (
          <div className="bg-[#f5f1ec] rounded-xl border border-dashed border-[#d3cec6] p-12 text-center">
            <HelpCircle className="h-12 w-12 text-[#9c9fa5] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#111111] mb-2">No questions yet</h3>
            <p className="text-sm text-[#626260] mb-4">
              Add MCQ questions to build your exam. Each question is worth 1 mark.
            </p>
            <Button
              onClick={handleAddQuestion}
              variant="outline"
              className="border-[#d3cec6]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Question Card Component
interface QuestionCardProps {
  index: number;
  question: CreateQuestionInput;
  isEditing: boolean;
  onEdit: () => void;
  onClose: () => void;
  onUpdate: (updates: Partial<CreateQuestionInput>) => void;
  onDelete: () => void;
  onOptionChange: (optIndex: number, field: string, value: unknown) => void;
  onAddOption: () => void;
  onRemoveOption: (optIndex: number) => void;
  onSetCorrect: (optIndex: number) => void;
}

function QuestionCard({
  index,
  question,
  isEditing,
  onEdit,
  onClose,
  onUpdate,
  onDelete,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onSetCorrect,
}: QuestionCardProps) {
  if (!isEditing) {
    return (
      <div
        className="bg-white rounded-xl border border-[#d3cec6] p-4 hover:border-[#111111] cursor-pointer transition-colors"
        onClick={onEdit}
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 text-[#9c9fa5]">
            <GripVertical className="h-5 w-5" />
            <span className="text-sm font-medium">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#f5f1ec] text-[#626260]">
                MCQ
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                1 mark
              </span>
            </div>
            <p className="text-sm text-[#111111] line-clamp-2">
              {question.questionText || "No question text"}
            </p>
            {question.options && question.options.length > 0 && (
              <p className="text-xs text-[#9c9fa5] mt-1">
                {question.options.length} options
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#111111] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#9c9fa5]">Question {index + 1}</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#f5f1ec] text-[#626260]">
            MCQ (1 mark)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111111]">Question Text</Label>
          <Textarea
            value={question.questionText}
            onChange={(e) => onUpdate({ questionText: e.target.value })}
            placeholder="Enter your MCQ question here..."
            rows={3}
            className="border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111] resize-none"
          />
        </div>

        {/* Options */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111111]">
            Options <span className="text-[#626260] font-normal">(select the correct one)</span>
          </Label>
          <div className="space-y-2">
            {question.options?.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <button
                  onClick={() => onSetCorrect(optIndex)}
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    option.isCorrect
                      ? "bg-[#0bdf50] border-[#0bdf50]"
                      : "border-[#d3cec6] hover:border-[#111111]"
                  }`}
                >
                  {option.isCorrect && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
                <Input
                  value={option.optionText}
                  onChange={(e) => onOptionChange(optIndex, "optionText", e.target.value)}
                  placeholder={`Option ${optIndex + 1}`}
                  className="flex-1 border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111]"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveOption(optIndex)}
                  className="text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddOption}
            className="border-[#d3cec6]"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </div>

        {/* Image Upload */}
        <ImageUpload
          currentUrl={question.questionImageUrl}
          onUpload={(url) => onUpdate({ questionImageUrl: url })}
          onRemove={() => onUpdate({ questionImageUrl: undefined })}
        />
      </div>
    </div>
  );
}

// Image Upload Component
function ImageUpload({ currentUrl, onUpload, onRemove }: { currentUrl?: string; onUpload: (url: string) => void; onRemove: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file, 'uploads');
      onUpload(res.url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (currentUrl) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#111111]">Question Image</Label>
        <div className="relative rounded-lg overflow-hidden border border-[#d3cec6]">
          <img src={currentUrl} alt="Question" className="max-h-40 w-full object-contain bg-[#f5f1ec]" />
          <button onClick={onRemove} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#111111]">Question Image (Optional)</Label>
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#d3cec6] p-4 hover:border-[#111111] hover:bg-[#f5f1ec] transition-colors">
        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} disabled={uploading} />
        <ImageIcon className={`h-8 w-8 ${uploading ? 'animate-pulse text-[#9c9fa5]' : 'text-[#9c9fa5]'}`} />
        <span className="text-sm text-[#626260]">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
      </label>
    </div>
  );
}
