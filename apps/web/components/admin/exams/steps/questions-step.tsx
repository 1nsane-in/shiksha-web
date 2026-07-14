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
  Type,
  List,
  CheckSquare,
  AlignLeft
} from "lucide-react";
import { useExam } from "@/domains/exams/exams.queries";
import { QuestionType, QuestionDifficulty, type CreateQuestionInput } from "@/domains/exams/exams.types";
import { toast } from "sonner";

interface Props {
  examId: string;
  data?: CreateQuestionInput[];
  onChange: (data: CreateQuestionInput[]) => void;
}

const QUESTION_TYPES = [
  { type: QuestionType.SINGLE_CHOICE, label: "Single Choice", icon: List, description: "Select one correct answer" },
  { type: QuestionType.MULTI_CHOICE, label: "Multiple Choice", icon: CheckSquare, description: "Select multiple correct answers" },
  { type: QuestionType.TRUE_FALSE, label: "True / False", icon: Check, description: "Simple true or false question" },
  { type: QuestionType.SUBJECTIVE, label: "Subjective", icon: AlignLeft, description: "Descriptive answer question" },
];

export function QuestionsStep({ examId, data = [], onChange }: Props) {
  const { data: exam } = useExam(examId);
  const [questions, setQuestions] = useState<CreateQuestionInput[]>(data);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: CreateQuestionInput = {
      type,
      questionText: "",
      marks: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      options: type === QuestionType.SINGLE_CHOICE || type === QuestionType.MULTI_CHOICE 
        ? [
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
          ]
        : type === QuestionType.TRUE_FALSE
        ? [
            { optionText: "True", isCorrect: true },
            { optionText: "False", isCorrect: false },
          ]
        : undefined,
      config: type === QuestionType.SUBJECTIVE 
        ? { wordLimit: 200, keywords: [], manualReview: true }
        : undefined,
    };
    
    setQuestions([...questions, newQuestion]);
    setEditingIndex(questions.length);
    setShowTypeSelector(false);
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

  const handleSetCorrectOption = (qIndex: number, optIndex: number, isMulti: boolean) => {
    const question = questions[qIndex];
    const updatedOptions = question.options?.map((opt, i) => ({
      ...opt,
      isCorrect: isMulti 
        ? (i === optIndex ? !opt.isCorrect : opt.isCorrect)
        : (i === optIndex ? true : false)
    }));
    handleUpdateQuestion(qIndex, { options: updatedOptions });
  };

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-[#111111]">Question Bank</h2>
          <p className="text-sm text-[#626260]">
            {questions.length} questions • {totalMarks} total marks
          </p>
        </div>
        <Button
          onClick={() => setShowTypeSelector(true)}
          className="bg-[#111111] hover:bg-[#313130] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Question Type Selector Modal */}
      {showTypeSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-medium text-[#111111] mb-4">Select Question Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUESTION_TYPES.map(({ type, label, icon: Icon, description }) => (
                <button
                  key={type}
                  onClick={() => handleAddQuestion(type)}
                  className="p-4 rounded-lg border border-[#d3cec6] hover:border-[#111111] hover:bg-[#f5f1ec] transition-all text-left"
                >
                  <Icon className="h-6 w-6 text-[#111111] mb-2" />
                  <h4 className="font-medium text-[#111111]">{label}</h4>
                  <p className="text-xs text-[#626260]">{description}</p>
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 border-[#d3cec6]"
              onClick={() => setShowTypeSelector(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

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
            onSetCorrect={(optIndex, isMulti) => handleSetCorrectOption(index, optIndex, isMulti)}
          />
        ))}

        {questions.length === 0 && (
          <div className="bg-[#f5f1ec] rounded-xl border border-dashed border-[#d3cec6] p-12 text-center">
            <Type className="h-12 w-12 text-[#9c9fa5] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#111111] mb-2">No questions yet</h3>
            <p className="text-sm text-[#626260] mb-4">
              Add questions to build your exam. You can create MCQ, True/False, and Subjective questions.
            </p>
            <Button
              onClick={() => setShowTypeSelector(true)}
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
  onSetCorrect: (optIndex: number, isMulti: boolean) => void;
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
  const typeLabel = QUESTION_TYPES.find(t => t.type === question.type)?.label || question.type;
  const isMultiChoice = question.type === QuestionType.MULTI_CHOICE;

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
                {typeLabel}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {question.marks} mark{question.marks !== 1 ? 's' : ''}
              </span>
              {question.difficulty && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  question.difficulty === QuestionDifficulty.EASY ? "bg-emerald-50 text-emerald-700" :
                  question.difficulty === QuestionDifficulty.MEDIUM ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-700"
                }`}>
                  {question.difficulty}
                </span>
              )}
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
            {typeLabel}
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
            placeholder="Enter your question here..."
            rows={3}
            className="border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111] resize-none"
          />
        </div>

        {/* Marks & Difficulty */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111111]">Marks</Label>
            <Input
              type="number"
              min={0.5}
              step={0.5}
              value={question.marks}
              onChange={(e) => onUpdate({ marks: parseFloat(e.target.value) || 1 })}
              className="border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111111]">Negative Marks</Label>
            <Input
              type="number"
              min={0}
              step={0.25}
              value={question.negativeMarks || 0}
              onChange={(e) => onUpdate({ negativeMarks: parseFloat(e.target.value) || 0 })}
              className="border-[#d3cec6] focus:border-[#111111] focus:ring-[#111111]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111111]">Difficulty</Label>
            <select
              value={question.difficulty}
              onChange={(e) => onUpdate({ difficulty: e.target.value as QuestionDifficulty })}
              className="w-full h-10 rounded-md border border-[#d3cec6] px-3 text-sm focus:border-[#111111] focus:ring-[#111111]"
            >
              <option value={QuestionDifficulty.EASY}>Easy</option>
              <option value={QuestionDifficulty.MEDIUM}>Medium</option>
              <option value={QuestionDifficulty.HARD}>Hard</option>
            </select>
          </div>
        </div>

        {/* Options (for MCQ and True/False) */}
        {(question.type === QuestionType.SINGLE_CHOICE || 
          question.type === QuestionType.MULTI_CHOICE || 
          question.type === QuestionType.TRUE_FALSE) && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#111111]">
              Options {isMultiChoice ? "(Select all correct)" : "(Select one correct)"}
            </Label>
            <div className="space-y-2">
              {question.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <button
                    onClick={() => onSetCorrect(optIndex, isMultiChoice)}
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
                  {question.type !== QuestionType.TRUE_FALSE && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveOption(optIndex)}
                      className="text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {question.type !== QuestionType.TRUE_FALSE && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddOption}
                className="border-[#d3cec6]"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            )}
          </div>
        )}

        {/* Subjective Config */}
        {question.type === QuestionType.SUBJECTIVE && (
          <div className="space-y-4 bg-[#f5f1ec] rounded-lg p-4">
            <h4 className="text-sm font-medium text-[#111111]">Subjective Settings</h4>
            <div className="space-y-2">
              <Label className="text-sm text-[#626260]">Word Limit</Label>
              <Input
                type="number"
                value={question.config?.wordLimit || 200}
                onChange={(e) => onUpdate({ 
                  config: { ...question.config, wordLimit: parseInt(e.target.value) || 200 }
                })}
                className="border-[#d3cec6] bg-white focus:border-[#111111] focus:ring-[#111111]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-[#626260]">Keywords (comma separated)</Label>
              <Input
                value={question.config?.keywords?.join(", ") || ""}
                onChange={(e) => onUpdate({
                  config: { 
                    ...question.config, 
                    keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
                  }
                })}
                placeholder="e.g., photosynthesis, chlorophyll, sunlight"
                className="border-[#d3cec6] bg-white focus:border-[#111111] focus:ring-[#111111]"
              />
              <p className="text-xs text-[#9c9fa5]">
                Used for auto-scoring. Separate keywords with commas.
              </p>
            </div>
          </div>
        )}

        {/* Image Upload Placeholder */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#111111]">Question Image (Optional)</Label>
          <button className="w-full p-4 border-2 border-dashed border-[#d3cec6] rounded-lg hover:border-[#111111] hover:bg-[#f5f1ec] transition-colors flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-[#9c9fa5]" />
            <span className="text-sm text-[#626260]">Click to upload image</span>
          </button>
        </div>
      </div>
    </div>
  );
}
